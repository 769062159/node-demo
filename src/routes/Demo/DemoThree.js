import React, { Component } from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { Table, Form, Button, Modal, Input, Card, Cascader, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const ButtonGroup = Button.Group;
// const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;
const { confirm } = Modal;
@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/addDep'],
  loading: loading.effects['user/fetchUser'],
}))
@Form.create()
export default class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addUserVisible: false,
      dep: {},
      pagination: 1,
      depRole: [],
    };
  }
  // state = {
  //   addUserVisible: false,
  // };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchGroup',
    });
    this.updataData();
  }

  // componentWillReceiveProps() {
  //   console.log(1);
  // }
  // 更改部门
  onDepChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    this.state.depRole = value;
    if (value.length > 1) {
      return false;
    }
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;
      const { dispatch } = this.props;
      dispatch({
        type: 'user/fetchRole',
        payload: {
          status: 0,
          parent_id: value,
        },
      }).then(() => {
        this.update();
        const { dep } = this.state;
        dep.GroupList.list.forEach(element => {
          if (element.id == value) {
            element.children = dep.RoleList.list;
          }
        });
      });
      //   console.log(targetOption);
      //   this.state.dep.GroupList.list[value] = targetOption;
      //   this.setState({
      //     user: [...this.state.user],
      //   });
    }, 1000);
  };
  // 更新
  update = () => {
    this.setState((prevState, props) => ({
      dep: props.user,
    }));
  };
  // 刷新本页
  updataData = () => {
    const { pagination } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchUser',
      payload: {
        status: 0,
        page: pagination,
      },
    }).then(() => {
      this.update();
    });
  };
  // 新增modal显示
  showModal = () => {
    this.setState({
      addUserVisible: true,
    });
  };
  // 新增取消
  handleCancel = () => {
    this.setState({
      addUserVisible: false,
    });
  };
  // 新增提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { depRole } = this.state;
      if (depRole.length !== 2) {
        message.error('请选择部门角色');
      } else if (!err) {
        // if (!err) {
        const data = {
          ...values,
          group_id: depRole[0],
          role_id: depRole[1],
        };
        const { dispatch } = this.props;
        dispatch({
          type: 'user/addUser',
          payload: data,
        }).then(() => {
          this.handleCancel();
          this.updataData();
        });
        // }
      }
    });
  };

  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  };
  showDeleteConfirm = id => {
    const that = this;
    confirm({
      content: '你确定删除这个吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        dispatch({
          type: 'user/delUser',
          payload: {
            id,
            status: 1,
          },
        }).then(() => {
          that.updataData();
        });
        // that.setState({
        //   dataSource: DelDataSource,
        // });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 换页
  handleTableChange = pagination => {
    this.setState(
      {
        pagination: pagination.current,
      },
      () => {
        this.updataData();
      }
    );
  };
  render() {
    const { addUserVisible, dep } = this.state;
    const { loading, submitting } = this.props;
    const { getFieldDecorator } = this.props.form;
    const progressColumns = [
      {
        title: '用户名',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
      },
      {
        title: '部门',
        dataIndex: 'group_name',
        key: 'group_name',
      },
      {
        title: '角色',
        dataIndex: 'role_name',
        key: 'role_name',
      },
      {
        title: '操作',
        dataIndex: 'status',
        key: 'status',
        render: (text, record, index) => {
          return (
            <ButtonGroup>
              <Button data-index={index} onClick={this.showDeleteConfirm.bind(this, record.id)}>
                删除
              </Button>
            </ButtonGroup>
          );
        },
      },
    ];
    let pagination = {};
    let UserList = {};
    let GroupList = [];
    if (Object.keys(dep).length) {
      UserList = dep.UserList;
      pagination = {
        pageSize: UserList.page,
        total: UserList.total,
      };
      GroupList = dep.GroupList.list;
    }
    return (
      <PageHeaderLayout title="用户列表">
        <Card bordered={false}>
          <Button type="primary" onClick={this.showModal.bind(this)}>
            新增用户
          </Button>
          <Table
            onChange={this.handleTableChange}
            dataSource={UserList.list}
            rowKey={record => record.id}
            loading={loading}
            columns={progressColumns}
            pagination={pagination}
          />
          <Modal
            title="Title"
            visible={addUserVisible}
            onCancel={this.handleCancel.bind(this)}
            footer=""
          >
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              <FormItem label="用户名">
                {getFieldDecorator('user_name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入用户名',
                    },
                  ],
                })(<Input placeholder="给用户起个名字" />)}
              </FormItem>
              <FormItem label="昵称">
                {getFieldDecorator('nick_name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入昵称',
                    },
                  ],
                })(<Input placeholder="昵称" />)}
              </FormItem>
              <FormItem label="密码">
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码',
                    },
                  ],
                })(<Input placeholder="密码" />)}
              </FormItem>
              <div>部门角色</div>
              <Cascader
                filedNames={{ label: 'name', value: 'id' }}
                options={GroupList}
                onChange={this.onDepChange}
                changeOnSelect
              />
              <FormItem tyle={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  提交
                </Button>
              </FormItem>
            </Form>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
