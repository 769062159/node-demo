import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Row, Col, Button, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
// const formItemLayout = {
//   labelCol: {
//     span: 5,
//   },
//   wrapperCol: {
//     span: 19,
//   },
// };
// const formSubmitLayout = {
//   wrapperCol: {
//     span: 19,
//     offset: 5,
//   },
// };
// const { confirm } = Modal;

@connect(({ finance, loading }) => ({
  finance,
  loading: loading.models.finance,
}))
@Form.create()
export default class Rank extends PureComponent {
  state = {
    expandForm: false,
    // editData: {},
    // formVisible: false,
    formValues: {},
    page: 1, // 页脚
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'finance/fetchAccountList',
      payload: {
        page,
      },
    });
  }

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
        type: 'finance/fetchAccountList',
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
      type: 'finance/fetchAccountList',
      payload: {
        page,
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
    const { formValues } = this.state;
    this.setState({
      page: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/fetchAccountList',
      payload: {
        ...formValues,
        page: current,
      },
    });
  };

  render() {
    const { finance: { accountList: datas, accountListPage }, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const progressColumns = [
      {
        title: '昵称',
        dataIndex: 'has_user',
        key: 'user_id',
        render: (val) => val ? (
          <div className={styles.userMsg}>
            <img src={val.avatar} alt="图片" />
            <div>
              <span>昵称:{val.nickname}</span>
              <span>id:{val.fake_id}</span>
            </div>
          </div>
        ) : null,
      },
      {
        title: '累计收益',
        dataIndex: 'account_total_income',
      },
      {
        title: '提现金额',
        dataIndex: 'account_withdrawed_cash',
      },
      {
        title: '未到账收入',
        dataIndex: 'projected_income',
      },
      // {
      //   title: '账户余额',
      //   dataIndex: 'account_commission',
      // },
      {
        title: '账户佣金',
        dataIndex: 'account_commission',
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            <a href={`#/finance/detail/${record.account_id}`}>详情</a>
            {/* <Divider type="vertical" /> */}
            {/* <a onClick={this.deleteGoods.bind(this, record.id)}>删除</a> */}
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
              {/* <Col md={8} sm={24}>
                <FormItem label="使用状态">
                  {getFieldDecorator('goods_status')(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="0">上架中</Option>
                      <Option value="1">未上架</Option>
                      <Option value="2">下架</Option>
                    </Select>
                  )}
                </FormItem>
              </Col> */}
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
          <div className={styles.tableList}>
            <Table
              onChange={this.handleTableChange}
              dataSource={datas}
              rowKey={record => record.account_id}
              loading={loading}
              columns={progressColumns}
              pagination={accountListPage}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
