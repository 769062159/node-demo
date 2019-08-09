import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {toDate} from '../../utils/date'
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
// import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import EditForm from './EditForm';
import MoneyForm from './MoneyForm';
import CodeForm from './CodeForm';
import RemarkForm from './RemarkForm';
import AuthDialog from '../../components/AuthDialog';
import styles from './TableList.less';

const { adminUrl } = process.env[process.env.API_ENV];

const LevelName = ['粉丝', '盟主', '群主', '店主'];
const { confirm } = Modal;
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

@connect(({ frontUser, global, login, loading, user }) => ({
  frontUser,
  login,
  global,
  user,
  loading: loading.models.frontUser,
}))
@Form.create()
export default class FrontUserList extends PureComponent {
  state = {
    codeMsg: {},
    isCode: false, // 设置授权码
    moneyMsg: {},
    isCommssion: false,
    isRemark: false,
    remarkMsg: {},
    powerValue: null,
    pagination: 1, // 页脚
    formVisible: false,
    editDataId: 0,
    type: 0,
    defaultId: '',
    merchantVisible: false,
    account: '',
    editId: '',
    password: '',
    // formValues: {},
    expandForm: false,
    // header: {
    //   Authorization: `Bearer ${localStorage.getItem('token')}`,
    // },
    passwordVisible: true,
    password: ''
  };
  componentDidMount() {
    if (this.props.global.actionPassword != '') {
      this.setState({
        password: this.props.global.actionPassword,
        passwordVisible: false
      }, function() {
        this.handlePasswordConfirm();
      })
    }
  };

  handlePasswordChange = e => {
    this.setState({
      password: e.target.value
    })
  }
  handlePasswordConfirm = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/checkPassword',
      payload: {
        password: this.state.password
      },
      callback: () => {
        this.setState({
          passwordVisible: false
        })
        this.props.dispatch({
          type: 'global/saveActionPassword',
          payload: this.state.password
        })

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
        dispatch({
          type: 'frontUser/getDefaultList',
        });
      }
    });
  };
  handlePasswordCancel = () => {
    this.setState({
      passwordVisible: false,
      password: ''
    });
  };
  setDefaultValue = e => {
    this.setState({
      defaultId: e.target.value,
    });
  };
  getFans = (id) => {
    const { form } = this.props;
    form.resetFields();
    form.setFieldsValue({
      referee_id: id,
    });
    this.setState({
      pagination: 1,
    }, () => {
      this.handleSearch();
    })
  }
  // 设置商户
  setMerchant = (record, e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    let account = null;
    if (record.shop_store) {
      account = record.shop_store.username;
    }
    dispatch({
      type: 'frontUser/getMerchantmobile',
      callback: (e) => {
        this.setState({
          account: account ? account : `${record.id}@${e}`,
          password: record.mobile || '请先在小程序授权手机号',
          editId: record.id,
          powerValue: Number(record.has_account ? record.has_account.permission : 0),
          merchantVisible: true,
        })
      },
    });
  }
  setRemark = (record, e) => {
    e.preventDefault();
    console.log(e);
    console.log(record);
    let remarkMsg = {
      id: record.id,
      remark: record.has_user_oauth ? record.has_user_oauth.user_remark : ''
    };
    this.setState({
      isRemark: true,
      remarkMsg
    })
  }
  setCode = (record, e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'frontUser/getCodeNum',
      payload: {
        member_id: record.id,
      },
      callback: (e) => {
        const codeMsg = e;
        codeMsg.name = record.nickname;
        this.setState({
          editId: record.id,
          isCode: true,
          codeMsg,
        });
      },
    });
  }
  setDefault = () => {
    const { defaultId } = this.state;
    if (defaultId) {
      const { dispatch } = this.props;
      dispatch({
        type: 'frontUser/setDefault',
        payload: {
          user_id: defaultId,
        },
        callback: () => {
          message.success('设置成功');
        },
      });
    } else {
      message.error('请输入站长id');
    }
  };
  handleSearch = e => {
    if (e) {
      e.preventDefault()
    }
    this.setState({
      pagination: 1,
    })
    // const { pagination } = this.state;
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        page: 1,
      };

      //   this.setState({
      //     formValues: values,
      //   });
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
  // 修改权限等级
  handleLevel = (powerValue) => {
    this.setState({
      powerValue,
    })
  }
  searchMsg = (text) => {
    if (text.fakeid) {
      const { form } = this.props;
      form.resetFields();
      form.setFieldsValue({
        user_id: text.fakeid,
        nickname: '',
        user_oauth_type: '',
      });
      this.setState({
        pagination: 1,
      }, () => {
        this.handleSearch();
      })
    }
  }

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
      dispatch({
        type: 'frontUser/fetchFrontUserList',
        payload: values,
      });
    });
  };
  // 设置商户
  merchantModal = () => {
    const { merchantVisible } = this.state;
    this.setState({
      merchantVisible: !merchantVisible,
      powerValue: null,
    })
  }
  changePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  }
  merchantOK = () => {
    const { password, account, editId, powerValue } = this.state;
    if (powerValue === null) {
      message.error('请选择权限');
      return false;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'frontUser/merchantSetting',
      payload: {
        username: account,
        password: password || '123456',
        member_id: editId,
        type: powerValue,
      },
      callback: () => {
        message.success('设置成功');
        this.merchantModal();
      },
    });
  }

  handleSetting = (fakeid, status) => {
    const { dispatch } = this.props;
    let statusTxt = '';
    if (status) {
      statusTxt = '设置';
    } else {
      statusTxt = '取消';
    }
    confirm({
      content: `你确定${statusTxt}这个审核员吗？`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        if (status === 3) {
          dispatch({
            type: 'frontUser/createMember',
            payload: {
              user_id: fakeid,
              status,
            },
            callback: () => {
                message.success('设置成功');
            },
          });
        } else {
          dispatch({
            type: 'frontUser/cancelOrPosition',
            payload: {
              user_id: fakeid,
              status,
            },
            callback: () => {
                message.success('设置成功');
            },
        });
        }
      },
      onCancel() {
          console.log('Cancel');
      },
    });
  }

  updateCommssion = (e) => {
    const moneyMsg = {
      id: e.id,
      name: e.nickname,
      money: e.has_account.account_commission,
    }
    console.log(moneyMsg);
    this.setState({
      isCommssion: true,
      moneyMsg,
    })
  }
  remarkOK = e => {
    const { dispatch } = this.props;
    const { remarkMsg } = this.state;
    const { pagination } = this.state;
    let data = {
      remark: e.remark,
      user_id: remarkMsg.id
    }
    console.log(data);
    dispatch({
      type: 'frontUser/setRemark',
      payload: data,
      callback: () => {
        message.success('设置成功');
        this.setState({
          isRemark: false,
          remarkMsg: {}
        })
        this.handleSearch();
      }
    })
  }
  codeOK = (e) => {
    const { dispatch } = this.props;
    const { editId } = this.state;
    e.member_id = editId;
    dispatch({
      type: 'frontUser/setAuthorCode',
      payload: e,
      callback: () => {
        message.success('设置成功');
        this.setState({
          isCode: false,
          editId: '',
        })
      },
    })
  }
  moneyOK = (e) => {
    const { moneyMsg } = this.state;
    e.member_id = moneyMsg.id;
    const { dispatch } = this.props;
    dispatch({
      type: 'frontUser/updateCommssion',
      payload: e,
      callback: () => {
        message.success('设置成功');
        this.setState({
          isCommssion: false,
          moneyMsg: {},
        })
      },
    });
  }

  codeCancel = () => {
    this.setState({
      isCode: false,
      editId: '',
    })
  }

  moneyCancel = () => {
    this.setState({
      isCommssion: false,
    })
  }
  remarkCancel = () => {
    this.setState({
      isRemark: false,
    })
  }

  changeFormVals = (obj) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'frontUser/changeFormVals',
      payload: {
        obj,
      },
    });
  }

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
        <FormItem {...formItemLayout} label="VIP_id">
          {getFieldDecorator('level_id', {
            rules: [
              {
                required: true,
                message: '请输入VIP_id',
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
      <Form onSubmit={this.handleSearch} layout="inline" autoComplete="OFF" labelCol={
        {
          xs: { span: 24 },
          sm: { span: 5 },
        }
      }>
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
            <FormItem label="店铺">
              {getFieldDecorator('user_oauth_type')(
                <Select>
                  <Option value={0}>粉丝</Option>
                  <Option value={2}>群主</Option>
                  <Option value={3}>店主</Option>
                  <Option value={1}>盟主</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col md={8} sm={24}>
            <FormItem label="VIPid">
              {getFieldDecorator('referee_id')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('mobile')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="备注">
              {getFieldDecorator('user_remark')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="推荐关系">
              {getFieldDecorator('expire_status')(<Select>
                <Option value={1}>有效</Option>
                <Option value={2}>过期</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}></Col>
          <Col md={8} sm={24}></Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </span>
        </div>
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
            <FormItem label="VIP用户id">
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
      frontUser: { frontUserList: datas, frontUserListPage, userRankList, getDefaultList, codeForm },
      user: { currentUser },
      loading,
    } = this.props;
    const hasAccountDefault = {
      account_balance: '0.00',
      account_commission: '0.00',
      account_confirming: '0.00',
      account_consume: '0.00',
      account_expenditure: '0.00',
      account_id: 0,
      account_total_income: '0.00',
      account_withdrawed_cash: '0.00',
      account_withdrawing_cash: '0.00',
      level: '0.00',
      permission: 0,
      level_id: 0,
      merchant_id: 0,
      projected_income: '0.00',
      update_time: 0,
      user_id: 0,
      user_oauth_id: 0,
      wechat_account_id: 1,
    };
    datas.forEach(item => {
      item.has_account = item.has_account || hasAccountDefault;
    });
    const { isCode, formVisible, type, pagination, editDataId, merchantVisible, account, powerValue, password, isCommssion, isRemark, remarkMsg, moneyMsg, codeMsg } = this.state;
    const progressColumns = [
      {
        title: '会员',
        dataIndex: 'avatar',
        render: (val, text) => (

          // <Row style={{ width: 500 }}>
          //   <Col span={4}>
          //     <img style={{ height: 80, width: 80 }} src={val} alt="头像" />
          //   </Col>
          //   <Col span={14} style={{ fontSize: 14 }}>
          //     <div>{text.nickname}</div>
          //     <div>Id:{text.id}</div>
          //     <div>等级:{text.account_level}</div>
          //     <div>上级:{text.referee && text.referee.nickname}</div>
          //   </Col>
          // </Row>
          <div className={styles.userBox}>
            <img style={{ height: 80, width: 80 }} src={val} alt="头像" />
            <div className={styles.userInfo}>
              <div>昵称: {text.nickname}</div>
              <div>Id: {text.id}</div>
              <div>等级: {text.account_level}</div>
              <div>版本: {LevelName[Number(text.has_account ? text.has_account.permission : 0)]}</div>
              <div className={styles.superior} onClick={this.searchMsg.bind(this, text.referee)} >VIP : {text.referee && text.referee.nickname}</div>
              <div>手机号码: {text.mobile}</div>
              <div>关系到期时间: {toDate(text.has_expire.lost_time*1000)}</div>
              <div>关系状态: {text.has_expire.lost?'已过期':'正常'}</div>
            </div>
          </div>
        ),
        key: 'avatar',
      },
      {
        title: '统计',
        dataIndex: 'has_account',
        render: (val, text) => (
          <Row>
            <Col span={24} style={{ fontSize: 14 }}>
              <div>消费 : {val.account_consume}</div>
              <div>总收入 : {val.account_total_income}</div>
              <div>佣金余额 : {val.account_commission}</div>
              <div>注册渠道 : {text.wechat_account_name}</div>
              <div onClick={this.getFans.bind(this, text.id)} className={styles.superior}>粉丝数量 : {text.fans_num}</div>
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
        title: '备注',
        dataIndex: 'has_user_oauth',
        render: val => val ? (
          <div style={{
            maxWidth: 260,
            wordBreak: 'break-all'
          }}>{val.user_remark}</div>
        ) : (<span></span>),
        key: 'has_user_oauth',
      },
      {
        title: '操作',
        fixed: 'right',
        width: 200,
        render: record => (
          <Fragment>
            <a onClick={this.editDataMsg.bind(this, record.id, 2)}>设置等级</a>
            {
              currentUser.show_update_referee_button ? (
                <Fragment>
                  <Divider type="vertical" />
                  <a onClick={this.editDataMsg.bind(this, record.id, 1)}>设置VIP</a>
                </Fragment>
              ) : null
            }
            <Divider type="vertical" />
            <a onClick={this.setMerchant.bind(this, record)}>设置版本</a>
            <Divider type="vertical" />
            <a onClick={this.setCode.bind(this, record)}>设置授权码</a>
            <Divider type="vertical" />
            <a onClick={this.setRemark.bind(this, record)} disabled={!record.has_user_oauth}>{
              record.has_user_oauth && record.has_user_oauth.user_remark ? '修改备注' : '设置备注'
            }</a>
            <Divider type="vertical" />
            <a onClick={this.updateCommssion.bind(this, record)}>更改佣金</a>
            <Divider type="vertical" />
            {
              !record.is_auditor ? (
                <a onClick={this.handleSetting.bind(this, record.id, 3)}>设置审核员</a>
              ) : (!record.auditor_status) ? (
                <a onClick={this.handleSetting.bind(this, record.id, 1)}>设置审核员</a>
              ) : (
                <a onClick={this.handleSetting.bind(this, record.id, 0)}>取消审核员</a>
              )
            }
            {/* {
              !record.auditor_status ? (
                <a onClick={this.handleSetting.bind(this, record.id, 1)}>设置审核员</a>
              ) : (
                <a onClick={this.handleSetting.bind(this, record.id, 0)}>取消审核员</a>
              )
            } */}
          </Fragment>
        ),
      },
    ];
    const deflutColumns = [
      {
        title: '头像',
        dataIndex: 'avatar',
        key: 'avatar',
        render: val => <img style={{ height: 80 }} src={val} alt="头像" />,
      },
      {
        title: '姓名',
        dataIndex: 'nickname',
      },
      {
        title: '用户id',
        dataIndex: 'id',
      },
    ];

    return (
      <AuthDialog>
        <PageHeaderLayout>
          <Card style={{ marginBottom: 10 }}>
            <Row type="flex" align="middle" style={{ marginBottom: 10 }}>
              <span style={{ textAlign: 'right', paddingRight: 10 }}>请输入站长id</span>
              <span>
              <Input placeholder="请输入站长id" onChange={this.setDefaultValue} />
            </span>
              <span>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.setDefault}>
                确定
              </Button>
            </span>
            </Row>
            <Table
              dataSource={getDefaultList}
              rowKey={record => record.id}
              loading={loading}
              columns={deflutColumns}
              pagination={false}
              // showHeader={false}
              locale={{
                emptyText: '暂无站长id',
              }}
            />
          </Card>
          <Card bordered={false} style={{ marginBottom: 10 }}>
            <div className={styles.tableList}>
              盟主和店主后台地址：
              <a href={adminUrl} target="view_window">
                {adminUrl}
              </a>
            </div>
          </Card>
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
                scroll={{ x: '100%' }}
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
          <Modal
            title="设置版本"
            visible={merchantVisible}
            onCancel={this.merchantModal}
            onOk={this.merchantOK}
            destroyOnClose="true"
          >
            <Row style={{ marginBottom: 20 }}>
              <Col span={6}>账户</Col>
              <Col span={18}><Input value={account} disabled /></Col>
            </Row>
            <Row style={{ marginBottom: 20 }}>
              <Col span={6}>手机号</Col>
              <Col span={18}><Input value={password} onChange={this.changePassword} disabled /></Col>
            </Row>
            <Row>
              <Col span={6}>版本</Col>
              <Col span={18}>
                <Select onChange={this.handleLevel} style={{ width: 200 }} value={powerValue} >
                  <Option key={1} value={1}>盟主</Option>
                  <Option key={3} value={3}>店主</Option>
                  <Option key={2} value={2}>群主</Option>
                  <Option key={0} value={0}>粉丝</Option>
                </Select>
              </Col>
            </Row>
          </Modal>
          <Modal
            title="设置余额"
            visible={isCommssion}
            onCancel={this.moneyCancel}
            destroyOnClose="true"
            footer=""
          >
            <MoneyForm moneyOK={this.moneyOK} name={moneyMsg.name} money={moneyMsg.money} />
          </Modal>
          <Modal
            title="修改备注"
            visible={isRemark}
            onCancel={this.remarkCancel}
            destroyOnClose="true"
            footer=""
          >
            <RemarkForm remarkOK={this.remarkOK} remarkText={remarkMsg.remark}/>
          </Modal>
          <Modal
            title="设置授权码"
            visible={isCode}
            onCancel={this.codeCancel}
            destroyOnClose="true"
            footer=""
          >
            <CodeForm codeOK={this.codeOK} codeMsg={codeMsg} codeForm={codeForm} changeFormVals={this.changeFormVals} />
          </Modal>
        </PageHeaderLayout>
      </AuthDialog>
    );
  }
}
