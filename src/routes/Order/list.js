import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Row, Col, List, Button, Icon, Input, Select, Modal, Cascader } from 'antd';
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
const oredrStatus = ['未支付', '已取消', '已支付', '已发货', '已收货', '已评价'];
// const packStatus = ['订单正常', '订单已确认收货', '订单已取消', '订单已关闭'];
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

@connect(({ order, address, loading }) => ({
  order,
  address,
  loading: loading.models.order,
  addLoadig: loading.models.address,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    isAddressModal: false,
    maxPrice: '',
    minPrice: '',
    sn: '', // 需要修改的包裹的sn
    isSnModal: false,
    shipNumber: '',
    expressId: '',
    isEditType: 0, // 修改发
    page: 1, // 页脚
    mobile: '',
    addressInfo: '',
    receiptName: '',
    addressArr: [],
    orderId: '',
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
    const { page } = this.state;
    dispatch({
      type: 'order/fetchOrder',
      payload: {
        page,
      },
    });
    dispatch({
      type: 'address/fetch',
      payload: {},
    });
    dispatch({
      type: 'order/fetchExpressList',
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
  setShip = () => {
    const { shipNumber, sn, expressId, isEditType } = this.state;
    const { dispatch } = this.props;
    if (isEditType) {
      dispatch({
        type: 'order/editShipGood',
        payload: {
          order_pack_id: sn,
          express_id: expressId,
          no: shipNumber,
        },
      });
    } else {
      dispatch({
        type: 'order/shipGood',
        payload: {
          order_pack_id: sn,
          express_id: expressId,
          no: shipNumber,
        },
      });
    }
    this.handShipCancel();
  };
  editAddressBtn = () => {
    const { mobile, addressInfo, receiptName, addressArr, orderId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'order/editShipGood',
      payload: {
        mobile,
        name: receiptName,
        address: addressInfo,
        province: addressArr[0],
        city: addressArr[1],
        region: addressArr[2],
        order_id: orderId,
      },
    });
    this.handAddressCancel();
  };
  ship = sn => {
    this.setState({
      sn,
      isSnModal: true,
      isEditType: 0,
    });
  };
  editShip = pack => {
    this.setState({
      sn: pack.order_id,
      isSnModal: true,
      shipNumber: pack.pack_express_code,
      expressId: pack.pack_express_id,
      isEditType: 1,
    });
  };
  // 修改发货
  editAddress = pack => {
    const addressArr = [];
    addressArr.push(pack.province);
    addressArr.push(pack.city);
    addressArr.push(pack.district);
    this.setState({
      isAddressModal: true,
      addressArr,
      receiptName: pack.consignee,
      addressInfo: pack.address,
      mobile: pack.mobile,
      orderId: pack.order_id,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'address/fetchAll',
      payload: {
        addressArr,
      },
    });
  };
  //  取消发货
  handShipCancel = () => {
    this.setState({
      isSnModal: false,
      shipNumber: '',
      expressId: '',
      sn: '',
    });
  };
  // 取消修改地址
  handAddressCancel = () => {
    this.setState({
      isAddressModal: false,
      receiptName: '',
      addressInfo: '',
      mobile: '',
      orderId: '',
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
  changeAddressInfo = e => {
    this.setState({
      addressInfo: e.target.value,
    });
  };
  changeShipNumber = e => {
    this.setState({
      shipNumber: e.target.value,
    });
  };
  changeMobile = e => {
    this.setState({
      mobile: e.target.value,
    });
  };
  changeReceiptName = e => {
    this.setState({
      receiptName: e.target.value,
    });
  };
  handleChangeExp = value => {
    this.setState({
      expressId: value,
    });
  };
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { page } = this.state;
    form.resetFields();
    // this.setState({
    //   formValues: {},
    // });
    console.log(999);
    dispatch({
      type: 'order/fetchOrder',
      payload: {
        page,
      },
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { page } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      const { minPrice, maxPrice } = this.state;
      values.page = page;
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
              {getFieldDecorator('order_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未支付</Option>
                  <Option value="1">已取消</Option>
                  <Option value="2">已支付</Option>
                  <Option value="3">已发货</Option>
                  <Option value="4">已收货</Option>
                  <Option value="5">已评价</Option>
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
              {getFieldDecorator('order_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未支付</Option>
                  <Option value="1">已取消</Option>
                  <Option value="2">已支付</Option>
                  <Option value="3">已发货</Option>
                  <Option value="4">已收货</Option>
                  <Option value="4">已评价</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('consignee')(<Input placeholder="请输入" />)}
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
    const {
      order: { orderList, orderListPage, expressList },
      address: { addressList },
      loading,
    } = this.props;
    const {
      isSnModal,
      isEditType,
      shipNumber,
      expressId,
      isAddressModal,
      addressInfo,
      receiptName,
      mobile,
      addressArr,
    } = this.state;
    const expressListItem = [];
    if (expressList.length) {
      expressList.forEach(res => {
        expressListItem.push(
          <Option value={res.id} key={res.id}>
            {res.name}
          </Option>
        );
      });
    }

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
                this.setState({
                  page,
                });
                const { dispatch } = this.props;
                dispatch({
                  type: 'order/fetchOrder',
                  payload: {
                    page,
                  },
                });
              },
              ...orderListPage,
            }}
            dataSource={orderList}
            // footer={<div><b>ant design</b> footer part</div>}
            renderItem={item => (
              <List.Item key={item.order_sn} className={styles.listItem}>
                <Card className={styles.RowItem} hoverable={false}>
                  <Card.Grid style={bigStyle}>
                    <Row>
                      <Col span={5}>订单号：{item.order_sn}</Col>
                      <Col span={3}>总金额：{item.total_amount}</Col>
                      <Col span={6}>联系电话：{item.mobile}</Col>
                      <Col span={6}>
                        下单时间：{moment(item.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
                      </Col>
                      <Col span={4}>订单状态：{oredrStatus[item.order_status]}</Col>
                    </Row>
                  </Card.Grid>
                  {item.order_status === 2 ? (
                    <Card.Grid style={smallStyle}>
                      <Row>
                        <Col>
                          <Button type="primary" onClick={this.editAddress.bind(this, item)}>
                            修改地址
                          </Button>
                        </Col>
                      </Row>
                    </Card.Grid>
                  ) : null}
                  {/* <Card.Grid style={smallStyle}>
                    <Row>
                      <Col>
                        {item.order_status === 2 ? (
                          <Button type="primary" onClick={this.editAddress.bind(this, item)}>
                            修改地址
                          </Button>
                        ) : null}
                      </Col>
                    </Row>
                  </Card.Grid> */}
                  {item.has_order_pack.map((res, index) => {
                    return (
                      <div key={res.order_id}>
                        <Card.Grid style={bigStyle}>
                          <Card bordered={false} hoverable={false}>
                            <Card.Grid style={allStyle}>
                              <Row gutter={24}>
                                <Col span={2}>包裹{index + 1}</Col>
                                <Col span={5}>sn：{res.order_sn}</Col>
                                <Col span={4}>状态：{oredrStatus[res.order_status]}</Col>
                                <Col span={3}>运费：{res.pack_shipping_fee}</Col>
                                <Col span={3}>发货类型：{warehouseType[res.warehouse_type]}</Col>
                                {res.pack_express_sn ? (
                                  <Col span={3}>快递单号：{res.pack_express_sn}</Col>
                                ) : null}
                                {res.pack_express_name ? (
                                  <Col span={3}>快递公司：{res.pack_express_name}</Col>
                                ) : null}
                                {res.pack_shipping_time ? (
                                  <Col span={3}>
                                    配送时间：{moment(res.pack_shipping_time * 1000).format(
                                      'YYYY-MM-DD HH:mm:ss'
                                    )}
                                  </Col>
                                ) : null}
                              </Row>
                            </Card.Grid>
                          </Card>
                          <Row gutter={24}>
                            <Col span={4}>图片</Col>
                            <Col span={4}>商品名</Col>
                            <Col span={4}>数量</Col>
                            <Col span={4}>单价</Col>
                            <Col span={4}>总价</Col>
                            <Col span={4}>状态</Col>
                          </Row>
                          {res.has_order_goods.map(ele => {
                            return (
                              <Row key={ele.order_pack_id} align="middle" type="flex">
                                <Col span={4}>
                                  <img
                                    src={ele.has_order_goods_sku.http_url}
                                    alt="图片"
                                    style={{ width: '80%' }}
                                  />
                                </Col>
                                <Col span={4}>{ele.goods_name}</Col>
                                <Col span={4}>{ele.has_order_goods_sku.total_goods_number}</Col>
                                <Col span={4}>{ele.has_order_goods_sku.unit_price}</Col>
                                <Col span={4}>{ele.sell_goods_price}</Col>
                                <Col span={4}>{ele.goods_name}</Col>
                              </Row>
                            );
                          })}
                        </Card.Grid>
                        <Card.Grid style={smallStyle}>
                          <Row>
                            <Col>
                              {res.order_status === 2 ? (
                                <Button type="primary" onClick={this.ship.bind(this, res.order_id)}>
                                  发货
                                </Button>
                              ) : res.order_status === 3 ? (
                                <Button type="primary" onClick={this.editShip.bind(this, res)}>
                                  修改发货
                                </Button>
                              ) : res.order_status === 1 ? null : null}
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
        <Modal
          title="发货"
          visible={isSnModal}
          onCancel={this.handShipCancel.bind(this)}
          footer=""
          destroyOnClose="true"
        >
          <Row>
            <Col span={4}>
              快递公司
            </Col>
            <Col span={20}>
              <Select
                defaultValue={expressId}
                showSearch
                style={{ width: 200 }}
                placeholder="选择快递"
                optionFilterProp="children"
                onChange={this.handleChangeExp.bind(this)}
                filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {expressListItem}
              </Select>
            </Col>
          </Row>
          <Row style={{ margin: '20px 0' }}>
            <Col span={4}>
              发货单号
            </Col>
            <Col span={20}>
              <Input
                defaultValue={shipNumber}
                placeholder="请输入发货单号"
                onChange={this.changeShipNumber}
              />
            </Col>
          </Row>
          <Button type="primary" loading={loading} onClick={this.setShip}>
            {isEditType ? '修改发货' : '确认发货'}
          </Button>
        </Modal>
        <Modal
          title="地址"
          visible={isAddressModal}
          onCancel={this.handAddressCancel.bind(this)}
          footer=""
          destroyOnClose="true"
        >
          <Row>
            <Col span={4}>
                手机号码
            </Col>
            <Col span={20}>
              <Input defaultValue={mobile} placeholder="请输入手机号码" onChange={this.changeMobile} />
            </Col>
          </Row>
          <Row style={{ margin: '20px 0' }}>
            <Col span={4}>
              收货人
            </Col>
            <Col span={20}>
              <Input
                defaultValue={receiptName}
                placeholder="请输入收货人姓名"
                onChange={this.changeReceiptName}
              />
            </Col>
          </Row>
          <Row>
            <Col span={4}>
                省市区
            </Col>
            <Col span={20}>
              <Cascader
                defaultValue={addressArr}
                style={{ width: 300 }}
                options={addressList}
                onChange={this.changeAddress}
                filedNames={{ label: 'region_name', value: 'id' }}
                changeOnSelect
              />
            </Col>
          </Row>
          <Row style={{ margin: '20px 0' }}>
            <Col span={4}>
                详细地址
            </Col>
            <Col span={20}>
              <Input
                defaultValue={addressInfo}
                placeholder="请输入详情地址"
                onChange={this.changeAddressInfo}
              />
            </Col>
          </Row>
          <Button type="primary" loading={loading} onClick={this.editAddressBtn}>
            修改地址
          </Button>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
