import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, message, Modal, Card, Form, Input, Button, Divider, InputNumber, Tag } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const { confirm } = Modal;
// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');
// const statusMap = ['processing', 'processing', 'error'];
// const goodsStatus = ['上架', '未上架', '下架'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];

@connect(({ frontUser, loading }) => ({
  frontUser,
  loading: loading.models.frontUser,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    editData: {},
    addUserVisible: false,
    // formValues: {},
    pagination: 1, // 页脚
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'frontUser/fetchUserRankList',
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
        const { pagination } = that.state;
        dispatch({
          type: 'frontUser/delUserRank',
          payload: {
            level_id: id,
            pagination,
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 修改信息
  editGoods = (data, e) => {
    e.preventDefault();
    this.setState({
      editData: data,
    });
    this.showModal();
  };
  // 新增modal显示
  showModal = () => {
    this.setState({
      addUserVisible: true,
    });
    this.renderForm();
  };
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      addUserVisible: false,
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
          values.level_id = editData.id;
          dispatch({
            type: 'frontUser/updateUserRank',
            payload: values,
          });
          message.success('修改成功');
        } else {
          dispatch({
            type: 'frontUser/addUserRank',
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
      type: 'frontUser/fetchUserRankList',
      payload: {
        pagination: current,
      },
    });
  };
  renderAddForm() {
    const { loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit.bind(this, 0)} hideRequiredMark style={{ marginTop: 8 }}>
        <FormItem label="等级名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入等级名称',
              },
            ],
          })(<Input placeholder="请输入等级名称" />)}
        </FormItem>
        <FormItem label="等级权重">
          {getFieldDecorator('level', {
            rules: [
              {
                required: true,
                message: '请输入等级权重',
              },
            ],
          })(<InputNumber step={1} min={0} />)}
        </FormItem>
        <FormItem label="升级金额">
          {getFieldDecorator('trade_amount', {
            rules: [
              {
                required: true,
                message: '请输入升级所需金额',
              },
            ],
          })(<InputNumber step={0.01} precision={2} min={0.01} />)}
        </FormItem>
        <FormItem tyle={{ marginTop: 32 }}>
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
      <Form onSubmit={this.handleSubmit.bind(this, 1)} hideRequiredMark style={{ marginTop: 8 }}>
        <FormItem label="等级名称">
          {getFieldDecorator('name', {
            initialValue: editData.name,
            rules: [
              {
                required: true,
                message: '请输入等级名称',
              },
            ],
          })(<Input placeholder="请输入等级名称" />)}
        </FormItem>
        <FormItem label="等级权重">
          {getFieldDecorator('level', {
            initialValue: editData.level,
            rules: [
              {
                required: true,
                message: '请输入等级权重',
              },
            ],
          })(<InputNumber step={1} min={0} />)}
        </FormItem>
        <FormItem label="升级金额">
          {getFieldDecorator('trade_amount', {
            initialValue: editData.trade_amount,
            rules: [
              {
                required: true,
                message: '请输入升级所需金额',
              },
            ],
          })(<InputNumber step={0.01} precision={2} min={0.01} />)}
        </FormItem>
        <FormItem tyle={{ marginTop: 32 }}>
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
    const { frontUser: { userRankList: datas }, loading } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { addUserVisible } = this.state;
    const progressColumns = [
      {
        title: '等级名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '等级权重',
        dataIndex: 'level',
      },
      {
        title: '升级金额',
        dataIndex: 'trade_amount',
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            <a onClick={this.editGoods.bind(this, record)}>修改</a>
            <Divider type="vertical" />
            <a onClick={this.deleteGoods.bind(this, record.id)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Tag color="blue" style={{marginBottom: 20}}>升级条件：满足对应的交易完成金额</Tag>
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
          title="等级"
          visible={addUserVisible}
          onCancel={this.handAddleCancel.bind(this)}
          footer=""
        >
          {this.renderForm()}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
