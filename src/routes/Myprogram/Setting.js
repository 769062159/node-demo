import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Table, Modal, Input, Row, Col, Tag } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import UploadFile from '../../components/UploadFile';

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
    // dispatch({
    //   type: 'program/getWxOpen',
    //   payload: {
    //     account_id: id,
    //   },
    // });
  }
  settingProgram = () => {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'program/getAuthorizationUrl',
      payload: {
        account_id: id,
      },
      callback: url => {
        setTimeout(() => {
          window.open(url);
        }, 5000);
        // const form = document.createElement('form');
        // form.action = url;
        // form.target = '_blank';
        // form.method = 'POST';
        // console.log(form);
        // document.body.appendChild(form);
        // form.submit();
        // const a = document.createElement("a");
        // a.setAttribute('target','_blank');
        // a.href = url;
        // console.log(a);
        // const e = document.createEvent('MouseEvents');
        // e.initEvent('click', true, true );
        // a.dispatchEvent(e)
        // console.log(url);
        // window.open(url, 'about:blank');
        // const w = window.open('about:blank');
        // console.log(w);
        // w.location.href = url;
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
    const {
      loading,
      form,
      program: { programDetail, authorizationUrl },
      uploadFile,
    } = this.props;
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
            !programDetail.appid ? (
              // <Button type="primary" onClick={this.settingProgram}>
              //   已有小程序，立即设置
              // </Button>
              <Fragment>
                <a target="_blank" href={authorizationUrl}>
                  <Button type="primary">已有小程序，立即设置</Button>
                </a>
                <br />
                <Tag style={{ marginTop: 10 }}>若已过期,请刷新页面</Tag>
              </Fragment>
            ) : null
          ) : (
            <a onClick={this.showModal.bind(this, record.id)}>修改</a>
          ),
      },
    ];
    const datas = [
      {
        name: '小程序appId',
        setting: programDetail.appid,
        remark: '小程序的唯一标识。不可更改。',
        id: 1,
      },
      {
        name: '微信商户号',
        setting: programDetail.mchid,
        remark: '必填。用于实现以下功能：微信支付；退款。',
        id: 2,
      },
      {
        name: '微信商户号密钥',
        setting: programDetail.key,
        remark: '必填。用于实现以下功能：微信支付；退款。',
        id: 3,
      },
      // {
      //   name: '微信开放平台',
      //   setting: `${wxOpen ? '已绑定' : '未绑定'}`,
      //   id: 4,
      // },
    ];
    console.log(programDetail.id);
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
        <Row>
          <Col span={4} style={{ margin: '10px 0' }}>
            apiclient_cert.pem:
          </Col>
          <Col span={20} style={{ margin: '10px 0' }}>
            <UploadFile
              uploadUrl={uploadFile}
              appid={programDetail.appid}
              id={programDetail.id}
              status={programDetail.is_upload_cert}
              type="cert"
            />
          </Col>
          <Col span={4}>apiclient_key.pem:</Col>
          <Col span={20}>
            <UploadFile
              uploadUrl={uploadFile}
              appid={programDetail.appid}
              id={programDetail.id}
              status={programDetail.is_upload_key}
              type="key"
            />
          </Col>
        </Row>
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
