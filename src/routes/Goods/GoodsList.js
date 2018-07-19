import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  // Dropdown,
  // Menu,
  // InputNumber,
  DatePicker,
  Badge,
  // Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// const statusMap = ['default', 'processing', 'success', 'error'];
const statusMap = ['processing', 'processing', 'error'];
const goodsStatus = ['上架', '未上架', '下架'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];
const isTrue = ['否', '是'];

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.rule,
}))
@Form.create()
export default class GoodsList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    minPrice: '',
    maxPrice: '',
    page: 1, // 页脚
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/fetchGoods',
    });
  }

  // 设置最小值
  setMin = e => {
    const { value } = e.target;
    this.setState({ minPrice: value });
  };
  // 设置最大值
  setMax = e => {
    const { value } = e.target;
    this.setState({ maxPrice: value });
  };

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
      type: 'goods/fetchGoods',
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
      type: 'goods/fetchGoods',
      payload: {},
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
      const { minPrice, maxPrice } = this.state;
      if (minPrice && maxPrice) {
        values.sell_goods_price_start = minPrice;
        values.sell_goods_price_end = maxPrice;
      }
      dispatch({
        type: 'goods/fetchGoods',
        payload: values,
      });
    });
  };

  // 删除商品
  deleteGoods = id => {
    event.preventDefault();
    console.log(id);
  };
  // 新建商品
  goNew = () => {
    const { dispatch } = this.props;
    const url = `/good/add-goods/info`;
    dispatch(routerRedux.push(url));
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" autoComplete="OFF">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('goods_name')(<Input placeholder="请输入" />)}
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
                  <Option value="1">未上架</Option>
                  <Option value="2">下架</Option>
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
    // console.log(this.props);
    const { goods: { goodsList: datas, goodsListPage }, loading } = this.props;
    console.log(datas);
    const data = {
      list: datas,
      pagination: {
        ...goodsListPage,
      },
    };
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '商品',
        dataIndex: 'goods_id',
        key: 'goods_id',
        render: (val, text) => (
          <Row style={{ width: 360 }}>
            <Col span={6}>
              <img style={{ height: 80, width: 80 }} src={text.img} alt="商品" />
            </Col>
            <Col span={18} style={{ fontSize: 14 }}>
              <div>{text.goods_name}</div>
              <div>销售价:{text.sell_goods_price}</div>
              <div>总库存:{text.goods_total_inventory}</div>
              <div>分类:{text.category_name}</div>
            </Col>
          </Row>
        ),
      },
      {
        title: '商品店铺',
        dataIndex: 'brand_name',
        key: 'brand_name',
      },
      {
        title: '状态',
        dataIndex: 'goods_status',
        key: 'goods_status',
        filters: [
          {
            text: goodsStatus[0],
            value: 0,
          },
          {
            text: goodsStatus[1],
            value: 1,
          },
          {
            text: goodsStatus[2],
            value: 2,
          },
        ],
        onFilter: (value, record) => record.goods_status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={goodsStatus[val]} />;
        },
      },
      {
        title: '排序',
        dataIndex: 'goods_sort',
      },
      {
        title: '剩余库存',
        dataIndex: 'goods_total_inventory',
        render: (val, record) => val - record.goods_total_sales,
      },
      // {
      //   title: '商品上架时间',
      //   dataIndex: 'goods_shelves_time',
      //   sorter: true,
      //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      // },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '包邮',
        dataIndex: 'shop_shipping_type',
        render: val => <span>{isTrue[val]}</span>,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 150,
        render: record => (
          <Fragment>
            <a href={`#/good/edit-goods/confirm/${record.goods_id}`}>修改</a>
            {/* <Divider type="vertical" />
            <a onClick={this.deleteGoods.bind(this, record.goods_id)}>删除</a> */}
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
              {selectedRows.length > 0 && (
                <span>
                  {/* <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown> */}
                </span>
              )}
            </div>
            <StandardTable
              rowKey={record => record.goods_id}
              scroll={{ x: 1200 }}
              selectedRows={selectedRows}
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
