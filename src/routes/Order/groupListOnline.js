import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Row,
  Col,
  List,
  Input,
  Icon,
  Button,
  Select,
  Modal,
  Table,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './List.less';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;
const oredrStatus = ['未支付', '已取消', '待发货', '已发货', '待评价', '已评价', '退款成功'];
// const warehouseType = ['仓库', '供应商', '本地仓库供应商货'];
const bigStyles = {
  display: 'inline-block',
  verticalAlign: 'bottom',
  borderTop: '1px solid #D2D2D2',
  width: '100%',
  //   textAlign: 'center',
  paddingLeft: 0,
  height: '50px',
  backgroundColor: '#F5F5F5',
  fontSize: 12,
};
// const smallStyle = {
//   display: 'inline-block',
//   borderTop: '1px solid #D2D2D2',
//   borderLeft: '1px solid #D2D2D2',
//   verticalAlign: 'bottom',
//   width: '10%',
//   //   textAlign: 'center',
//   height: '50px',
//   backgroundColor: '#F5F5F5',
//   fontSize: 12,
// };
const grayBtn = {
  display: 'inline-block',
  backgroundColor: '#E3E3E3',
  width: 80,
  height: 28,
  marginBottom: 5,
  color: '#000000',
  borderRadius: 0,
  textAlign: 'center',
  fontSize: 11,
  lineHeight: '28px',
  // verticalAlign: 'middle',
};
// const bigStyles = {
//     width: '90%',
//     textAlign: 'center',
//     height: '100%',
//   };
//   const smallStyles = {
//     width: '10%',
//     textAlign: 'center',
//     height: '100%',
//   };
// const allStyle = {
//   width: '100%',
//   textAlign: 'center',
//   height: '100%',
// };

@connect(({ order, shop, loading }) => ({
  order,
  shop,
  loading: loading.models.order,
  shopLoadig: loading.models.shop,
}))
@Form.create()
export default class Order extends PureComponent {
  state = {
    expandForm: false,
    formVisible: false,
    isSnModal: false,
    shipNumber: '',
    expressId: '',
    sn: '',
    isEditType: 0, // 修改发
    orderId: '',
    maxPrice: '',
    minPrice: '',
    page: 1, // 页脚
    values: {}, // form表单的查询条件
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'order/getGroupList',
      payload: {
        page,
        sale_channel: 0,
      },
    });
    dispatch({
      type: 'shop/fetchMenber',
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
  
  
  // loadData = value => {
  //   const { dispatch, address: { addressList } } = this.props;
  //   value = value[value.length - 1];
  //   const id = value.id;
  //   for (const val of addressList) {
  //     if (val.id === id) {
  //       if (!val.children) {
  //         dispatch({
  //           type: 'address/fetch',
  //           payload: {
  //             parent_id: id,
  //           },
  //         });
  //       }
  //       break;
  //     }
  //     if (val.children) {
  //       for (const vals of val.children) {
  //         if (vals.id === id) {
  //           if (!vals.children) {
  //             dispatch({
  //               type: 'address/fetch',
  //               payload: {
  //                 parent_id: id,
  //                 type: 1,
  //               },
  //             });
  //           }
  //           break;
  //         }
  //       }
  //     }
  //   }
  // };
  setMenber = () => {
    const { orderId, values } = this.state;
    const { shop: { selectedMember } } = this.props;
    const { dispatch } = this.props;
    values.sale_channel = 0;
    dispatch({
      type: 'shop/setwriteOff',
      payload: {
        order_id: orderId,
        user_id: selectedMember[0],
      },
      callback: () => {
        message.success('核销成功');
        dispatch({
          type: 'order/getGroupList',
          payload: values,
        });
      },
    });
    this.handAddleCancel();
  }
  setShip = () => {
    const { shipNumber, sn, expressId, isEditType } = this.state;
    if (!sn) {
      message.error('请输入订单编号');
      return false;
    }
    if (!expressId) {
      message.error('请选择快递公司');
      return false;
    }
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
  // toggleForm = () => {
  //   this.setState({
  //     expandForm: !this.state.expandForm,
  //   });
  // };
  writeOff = (id) => {
    this.setState({
      orderId: id,
      formVisible: true,
    });
  }
  ship = sn => {
    this.setState({
      sn,
      isSnModal: true,
      isEditType: 0,
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
  handleChangeExp = value => {
    this.setState({
      expressId: value,
    });
  };
  // ship = (id) => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'order/shipGood',
  //     payload: {
  //       order_pack_id: id,
  //       express_id: 8,
  //       no: '296133847036',
  //     },
  //   });
  // }
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { page } = this.state;
    form.resetFields();
    // this.setState({
    //   formValues: {},
    // });
    this.setState({
      values: {},
      minPrice: '',
      maxPrice: '',
    });
    dispatch({
      type: 'order/getGroupList',
      payload: {
        page,
        sale_channel: 0,
      },
    });
  };
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      formVisible: false,
      orderId: '',
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
      values.sale_channel = 0;
      if (minPrice && maxPrice) {
        values.start_order_amount = minPrice;
        values.end_order_amount = maxPrice;
      }
      this.setState({
        values,
      });
      dispatch({
        type: 'order/getGroupList',
        payload: values,
      });
    });
  };
  selectMember = selectList => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/selectMember',
      payload: {
        data: selectList,
      },
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" autoComplete="OFF">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="包裹订单sn">
              {getFieldDecorator('pack_order_sn')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="包裹订单状态">
              {getFieldDecorator('order_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未支付</Option>
                  <Option value="1">已取消</Option>
                  <Option value="2">待发货</Option>
                  <Option value="3">已发货</Option>
                  <Option value="4">待评价</Option>
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
      <Form onSubmit={this.handleSearch} layout="inline" autoComplete="OFF" >
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
                  <Option value="2">待发货</Option>
                  <Option value="3">已发货</Option>
                  <Option value="4">待评价</Option>
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
  // renderSimpleForms() {
  //   const { loading, shop: { WriteOffList, selectedMember } } = this.props;
  //   // const { previewVisible } = this.state;
  //   const { getFieldDecorator } = this.props.form;
  //   const shopColumns = [
  //     {
  //       title: '店铺名',
  //       dataIndex: 'shop_name',
  //       key: 'shop_name',
  //     },
  //   ];
  //   const rowSelection = {
  //     type: 'radio',
  //     selectedRowKeys: selectedMember,
  //     onChange: this.selectShop,
  //   };
  //   return (
  //     <Form
  //       onSubmit={this.handleSubmit.bind(this)}
  //       hideRequiredMark
  //       style={{ marginTop: 8 }}
  //       autoComplete="OFF"
  //     >
  //       <FormItem label="核销员" {...formItemLayout} >
  //         {getFieldDecorator('user_id', {
  //         })(
  //           <Table
  //             rowSelection={rowSelection}
  //             dataSource={WriteOffList}
  //             rowKey={record => record.id}
  //             loading={loading}
  //             columns={shopColumns}
  //             pagination={false}
  //           />
  //         )}
  //       </FormItem>
  //       <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
  //         <Button type="primary" htmlType="submit" loading={loading}>
  //           配置
  //         </Button>
  //       </FormItem>
  //     </Form>
  //   );
  // }


  render() {
    const {
      order: { groupList: orderList, expressList },
      shop: { WriteOffList, selectedMember },
      shopLoadig,
      loading,
    } = this.props;
    const { formVisible, isSnModal, isEditType, shipNumber, expressId, page } = this.state;
    const shopColumns = [
      {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
      },
    ];
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: selectedMember,
      onChange: this.selectMember,
    };
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
    const detailColumns = [
      {
        title: '直播标题',
        width: '20%',
        dataIndex: 'hasUser',
        key: 'hasUser',
        render: val =>{
            return (
              <Row>
                <Col span={8} style={{overflow: 'hidden'}}>
                  <img src={val.avatar} alt="图片" style={{ width: 60, maxHeight: 60 }} />
                </Col>
                <Col span={16}>
                  <div>{val.nickname}</div>
                  <div>id:{val.fake_id}</div>
                </Col>
              </Row>
            );
        },
      },
      {
        title: '直播标题',
        width: '29%',
        dataIndex: 'has_order_goods',
        key: 'has_order_goods',
        render: val =>
          val.map(res => {
            return (
              <Row>
                <Col span={8}>
                  <img src={res.has_order_goods_sku.http_url} alt="图片" style={{ width: 60, maxHeight: 60 }} />
                </Col>
                <Col span={16}>
                  <div>{res.goods_name}</div>
                  <div>¥{res.group_price} 数量:{res.has_order_goods_sku.total_goods_number}</div>
                </Col>
              </Row>
            );
          }),
      },
      {
        title: '213',
        width: '8%',
        dataIndex: 'goods_amount',
      },
      {
        title: '213',
        width: '12%',
        dataIndex: 'store_name',
      },
      {
        title: '21',
        width: '12%',
        dataIndex: 'has_check_user',
        render: (val, record) => (
          record.order_status === 4 ? (
            <Row>
              <div>核销门店:{record.store_name}</div>
              <div>核销员:{val.nickname}</div>
            </Row>
          ) : null
        ), 
      },
      {
        title: '直播简介',
        width: '8%',
        dataIndex: 'order_status',
        render: (val, record) => (
          record.groupStatus === 1 ? (
            <div>
              {oredrStatus[val]}
              <div style={{color: 'red'}}>(拼团成功)</div>
            </div>
          ) : (oredrStatus[val])
        ),
          // <div>
          //   {oredrStatus[val]}
          //   <div></div>
          // </div>
        // ),
      },
      {
        title: '直播简介',
        width: '8%',
        render: (text, record) =>
          (record.groupStatus === 1 && record.order_status === 2 && record.isBtn ) ? (
            <Row>
              <Button style={grayBtn} onClick={this.ship.bind(this, record.pack_id)}>
                发货
              </Button>
              {/* <a href={`#/order/group-detail/${record.order_id}`} style={grayBtn} >
                详情
              </a> */}
            </Row>
          ) : (
            null
            // <a href={`#/order/group-detail/${record.order_id}`} style={grayBtn} >
            //   详情
            // </a>
          ),
      },
    ];
    

    return (
      <PageHeaderLayout>
        <Card bordered={false} hoverable={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <Row
            style={{
              backgroundColor: '#F5F5F5',
              height: 34,
              marginBottom: 10,
              fontSize: 12,
            }}
            align="middle"
            type="flex"
          >
            <Col span={5} style={{ paddingLeft: 20 }}>
              会员信息
            </Col>
            <Col span={7} style={{ paddingLeft: 20 }}>
              订单详情
            </Col>
            <Col span={2} style={{ paddingLeft: 10 }}>
              实付金额
            </Col>
            <Col span={3} style={{ paddingLeft: 10 }}>
              门店信息
            </Col>
            <Col span={3} style={{ paddingLeft: 10 }}>
              核销信息
            </Col>
            <Col span={2} style={{ paddingLeft: 10 }}>
              状态
            </Col>
            <Col span={2} style={{ paddingLeft: 10 }}>
              操作
            </Col>
          </Row>
          <List
            itemLayout="vertical"
            size="small"
            pagination={{
              onChange: page => {
                this.setState({
                  page,
                });
                const { values } = this.state;
                values.page = page;
                values.sale_channel = 0;
                const { dispatch } = this.props;
                dispatch({
                  type: 'order/getGroupList',
                  payload: values,
                });
              },
              current: page,
            }}
            dataSource={orderList}
            renderItem={item => (
              <List.Item key={item.order_sn} className={styles.listItem}>
                <Card className={styles.RowItem} hoverable={false} loading={loading}>
                  <Row
                    style={{ backgroundColor: '#F5F5F5', height: 48, fontSize: 12 }}
                    align="middle"
                    type="flex"
                  >
                    <Col span={6} style={{ paddingLeft: 10 }}>
                      订单号：{item.order_sn}
                    </Col>
                    <Col span={4} style={{ paddingLeft: 20 }}>
                      {moment(item.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
                    </Col>
                    {/* <Col span={6} style={{ paddingLeft: 10 }}>
                      总金额：{item.total_amount}
                    </Col> */}
                  </Row>
                  <div style={bigStyles}>
                    <Row align="middle" type="flex" style={{ height: '100%' }}>
                      <Col span={5} style={{ paddingLeft: 20 }}>
                        收货人：{item.consignee}
                      </Col>
                      <Col span={6} style={{ paddingLeft: 10 }}>
                        联系电话：{item.mobile}
                      </Col>
                      <Col span={13}>
                        地址：{item.province_name +
                          item.city_name +
                          item.district_name +
                          item.address}
                      </Col>
                    </Row>
                  </div>
                  {item.has_order_pack &&
                    item.has_order_pack.map((res) => {
                      return (
                        <div key={res.pack_id}>
                          {/* <Card.Grid style={{ padding: 0, width: '100%' }}> */}
                          {/* <Row
                            style={{
                              padding: 0,
                              height: 48,
                              paddingLeft: 20,
                              fontSize: 12,
                              borderTop: '1px solid #D2D2D2',
                              borderBottom: '1px solid #D2D2D2',
                            }}
                            align="middle"
                            type="flex"
                          >
                            <Col span={2}>包裹{index + 1}</Col>
                            <Col span={5}>包裹订单号：{res.order_sn}</Col>
                            <Col span={3}>运费：{res.pack_shipping_fee}</Col>
                          </Row> */}
                          <Table
                            bordered
                            showHeader={false}
                            dataSource={[res]}
                            rowKey={record => record.order_id}
                            columns={detailColumns}
                            pagination={false}
                          />
                        </div>
                      );
                    })}
                </Card>
              </List.Item>
            )}
          />
        </Card>
        <Modal
          title="核销员"
          visible={formVisible}
          destroyOnClose="true"
          onCancel={this.handAddleCancel.bind(this)}
          onOk={this.setMenber.bind(this)}
        >
          <Row>
            <Col span={4}>核销员</Col>
            <Col span={20}>
              <Table
                rowSelection={rowSelection}
                dataSource={WriteOffList}
                rowKey={record => record.id}
                loading={shopLoadig}
                columns={shopColumns}
                pagination={false}
              />
            </Col>
          </Row>
        </Modal>
        <Modal
          title="发货"
          visible={isSnModal}
          onCancel={this.handShipCancel.bind(this)}
          footer=""
          destroyOnClose="true"
        >
          <Row>
            <Col span={4}>快递公司</Col>
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
            <Col span={4}>发货单号</Col>
            <Col span={20}>
              <Input
                defaultValue={shipNumber}
                placeholder="请输入发货单号"
                onChange={this.changeShipNumber}
              />
            </Col>
          </Row>
          <Button loading={loading} onClick={this.setShip}>
            {isEditType ? '修改发货' : '确认发货'}
          </Button>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
