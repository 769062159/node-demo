import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Modal, Card, Form, Input, Icon, Button, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const { confirm } = Modal;
// const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// 动态加减
let uuid = 0;
@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    addUserVisible: false,
    sonAttrVisible: false,
    sonAttrName: '',
    // selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/getAllAttr',
      payload: {
        status: 0,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    console.log(99);
    console.log(params);
    dispatch({
      type: 'goods/getAllAttr',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    console.log(999);
    dispatch({
      type: 'goods/getAllAttr',
      payload: {},
    });
  };

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
        dispatch({
          type: 'goods/delGoodType',
          payload: {
            id,
          },
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
  // 子修改modal显示取消
  handSonModal = (name, e) => {
    e.preventDefault();
    const { sonAttrVisible } = this.state;
    this.setState({
      sonAttrVisible: !sonAttrVisible,
      sonAttrName: name,
    });
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
    });
  };
  // 新增提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        // const { dispatch } = this.props;
        // dispatch({
        //   type: 'goods/addGoodType',
        //   payload: values,
        // });
        // message.success('添加成功');
        // this.handAddleCancel();
      }
    });
  };
  // 动态加减
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  render() {
    const { goods: { goodAttr: datas, goodsAttrPage }, loading } = this.props;
    // 上传icon
    // const uploadButton = (
    //   <div>
    //     <Icon type="plus" />
    //     <div className="ant-upload-text">Upload</div>
    //   </div>
    // );
    const { addUserVisible, sonAttrVisible, sonAttrName } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const progressColumns = [
      {
        title: '属性名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
      },
      {
        title: '操作',
        render: record => (
          <Fragment>
            <a href="">修改</a>
            <Divider type="vertical" />
            <a onClick={this.deleteGoods.bind(this, record.class_id)}>删除</a>
          </Fragment>
        ),
      },
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    // 子table
    const expandedRowRender = data => {
      const columnss = [
        { title: '属性值', dataIndex: 'value', key: 'value' },
        { title: '创建时间', dataIndex: 'create_time', key: 'create_time' },
        { title: '更新时间', dataIndex: 'update_time', key: 'update_time' },
        {
          title: '操作',
          render: record => (
            <Fragment>
              <a onClick={this.handSonModal.bind(this, record.value)}>修改</a>
              <Divider type="vertical" />
              <a href="">删除</a>
            </Fragment>
          ),
        },
      ];
      return (
        <Table
          columns={columnss}
          dataSource={data}
          pagination={false}
          rowKey={record => record.id + record.value}
        />
      );
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '子属性名' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`values[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入子属性名',
              },
            ],
          })(<Input placeholder="请输入子属性名" style={{ width: '60%', marginRight: 8 }} />)}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      );
    });

    return (
      <PageHeaderLayout title="商品属性">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.showModal.bind(this)}>
                新建
              </Button>
            </div>
            <Table
              className="components-table-demo-nested"
              // onChange={this.handleTableChange}
              expandedRowRender={record => expandedRowRender(record.has_many_attr)}
              dataSource={datas}
              rowKey={record => record.id + record.create_time}
              loading={loading}
              columns={progressColumns}
              pagination={goodsAttrPage}
            />
          </div>
        </Card>
        <Modal
          title="Title"
          visible={addUserVisible}
          onCancel={this.handAddleCancel.bind(this)}
          footer=""
        >
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem label="属性名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入属性名称',
                  },
                ],
              })(<Input placeholder="给属性起个名字" />)}
            </FormItem>
            {formItems}
            <FormItem {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <Icon type="plus" /> Add field
              </Button>
            </FormItem>
            <FormItem tyle={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="Title"
          visible={sonAttrVisible}
          onCancel={this.handSonModal.bind(this, '')}
          footer=""
        >
          <Input placeholder="给属性起个名字" defaultValue={sonAttrName} />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
