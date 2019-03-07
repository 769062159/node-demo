import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Table, Modal, Input, Row, Col, Tag, message, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import UploadFile from '../../components/UploadFile';
import styles from './Style.less';
const QRCode = require('qrcode.react');

const { Option } = Select;
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
    uploadTxt: process.env[process.env.API_ENV].wxTxt,
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
    console.log(this.program);
    dispatch({
      type: 'program/getAuthorizationUrl',
      payload: {
        account_id: id,
      },
      callback: (url, bin_component_url) => {
        console.log(url, bin_component_url)
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
  };
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      formVisible: false,
    });
  };
  changeShow = (e) => {
    const { dispatch, program: { programDetail } } = this.props;
    const data = {
      account_id: programDetail.id,
      mcid: programDetail.merchant_id,
      key: programDetail.key,
      is_show_live: Number(e),
    };
    dispatch({
      type: 'program/updateProgram',
      payload: data,
      callback: () => {
        message.success('设置成功');
      },
    });
  }
  handlePay = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'program/updateKeyProgram',
      // id: programDetail.id,
      // key: 'pay_type',
      // value: Number(e),
      payload: {
        key: 'pay_type',
        value: Number(e),
      },
      // callback: () => {
      //   message.success('设置成功');
      // },
    });
  }
  handleVersion = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'program/updateKeyProgram',
      // id: programDetail.id,
      // key: 'config_version',
      // value: Number(e),
      payload: {
        key: 'config_version',
        value: Number(e),
      },
      // callback: () => {
      //   message.success('设置成功');
      // },
    });
  }
  handleJump = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'program/updateKeyProgram',
      payload: {
        key: 'config_jump_account',
        value: Number(e),
      },
      // id: programDetail.id,
      // key: 'config_jump_account',
      // value: Number(e),
      // callback: () => {
      //   message.success('设置成功');
      // },
    });
  }
  saveProgram = () => {
    const { dispatch, program: { programDetail } } = this.props;
    const payload = {
      account_id: programDetail.id,
      config_jump_account: programDetail.config_jump_account,
      config_version: programDetail.config_version,
      pay_type: programDetail.pay_type,
    }
    dispatch({
      type: 'program/saveProgram',
      payload,
      callback: () => {
        message.success('设置成功');
      },
    });
  }
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
      program: { programDetail, authorizationUrl, binComponentUrl },
      uploadFile,
    } = this.props;
    let programName = '';
    if (programDetail.type) {
      programName = '公众号'
    } else {
      programName = '小程序'
    }
    const { formVisible, type, uploadTxt } = this.state;
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
            <Fragment>
              <div>
                <QRCode
                  value={binComponentUrl}
                  size={200}
                  bgColor="purple"
                  fgColor="white"
                />
              </div>
              {/* <a target="_blank" href={authorizationUrl}>
                <Button type="primary">已有{programName}，立即设置</Button>
              </a> */}
              <br />
              <Tag style={{ marginTop: 10 }}>若已过期,请刷新页面</Tag>
              {/* <br />
              {
                process.env.API_ENV === 'dev' ? (
                  <Tag className={styles.tip}>测试环境需要复制授权地址，发送给公众号/小程序管理员授权！！！！！，必须在手机端微信打开！！！！</Tag>
                ) : null
              } */}
            </Fragment>
          ) : (
            <a onClick={this.showModal.bind(this, record.id)}>修改</a>
          ),
      },
    ];
    const datas = [
      {
        name: `${programName}appId`,
        setting: programDetail.appid,
        remark: `${programName}的唯一标识。不可更改。`,
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
    return (
      <PageHeaderLayout>

        {
          programDetail.type === 0 ? (
            <Tag color="blue">
              如需开通直播，请您在小程序管理后台，“设置”-“接口设置”中自助开通该直播权限
            </Tag>
          ) : (
            <Tag color="blue">
              公众号地址：{process.env[process.env.API_ENV].h5Url}/index?wechat_account_id={programDetail.id}
            </Tag>
          )
        }
        <br />
        {
          programDetail.type !== 0 ? (
            <Tag >公众号支付还需要登录https://pay.weixin.qq.com微信商户平台;选择产品中心-》开发配置-》公众号支付支付授权目录;添加{process.env[process.env.API_ENV].h5Url}/</Tag>
          ) : null
        }
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
          <Col span={4} style={{ margin: '10px 0' }}>apiclient_key.pem:</Col>
          <Col span={20} style={{ margin: '10px 0' }}>
            <UploadFile
              uploadUrl={uploadFile}
              appid={programDetail.appid}
              id={programDetail.id}
              status={programDetail.is_upload_key}
              type="key"
            />
          </Col>
          {
            programDetail.type === 1 ? (
              <Fragment>
                <Col span={4}>域名验证文件</Col>
                <Col span={20}>
                  <UploadFile
                    uploadUrl={uploadTxt}
                    appid={programDetail.appid}
                    id={programDetail.id}
                    status={programDetail.domain_txt}
                    type="txt"
                  />
                </Col>
              </Fragment>
            ) : (
              <Fragment>
                <Col span={4} style={{ marginTop: 10 }}>支付方式</Col>
                <Col span={20} style={{ marginTop: 10 }}>
                  <Select onChange={this.handlePay} style={{ width: 200 }} value={programDetail.pay_type}>
                    <Option value={1} key={1}>微信支付</Option>
                    <Option value={3} key={3}>钱尔通支付</Option>
                  </Select>
                </Col>
              </Fragment>
            )
          }
          <Col span={4} style={{ marginTop: 10 }}>跳转版本</Col>
          <Col span={20} style={{ marginTop: 10 }}>
            <Select onChange={this.handleVersion} style={{ width: 200 }} value={programDetail.config_version}>
              <Option value={0} key={0}>通用版</Option>
              <Option value={1} key={1}>跳转版</Option>
              <Option value={2} key={2}>隐藏版</Option>
            </Select>
          </Col>
          {
            programDetail.config_version === 1 ? (
              <Fragment>
                <Col span={4} style={{ marginTop: 10 }}>跳转版本</Col>
                <Col span={20} style={{ marginTop: 10 }}>
                  <Select onChange={this.handleJump} style={{ width: 200 }} value={programDetail.config_jump_account}>
                    <Option value={0} key={0}>全球视群</Option>
                    <Option value={1} key={1}>百万视群</Option>
                  </Select>
                </Col>
              </Fragment>
            ) : null
          }
          <Col span={20} offset={4} style={{ marginTop: 10 }}>
            <Button type="primary" onClick={this.saveProgram}>保存</Button>
          </Col>
          {/* <Col span={4} style={{ marginTop: 10 }}>是否显示视群</Col>
          <Col span={20} style={{ marginTop: 10 }}>
            <Switch checkedChildren="开" onChange={this.changeShow} unCheckedChildren="关" checked={!!programDetail.is_show_live} />
          </Col> */}
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
