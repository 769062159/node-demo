import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, message, Modal, Card, Form, Input, Button, Divider, InputNumber } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
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
        const { editData, page, type } = this.state;
        if (type === 3) {
          if (!values.money) {
            message.error('请输入金额');
            return false;
          } else if (values.money * 100 > editData.refund_apply_money * 100) {
            message.error('输入金额请勿大于申请金额');
            return false;
          }
          values.page = page;
          values.order_goods_sku_id = editData.order_goods_sku_id;
          dispatch({
            type: 'finance/updateRefundMoney',
            payload: values,
          });
        } else {
          values.page = page;
          values.type = type;
          values.order_goods_sku_id = editData.order_goods_sku_id;
          dispatch({
            type: 'finance/updateRefundStatus',
            payload: values,
          });
        }
        message.success('更新成功');
        this.handAddleCancel();
      }
    });
  };
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      page: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/fetchRefundList',
      payload: {
        page: current,
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
        {/* <Row>
          <Col span={5}>
           申请日期:
          </Col>
          <Col span={19}>
            {moment(editData.create_time*1000).format('YYYY-MM-DD HH:mm:ss')}
          </Col>
          <Col span={5}>
            申请金额:
          </Col>
          <Col span={19}>
            {editData.money}
          </Col>
          <Col span={5}>
            收款帐号:
          </Col>
          <Col span={19}>
            {editData.account_no}
          </Col>
          <Col span={5}>
            收款人:
          </Col>
          <Col span={19}>
            {editData.real_name}
          </Col>
        </Row> */}
        <FormItem {...formItemLayout} style={{ marginBottom: 5 }} label="申请日期">
          {moment(editData.create_time).format('YYYY-MM-DD HH:mm:ss')}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 5 }} label="提现金额">
          {editData.refund_money}
        </FormItem>
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
    console.log(datas);
    // const { getFieldDecorator } = this.props.form;
    const { formVisible } = this.state;
    const progressColumns = [
      {
        title: '退款商品',
        dataIndex: 'http_url',
        width: 320,
        render: (val, text) => (
          <div className={styles.shopTable}>
            <img style={{ height: 80, width: 80 }} src={val} alt="头像" />
            <div>
              <div className={styles.shopName}>{text.goods_name}</div>
              <div className={styles.space} />
              <div>属性:{text.attr_str.replace(/,/g, '')}</div>
              <div>总价:{text.price}</div>
            </div>
          </div>
        ),
      },
      {
        title: '用户昵称',
        dataIndex: 'has_user',
        width: 120,
        render: val => val.nickname,
      },
      {
        title: '申请时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
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
        render: val => (val ? <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span> : '未返利'),
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
          <div className={styles.tableList}>
            {/* <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.showModal.bind(this)}>
                新建
              </Button>
            </div> */}
            <Table
              onChange={this.handleTableChange}
              scroll={{ x: 1200 }}
              dataSource={datas}
              rowKey={record => record.order_goods_sku_id}
              loading={loading}
              columns={progressColumns}
              pagination={refundListPage}
            />
          </div>
        </Card>
        <Modal
          title="提现"
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
