import React from 'react';
import {
  Icon,
  Card,
  Input,
  Button,
  Table,
  Row,
  Col,
  Spin,
  Modal,
  Form,
  Select,
  message,
  Radio,
  Cascader,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { debounce } from "lodash";

// import CenterForm from './CenterForm';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

function getPositionTypeText(positionType) {
  switch(positionType) {
    case 1: return '总裁';
    case 2: return '事业合伙人';
    case 3: return '运营中心';
  }
}

function getRegionByCode(code, regionObj) {
  if (regionObj.children) {
    return regionObj.children.find(region => region.value === code);
  } else {
    return null;
  }
}

const noop = function() {};

@connect(({ operationCenter: operation, loading }) => ({
  operation,
  centerModel: operation.center,
  allPositionsModel: operation.allPositions,
  reviewCenterDialogShow: operation.reviewCenterDialogShow,
  saveOperateLoading: operation.saveOperateLoading,
  regionTree: operation.regionTree,
  placesLoading: operation.placesLoading,
  places: operation.places,
  loading: loading.models.operationCenter,
}))
export default class OperationCenter extends React.PureComponent {
  state = {
    // 搜索关键字
    searchKey: '',
    // 审核状态
    reviewFilter: '',
    // 职位类型
    positionTypeFilter: 0,
    // 联系状态
    contactStatusFilter: '',
    // 审核对话框
    reviewDialog: {
      id: 0,
      title: '',
      mark: '',
      positionId: '',
      reviewType: false,
    },
    // 选择要添加（1总裁, 2事业合伙人, 3运营中心）的对话框
    chooseTypeDialog: {
      show: false,
      position_type: 1,
    },
    // 新增或编辑（1总裁, 2事业合伙人, 3运营中心）对话框
    operationDialog: {
      show: false,
      mode: 'create',
      title: '',
      form: {
        id: 0,
        nickname: '',
        mobile: '',
        user_id: '',
        // 申请类型，1大区，2省份，3市，4区(总裁、合伙人)
        type: 1,
        // 职位ID，仅大区级别需传(总裁、合伙人)
        position_id: '',
        // 1总裁，2事业合伙人，3运营中心
        position_type: 1,
        // 选择的区域
        raw_area_code: [],
        // 场地ID，仅区县级别的可传（运营中心only）
        lecturer_area_id: '',
      },
    },
  };
  componentDidMount = () => {
    this.doGetCenterList();
    const { dispatch } = this.props;
    dispatch({
      type: 'operationCenter/doGetAllPositions',
    });
    this.doGetRegionList();
  };
  doGetCenterList = (params = {}) => {
    const { dispatch, centerModel } = this.props;
    dispatch({
      type: 'operationCenter/doGetCenterList',
      payload: {
        ...centerModel,
        ...params,
      },
    });
  };
  handleSearch = () => {
    const { searchKey, reviewFilter, positionTypeFilter, contactStatusFilter } = this.state;
    this.doGetCenterList({
      page: 1,
      key: searchKey,
      status: reviewFilter,
      position_type: positionTypeFilter,
      contact_status: contactStatusFilter,
    });
  };
  // 审核
  handleClickReview = (reviewType, row) => {
    this.updateReviewDialog({
      show: true,
      id: row.id,
      title: `${reviewType ? '审核同意' : '审核驳回'}_${row.user.nickname}_${row.area}_${row.id}`,
      mark: '',
      positionId: '',
      reviewType,
    });
  };
  // 更新审核dialog
  updateReviewDialog = (updater = {}) => {
    if ('show' in updater) {
      const { dispatch } = this.props;
      dispatch({
        type: 'operationCenter/setReviewCenterDialogShow',
        payload: updater.show,
      });
      delete updater.show;
    }
    this.setState(state => {
      return {
        reviewDialog: {
          ...state.reviewDialog,
          ...updater,
        },
      };
    });
  };
  doReview = () => {
    const { id, mark, positionId, reviewType } = this.state.reviewDialog;
    const { dispatch, centerModel } = this.props;
    if (reviewType) {
      if (!positionId) {
        return message.error('请选择职位');
      }
      dispatch({
        type: 'operationCenter/doAcceptCenterApplication',
        payload: {
          data: {
            id,
            mark,
            position_id: positionId,
          },
          searchParams: centerModel,
        },
      });
    } else {
      dispatch({
        type: 'operationCenter/doRefuseCenterApplication',
        payload: {
          data: {
            id,
            mark,
          },
          searchParams: centerModel,
        },
      });
    }
  };
  updateChooseTypeDialog = (params) => {
    this.setState((prevState) => ({
      chooseTypeDialog: {
        ...(prevState.chooseTypeDialog),
        ...params,
      }
    }));
  }
  handleChooseTypeDialogSure = () => {
    const { position_type } = this.state.chooseTypeDialog;
    this.updateChooseTypeDialog({show: false});
    requestAnimationFrame(() => {
      this.openOperationDialog({
        form: {
          id: 0,
          nickname: '',
          mobile: '',
          user_id: '',
          type: 1,
          position_id: '',
          position_type,
          raw_area_code: [],
          lecturer_area_id: '',
        },
      });
    });
  }
  // 编辑运营中心
  handleClickEditOperate = async (record) => {
    const raw_area_code = [];

    if (record.area.id) {
      raw_area_code.push(record.area.id);
    }
    if (record.province.id && record.type.key >= 2) {
      raw_area_code.push(record.province.id);
    }
    if (record.city.id && record.type.key >= 3) {
      raw_area_code.push(record.city.id);
    }
    if (record.county.id && record.type.key >= 4) {
      raw_area_code.push(record.county.id);
    }

    await this.doHackRegionTree(raw_area_code);
    await this.doSearchLecturerPromise({
      id: record.lecturer_area_id,
    });

    this.openOperationDialog({
      mode: 'edit',
      form: {
        id: record.id,
        nickname: record.nickname,
        mobile: record.mobile,
        user_id: record.user.fake_id,
        type: record.type.key,
        position_id: record.position.id,
        position_type: record.position_type.key,
        raw_area_code,
        lecturer_area_id: record.lecturer_area_id || '',
      },
    });
  }
  // regionTree可能只有大区id, 没有province, city等id
  doHackRegionTree = (raw_area_code) => {
    const { regionTree } = this.props;
    let regionObj = {
      children: regionTree,
    };
    let sequence = Promise.resolve();

    for (let i = 0, length = raw_area_code.length; i < length; i++) {
      const code = raw_area_code[i];
      const item = getRegionByCode(code, regionObj);
      if (!item) {
        // 请求
        if (i === 0) {
          sequence = sequence
            .then(() => {
              return this.doGetRegionListPromise();
            });
        } else {
          sequence = sequence
            // eslint-disable-next-line no-loop-func
            .then(() => {
              return this.doGetRegionListPromise({
                id: regionObj.value,
                type: i + 1,
                regionRef: regionObj,
              });
            });
        }
        // eslint-disable-next-line no-loop-func
        sequence = sequence.then(() => {
          regionObj = getRegionByCode(code, regionObj);
        });
      } else {
        regionObj = item;
      }
    }
    return sequence;
  }
  // 保存运营中心
  handleOperationDialogSure = () => {
    const { mode } = this.state.operationDialog;
    const { id, nickname, mobile, user_id, type, position_id, position_type, raw_area_code, lecturer_area_id } = this.state.operationDialog.form;

    if (mode === 'edit' && !id) {
      return message.error('编号不存在，请重新打开编辑框');
    }

    if (!position_type) {
      return message.error('职位类型错误，请重新打开');
    }

    if (!nickname) {
      return message.error('请输入联系人姓名');
    }

    if (!(/^1\d{10}$/.test(mobile))) {
      return message.error('手机号必须为1开头的11位数字');
    }

    if (!user_id) {
      return message.error('请输入用户Id');
    }

    if (position_type !== 3 && !type) {
      return message.error('请选择代理身份');
    }

    if (position_type !== 3 && type === 1 && !position_id) {
      return message.error('请选择代理职位');
    }

    if (position_type !== 3 && raw_area_code.length !== type) {
      return message.error('请选择对应代理身份的代理区域， 省级对应选择到省级');
    }

    if (position_type === 3 && raw_area_code.length !== 4) {
      return message.error('运营中心必选大区、省、市、区县');
    }

    this.doSaveOperationDialogForm();
  }
  doSaveOperationDialogForm = () => {
    const { dispatch } = this.props;
    const { mode } = this.state.operationDialog;
    const { id, nickname, mobile, user_id, type, position_id, position_type, raw_area_code, lecturer_area_id } = this.state.operationDialog.form;

    const data = {
      nickname, mobile, user_id, position_type,
    }
    if (position_type !== 3) {
      data.type = type;
      if (type === 1) {
        data.position_id = position_id;
      }
    }
    if (position_type === 3) {
      data.lecturer_area_id = lecturer_area_id;
      data.type = 4;
    }
    for (let i = 0, length = raw_area_code.length; i < length; i++) {
      switch(i) {
        case 0:
          data.area_id = raw_area_code[i];
          break;
        case 1:
          data.province = raw_area_code[i];
          break;
        case 2:
          data.city = raw_area_code[i];
          break;
        case 3:
          data.county = raw_area_code[i];
          break;
        default:
          break;
      }
    }
    const callback = () => {
      this.closeOperationDialog();
      this.doGetCenterList();
    }
    if (mode === 'edit') {
      data.id = id;
      dispatch({
        type: 'operationCenter/doUpdateCenter',
        payload: {
          params: data,
          callback,
        },
      });
    } else {
      dispatch({
        type: 'operationCenter/doAddCenter',
        payload: {
          params: data,
          callback,
        },
      });
    }
  }
  // 打开（1总裁, 2事业合伙人, 3运营中心）对话框
  openOperationDialog = ({
    mode = 'create',
    form = {},
  }) => {
    const title = mode === 'create' ? `创建-${getPositionTypeText(form.position_type)}` : `编辑-${form.id}`;

    this.setState({
      operationDialog: {
        show: true,
        mode,
        title,
        form,
      },
    });
  }
  closeOperationDialog = () => {
    this.setState((prevState) => ({
      operationDialog: {
        ...(prevState.operationDialog),
        show: false,
      },
    }));
  }
  updateOperationDialogForm = (params = {}) => {
    this.setState((prevState) => ({
      operationDialog: {
        ...(prevState.operationDialog),
        form: {
          ...(prevState.operationDialog.form),
          ...params,
        },
      },
    }));
  }
  // 获取区域列表
  doGetRegionList = ({
    id = 0,
    type = 1,
    regionRef,
    callback = noop,
    // 是否最后一层
    isLeaf = false,
  } = {}) => {
    const { dispatch, regionTree } = this.props;
    dispatch({
      type: 'operationCenter/doGetRegionList',
      payload: {
        params: {id, type},
        regionRef,
        callback,
        isLeaf,
        regionTree,
      },
    });
  }
  doGetRegionListPromise = (params) => {
    return new Promise((resolve) => {
      this.doGetRegionList({
        ...params,
        callback: () => resolve(),
      });
    });
  }
  // 代理区域加载更多数据
  handleRegionSelectLoadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    this.doGetRegionList({
      id: targetOption.value,
      type: targetOption.level + 1,
      regionRef: targetOption,
      isLeaf: targetOption.level + 1 === 4,
    });
  }
  doSearchLecturer = ({
    keyword,
    id,
    callback = noop,
  }) => {
    if (!id && !keyword) {
      return callback();
    }
    const { dispatch } = this.props;
    const params = {};
    if (id) {
      params.id = id;
    }
    if (keyword) {
      params.keyword = keyword;
    }
    dispatch({
      type: 'operationCenter/doSearchLecturerPlace',
      payload: {
        params,
        callback,
      },
    })
  }
  doSearchLecturerPromise = ({
    keyword,
    id,
  }) => {
    return new Promise((resolve) => {
      if (!id && !keyword) {
        return resolve();
      }
      this.doSearchLecturer({
        keyword,
        id,
        callback: () => resolve(),
      })
    })
  }
  // 搜索场地
  handleSearchLecturer = debounce((value) => {
    if (!value) return;
    this.doSearchLecturer({keyword: value});
  }, 800)



  render() {
    const { state, props } = this;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Spin spinning={props.loading}>
            {/* 搜索行 */}
            <Row type="flex" gutter={10}>
              <Col span={6}>
                <Input
                  type="text"
                  prefix={<Icon type="search" />}
                  placeholder="搜索联系人"
                  value={state.searchKey}
                  onChange={event => {
                    this.setState({
                      searchKey: event.target.value,
                    });
                  }}
                  addonBefore="搜索"
                />
              </Col>
              <Col>
                <span>审核状态：</span>
                <Select
                  value={state.reviewFilter}
                  onChange={value => {
                    this.setState({
                      reviewFilter: value,
                    });
                  }}
                >
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value={1}>待审核</Select.Option>
                  <Select.Option value={2}>已驳回</Select.Option>
                  <Select.Option value={3}>已同意</Select.Option>
                </Select>
              </Col>
              <Col>
                <span>职位类型：</span>
                <Select
                  value={state.positionTypeFilter}
                  onChange={value => {
                    this.setState({
                      positionTypeFilter: value,
                    });
                  }}
                  style={{
                    width: '114px',
                  }}
                >
                  <Select.Option value={0}>全部</Select.Option>
                  <Select.Option value={1}>总裁</Select.Option>
                  <Select.Option value={2}>事业合伙人</Select.Option>
                  <Select.Option value={3}>运营中心</Select.Option>
                </Select>
              </Col>
              <Col>
                <span>联系状态：</span>
                <Select
                  value={state.contactStatusFilter}
                  onChange={value => {
                    this.setState({
                      contactStatusFilter: value,
                    });
                  }}
                >
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value={1}>未联系</Select.Option>
                  <Select.Option value={2}>已联系</Select.Option>
                </Select>
              </Col>
              <Col>
                <Button type="primary" onClick={this.handleSearch}>
                  查询
                </Button>
              </Col>
            </Row>

            {/* 添加运营中心 */}
            <Row
              type="flex"
              style={{
                marginTop: '30px',
              }}
            >
              <Col>
                <Button
                  type="default"
                  onClick={() => this.updateChooseTypeDialog({
                    show: true,
                    position_type: 1,
                  })}
                >添加
                </Button>
              </Col>
            </Row>
            {/* 表格 */}
            <Table
              dataSource={props.centerModel.list}
              rowKey="id"
              columns={[
                {
                  title: '编号',
                  dataIndex: 'id',
                },
                {
                  title: '类型',
                  dataIndex: 'type',
                  render(type) {
                    return <span>{type.value}</span>;
                  },
                },
                {
                  title: '职位类型',
                  dataIndex: 'position_type',
                  render(positionType) {
                    return <span>{positionType.value}</span>;
                  },
                },
                {
                  title: '代理区域',
                  dataIndex: 'area',
                  render(_, record) {
                    return (
                      <span>{`${record.area.name}${record.province.name}${record.city.name}${
                        record.county.name
                      }`}
                      </span>
                    );
                  },
                },
                {
                  title: '联系人',
                  dataIndex: 'nickname',
                },
                {
                  title: '联系电话',
                  dataIndex: 'mobile',
                },
                {
                  title: '联系状态',
                  dataIndex: 'contact_status',
                  render(contactStatus) {
                    return (<span>{contactStatus.value}</span>);
                  },
                },
                {
                  title: '绑定用户',
                  dataIndex: 'user_name',
                  render(_, record) {
                    return <span>{record.user.nickname}</span>;
                  },
                },
                {
                  title: '绑定用户Id',
                  dataIndex: 'user_id',
                  render(_, record) {
                    return <span>{record.user.fake_id}</span>;
                  },
                },
                {
                  title: '职位',
                  dataIndex: 'position',
                  render(position) {
                    return <span>{position.name}</span>;
                  },
                },
                {
                  title: '申请时间',
                  dataIndex: 'time',
                  render(text) {
                    return <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>;
                  },
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (_, record) => {
                    if (record.audit_status.key === 1) {
                      return (
                        <div>
                          <Button
                            type="primary"
                            size="small"
                            style={{ marginRight: '10px' }}
                            onClick={() => {
                              this.handleClickReview(true, record);
                            }}
                          >
                            通过
                          </Button>
                          <Button
                            type="danger"
                            size="small"
                            onClick={() => {
                              this.handleClickReview(false, record);
                            }}
                          >
                            驳回
                          </Button>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          style={{
                            color: record.audit_status.key === 2 ? '#CF1322' : '#1890ff',
                          }}
                        >
                          {record.audit_status.value}
                          {
                            record.audit_status.key === 3 ? (
                              <Button
                                type="primary"
                                size="small"
                                onClick={() => this.handleClickEditOperate(record)}
                                style={{
                                  marginLeft: '8px',
                                }}
                              >
                                编辑
                              </Button>
                            ) : null
                          }
                        </div>
                      );
                    }
                  },
                },
              ]}
              style={{
                marginTop: '10px',
              }}
              pagination={{
                defaultCurrent: 1,
                current: props.centerModel.page,
                total: props.centerModel.total,
                pageSize: props.centerModel.pagesize,
                onChange: current => {
                  this.doGetCenterList({
                    page: current,
                  });
                },
              }}
            />
          </Spin>

          {/* 审核对话框 */}
          <Modal
            title={state.reviewDialog.title}
            visible={props.reviewCenterDialogShow}
            onCancel={() => {
              this.updateReviewDialog({
                show: false,
              });
            }}
            onOk={this.doReview}
          >
            <Form layout="horizontal">
              <Form.Item {...formItemLayout} label="备注">
                <Input
                  type="text"
                  value={state.reviewDialog.mark}
                  onChange={event => {
                    this.updateReviewDialog({
                      mark: event.target.value,
                    });
                  }}
                />
              </Form.Item>
              {state.reviewDialog.reviewType ? (
                <Form.Item {...formItemLayout} label="职位">
                  <Select
                    value={state.reviewDialog.positionId}
                    onChange={value => {
                      this.updateReviewDialog({
                        positionId: value,
                      });
                    }}
                  >
                    <Select.Option value="">请选择</Select.Option>
                    {props.allPositionsModel.map(item => (
                      <Select.Option value={item.id} key={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null}
            </Form>
          </Modal>
          {/** 选择要添加（1总裁, 2事业合伙人, 3运营中心）的对话框 */}
          <Modal
            title="请选择要添加的类型"
            visible={state.chooseTypeDialog.show}
            onCancel={() => this.updateChooseTypeDialog({ show: false })}
            onOk={this.handleChooseTypeDialogSure}
          >
            <Radio.Group
              defaultValue={1}
              buttonStyle="solid"
              value={state.chooseTypeDialog.position_type}
              onChange={(event) => {
                this.updateChooseTypeDialog({
                  position_type: event.target.value,
                });
              }}
            >
              <Radio.Button value={1}>总裁</Radio.Button>
              <Radio.Button value={2}>事业合伙人</Radio.Button>
              <Radio.Button value={3}>运营中心</Radio.Button>
            </Radio.Group>
          </Modal>
          {/** 新增或编辑（1总裁, 2事业合伙人, 3运营中心）对话框 */}
          <Modal
            title="添加总裁"
            visible={state.operationDialog.show}
            title={state.operationDialog.title}
            onCancel={this.closeOperationDialog}
            onOk={this.handleOperationDialogSure}
            okButtonProps={{
              loading: props.saveOperateLoading,
            }}
          >
            <Form layout="horizontal">
              {
                state.operationDialog.form.position_type !== 3 ? (
                  <Form.Item
                    {...formItemLayout}
                    label="代理身份"
                  >
                    <Select
                      placeholder="请选择"
                      value={state.operationDialog.form.type}
                      defaultValue={1}
                      onChange={(value) => this.updateOperationDialogForm({
                        type: value,
                      })}
                    >
                      {
                        state.operationDialog.form.position_type === 1 ?(
                          <Select.Option value={1}>大区{getPositionTypeText(state.operationDialog.form.position_type)}</Select.Option>
                        ) : null
                      }
                      <Select.Option value={2}>省级{getPositionTypeText(state.operationDialog.form.position_type)}</Select.Option>
                      <Select.Option value={3}>市级{getPositionTypeText(state.operationDialog.form.position_type)}</Select.Option>
                      <Select.Option value={4}>区县{getPositionTypeText(state.operationDialog.form.position_type)}</Select.Option>
                    </Select>
                  </Form.Item>
                ) : null
              }
              <Form.Item {...formItemLayout} label="代理区域">
                <Cascader
                  changeOnSelect
                  placeholder="请选择"
                  value={state.operationDialog.form.raw_area_code}
                  options={props.regionTree}
                  loadData={this.handleRegionSelectLoadData}
                  onChange={(value) => this.updateOperationDialogForm({
                    raw_area_code: value,
                  })}
                />
              </Form.Item>
              {
                state.operationDialog.form.position_type !== 3 && state.operationDialog.form.type === 1 ? (
                  <Form.Item {...formItemLayout} label="代理职位">
                    <Select
                      placeholder="请选择"
                      value={state.operationDialog.form.position_id}
                      onChange={(value) => this.updateOperationDialogForm({
                        position_id: value,
                      })}
                    >
                      <Select.Option value="">请选择</Select.Option>
                      {props.allPositionsModel.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : null
              }
              <Form.Item {...formItemLayout} label="联系人姓名">
                <Input
                  type="text"
                  placeholder="请填写"
                  value={state.operationDialog.form.nickname}
                  onChange={(event) => this.updateOperationDialogForm({
                    nickname: event.target.value,
                  })}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="联系电话">
                <Input
                  type="number"
                  placeholder="请填写"
                  value={state.operationDialog.form.mobile}
                  onChange={(event) => this.updateOperationDialogForm({
                    mobile: event.target.value,
                  })}
                  maxLength={11}
                  minLength={11}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="用户Id">
                <Input
                  type="text"
                  placeholder="请填写"
                  value={state.operationDialog.form.user_id}
                  onChange={(event) => this.updateOperationDialogForm({
                    user_id: event.target.value,
                  })}
                />
              </Form.Item>
              {
                state.operationDialog.form.position_type === 3 ? (
                  <Form.Item {...formItemLayout} label="关联场地">
                    <Select
                      showSearch
                      allowClear
                      value={state.operationDialog.form.lecturer_area_id}
                      onChange={(value) => this.updateOperationDialogForm({
                        lecturer_area_id: value,
                      })}
                      notFoundContent={props.placesLoading ? <Spin size="small" /> : null}
                      onSearch={this.handleSearchLecturer}
                      filterOption={false}
                      placeholder="搜索并选择"
                    >
                      {props.places.map(d => (
                        <Select.Option key={d.value} value={d.value}>{d.text}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : null
              }
            </Form>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
