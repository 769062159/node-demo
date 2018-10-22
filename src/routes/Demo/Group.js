import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Form, Button, Modal, Input, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const ButtonGroup = Button.Group;
// const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;
const { confirm } = Modal;
@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/addDep'],
  loading: loading.effects['user/fetchGroup'],
}))
@Form.create()
export default class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addUserVisible: false,
      dep: {},
    };
  }
  // state = {
  //   addUserVisible: false,
  // };
  componentDidMount() {
    this.updataData();
  }
  // 更新
  update = () => {
    this.setState((prevState, props) => ({
      dep: props.user,
    }));
  };
  // 刷新本页
  updataData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchGroup',
      payload: {
        status: 0,
      },
    }).then(() => {
      this.update();
    });
  };
  // componentWillReceiveProps() {
  //   console.log(1);
  // }
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
      const data = {
        ...values,
        role_parent_id: 0,
        type: 0,
      };
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'user/addDep',
          payload: data,
        }).then(() => {
          this.handleCancel();
          this.updataData();
        });
      }
    });
  };
  // 跳到角色
  goPath = index => {
    const { dispatch } = this.props;
    const { id } = this.props.user.GroupList.list[index];
    const url = `/users/role/${id}`;
    dispatch(routerRedux.push(url));
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
          type: 'user/delDep',
          payload: {
            id,
            type: 0,
          },
        }).then(() => {
          that.updataData();
        });
        // that.setState({
        //   dataSource: DelDataSource,
        // });
      },
      onCancel() {
      },
    });
  };
  render() {
    const { addUserVisible, dep } = this.state;
    const { loading, submitting } = this.props;
    const { getFieldDecorator } = this.props.form;
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
        render: (text, record, index) => {
          return (
            <ButtonGroup>
              <Button data-index={index} onClick={this.goPath.bind(this, index)}>
                查看角色
              </Button>
              <Button data-index={index} onClick={this.showDeleteConfirm.bind(this, record.id)}>
                删除
              </Button>
            </ButtonGroup>
          );
        },
      },
    ];
    let pagination = {};
    let GroupList = {};
    if (Object.keys(dep).length) {
      GroupList = dep.GroupList;
      pagination = {
        pageSize: GroupList.page,
        total: GroupList.total,
      };
    }
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Button type="primary" onClick={this.showModal.bind(this)} style={{ marginBottom: 24 }}>
            新增部门
          </Button>
          <Table
            dataSource={GroupList.list}
            rowKey={record => record.id}
            loading={loading}
            columns={progressColumns}
            pagination={pagination}
          />
          <Modal
            title="部门"
            visible={addUserVisible}
            onCancel={this.handleCancel.bind(this)}
            footer=""
          >
            <Form
              onSubmit={this.handleSubmit}
              hideRequiredMark
              style={{ marginTop: 8 }}
              autoComplete="OFF"
            >
              <FormItem label="部门名">
                {getFieldDecorator('role_name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入部门名',
                    },
                  ],
                })(<Input placeholder="给部门起个名字" />)}
              </FormItem>
              <FormItem style={{ marginTop: 32 }}>
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
