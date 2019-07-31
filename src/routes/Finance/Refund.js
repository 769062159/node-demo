import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Switch,Table, message, Modal, Card, Form, Input, Button, Divider, InputNumber, Row, Col, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

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
const { TextArea } = Input;
const refundType = ['默认', '退款', '退货'];
const refundStatus = ['没有申请过退款', ' 退款申请中', '退款拒绝', '退款同意'];
const payType = ['微信支付', '支付宝支付', '扫呗支付', '线下支付'];
// const { confirm } = Modal;

@connect(({ finance, loading }) => ({
  finance,
  loading: loading.models.finance,
}))
@Form.create()
export default class Withdraw extends PureComponent {
  state = {
    expandForm: false,
    editData: {},
    formVisible: false,
    selectState: undefined,
    // formValues: {},
    page: 1, // 页脚
    type: 0, // 是否同意
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'finance/fetchRefundList',
      payload: {
        page,
      },
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  // 修改信息
  editDataMsg = (data, type, e) => {
    e.preventDefault();
    this.setState({
      editData: data,
      type,
    });
    this.showModal();
  };
  editMoney = (data, type, e) => {
    e.preventDefault();
    this.setState({
      editData: data,
      type,
    });
    this.showModal();
  };
  // 新增modal显示
  showModal = () => {
    this.setState({
      formVisible: true,
    });
    this.renderForm();
  };
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      formVisible: false,
      editData: {},
    });
  };
  // 新增修改提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const { editData, page, type, selectState } = this.state;
        if (type === 3) {
          if (!values.money) {
            message.error('请输入金额');
            return false;
          } else if (values.money * 100 > editData.refund_apply_money * 100) {
            message.error('输入金额请勿大于申请金额');
            return false;
          }
          values.order_goods_sku_id = editData.order_goods_sku_id;
          dispatch({
            type: 'finance/updateRefundMoney',
            payload: values,
            search: {
              refund_status: selectState,
              page,
            },
            callback: () => {
              message.success('更新成功');
            },
          });
        } else {
          values.type = type;
          values.order_goods_sku_id = editData.order_goods_sku_id;
          //是否退款状态：1退款，2不退
          if(this.state.money_type){values.money_type=this.state.money_type}
          if(this.state.password){values.password=this.state.password}
          dispatch({
            type: 'finance/updateRefundStatus',
            payload: values,
            search: {
              refund_status: selectState,
              page,
            },
            callback: () => {
              message.success('更新成功');
            },
          });
        }
        this.handAddleCancel();
      }
    });
  };
  changeState = (e) => {
    this.setState({
      selectState: e,
    })
  }
  search = () => {
    const { dispatch } = this.props;
    const { page, selectState } = this.state;
    dispatch({
      type: 'finance/fetchRefundList',
      payload: {
        refund_status: selectState,
        page,
      },
    });
  }
  handleFormReset = () => {
    this.setState({
      page: 1,
      selectState: null,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/fetchRefundList',
      payload: {
        page: 1,
      },
    });
  }
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      page: current,
    });
    const { selectState } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/fetchRefundList',
      payload: {
        page: current,
        refund_status: selectState,
      },
    });
  };
  moneyForm() {
    const { loading } = this.props;
    // const { editData } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem {...formItemLayout} label="修改金额">
          {getFieldDecorator('money', {})(
            <InputNumber step={0.01} precision={2} min={0.01} style={{ width: '200px' }} />
          )}
        </FormItem>
        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            修改金额
          </Button>
        </FormItem>
      </Form>
    );
  }
  renderAgree() {
    const { loading } = this.props;
    const { editData } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem {...formItemLayout} style={{ marginBottom: 5 }} label="申请日期">
          {moment(editData.create_time).format('YYYY-MM-DD HH:mm:ss')}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 5 }} label="退款金额">
          {editData.refund_money}
        </FormItem>
        <FormItem {...formItemLayout} label="是否退款">
          {getFieldDecorator('money_type')(<Switch onChange={(value)=>{this.setState({money_type:value?1:2})}} />)}
        </FormItem>
        {this.state.editData.refund_type==6&&
        <FormItem {...formItemLayout} label="密码">
          {getFieldDecorator('password',{rules: [{required:true, message: '请输入密码' }],})(<Input placeholder="请输入密码" type='password' onChange={(e)=>{this.setState({password:e.target.value})}} />)}
        </FormItem>}
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('remark', {
            rules: [],
          })(<TextArea placeholder="请输入备注" autosize />)}
        </FormItem>

        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            同意
          </Button>
        </FormItem>
      </Form>
    );
  }
  renderRefuse() {
    const { loading } = this.props;
    // const { editData } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('remark', {
            rules: [],
          })(<TextArea placeholder="请输入备注" autosize />)}
        </FormItem>
        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            驳回
          </Button>
        </FormItem>
      </Form>
    );
  }
  // 渲染修改还是新增
  renderForm() {
    const { type } = this.state;
    return type === 1 ? this.renderAgree() : type === 2 ? this.renderRefuse() : this.moneyForm();
  }
  render() {
    const { finance: { refundList: datas, refundListPage }, loading } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { formVisible, selectState } = this.state;
    const progressColumns = [
      {
        title: '退款商品',
        dataIndex: 'http_url',
        width: 320,
        render: (val, text) => (
          <div className={styles.shopTable}>
            <img style={{ height: 80, width: 80 }} src={val} alt="头像" />
            <div>
              <div
                className={styles.shopName}
                style={{
                  // '-webkit-box-orient': 'vertical',
                  'WebkitBoxOrient': 'vertical',
                  // '-webkit-line-clamp': 2,
                  'WebkitLineClamp': 2,
                  overflow: 'hidden',
                }}
              >
                {text.goods_name}
              </div>
              <div className={styles.space} />
              <div>属性:{text.attr_str.replace(/,/g, '')}</div>
              <div>总价:{text.price}</div>
            </div>
          </div>
        ),
      },
      {
        title: '支付类型',
        dataIndex: 'has_order_pack',
        width: 120,
<<<<<<< HEAD
        key:'has_order_pack',
=======
        key:'has_order_pack_type',
>>>>>>> 0d910d8... 退款申请新增是否退款淘淘谷支付密码字段
        render: val => payType[val.pay_type - 1],
      },
      {
        title: '订单',
        dataIndex: 'has_order_pack',
        width: 120,
<<<<<<< HEAD
        key:'has_order_pack1',
=======
        key:'has_order_pack_order',
>>>>>>> 0d910d8... 退款申请新增是否退款淘淘谷支付密码字段
        render: val => val.order_sn,
      },
      {
        title: '用户昵称',
        dataIndex: 'has_user',
        width: 120,
        render: val => val&&val.nickname,
      },
      {
        title: '申请时间',
        dataIndex: 'refund_at',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '申请退款金额',
        dataIndex: 'refund_apply_money',
      },
      {
        title: '实际退款',
        dataIndex: 'refund_money',
      },
      {
        title: '退款理由',
        dataIndex: 'refund_reason',
      },
      {
        title: '返利时间',
        dataIndex: 'profit_time',
        render: val => (val ? <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span> : '未返利'),
      },
      {
        title: '退款类型',
        dataIndex: 'refund_type',
        render: val => refundType[val],
      },
      {
        title: '退款状态',
        dataIndex: 'refund_status',
        render: val => refundStatus[val],
      },
      {
        title: '操作',
        dataIndex: 'goods_id',
        fixed: 'right',
        width: 130,
        render: (text, record) =>
          record.refund_status === 1 ? (
            <Fragment>
              <a onClick={this.editDataMsg.bind(this, record, 2)}>驳回</a>
              <Divider type="vertical" />
              <a onClick={this.editDataMsg.bind(this, record, 1)}>同意</a>
              <Divider type="vertical" />
              <a onClick={this.editMoney.bind(this, record, 3)}>修改金额</a>
            </Fragment>
          ) : null,
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              状态：
              <Select value={selectState} onChange={this.changeState} placeholder="请选择" style={{ width: 200 }}>
                <Option value={3}>退款同意</Option>
                <Option value={1}>退款申请中</Option>
                <Option value={2}>退款拒绝</Option>
              </Select>
            </Col>
            <Col md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" onClick={this.search}>
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </span>
            </Col>
          </Row>
          <div className={styles.tableList}>
            <Table
              onChange={this.handleTableChange}
              scroll={{ x: '120%' }}
              dataSource={datas}
              rowKey={record => record.order_goods_sku_id}
              loading={loading}
              columns={progressColumns}
              pagination={refundListPage}
            />
          </div>
        </Card>
        <Modal
          title="退款"
          visible={formVisible}
          onCancel={this.handAddleCancel.bind(this)}
          footer=""
          destroyOnClose="true"
        >
          {this.renderForm()}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
