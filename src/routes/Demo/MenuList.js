import React, { Component } from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { Table, Button, Modal, Card, Form, Input, Select, Icon, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import './style.less';

const ButtonGroup = Button.Group;
const { Option } = Select;
const { confirm } = Modal;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};
const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      name: Form.createFormField({
        value: props.routerForm.name,
      }),
      level: Form.createFormField({
        value: props.routerForm.level,
      }),
      parent_id: Form.createFormField({
        value: props.routerForm.parent_id,
      }),
      path: Form.createFormField({
        value: props.routerForm.path,
      }),
      icon: Form.createFormField({
        value: props.routerForm.icon,
      }),
    };
  },
  // onValuesChange(_, values) {
  // },
})(props => {
  const { getFieldDecorator, validateFields } = props.form;
  const onValidateForm = e => {
    e.preventDefault();
    const { handleSubmit } = props;
    validateFields((err, values) => {
      if (!err) {
        handleSubmit(values);
      } else {
        message.error('请填写信息');
      }
    });
  };
  const { items, routerForm } = props;
  return (
    <Form>
      <FormItem {...formItemLayout} label="菜单名">
        {getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: '请输入菜单名',
            },
          ],
        })(<Input placeholder="给菜单起个名字" />)}
      </FormItem>
      <FormItem {...formItemLayout} label={<span>等级</span>}>
        {getFieldDecorator('level', {
          rules: [
            {
              required: true,
              message: '请输入路由等级',
            },
          ],
        })(
          <Select style={{ width: 120 }}>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>
        )}
      </FormItem>
      {routerForm.level === '2' ? (
        <FormItem {...formItemLayout} label={<span>上级路由</span>}>
          {getFieldDecorator('parent_id', {
            rules: [
              {
                required: routerForm.level === '2',
                message: '请输入上级路由',
              },
            ],
          })(
            <Select showSearch style={{ width: 200 }} searchPlaceholder="输入">
              {items}
            </Select>
          )}
        </FormItem>
      ) : (
        <FormItem {...formItemLayout} label="图标">
          {getFieldDecorator('icon', {
            rules: [
              {
                required: routerForm.level === '1',
                message: '请输入图标',
              },
            ],
          })(
            <Select style={{ width: 120 }}>
              <Option value="link">
                <Icon type="link" />
              </Option>
              <Option value="lock">
                <Icon type="lock" />
              </Option>
              <Option value="desktop">
                <Icon type="desktop" />
              </Option>
              <Option value="edit">
                <Icon type="edit" />
              </Option>
            </Select>
          )}
        </FormItem>
      )}
      <FormItem {...formItemLayout} label="菜单路由">
        {getFieldDecorator('path', {
          rules: [
            {
              required: true,
              message: '请输入菜单路由',
            },
          ],
        })(<Input placeholder="给菜单路由起个名字" />)}
      </FormItem>
      <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
        <Button type="primary" htmlType="submit" onClick={onValidateForm}>
          提交
        </Button>
      </FormItem>
    </Form>
  );
});

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.effects.menu,
}))
export default class MenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // pagination: 1,
      addRoouterVisible: false,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetchMenu',
    });
  }
  // 修改表单值
  changeFormVal = val => {
    const { dispatch } = this.props;
    const obj = {};
    for (const key of Object.keys(val)) {
      obj[key] = val[key].value;
    }
    dispatch({
      type: 'menu/changeFormVal',
      payload: {
        obj,
      },
    });
  };
  // 更新
  // update = () => {
  //   this.setState((prevState, props) => ({
  //     menuList: props.menu.data,
  //   }));
  // };
  // 新增modal显示
  showModal = () => {
    this.setState({
      addRoouterVisible: true,
    });
  };
  // 新增取消
  handleCancel = () => {
    this.setState({
      addRoouterVisible: false,
    });
  };
  // 刷新本页
  // updataData = () => {
  //   const { pagination } = this.state;
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'menu/fetchMenu',
  //     payload: {
  //       status: 0,
  //       page: pagination,
  //     },
  //   });
  // };

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
          type: 'menu/delMenu',
          payload: {
            id,
          },
        });
      },
      onCancel() {
      },
    });
  };
  // 提交
  handleSubmit = () => {
    const { menu: { routerForm }, dispatch } = this.props;
    routerForm.parent_id = routerForm.parent_id || 0;
    routerForm.icon = routerForm.icon || '';
    dispatch({
      type: 'menu/submitAddMenuForm',
      payload: routerForm,
    });
    this.handleCancel();
  };
  // 换页
  // handleTableChange = pagination => {
  //   this.setState({
  //     pagination: pagination.current,
  //   });
  // };
  // 跳到角色
  // goPath = () => {
  //   const { dispatch } = this.props;
  //   const url = `/router/menu-add`;
  //   dispatch(routerRedux.push(url));
  // };
  render() {
    const { loading, menu: { data: menuList, routerForm } } = this.props;
    const items = [];
    if (menuList.length) {
      menuList.forEach(res => {
        items.push(
          <Select.Option value={res.id} className="item" key={res.id}>
            {res.menu_name}
          </Select.Option>
        );
      });
    }
    const { addRoouterVisible } = this.state;
    const progressColumns = [
      {
        title: '',
        dataIndex: '',
        key: 'id',
      },
      {
        title: '名称',
        dataIndex: 'menu_name',
        key: 'menu_name',
      },
      {
        title: '路径',
        dataIndex: 'path',
        key: 'path',
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
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Button type="primary" onClick={this.showModal} style={{ marginBottom: 24 }}>
            新增菜单
          </Button>
          <Table
            onChange={this.handleTableChange}
            dataSource={menuList}
            rowKey={record => record.id}
            loading={loading}
            columns={progressColumns}
          />
        </Card>
        <Modal
          title="路由"
          visible={addRoouterVisible}
          onCancel={this.handleCancel.bind(this)}
          footer=""
        >
          <CustomizedForm
            handleSubmit={this.handleSubmit}
            routerForm={routerForm}
            items={items}
            onChange={this.changeFormVal}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
