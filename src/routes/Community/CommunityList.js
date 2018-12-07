import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import { routerRedux } from 'dva/router';
import {
  Table,
  message,
  Modal,
  Card,
  Form,
  Divider,
  Row,
  Col,
  Input,
  Button,
} from 'antd';
import Ellipsis from '../../components/Ellipsis';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
// import LiveGoodTable from '../../components/LiveGoodTable';


const FormItem = Form.Item;
const { confirm } = Modal;

@connect(({ live, goods, loading }) => ({
  live,
  goods,
  loading: loading.models.live,
}))
@Form.create()
export default class Live extends PureComponent {
  state = {
    page: 1,
    formValues: {},
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'live/fetchLive',
      payload: {
        page,
      },
    });
  }

  // 开启关闭
  updateLiveStatus = (id, type, index) => {
    let typeName = '';
    if (type) {
      typeName = '关闭';
    } else {
      typeName = '开启';
    }
    const that= this;
    confirm({
      content: `你确定${typeName}这个吗？`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        dispatch({
          type: 'live/updateLiveStatus',
          payload: {
            live_id: id,
            status: type,
          },
          index,
          callback: () => {
            message.success('设置成功');
          },
        });
      },
      onCancel() {
      },
    });
  }

  // 删除商品
  deleteDataMsg = id => {
    event.preventDefault();
    const that = this;
    confirm({
      content: '你确定删除这个吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        const { page } = that.state;
        dispatch({
          type: 'live/deleteLive',
          payload: {
            live_id: id,
            page,
          },
        });
      },
      onCancel() {
      },
    });
  };
  // 修改信息
  editDataMsg = (data, e) => {
    e.preventDefault();
    this.showModal();
    const { dispatch } = this.props;
    dispatch({
      type: 'live/editLiveMsg',
      payload: {
        data,
      },
    });
  };
  handleSearch = e => {
    e.preventDefault();
    // const { page } = this.state;
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
        page: 1,
      });
      dispatch({
        type: 'live/fetchLive',
        payload: {
          ...values,
          page: 1,
        },
      });
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    const { page } = this.state;
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'live/fetchLive',
      payload: {
        page,
      },
    });
  };
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      page: current,
    });
    const { formValues } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchLive',
      payload: {
        ...formValues,
        page: current,
      },
    });
  };
  copyBtn = val => {
    copy(val);
    message.success('成功复制到剪贴板');
  };

  // 修改表单值
  changeFormVal = val => {
    const { dispatch } = this.props;
    const obj = {};
    for (const key of Object.keys(val)) {
      obj[key] = val[key].value;
    }
    dispatch({
      type: 'live/changeFormVal',
      payload: {
        obj,
      },
    });
  };
  goPath = () => {
    const { dispatch } = this.props;
    const url = `/community/add-live`;
    dispatch(routerRedux.push(url));
  };
  render() {
    const {
      live: { liveList: datas, liveListPage },
      loading,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const progressColumns = [
      {
        title: '社群标题',
        dataIndex: 'title',
        key: 'title',
        width: 200,
        render: val => (<Ellipsis lines={2}>{val}</Ellipsis>),
      },
      {
        title: '社群简介',
        dataIndex: 'desc',
        key: 'desc',
        width: 300,
        render: val => (<Ellipsis lines={2}>{val}</Ellipsis>),
      },
      {
        title: '社群封面',
        dataIndex: 'cover',
        render: val => (val ? <img src={val} style={{ width: '80px' }} alt="图片" /> : null),
      },
      {
        title: '分享路径',
        dataIndex: 'stv_live_id',
        render: val => `/pages/live/main?live_id=${val}&referee_id=`,
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record, index) => (
          <Fragment>
            <a onClick={this.copyBtn.bind(this, record.rtmp_push)}>推流地址</a>
            <Divider type="vertical" />
            <a href={`#/community/edit-live/confirm/${record.id}`}>修改</a>
            <Divider type="vertical" />
            {
              record.status ? (
                <a onClick={this.updateLiveStatus.bind(this, record.id, 0, index)}>开启</a>
              ) : (
                <a onClick={this.updateLiveStatus.bind(this, record.id, 1, index)}>关闭</a>
              )
            }
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form onSubmit={this.handleSearch} layout="inline" autoComplete="OFF">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="昵称">
                  {getFieldDecorator('nickname')(<Input placeholder="请输入昵称" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="用户id">
                  {getFieldDecorator('user_id')(<Input placeholder="请输入用户id" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="社群标题">
                  {getFieldDecorator('title')(<Input placeholder="请输入社群标题" />)}
                </FormItem>
              </Col>
            </Row>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ margin: '0 20px' }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </span>
            </div>
          </Form>
          <div className={styles.tableList}>
            <Table
              dataSource={datas}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
              pagination={liveListPage}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
