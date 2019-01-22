import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, message, Modal, Card, Form, Input, Button, Tag, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SearchForm from './SearchForm';
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
const withdrawStatus = ['提现申请', '提现成功', '提现失败'];
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
    formValues: {},
    page: 1, // 页脚
    type: 0, // 是否同意
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'finance/fetchWithdraw',
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
  handleSearch = (val) => {
    this.setState({
      formValues: val,
      page: 1,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/fetchWithdraw',
      payload: {
        ...val,
        page: 1,
      },
    });
  }
  // 新增修改提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const { editData, page, type } = this.state;
        values.page = page;
        values.status = type;
        values.id = editData.id;
        dispatch({
          type: 'finance/updateWithdraw',
          payload: values,
          callback: () => {
            message.success('更新成功');
          },
        });
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
    const { formValues } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/fetchWithdraw',
      payload: {
        ...formValues,
        page: current,
      },
    });
  };

  handleFormReset = () => {
    this.setState({
      page: 1,
      formValues: {},
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/fetchWithdraw',
      payload: {
        page: 1,
      },
    });
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
          {moment(editData.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 5 }} label="申请金额">
          {editData.money}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 5 }} label="收款帐号">
          {editData.account_no}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 5 }} label="收款人">
          {editData.real_name}
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
    return type === 1 ? this.renderAgree() : this.renderRefuse();
  }
  render() {
    const { finance: { withdrawList: datas, withdrawListPage }, loading } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { formVisible } = this.state;
    const progressColumns = [
      {
        title: '用户信息',
        dataIndex: 'has_user',
        width: 230,
        render: (val, record) => (
          <div className={styles.userMsg}>
            <img src={val.avatar} alt="图片" />
            <div>
              <span>{val.nickname}</span>
              <span>Id:<a href={`#/finance/detail/${record.account_id}`}>{val.fake_id}</a></span>
            </div>
          </div>
        ),
      },
      {
        title: '昵称/手机号',
        dataIndex: 'real_name',
        width: 150,
        render: (val, record) => (
          <div>
            <div>{val}</div>
            <div>{record.mobile}</div>
          </div>
        ),
      },
      {
        title: '申请类别',
        dataIndex: 'type',
        render: val => (val ? '微信提现' : '银行卡提现'),
      },
      {
        title: '申请时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '申请金额（元）',
        dataIndex: 'apply_money',
      },
      {
        title: '到账金额（元）',
        dataIndex: 'money',
      },
      {
        title: '收款帐号/OpenID',
        dataIndex: 'account_no',
      },
      {
        title: '开户行',
        dataIndex: 'bank_name',
        render: (val, record) => <span>{record.bank_addr + val}</span>,
      },
      {
        title: '状态',
        width: 120,
        dataIndex: 'status',
        render: val => withdrawStatus[val],
      },
      {
        title: '自动提现失败说明',
        width: 120,
        dataIndex: 'remark',
        render: (val, record) => record.status === 2 ? (`${moment(record.auto_withdraw_time * 1000).format('YYYY-MM-DD HH:mm:ss')} ${record.auto_withdraw_error}`) : null,
      },
      {
        title: '操作',
        dataIndex: 'account_id',
        width: 150,
        render: (text, record) =>
        record.status === 0 ? (
          <Fragment>
            <a onClick={this.editDataMsg.bind(this, record, 2)}>驳回</a>
            <Divider type="vertical" />
            <a onClick={this.editDataMsg.bind(this, record, 1)}>同意</a>
          </Fragment>
          ) : record.status === 1 ? null : null,
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Tag
            color="blue"
            style={{ marginBottom: 20, width: '100%', whiteSpace: 'pre-wrap', height: 'auto' }}
          >
            由于发放佣金需要在微信商户平台开通企业付款到零钱这个功能才可以正常发放，所以请商户们需要提前开通此功能。此功能需要满足已入驻90日 ，有30天连续正常交易才可以去产品中心开通。详细请查看。<a style={{ color: 'red' }} href="https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_1" target="view_window">微信支付企业付款</a>
            <br />
            微信提现是直接到账的。
          </Tag>
          <SearchForm handleFormReset={this.handleFormReset} handleSearch={this.handleSearch} />
          <Table
            scroll={{ x: '120%' }}
            onChange={this.handleTableChange}
            dataSource={datas}
            rowKey={record => record.id}
            loading={loading}
            columns={progressColumns}
            pagination={withdrawListPage}
          />
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
