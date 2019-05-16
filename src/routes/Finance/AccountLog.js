import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { DatePicker, Select, Table, Card, Form, Row, Col, Button, Input } from 'antd';
const { RangePicker } = DatePicker
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';


import styles from './TableList.less';

const FormItem = Form.Item;
const upgrade = ['普通商品', '盟主专属', '群主专属'];
const actionType = ['-', '充值', '下单返利', '退款减利', '提现', '后台操作', '线下操作'];
const status = ['未到账', '已到账', '已失效'];
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

@connect(({ finance, global, loading }) => ({
  finance,
  global,
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

  onRankChange(value, dateString) {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  }

  onRankOk(value) {
    console.log('onOk: ', value);
  }
  
  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'finance/fetchAccountLogList',
      payload: {
        page,
      },
    });
  }

  handleSearch = e => {
    e.preventDefault();
    // const { page } = this.state;
    this.setState({
      page: 1,
    })
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
        type: 'finance/fetchAccountLogList',
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
      type: 'finance/fetchAccountLogList',
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
      type: 'finance/fetchAccountLogList',
      payload: {
        ...formValues,
        page: current,
      },
    });
  };

  render() {
    const { finance: { accountLogList: datas, accountLogListPage }, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const progressColumns = [
      {
        title: '佣金得主',
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
        title: '备注',
        dataIndex: 'desc',
      },
      {
        title: '购买人',
        dataIndex: 'has_buyer',
        key: 'buyer_id',
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
        title: '佣金',
        dataIndex: 'money',
      },
      {
        title: '订单',
        dataIndex: 'order_sn',
      },
      {
        title: '操作类型',
        dataIndex: 'action_type',
        key: 'action_type',
        render: val => actionType[val],
      },
      {
        title: '类型',
        dataIndex: 'upgrade_type',
        key: 'upgrade_type',
        render: val => upgrade[val],
      },
      {
        title: '生成时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
        key: 'create_time',
      },
      {
        title: '到账时间',
        dataIndex: 'profit_time',
        render: (val, record) => record.status === 1 ? <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span> : record.status === 2 ? '已失效' : '未到账',
        key: 'profit_time',
      },
      // {
      //   title: '账户佣金',
      //   dataIndex: 'account_commission',
      // },
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
                <FormItem label="用户ID">
                  {getFieldDecorator('user_id')(<Input placeholder="订单购买人|佣金得主" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="订单号SN">
                  {getFieldDecorator('order_sn')(<Input placeholder="sn开头订单号" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="佣金类型">
                  {getFieldDecorator('action_type')(
                    <Select placeholder="请选择" style={{ minWidth: '100px', width: '100%' }}>
                      {
                        actionType.map((item, index) => {
                          return <Option value={index} >{item}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col md={8} sm={24}>
                <FormItem label="生成时间">
                  {getFieldDecorator('times')(<RangePicker
                    // showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD"
                    style={{ width: '250px' }}
                    placeholder={['开始日期', '结束日期']}
                  />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="到账状态">
                  {getFieldDecorator('status')(
                    <Select placeholder="请选择" style={{ minWidth: '100px', width: '100%' }}>
                      <Option value="-1" >-</Option>
                      {
                        status.map((item, index) => {
                          return <Option value={index} >{item}</Option>
                        })
                      }
                    </Select>
                  )}
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
          <div className={styles.tableList}>
            <Table
              onChange={this.handleTableChange}
              dataSource={datas}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
              pagination={accountLogListPage}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
