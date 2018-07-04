import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Form, Button, Modal, Input, Checkbox, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const ButtonGroup = Button.Group;
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
    console.log(this.state.RoleMenu);
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
    }).then(() => {
      this.setState((prevState, props) => ({
        RoleMenu: props.menu.RoleMenu,
      }));
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
    console.log(this.props.form);
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
    const data = {};
    data.id = [];
    const { RoleMenu, roleId } = this.state;
    data.role_id = roleId;
    data.group_id = this.props.match.params.id;
    RoleMenu.forEach(res => {
      if (res.permission) {
        data.id.push(res.id);
      }
      res.children.forEach(ele => {
        if (ele.permission) {
          data.id.push(ele.id);
        }
      });
    });
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
        console.log('Cancel');
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
    console.log('Clicked cancel button');
    this.setState({
      addUserVisible: false,
    });
  };
  // 权限取消
  powerCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      powerVisible: false,
    });
  };
  render() {
    const { powerVisible, loading, addUserVisible, user, RoleMenu } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { addUser } = this.props;
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
    // 渲染角色权限
    const Role = [];
    if (RoleMenu.length) {
      RoleMenu.forEach((element, index) => {
        // element.key = element.id;
        Role.push(
          <div key={index}>
            <Checkbox
              key={element.id}
              onChange={this.onPowerChange.bind(this, index)}
              checked={element.permission === 0 ? false : true}
            >
              {element.menu_name}
            </Checkbox>
          </div>
        );
        element.children.forEach((res, inx) => {
          Role.push(
            <Checkbox
              key={res.id}
              onChange={this.onPowerChange.bind(this, index, inx)}
              checked={res.permission === 0 ? false : true}
            >
              {res.menu_name}
            </Checkbox>
          );
        });
      });
    }
    // const plainOptions = ['Apple', 'Pear', 'Orange'];
    // const defaultCheckedList = ['Apple', 'Orange'];
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
              AUTOCOMPLETE="OFF"
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
              <FormItem tyle={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={addUser}>
                  提交
                </Button>
              </FormItem>
            </Form>
          </Modal>
          <Modal
            title="Titles"
            visible={powerVisible}
            onCancel={this.powerCancel.bind(this)}
            onOk={this.okPower.bind(this)}
          >
            {Role}
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
