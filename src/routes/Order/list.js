import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Row, Col, List, Button, Icon, Input, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './List.less';

// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');
// const statusMap = ['processing', 'processing', 'error'];
// const goodsStatus = ['上架', '未上架', '下架'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];
const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;
const oredrStatus = ['未支付', '已取消', '已发货', '已收货', '已评价'];
const packStatus = ['订单正常', '订单已确认收货', '订单已取消', '订单已关闭'];
const warehouseType = ['仓库', '供应商', '本地仓库供应商货'];
const bigStyle = {
  width: '90%',
  textAlign: 'center',
  height: '100%',
};
const smallStyle = {
  width: '10%',
  textAlign: 'center',
  height: '100%',
};
const allStyle = {
  width: '100%',
  textAlign: 'center',
  height: '100%',
};

@connect(({ order, loading }) => ({
  order,
  loading: loading.models.indexs,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    maxPrice: '',
    minPrice: '',
    // pagination: 1, // 页脚
  };

  // 换页
  // handleTableChange = pagination => {
  //   const { current } = pagination;
  //   this.setState({
  //     pagination: current,
  //   });
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'indexs/fetchAds',
  //     payload: {
  //       pagination: current,
  //     },
  //   });
  // };

  componentDidMount() {
    const { dispatch } = this.props;
    // const { pagination } = this.state;
    dispatch({
      type: 'order/fetchOrder',
      payload: {},
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
  caozuo = () => {
    console.log(11);
  }
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    // this.setState({
    //   formValues: {},
    // });
    console.log(999);
    dispatch({
      type: 'order/fetchOrder',
      payload: {},
    });
  };
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      // this.setState({
      //   formValues: values,
      // });
      console.log(9999);
      const { minPrice, maxPrice } = this.state;
      console.log(minPrice);
      console.log(maxPrice);
      if (minPrice && maxPrice) {
        values.start_order_amount = minPrice;
        values.end_order_amount = maxPrice;
      }
      dispatch({
        type: 'order/fetchOrder',
        payload: values,
      });
    });
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单sn">
              {getFieldDecorator('pack_order_sn')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="包裹订单状态">
              {getFieldDecorator('pack_order_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">订单正常</Option>
                  <Option value="1">订单已确认收货</Option>
                  <Option value="2">订单已取消</Option>
                  <Option value="3">订单已关闭</Option>
                </Select>
              )}
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单sn">
              {getFieldDecorator('pack_order_sn')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="包裹订单状态">
              {getFieldDecorator('pack_order_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">订单正常</Option>
                  <Option value="1">订单已确认收货</Option>
                  <Option value="2">订单已取消</Option>
                  <Option value="3">订单已关闭</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="包裹快递状态">
              {getFieldDecorator('pack_shipping_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">待发货</Option>
                  <Option value="1">已发货</Option>
                  <Option value="2">已收货</Option>
                  <Option value="3">备货中</Option>
                </Select>
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
          <Col md={8} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('consignee')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系人手机">
              {getFieldDecorator('mobile')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
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
    const { order: { orderList } } = this.props;

    return (
      <PageHeaderLayout>
        <Card bordered={false} hoverable={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <List
            itemLayout="vertical"
            className={styles.noMouse}
            // size="large"
            size="small"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 3,
            }}
            dataSource={orderList}
            // footer={<div><b>ant design</b> footer part</div>}
            renderItem={item => (
              <List.Item key={item.order_sn} className={styles.listItem}>
                <Card className={styles.RowItem} hoverable={false}>
                  <Card.Grid style={bigStyle}>
                    <Row >
                      <Col span={5}>
                        订单号：{item.order_sn}
                      </Col>
                      <Col span={3}>
                        总金额：{item.total_amount}
                      </Col>
                      <Col span={6}>
                        联系电话：{item.mobile}
                      </Col>
                      <Col span={6}>
                        下单时间：{moment(item.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
                      </Col>
                      <Col span={4}>
                        订单状态：{oredrStatus[item.order_status]}
                      </Col>
                    </Row>
                  </Card.Grid>
                  <Card.Grid style={smallStyle}>
                    <Row>
                      <Col>
                        操作
                      </Col>
                    </Row>
                  </Card.Grid>
                  {item.has_order_pack.map((res, index) => {
                    return (
                      <div key={index}>
                        <Card.Grid style={bigStyle}>
                          <Card bordered={false} hoverable={false}>
                            <Card.Grid style={allStyle}>
                              <Row gutter={24} >
                                <Col span={2}>
                                  包裹{ index + 1 }
                                </Col>
                                <Col span={5}>
                                  sn：{res.order_sn}
                                </Col>
                                <Col span={3}>
                                  状态：{packStatus[res.pack_order_status]}
                                </Col>
                                <Col span={3}>
                                  运费：{res.pack_shipping_fee}
                                </Col>
                                <Col span={3}>
                                  发货类型：{warehouseType[res.warehouse_type]}
                                </Col>
                                {
                                  res.pack_express_sn ? (
                                    <Col span={3}>
                                      快递单号：{res.pack_express_sn}
                                    </Col>
                                  ) : null
                                }
                                {
                                  res.pack_express_name ? (
                                    <Col span={3}>
                                      快递公司：{res.pack_express_name}
                                    </Col>
                                  ) : null
                                }
                                {
                                  res.pack_shipping_time ? (
                                    <Col span={3}>
                                      配送时间：{moment(res.pack_shipping_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
                                    </Col>
                                  ) : null
                                }
                              </Row>
                            </Card.Grid>
                          </Card>
                          <Row gutter={24}>
                            <Col span={4}>
                              图片
                            </Col>
                            <Col span={4}>
                              商品名
                            </Col>
                            <Col span={4}>
                              数量
                            </Col>
                            <Col span={4}>
                              单价
                            </Col>
                            <Col span={4}>
                              总价
                            </Col>
                            <Col span={4}>
                              状态
                            </Col>
                          </Row>
                          {res.has_order_goods.map((ele, eleIndex) => {
                            return (
                              <Row key={eleIndex} align="middle" type="flex">
                                <Col span={4}>
                                  <img src={ele.has_order_goods_sku.http_url} alt="图片" style={{width: '80%'}} />
                                </Col>
                                <Col span={4}>
                                  {ele.goods_name}
                                </Col>
                                <Col span={4}>
                                  {ele.has_order_goods_sku.total_goods_number}
                                </Col>
                                <Col span={4}>
                                  {ele.has_order_goods_sku.unit_price}
                                </Col>
                                <Col span={4}>
                                  {ele.sell_goods_price}
                                </Col>
                                <Col span={4}>
                                  {ele.goods_name}
                                </Col>
                              </Row>
                            )}
                          )}
                        </Card.Grid>
                        <Card.Grid style={smallStyle}>
                          <Row>
                            <Col>
                              <Button type="primary" onClick={this.caozuo}>操作</Button>
                            </Col>
                          </Row>
                        </Card.Grid>
                      </div>
                    );
                  })}
                </Card>
              </List.Item>
            )}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
