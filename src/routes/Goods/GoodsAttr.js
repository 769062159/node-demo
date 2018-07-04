import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Table,
  Modal,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Divider,
  Select,
  InputNumber,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { Option } = Select;
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
    editData: {},
    isFromEdit: false, // 从修改打开modal
    // selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/getAllAttr',
      payload: {},
    });
    dispatch({
      type: 'goods/getAllType',
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
  // 修改商品
  editGoods = data => {
    if (data.status) {
      message.error('该属性不能修改');
      return;
    }
    event.preventDefault();
    this.setState({
      addUserVisible: true,
      isFromEdit: true,
      editData: data,
    });
  };
  // 删除商品
  deleteGoods = data => {
    event.preventDefault();
    if (data.status) {
      message.error('该属性不能删除');
      return;
    }
    const that = this;
    confirm({
      content: '你确定删除这个吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        dispatch({
          type: 'goods/addGoodAttr',
          payload: {
            ...data,
            status: 1,
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
  // 新增modal显示
  showModal = () => {
    this.setState({
      addUserVisible: true,
    });
  };
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      addUserVisible: false,
      isFromEdit: false,
      editData: {},
    });
  };
  // 新增提交&&修改
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const attrData = [];
      if (!err) {
        const { dispatch } = this.props;
        const { isFromEdit, editData } = this.state;
        values.attr = attrData;
        values.status = 0;
        if (isFromEdit) {
          values.id = editData.id;
          const sonAttr = editData.has_many_attr.filter(res => {
            return res.status === 0;
          });
          const length = sonAttr.length - 1;
          values.values.forEach((res, index) => {
            if (index > length) {
              attrData.push({
                value: res,
                status: 0,
                id: 0,
              });
            } else {
              attrData.push({
                value: res,
                status: 0,
                id: sonAttr[index].id,
              });
            }
          });
        } else {
          values.values.forEach(res => {
            attrData.push({
              value: res,
              status: 0,
            });
          });
        }
        dispatch({
          type: 'goods/addGoodAttr',
          payload: values,
        });
        message.success(`${isFromEdit ? '修改成功' : '添加成功'}`);
        this.handAddleCancel();
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
    const { goods: { goodAttr: datas, goodsAttrPage, goodType }, loading } = this.props;
    // 选择上级分类
    const selectItem = [];
    goodType.forEach(res => {
      selectItem.push(
        <Option key={res.class_id} value={res.class_id}>
          {res.class_name}
        </Option>
      );
    });
    // 上传icon
    // const uploadButton = (
    //   <div>
    //     <Icon type="plus" />
    //     <div className="ant-upload-text">Upload</div>
    //   </div>
    // );
    const { addUserVisible, isFromEdit, editData } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const progressColumns = [
      {
        title: '属性名',
        dataIndex: 'name',
        key: 'name',
        render(text, record) {
          return record.status ? <span>{text}</span> : <a>{text}</a>;
        },
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
            <a onClick={this.editGoods.bind(this, record)}>修改</a>
            <Divider type="vertical" />
            <a onClick={this.deleteGoods.bind(this, record)}>删除</a>
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
      const item = [];
      data.forEach(res => {
        item.push(
          res.status ? (
            <span style={{ marginRight: 20 }} key={res.id}>
              {res.value}
            </span>
          ) : (
            <span style={{ marginRight: 20, color: 'blue' }} key={res.id}>
              {res.value}
            </span>
          )
        );
      });
      return <p>{item}</p>;
    };
    const initValue = [];
    if (isFromEdit) {
      const sonAttr = editData.has_many_attr.filter(res => {
        return res.status === 0;
      });
      sonAttr.forEach(res => {
        initValue.push(res.value);
      });
    }

    getFieldDecorator('keys', { initialValue: initValue });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '子属性名' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`values[${index}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            initialValue: `${initValue[index] || ''}`,
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
    // console.log(formItems);
    // console.log(editData.has_many_attr);

    // 修改的属性名
    // const attrName =  isFromEdit ? editData.name : '';
    // // 修改的属性排序
    // const attrSort =  isFromEdit ? editData.sort : '';
    // // // 修改的属性父id
    // const attrId =  isFromEdit ? editData.goods_class_id : '';
    // console.log(attrName);
    // console.log(this.props.form);
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
              className="components-table-demo-nested"
              // onChange={this.handleTableChange}
              expandedRowRender={record => expandedRowRender(record.has_many_attr)}
              // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
              dataSource={datas}
              rowKey={record => record.id + record.create_time}
              loading={loading}
              columns={progressColumns}
              pagination={goodsAttrPage}
            />
          </div>
        </Card>
        <Modal
          title="属性"
          visible={addUserVisible}
          onCancel={this.handAddleCancel.bind(this)}
          destroyOnClose="true"
          footer=""
        >
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
            autoComplete="OFF"
          >
            <FormItem label="分类" {...formItemLayout}>
              {getFieldDecorator('goods_class_id', {
                initialValue: editData.goods_class_id,
              })(
                <Select style={{ width: 200 }} onChange={this.selectOption}>
                  {selectItem}
                </Select>
              )}
            </FormItem>
            <FormItem label="排序" {...formItemLayout}>
              {getFieldDecorator('sort', {
                initialValue: editData.sort,
              })(<InputNumber />)}
            </FormItem>
            <FormItem label="属性名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: editData.name,
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
                <Icon type="plus" /> 添加子属性
              </Button>
            </FormItem>
            <FormItem tyle={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isFromEdit ? '修改' : '提交'}
              </Button>
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
