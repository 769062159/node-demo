import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Table, Modal, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const formSubmitLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 24 },
    sm: { span: 18, offset: 6 },
  },
};
@connect(({ program, loading }) => ({
  program,
  loading: loading.models.program,
}))
@Form.create()
export default class Setting extends PureComponent {
  state = {
    formVisible: false,
    type: 0,
  };
  componentDidMount() {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'program/getProgramDetail',
      payload: {
        account_id: id,
      },
    });
  }
  settingProgram = () => {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'program/getAuthorizationUrl',
      payload: {
        account_id: id,
      },
    });
  };
  editDataMsg = () => {
    console.log(11);
  };
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      formVisible: false,
    });
  };
  // 新增提交&&修改
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const { id } = this.props.match.params;
        const { type } = this.state;
        values.account_id = id;
        if (type === 2) {
          values.mchid = values.name;
        } else {
          values.key = values.name;
        }
        dispatch({
          type: 'program/editProgramDetail',
          payload: values,
        });
        this.handAddleCancel();
      }
    });
  };
  // 新增modal显示
  showModal = id => {
    this.setState({
      formVisible: true,
      type: id,
    });
  };
  render() {
    const { loading, form, program: { programDetail } } = this.props;
    const { formVisible, type } = this.state;
    const { getFieldDecorator } = form;
    const modalTitle = type === 2 ? '微信商户号' : '微信商户号密钥';
    const modalVal = type === 2 ? programDetail.mchid : programDetail.key;
    const settingColumns = [
      {
        title: '基本信息',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '当前设置',
        dataIndex: 'setting',
      },
      {
        title: '说明',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: record =>
          record.id === 1 ? (
            <Button type="primary" onClick={this.settingProgram}>
              已有小程序，立即设置
            </Button>
          ) : (
            <a onClick={this.showModal.bind(this, record.id)}>修改</a>
          ),
      },
    ];
    const datas = [
      {
        name: '小程序appId',
        setting: '',
        remark: '小程序的唯一标识。不可更改。',
        id: 1,
      },
      {
        name: '微信商户号',
        setting: '',
        remark: '必填。用于实现以下功能：微信支付；退款。',
        id: 2,
      },
      {
        name: '微信商户号密钥',
        setting: '',
        remark: '必填。用于实现以下功能：微信支付；退款。',
        id: 3,
      },
    ];
    return (
      <PageHeaderLayout>
        <Table
          //   onChange={this.handleTableChange}  // 换页
          className="components-table-demo-nested"
          // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
          dataSource={datas}
          rowKey={record => record.id}
          loading={loading}
          columns={settingColumns}
          pagination={false}
        />
        <Modal
          title={modalTitle}
          visible={formVisible}
          onCancel={this.handAddleCancel.bind(this)}
          destroyOnClose="true"
          footer=""
        >
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
            autoComplete="OFF"
          >
            <FormItem label={modalTitle} {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: modalVal,
              })(<Input />)}
            </FormItem>
            <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
              <Button type="primary" htmlType="submit" loading={loading}>
                修改
              </Button>
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
