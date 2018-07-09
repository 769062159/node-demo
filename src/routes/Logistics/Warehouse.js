import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Table,
  message,
  Modal,
  Card,
  Form,
  Input,
  Button,
  InputNumber,
  Divider,
  Cascader,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

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
const { confirm } = Modal;

@connect(({ logistics, address, loading }) => ({
  logistics,
  address,
  loading: loading.models.logistics,
}))
@Form.create()
export default class Warehouse extends PureComponent {
  state = {
    expandForm: false,
    editData: {},
    formVisible: false,
    // formValues: {},
    page: 1, // 页脚
    addressArr: [],
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'logistics/fetchWarehouseList',
      payload: {
        page,
      },
    });
    dispatch({
      type: 'address/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  // 删除商品
  deleteGoods = id => {
    event.preventDefault();
    const that = this;
    confirm({
      content: '你确定删除这个吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        const { page } = that.state;
        dispatch({
          type: 'logistics/delWarehouse',
          payload: {
            warehouse_id: id,
            page,
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 修改信息
  editDataMsg = (data, e) => {
    e.preventDefault();
    const addressArr = [];
    if (data.province_id) {
      addressArr.push(data.province_id);
      addressArr.push(data.city_id);
      addressArr.push(data.district_id);
    }
    this.setState({
      editData: data,
      addressArr,
    });
    this.showModal();
    const { dispatch } = this.props;
    dispatch({
      type: 'address/fetchAll',
      payload: {
        addressArr,
      },
    });
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
  // 新增修改提交
  handleSubmit = (type, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const { editData, page, addressArr } = this.state;
        if (addressArr.length !== 0 && addressArr.length !== 3) {
          message.error('省市区不全');
          return;
        }
        if (addressArr.length === 3) {
          values.province_id = addressArr[0];
          values.city_id = addressArr[1];
          values.district_id = addressArr[2];
        }
        values.page = page;
        if (Object.keys(editData).length) {
          values.warehouse_id = editData.id;
          dispatch({
            type: 'logistics/updateWarehouse',
            payload: values,
          });
          message.success('修改成功');
        } else {
          dispatch({
            type: 'logistics/addWarehouse',
            payload: values,
          });
          message.success('添加成功');
        }
        this.handAddleCancel();
      }
    });
  };
  changeAddress = value => {
    this.setState({
      addressArr: value,
    });
    const { dispatch, address: { addressList } } = this.props;
    value = value[value.length - 1];
    for (const val of addressList) {
      if (val.id === value) {
        if (!val.children) {
          dispatch({
            type: 'address/fetch',
            payload: {
              parent_id: value,
            },
          });
        }
        break;
      }
      if (val.children) {
        for (const vals of val.children) {
          if (vals.id === value) {
            if (!vals.children) {
              dispatch({
                type: 'address/fetch',
                payload: {
                  parent_id: value,
                },
              });
            }
            break;
          }
        }
      }
    }
  };
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      page: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'logistics/fetchWarehouseList',
      payload: {
        page: current,
      },
    });
  };
  renderAddForm() {
    const { loading, address: { addressList } } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this, 0)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem {...formItemLayout} label="仓库名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入仓库名称',
              },
            ],
          })(<Input placeholder="请输入仓库名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="编号">
          {getFieldDecorator('number', {})(<InputNumber step={1} min={0} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="联系人">
          {getFieldDecorator('contact', {})(<Input placeholder="请输入联系人" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="联系电话">
          {getFieldDecorator('tel', {})(<Input placeholder="请输入联系电话" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="省市区">
          <Cascader
            style={{ width: 300 }}
            options={addressList}
            onChange={this.changeAddress}
            filedNames={{ label: 'region_name', value: 'id' }}
            changeOnSelect
          />
        </FormItem>
        <FormItem {...formItemLayout} label="详细地址">
          {getFieldDecorator('address', {})(<Input placeholder="请输入详细地址" />)}
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
    const { loading, address: { addressList } } = this.props;
    const { editData, addressArr } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this, 1)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem {...formItemLayout} label="仓库名称">
          {getFieldDecorator('name', {
            initialValue: editData.name,
            rules: [
              {
                required: true,
                message: '请输入仓库名称',
              },
            ],
          })(<Input placeholder="请输入仓库名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="编号">
          {getFieldDecorator('number', {
            initialValue: editData.number,
          })(<InputNumber step={1} min={0} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="联系人">
          {getFieldDecorator('contact', {
            initialValue: editData.contact,
          })(<Input placeholder="请输入联系人" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="联系电话">
          {getFieldDecorator('tel', {
            initialValue: editData.tel,
          })(<Input placeholder="请输入联系电话" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="省市区">
          <Cascader
            defaultValue={addressArr}
            style={{ width: 300 }}
            options={addressList}
            onChange={this.changeAddress}
            filedNames={{ label: 'region_name', value: 'id' }}
            changeOnSelect
          />
        </FormItem>
        <FormItem {...formItemLayout} label="详细地址">
          {getFieldDecorator('address', {
            initialValue: editData.address,
          })(<Input placeholder="请输入详细地址" />)}
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
    const { editData } = this.state;
    const length = Object.keys(editData).length;
    return length ? this.renderEditForm() : this.renderAddForm();
  }
  render() {
    const { logistics: { warehouseList: datas, warehouseListPage }, loading } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { formVisible } = this.state;
    const progressColumns = [
      {
        title: '仓库名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '编号',
        dataIndex: 'number',
      },
      {
        title: '联系人',
        dataIndex: 'contact',
      },
      {
        title: '联系电话',
        dataIndex: 'tel',
      },
      {
        title: '地址',
        dataIndex: 'address',
        render: (val, text) => {
          const str = text.province_name + text.district_name + text.city_name + val;
          return str || '';
        },
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            <a onClick={this.editDataMsg.bind(this, record)}>修改</a>
            <Divider type="vertical" />
            <a onClick={this.deleteGoods.bind(this, record.id)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.showModal.bind(this)}>
                新建
              </Button>
            </div>
            <Table
              onChange={this.handleTableChange}
              dataSource={datas}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
              pagination={warehouseListPage}
            />
          </div>
        </Card>
        <Modal
          title="等级"
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
