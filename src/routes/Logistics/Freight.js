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
  Select,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const freightType = ['重量计', '件计'];
const { confirm } = Modal;

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
@Form.create()
export default class Freight extends PureComponent {
  state = {
    expandForm: false,
    editData: {},
    formVisible: false,
    // formValues: {},
    pagination: 1, // 页脚
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'goods/fetchFreight',
      payload: {
        pagination,
      },
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  // 删除商品
  deleteDataMsg = id => {
    event.preventDefault();
    const that = this;
    confirm({
      content: '你确定删除这个吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        const { pagination } = that.state;
        dispatch({
          type: 'goods/delFreight',
          payload: {
            template_id: id,
            pagination,
          },
        });
      },
      onCancel() {
      },
    });
  };
  // 修改信息
  editDataMag = (data, e) => {
    e.preventDefault();
    this.setState({
      editData: data,
    });
    this.showModal();
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
        const { editData, pagination } = this.state;
        values.pagination = pagination;
        if (Object.keys(editData).length) {
          values.template_id = editData.id;
          dispatch({
            type: 'goods/updateFreight',
            payload: values,
          });
          message.success('修改成功');
        } else {
          dispatch({
            type: 'goods/addFreight',
            payload: values,
          });
          message.success('添加成功');
        }
        this.handAddleCancel();
      }
    });
  };
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      pagination: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/fetchFreight',
      payload: {
        pagination: current,
      },
    });
  };
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
        <FormItem {...formItemLayout} label="模版名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入运费模版名称 ',
              },
            ],
          })(<Input placeholder="请输入等级名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="运费类型">
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '请输入运费类型',
              },
            ],
          })(
            <Select>
              <Option value="0">重量计 </Option>
              {/* <Option value="1">1件计</Option> */}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="首重">
          {getFieldDecorator('dft_head', {
            rules: [
              {
                required: true,
                message: '请输入首重',
              },
            ],
          })(<InputNumber step={0.01} precision={2} min={0} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="首重收费">
          {getFieldDecorator('dft_head_price', {
            rules: [
              {
                required: true,
                message: '请输入首重收费',
              },
            ],
          })(<InputNumber step={0.01} precision={2} min={0} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="续重">
          {getFieldDecorator('tail', {
            rules: [
              {
                required: true,
                message: '请输入续重',
              },
            ],
          })(<InputNumber step={0.01} precision={2} min={0.01} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="续重收费">
          {getFieldDecorator('tail_price', {
            rules: [
              {
                required: true,
                message: '请输入续重收费',
              },
            ],
          })(<InputNumber step={0.01} precision={2} min={0} />)}
        </FormItem>
        <FormItem style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
  renderEditForm() {
    const { loading } = this.props;
    const { editData } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this, 1)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem {...formItemLayout} label="模版名称">
          {getFieldDecorator('name', {
            initialValue: editData.name,
            rules: [
              {
                required: true,
                message: '请输入运费模版名称 ',
              },
            ],
          })(<Input placeholder="请输入等级名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="运费类型">
          {getFieldDecorator('type', {
            initialValue: editData.type,
            rules: [
              {
                required: true,
                message: '请输入运费类型',
              },
            ],
          })(
            <Select>
              <Option value={0}>重量计 </Option>
              {/* <Option value={1}>1件计</Option> */}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="首重">
          {getFieldDecorator('dft_head', {
            initialValue: editData.dft_head_weight,
            rules: [
              {
                required: true,
                message: '请输入首重',
              },
            ],
          })(<InputNumber step={0.01} precision={2} min={0} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="首重收费">
          {getFieldDecorator('dft_head_price', {
            initialValue: editData.dft_head_weight_price,
            rules: [
              {
                required: true,
                message: '请输入首重收费',
              },
            ],
          })(<InputNumber step={0.01} precision={2} min={0} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="续重">
          {getFieldDecorator('tail', {
            initialValue: editData.tail_weight,
            rules: [
              {
                required: true,
                message: '请输入续重',
              },
            ],
          })(<InputNumber step={0.01} precision={2} min={0.01} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="续重收费">
          {getFieldDecorator('tail_price', {
            initialValue: editData.tail_weight_price,
            rules: [
              {
                required: true,
                message: '请输入续重收费',
              },
            ],
          })(<InputNumber step={0.01} precision={2} min={0} />)}
        </FormItem>
        <FormItem style={{ marginTop: 32 }}>
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
    const { goods: { freightList: datas }, loading } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { formVisible } = this.state;
    const progressColumns = [
      {
        title: '模版名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '运费类型',
        dataIndex: 'type',
        render: val => `${freightType[val]}`,
      },
      {
        title: '首重',
        dataIndex: 'dft_head_weight',
      },
      {
        title: '首重收费',
        dataIndex: 'dft_head_weight_price',
      },
      {
        title: '续重',
        dataIndex: 'tail_weight',
      },
      {
        title: '续重收费',
        dataIndex: 'tail_weight_price',
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            <a onClick={this.editDataMag.bind(this, record)}>修改</a>
            <Divider type="vertical" />
            <a onClick={this.deleteDataMsg.bind(this, record.id)}>删除</a>
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
              pagination={false}
            />
          </div>
        </Card>
        <Modal
          title="运费"
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
