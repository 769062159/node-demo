import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Card, Form, Row, Col, Input, Select, Button, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ frontUser, loading }) => ({
  frontUser,
  loading: loading.models.frontUser,
}))
@Form.create()
export default class FrontUserList extends PureComponent {
  state = {
    pagination: 1, // 页脚
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
        pagination,
      },
    });
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
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
    console.log(999);
    dispatch({
      type: 'frontUser/fetchFrontUserList',
      payload: {
        pagination,
      },
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      pagination: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'frontUser/fetchFrontUserList',
      payload: {
        pagination: current,
      },
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
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
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
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

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { frontUser: { frontUserList: datas, frontUserListPage }, loading } = this.props;
    const progressColumns = [
      {
        title: '会员',
        dataIndex: 'avatar',
        render: (val, text) => (
          <Row style={{ width: 250 }}>
            <Col span={10}>
              <img style={{ height: 80 }} src={val} alt="头像" />
            </Col>
            <Col span={14} style={{ fontSize: 14 }}>
              <div>{text.nickname}</div>
              <div>Id:{text.id}</div>
              <div>等级:{text.level}</div>
            </Col>
          </Row>
        ),
        key: 'avatar',
      },
      {
        title: '统计',
        dataIndex: 'has_account',
        render: val => (
          <Row>
            <Col span={24} style={{ fontSize: 14 }}>
              <div>消费:{val.account_consume}</div>
              {/* <div>余额:{text.id}</div>
              <div>积分:{text.level}</div> */}
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
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
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
      </PageHeaderLayout>
    );
  }
}
