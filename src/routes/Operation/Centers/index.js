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
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';

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
@connect(({ operationCenter: operation, loading }) => ({
  operation,
  centerModel: operation.center,
  allPositionsModel: operation.allPositions,
  reviewCenterDialogShow: operation.reviewCenterDialogShow,
  loading: loading.models.operationCenter,
}))
export default class OperationCenter extends React.PureComponent {
  state = {
    searchKey: '',
    reviewFilter: '',
    positionTypeFilter: 0,
    contactStatusFilter: '',
    reviewDialog: {
      id: 0,
      title: '',
      mark: '',
      positionId: '',
      reviewType: false,
    },
  };
  componentDidMount = () => {
    this.doGetCenterList();
    const { dispatch } = this.props;
    dispatch({
      type: 'operationCenter/doGetAllPositions',
    });
  };
  onUpdateFormItem = options => {
    this.setState(state => {
      return {
        form: {
          ...state.form,
          ...options,
        },
      };
    });
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
              {/* <Col>
              <Button
                type="default"
                onClick={this.showDialogCreate}
              >添加运营中心
              </Button>
            </Col> */}
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
                      <span>{`${record.area}${record.province}${record.city}${
                        record.county
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
                    return <span>{record.user.id}</span>;
                  },
                },
                {
                  title: '职位',
                  dataIndex: 'position',
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
                            style={{ marginRight: '10px' }}
                            onClick={() => {
                              this.handleClickReview(true, record);
                            }}
                          >
                            通过
                          </Button>
                          <Button
                            type="danger"
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
        </Card>
      </PageHeaderLayout>
    );
  }
}
