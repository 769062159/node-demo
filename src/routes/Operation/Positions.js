import React from 'react';
import { Icon, Card, Input, Button, Table, Row, Col, Form, Modal, Spin, message, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ operationPosition: operation, loading }) => ({
  operation,
  positionListModel: operation.position,
  positionDialogShow: operation.positionDialogShow,
  loading: loading.models.operationPosition,
}))
export default class Operating extends React.PureComponent {
  state = {
    positionDialog: {
      mode: 'create',
      positionName: '',
      level: 1,
      id: 0,
    },
    search: '',
  };
  componentDidMount = () => {
    this.doGetPositionList();
  };
  onSavePosition = () => {
    const { positionDialog } = this.state;
    const { dispatch, positionListModel } = this.props;
    if (positionDialog.positionName.length === 0) {
      return message.error('职位名不能为空');
    }
    if (!positionDialog.level) {
      return message.error('请选择职位等级');
    }

    if (positionDialog.mode === 'create') {
      dispatch({
        type: 'operationPosition/doCreatePosition',
        payload: {
          data: {
            name: positionDialog.positionName,
            // level: positionDialog.level,
          },
          searchParams: positionListModel,
        },
      });
    } else {
      dispatch({
        type: 'operationPosition/doUpdatePosition',
        payload: {
          data: {
            id: positionDialog.id,
            name: positionDialog.positionName,
            // level: positionDialog.level,
          },
          searchParams: positionListModel,
        },
      });
    }
  };
  updatePositionDialog = updater => {
    if ('show' in updater) {
      const { dispatch } = this.props;
      dispatch({
        type: 'operationPosition/setPositionDialogShow',
        payload: updater.show,
      });
      if (updater.show) {
        dispatch({
          type: 'operationPosition/doGetAllProvinces',
        });
      }
    }

    delete updater.show;

    this.setState(state => {
      return {
        positionDialog: {
          ...state.positionDialog,
          ...updater,
        },
      };
    });
  };
  doGetPositionList = (params = {}) => {
    const { dispatch, positionListModel } = this.props;
    dispatch({
      type: 'operationPosition/doGetPositionList',
      payload: {
        ...positionListModel,
        ...params,
      },
    });
  };
  handleClickDel = row => {
    Modal.confirm({
      title: '温馨提示',
      content: '您确定要删除这个职位吗？',
      onOk: () => {
        const { dispatch, positionListModel } = this.props;
        dispatch({
          type: 'operationPosition/doDelPosition',
          payload: {
            data: {
              id: row.id,
            },
            searchParams: positionListModel,
          },
        });
      },
    });
  };
  handleSearch = () => {
    this.doGetPositionList({
      page: 1,
      key: this.state.search,
    });
  };
  render() {
    const { state, props } = this;

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
                    <span>职位名称</span>
                  </Col>
                  <Col span={18}>
                    <Input
                      type="text"
                      prefix={<Icon type="search" />}
                      placeholder="职位名称"
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
                <Button type="primary" onClick={this.handleSearch}>
                  查询
                </Button>
              </Col>
            </Row>

            {/* 添加职位 */}
            <Row
              style={{
                marginTop: '30px',
              }}
            >
              <Col>
                <Button
                  type="primary"
                  onClick={() => {
                    this.updatePositionDialog({
                      show: true,
                      mode: 'create',
                      positionName: '',
                      level: 1,
                      id: 0,
                    });
                  }}
                >
                  添加职位
                </Button>
              </Col>
            </Row>

            {/* 职位表格 */}
            <Table
              dataSource={props.positionListModel.list}
              rowKey="id"
              columns={[
                {
                  title: '职位编号',
                  dataIndex: 'id',
                },
                {
                  title: '职位名称',
                  dataIndex: 'name',
                },
                {
                  title: '人数',
                  dataIndex: 'count',
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
                  key: 'action',
                  render: (text, record) => {
                    return (
                      <div>
                        <Button
                          type="primary"
                          style={{ marginRight: '10px' }}
                          onClick={() => {
                            this.updatePositionDialog({
                              show: true,
                              positionName: record.name,
                              level: record.level,
                              id: record.id,
                              mode: 'edit',
                            });
                          }}
                        >
                          编辑
                        </Button>
                        <Button
                          type="danger"
                          onClick={() => {
                            this.handleClickDel(record);
                          }}
                        >
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
                total: props.positionListModel.total,
                pageSize: props.positionListModel.pagesize,
                onChange: current => {
                  this.doGetPositionList({
                    page: current,
                  });
                },
              }}
            />

            {/* 编辑、创建职位 */}
            <Modal
              title={state.positionDialog.mode === 'create' ? '创建职位' : '编辑职位'}
              visible={props.positionDialogShow}
              onCancel={() => {
                this.updatePositionDialog({
                  show: false,
                });
              }}
              onOk={this.onSavePosition}
            >
              <Spin spinning={props.loading}>
                <Form layout="horizontal">
                  <Form.Item {...formItemLayout} label="职位名称">
                    <Input
                      type="text"
                      placeholder="请输入"
                      value={state.positionDialog.positionName}
                      onChange={event => {
                        this.updatePositionDialog({
                          positionName: event.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  {/* <Form.Item {...formItemLayout} label="职位等级">
                    <Select
                      value={state.positionDialog.level}
                      onChange={(value) => {
                        this.updatePositionDialog({
                          level: value,
                        });
                      }}
                    >
                      <Select.Option value="">请选择</Select.Option>
                      <Select.Option value={1}>大区</Select.Option>
                      <Select.Option value={2}>省</Select.Option>
                      <Select.Option value={3}>市</Select.Option>
                      <Select.Option value={4}>区县</Select.Option>
                    </Select>
                  </Form.Item> */}
                </Form>
              </Spin>
            </Modal>
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}
