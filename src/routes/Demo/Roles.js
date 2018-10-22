import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Form, Button, Modal, Input, Card, Tree } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const ButtonGroup = Button.Group;
const TreeNode = Tree.TreeNode;
// const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const { confirm } = Modal;
// const plainOptions = ['Apple', 'Pear', 'Orange'];
// const defaultCheckedList = ['Apple', 'Orange'];
@connect(({ user, loading, menu }) => ({
  user,
  menu,
  submitting: loading.effects['form/submitAddMenuForm'],
  addUser: loading.effects['user/addDep'],
  loading: loading.effects['user/fetchRole'],
}))
@Form.create()
export default class Role extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     powerVisible: false,
  //     addUserVisible: false,
  //   };
  // }
  state = {
    powerVisible: false,
    addUserVisible: false,
    user: {},
    RoleMenu: [],
    roleId: '',
    // expandedKeys: ['13'],
    autoExpandParent: true,
    // targetKeys: [],
  };
  componentDidMount() {
    // console.log(this.props.match.params.id);
    this.updataData();
  }
  // 权限勾选
  onPowerChange = (index, idx) => {
    const { RoleMenu } = this.state;
    if (typeof idx === 'number') {
      RoleMenu[index].children[idx].permission = Number(!RoleMenu[index].children[idx].permission);
      this.setState({
        RoleMenu,
      });
    } else {
      RoleMenu[index].permission = Number(!RoleMenu[index].permission);
      this.setState({
        RoleMenu,
      });
    }
  };
  // onCheckAllChange = (e) => {
  //   this.setState({
  //     checkedList: e.target.checked ? plainOptions : [],
  //     indeterminate: false,
  //     checkAll: e.target.checked,
  //   });
  // }
  getMock = id => {
    // const targetKeys = [];
    // const powerData = [];
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetchRoleMenu',
      payload: {
        role_id: id,
      },
    });
    // this.setState({ powerData, targetKeys });
  };
  // 更新
  update = () => {
    this.setState((prevState, props) => ({
      user: props.user,
    }));
  };
  // 刷新本页
  updataData = () => {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchRole',
      payload: {
        status: 0,
        parent_id: id,
      },
    }).then(() => {
      this.update();
    });
  };
  // 新增提交
  handleSubmits = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (values.role_name) {
        const { id } = this.props.match.params;
        const data = {
          role_name: values.role_name,
          role_parent_id: id,
          type: 1,
        };
        this.props
          .dispatch({
            type: 'user/addDep',
            payload: data,
          })
          .then(() => {
            this.handleCancel();
            this.updataData();
          });
      }
    });
  };
  // 权限提交
  okPower = () => {
    const { menu: { checkPowerObj } } = this.props;
    const arr = [];
    checkPowerObj.checkedNodes.forEach(res => {
      arr.push(res.key);
    });
    checkPowerObj.halfCheckedKeys.forEach(res => {
      arr.push(res);
    });
    const data = {};
    const { roleId } = this.state;
    data.role_id = roleId;
    data.group_id = this.props.match.params.id;
    data.id = arr;
    this.props
      .dispatch({
        type: 'menu/setRoleMenu',
        payload: data,
      })
      .then(() => {
        this.setState({
          powerVisible: false,
        });
      });
  };
  // 删除用户
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
          type: 'user/delDep',
          payload: {
            id,
            type: 1,
          },
        }).then(() => {
          that.updataData();
        });
      },
      onCancel() {
      },
    });
  };
  // 新增modal显示
  showModal = () => {
    this.setState({
      addUserVisible: true,
    });
  };
  // 权限modal显示
  showPowerModal = id => {
    this.setState({
      powerVisible: true,
      roleId: id,
    });
    this.getMock(id);
  };
  // 新增取消
  handleCancel = () => {
    this.setState({
      addUserVisible: false,
    });
  };
  // 权限取消
  powerCancel = () => {
    this.setState({
      powerVisible: false,
    });
  };

  check = (checkedKeys, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/selectPowerTree',
      payload: {
        checkedKeys,
        e,
      },
    });
  };

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.menu_name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.menu_name} key={item.id} />;
    });
  };
  render() {
    const { powerVisible, loading, addUserVisible, user } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { addUser, menu: { checkPowerArr, RoleMenu } } = this.props;
    const progressColumns = [
      {
        title: '呢称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
      },
      {
        title: '操作',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          return (
            <ButtonGroup>
              <Button onClick={this.showPowerModal.bind(this, record.id)}>权限设置</Button>
              <Button onClick={this.showDeleteConfirm.bind(this, record.id)}>删除</Button>
            </ButtonGroup>
          );
        },
      },
    ];
    let pagination = {};
    let RoleList = [];
    if (Object.keys(user).length) {
      RoleList = user.RoleList;
      pagination = {
        pageSize: RoleList.page,
        total: RoleList.total,
      };
    }
    return (
      <PageHeaderLayout>
        <Card>
          <Button type="primary" onClick={this.showModal.bind(this)} style={{ marginBottom: 24 }}>
            新增角色
          </Button>
          <Table
            dataSource={RoleList.list}
            rowKey={record => record.id}
            loading={loading}
            columns={progressColumns}
            pagination={pagination}
          />
          <Modal
            title="角色"
            visible={addUserVisible}
            onCancel={this.handleCancel.bind(this)}
            footer=""
          >
            <Form
              onSubmit={this.handleSubmits}
              hideRequiredMark
              style={{ marginTop: 8 }}
              autoComplete="OFF"
            >
              <FormItem label="角色名">
                {getFieldDecorator('role_name', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请输入角色名',
                  //   },
                  // ],
                })(<Input placeholder="给角色起个名字" />)}
              </FormItem>
              <FormItem style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={addUser}>
                  提交
                </Button>
              </FormItem>
            </Form>
          </Modal>
          <Modal
            title="权限"
            visible={powerVisible}
            onCancel={this.powerCancel.bind(this)}
            onOk={this.okPower.bind(this)}
          >
            <Tree
              checkable
              //   onExpand={this.onExpand}
              //   expandedKeys={this.state.expandedKeys}
              defaultExpandAll
              autoExpandParent={this.state.autoExpandParent}
              onCheck={this.check}
              checkedKeys={{ checked: checkPowerArr }}
            >
              {this.renderTreeNodes(RoleMenu)}
              {/* {RoleItem} */}
            </Tree>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
