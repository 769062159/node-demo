import React from 'react';
import {
  Icon,
  Card,
  Input,
  Button,
  Table,
  Row,
  Col,
  Form,
  Checkbox,
  Modal,
  Spin,
  message,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ operationArea: operation, loading }) => ({
  operation,
  areaModel: operation.area,
  allProvincesModel: operation.allProvinces,
  areaDialogShow: operation.areaDialogShow,
  loading: loading.models.operationArea,
}))
export default class AreaManagement extends React.PureComponent {
  state = {
    areaDialog: {
      mode: 'create',
      areaName: '',
      provinces: [],
      id: 0,
      constProvinces: [],
    },
    search: '',
  };
  componentDidMount = () => {
    this.doGetAreaList();
  };
  onSaveArea = () => {
    const { areaDialog } = this.state;
    const { dispatch, areaModel } = this.props;
    if (areaDialog.areaName.length === 0) {
      return message.error('大区名不能为空');
    }
    if (areaDialog.provinces.length === 0) {
      return message.error('大区包含的省份不能为空');
    }

    if (areaDialog.mode === 'create') {
      dispatch({
        type: 'operationArea/doCreateArea',
        payload: {
          data: {
            name: areaDialog.areaName,
            provinces: areaDialog.provinces,
          },
          searchParams: areaModel,
        },
      });
    } else {
      dispatch({
        type: 'operationArea/doUpdateArea',
        payload: {
          data: {
            id: areaDialog.id,
            name: areaDialog.areaName,
            provinces: areaDialog.provinces,
          },
          searchParams: areaModel,
        },
      });
    }
  };
  updateAreaDialog = updater => {
    if ('show' in updater) {
      const { dispatch } = this.props;
      dispatch({
        type: 'operationArea/setAreaDialogShow',
        payload: updater.show,
      });
      if (updater.show) {
        dispatch({
          type: 'operationArea/doGetAllProvinces',
        });
      }
    }

    delete updater.show;

    this.setState(state => {
      return {
        areaDialog: {
          ...state.areaDialog,
          ...updater,
        },
      };
    });
  };
  doGetAreaList = (params = {}) => {
    const { dispatch, areaModel } = this.props;
    dispatch({
      type: 'operationArea/doGetAreaList',
      payload: {
        ...areaModel,
        ...params,
      },
    });
  };
  handleClickEdit = row => {
    this.updateAreaDialog({
      show: true,
      mode: 'edit',
      id: row.id,
      areaName: row.name,
      provinces: row.provinces.map(item => item.id),
      constProvinces: row.provinces.map(item => item.id),
    });
  };
  handleClickDel = row => {
    Modal.confirm({
      title: '温馨提示',
      content: '您确定要删除这个大区吗？',
      onOk: () => {
        const { dispatch, areaModel } = this.props;
        dispatch({
          type: 'operationArea/doDelArea',
          payload: {
            data: {
              id: row.id,
            },
            searchParams: areaModel,
          },
        });
      },
    });
  };
  handleSearch = () => {
    this.doGetAreaList({
      page: 1,
      key: this.state.search,
    });
  };
  render() {
    const { state, props } = this;
    const allProvinces = props.allProvincesModel.map(item => {
      const alreadyChosen = state.areaDialog.constProvinces;
      const isExist = alreadyChosen.some(id => id === item.id);
      let disabled = false;
      if (isExist) {
        disabled = false;
      } else {
        disabled = Boolean(item.disabled);
      }
      return {
        label: item.name,
        value: item.id,
        disabled,
      };
    });

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Spin spinning={props.loading}>
            {/* 查询 */}
            <Row type="flex" gutter={10}>
              <Col span={6}>
                <Row type="flex" align="middle" gutter={10}>
                  <Col
                    span={6}
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    <span>大区名称</span>
                  </Col>
                  <Col span={18}>
                    <Input
                      type="text"
                      prefix={<Icon type="search" />}
                      placeholder="大区名称"
                      value={state.search}
                      onChange={event => {
                        this.setState({
                          search: event.target.value,
                        });
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Button onClick={this.handleSearch} type="primary">
                  查询
                </Button>
              </Col>
            </Row>

            {/* 添加大区 */}
            <Row
              style={{
                marginTop: '30px',
              }}
            >
              <Col>
                <Button
                  type="primary"
                  onClick={() => {
                    this.updateAreaDialog({
                      show: true,
                      mode: 'create',
                      areaName: '',
                      provinces: [],
                      id: 0,
                      constProvinces: [],
                    });
                  }}
                >
                  添加大区
                </Button>
              </Col>
            </Row>

            {/* 大区表格 */}
            <Table
              dataSource={props.areaModel.list}
              rowKey="id"
              columns={[
                {
                  title: '大区编号',
                  dataIndex: 'id',
                },
                {
                  title: '大区名称',
                  dataIndex: 'name',
                },
                {
                  title: '包含省数量',
                  dataIndex: 'provinces',
                  render(provinces) {
                    return <span>{provinces.length}</span>;
                  },
                },
                {
                  title: '创建时间',
                  dataIndex: 'create_time',
                  render(value) {
                    return <span>{moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>;
                  },
                },
                {
                  title: '操作',
                  render: (_, record, index) => {
                    return (
                      <div>
                        <Button
                          type="primary"
                          style={{ marginRight: '10px' }}
                          onClick={() => this.handleClickEdit(record, index)}
                        >
                          编辑
                        </Button>
                        <Button type="danger" onClick={() => this.handleClickDel(record, index)}>
                          删除
                        </Button>
                      </div>
                    );
                  },
                },
              ]}
              style={{
                marginTop: '10px',
              }}
              pagination={{
                defaultCurrent: 1,
                total: props.areaModel.total,
                pageSize: props.areaModel.pagesize,
                onChange: current => {
                  this.doGetAreaList({
                    page: current,
                  });
                },
              }}
            />

            {/* 编辑、创建大区 */}
            <Modal
              title={state.areaDialog.mode === 'create' ? '添加大区' : '编辑大区'}
              visible={props.areaDialogShow}
              onCancel={() => {
                this.updateAreaDialog({
                  show: false,
                });
              }}
              onOk={this.onSaveArea}
            >
              <Spin spinning={props.loading}>
                <Form layout="horizontal">
                  <Form.Item {...formItemLayout} label="大区名称">
                    <Input
                      type="text"
                      placeholder="请输入"
                      value={state.areaDialog.areaName}
                      onChange={event => {
                        this.updateAreaDialog({
                          areaName: event.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="包含省份">
                    <CheckboxGroup
                      options={allProvinces}
                      value={state.areaDialog.provinces}
                      onChange={value => {
                        this.updateAreaDialog({
                          provinces: value,
                        });
                      }}
                    />
                  </Form.Item>
                </Form>
              </Spin>
            </Modal>
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}
