import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
// import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  message,
  Modal,
  // Dropdown,
  // Menu,
  // InputNumber,
  DatePicker,
  // Badge,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const { confirm } = Modal;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// const statusMap = ['default', 'processing', 'success', 'error'];
// const statusMap = ['processing', 'processing', 'error'];
// const goodsStatus = ['上架', '下架', '审核中'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];
// const isTrue = ['否', '是'];

@connect(({ classModel, loading }) => ({
  classModel,
  loading: loading.models.classModel,
}))
@Form.create()
export default class ClassList extends PureComponent {
  state = {
    expandForm: false,
    formValues: {},
    minPrice: '',
    maxPrice: '',
    page: 1, // 页脚
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'classModel/getclassList',
      payload: {
        page_number: 3,
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

    // const params = {
    //   currentPage: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...formValues,
    //   ...filters,
    // };
    const params = {
      page: pagination.current,
      page_number: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'classModel/getclassList',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      minPrice: '',
      maxPrice: '',
    });
    dispatch({
      type: 'classModel/getclassList',
      payload: {},
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };



  handleSearch = e => {
    e.preventDefault();
    const { page } = this.state;
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        page,
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'classModel/getclassList',
        payload: values,
      });
    });
  };

  // 删除商品
  deleteItem = id => {
    event.preventDefault();
    const that = this;
    confirm({
      content: '你确定删除这个吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { page } = that.state;
        const { dispatch } = that.props;
        dispatch({
          type: 'classModel/deleteClass',
          payload: id,
          page: {
            page,
            page_number: 3,
          },
          callback: () => {
            message.success('删除成功！');
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 新建商品
  goNew = () => {
    const { dispatch } = this.props;
    const url = `/live/class-add`;
    dispatch(routerRedux.push(url));
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" autoComplete="OFF">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="课程名称">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('goods_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">上架中</Option>
                  <Option value="1">未上架</Option>
                  <Option value="2">下架</Option>
                </Select>
              )}
            </FormItem>
          </Col> */}
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" autoComplete="OFF">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('goods_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('goods_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">上架中</Option>
                  <Option value="1">下架中</Option>
                  <Option value="2">审核中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('create_start')(
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime
                  placeholder="请输入创建日期"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="价格区间">
              <InputGroup compact>
                <Input
                  key={1}
                  value={this.state.minPrice}
                  style={{ width: 70, textAlign: 'center' }}
                  onChange={this.setMin}
                  placeholder="Min"
                />
                <Input
                  key={2}
                  style={{
                    width: 30,
                    borderLeft: 0,
                    pointerEvents: 'none',
                    backgroundColor: '#fff',
                  }}
                  placeholder="~"
                  disabled
                />
                <Input
                  key={3}
                  value={this.state.maxPrice}
                  style={{ width: 70, textAlign: 'center', borderLeft: 0 }}
                  onChange={this.setMax}
                  placeholder="Max"
                />
              </InputGroup>
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col> */}
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { classModel: { classList: datas, classListPage }, loading } = this.props;
    const data = {
      list: datas,
      pagination: {
        ...classListPage,
      },
    };

    const columns = [
      {
        title: '课程名称',
        dataIndex: 'title',
        key: 'title',
      },
      // {
      //   title: '课程价格',
      //   dataIndex: 'price',
      //   key: 'price',
      // },
      {
        title: '课程数量',
        dataIndex: 'lesson_num',
        key: 'lesson_num',
        render: (val) => {
          return val === 1 ? '单课' :`${val}集`;
        },
      },
      {
        title: '课程封面',
        dataIndex: 'cover',
        key: 'cover',
        render: (val) => <img style={{ height: 80, width: 80 }} src={val} alt="商品" />,
      },
      {
        title: '课程封面',
        dataIndex: 'share_cover',
        key: 'share_cover',
        render: (val) => <img style={{ height: 80, width: 80 }} src={val} alt="商品" />,
      },
      // {
      //   title: '剩余库存',
      //   dataIndex: 'goods_total_inventory',
      //   render: (val, record) => val - record.goods_total_sales,
      // },
      // {
      //   title: '商品上架时间',
      //   dataIndex: 'goods_shelves_time',
      //   sorter: true,
      //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      // },
      {
        title: '操作',
        fixed: 'right',
        width: 150,
        render: record => (
          <Fragment>
            <a href={`#/live/class-edit/${record.id}`}>修改</a>
            <Divider type="vertical" />
            <a onClick={this.deleteItem.bind(this, record.id)}>删除</a>
          </Fragment>
        ),
      },
    ];

    // const menu = (
    //   <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
    //     <Menu.Item key="remove">删除</Menu.Item>
    //     <Menu.Item key="approval">批量审批</Menu.Item>
    //   </Menu>
    // );

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.goNew.bind(this)}>
                新建
              </Button>
            </div>
            <StandardTable
              rowKey={record => record.id}
              scroll={{ x: 500 }}
              selectedRows={false}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
