import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Table,
  Card,
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  Icon,
  Divider,
  Modal,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import EditForm from './EditForm';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const formSubmitLayout = {
  wrapperCol: {
    span: 19,
    offset: 5,
  },
};

@connect(({ frontUser, loading }) => ({
  frontUser,
  loading: loading.models.frontUser,
}))
@Form.create()
export default class FrontUserList extends PureComponent {
  state = {
    pagination: 1, // 页脚
    formVisible: false,
    editDataId: 0,
    type: 0,
    // formValues: {},
    expandForm: false,
    // header: {
    //   Authorization: `Bearer ${localStorage.getItem('token')}`,
    // },
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'frontUser/fetchFrontUserList',
      payload: {
        page: pagination,
      },
    });
    dispatch({
      type: 'frontUser/fetchUserRankList',
      payload: {
        pagination,
      },
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { pagination } = this.state;
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        page: pagination,
      };

      //   this.setState({
      //     formValues: values,
      //   });
      console.log(values);
      dispatch({
        type: 'frontUser/fetchFrontUserList',
        payload: values,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pagination } = this.state;
    form.resetFields();
    // this.setState({
    //   formValues: {},
    // });
    dispatch({
      type: 'frontUser/fetchFrontUserList',
      payload: {
        page: pagination,
      },
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };
  // 修改信息
  editDataMsg = (id, type, e) => {
    e.preventDefault();
    this.setState({
      editDataId: id,
      type,
    });
    this.showModal();
  };
  // 新增modal显示
  showModal = () => {
    this.setState({
      formVisible: true,
    });
    // this.renderForm();
  };
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      formVisible: false,
      editDataId: 0,
    });
  };
  // 新增修改提交
  handleSubmit = (type, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const { editDataId, pagination, type } = this.state;
        values.page = pagination;
        values.user_id = editDataId;
        if (type === 1) {
          values.referee_id = values.level_id;
          dispatch({
            type: 'frontUser/updateUpLevel',
            payload: values,
          });
        } else {
          dispatch({
            type: 'frontUser/updateMemberLevel',
            payload: values,
          });
        }
        message.success('修改成功');
        this.handAddleCancel();
      }
    });
  };

  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      pagination: current,
    });
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        page: current,
      };
      console.log(values);
      dispatch({
        type: 'frontUser/fetchFrontUserList',
        payload: values,
      });
    });
  };
  renderAddForm() {
    const { loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this, 0)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem {...formItemLayout} label="上级id">
          {getFieldDecorator('level_id', {
            rules: [
              {
                required: true,
                message: '请输入上级id',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
  renderEditForm() {
    const { loading, frontUser: { userRankList: datas } } = this.props;
    const levelItem = [];
    if (datas.length) {
      datas.forEach(res => {
        levelItem.push(
          <Option value={res.id} key={res.id}>
            {res.name}
          </Option>
        );
      });
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this, 1)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem {...formItemLayout} label="用户等级">
          {getFieldDecorator('level_id', {
            rules: [
              {
                required: true,
                message: '请输入用户等级',
              },
            ],
          })(<Select>{levelItem}</Select>)}
        </FormItem>
        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            修改
          </Button>
        </FormItem>
      </Form>
    );
  }
  // 渲染修改还是新增
  renderForm() {
    const { type } = this.state;
    return type === 1 ? this.renderAddForm() : this.renderEditForm();
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" autoComplete="OFF">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('nickname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户id">
              {getFieldDecorator('user_id')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" autoComplete="OFF">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('nickname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户id">
              {getFieldDecorator('goods_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户等级">
              {getFieldDecorator('goods_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">上架中</Option>
                  <Option value="1">未上架</Option>
                  <Option value="2">下架</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="上级用户id">
              {getFieldDecorator('goods_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderInquire() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      frontUser: { frontUserList: datas, frontUserListPage, userRankList },
      loading,
    } = this.props;
    const { formVisible, type, pagination, editDataId } = this.state;
    const progressColumns = [
      {
        title: '会员',
        dataIndex: 'avatar',
        render: (val, text) => (
          <Row style={{ width: 500 }}>
            <Col span={4}>
              <img style={{ height: 80 }} src={val} alt="头像" />
            </Col>
            <Col span={14} style={{ fontSize: 14 }}>
              <div>{text.nickname}</div>
              <div>Id:{text.id}</div>
              <div>等级:{text.account_level}</div>
              <div>上级:{text.referee && text.referee.nickname}</div>
            </Col>
          </Row>
        ),
        key: 'avatar',
      },
      {
        title: '统计',
        dataIndex: 'has_account',
        render: (val, text) => (
          <Row>
            <Col span={24} style={{ fontSize: 14 }}>
              <div>消费:{val.account_consume}</div>
              <div>佣金:{val.account_total_income}</div>
              <div>注册渠道:{text.wechat_account_name}</div>
            </Col>
          </Row>
        ),
        key: 'id',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
        key: 'create_time',
      },
      {
        title: '操作',
        render: record => (
          <Fragment>
            <a onClick={this.editDataMsg.bind(this, record.id, 1)}>设上级</a>
            <Divider type="vertical" />
            <a onClick={this.editDataMsg.bind(this, record.id, 2)}>设置等级</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderInquire()}</div>
          <div className={styles.tableList}>
            <Table
              onChange={this.handleTableChange}
              dataSource={datas}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
              pagination={frontUserListPage}
            />
          </div>
        </Card>
        <Modal
          title="修改"
          visible={formVisible}
          onCancel={this.handAddleCancel.bind(this)}
          footer=""
          destroyOnClose="true"
        >
          {/* {this.renderForm()} */}
          <EditForm
            loading={loading}
            userRankList={userRankList}
            type={type}
            editDataId={editDataId}
            pagination={pagination}
            handAddleCancel={this.handAddleCancel}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
