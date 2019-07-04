import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Popconfirm,Card, Form, Row, Col, List, Button, Icon, Input, Select, Modal, DatePicker, Cascader, Table, message, } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { apiurl, wxapiurl } = process.env[process.env.API_ENV];
import debounce from 'lodash/debounce';
import request from '../../utils/request';
import styles from './List.less';
import { getDay } from 'date-fns';

const FormItem = Form.Item;
const { confirm } = Modal;
const InputGroup = Input.Group;
const { Option } = Select;
const oredrStatus = ['未支付', '已取消', '待发货', '已发货', '待评价', '已评价', '退款成功'];
// const warehouseType = ['仓库', '供应商', '本地仓库供应商货'];
const bigStyles = {
  display: 'inline-block',
  verticalAlign: 'bottom',
  borderTop: '1px solid #D2D2D2',
  width: '90%',
  //   textAlign: 'center',
  paddingLeft: 0,
  height: '50px',
  backgroundColor: '#F5F5F5',
  fontSize: 12,
};
const smallStyle = {
  display: 'inline-block',
  borderTop: '1px solid #D2D2D2',
  borderLeft: '1px solid #D2D2D2',
  verticalAlign: 'bottom',
  width: '10%',
  //   textAlign: 'center',
  height: '50px',
  backgroundColor: '#F5F5F5',
  fontSize: 12,
};
const grayBtn = {
  display: 'inline-block',
  backgroundColor: '#E3E3E3',
  width: 80,
  height: 28,
  color: '#000000',
  borderRadius: 0,
  textAlign: 'center',
  fontSize: 11,
  margin: '5px 0',
  lineHeight: '28px',
};


@connect(({ order, address, loading }) => ({
  order,
  address,
  loading: loading.models.order,
  addLoadig: loading.models.address,
}))
@Form.create()
export default class Order extends PureComponent {
  state = {
    expandForm: false,
    isAddressModal: false,
    maxPrice: '',
    minPrice: '',
    sn: '', // 需要修改的包裹的sn
    isSnModal: false,
    isManualOrder: false, // 添加手工单显示
    manualOrder: {},
    manualOrderGoods: [],
    applets: [], // 小程序列表
    shipNumber: '',
    expressId: '',
    isEditType: 0, // 修改发
    page: 1, // 页脚
    mobile: '',
    addressInfo: '',
    receiptName: '',
    addressArr: [],
    orderId: '',
    values: {}, // form表单的查询条件
    close_order_sku_id:'',//需要订单退单的id
  };

  constructor (props) {
    super(props);
    this.filterGoods = debounce(this.filterGoods, 300);
  }
  componentDidMount() {
    const { dispatch, address: { addressList }, order: { expressList, searchOrderSn }, form } = this.props;
    if (searchOrderSn) {
      const { page } = this.state;
      dispatch({
        type: 'order/fetchOrder',
        payload: {
          page,
          pack_order_sn: searchOrderSn,
        },
      });
      form.setFieldsValue({
        pack_order_sn: searchOrderSn,
      });
    } else {
      const { page } = this.state;
      dispatch({
        type: 'order/fetchOrder',
        payload: {
          page,
        },
      });
    }
    if (!addressList.length) {
      dispatch({
        type: 'address/fetch',
        payload: {},
      });
    }
    if (!expressList.length) {
      dispatch({
        type: 'order/fetchExpressList',
      });
    }
    this.filterGoods('')
    this.getApplets()
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/clearOrder',
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
  saveManualOrder = () => {
    let { manualOrder } = this.state
    if (!manualOrder.user_id) {
      message.error('请输入用户id')
      return false
    }
    if (!manualOrder.sku_id) {
      message.error('请选择商品')
      return false
    }
    // if (!manualOrder.wechat_account_id) {
    //   message.error('请选择小程序')
    //   return false
    // }
    request('/merchant/order/create/manual', {
      method: 'POST',
      body: manualOrder
    }).then(res => {
      console.log(res)
      if (res && res.code === 200) {
        const { dispatch, order: { searchOrderSn } } = this.props;
        const { page } = this.state;
        let payload = {
          page: page,
          pack_order_sn: searchOrderSn,
        }
        !searchOrderSn && delete payload.pack_order_sn
        this.hideManualOrder()
        dispatch({
          type: 'order/fetchOrder',
          payload: payload,
        });
        searchOrderSn && form.setFieldsValue({
          pack_order_sn: searchOrderSn,
        });
      }
    }).catch(e => {
      console.log(e)
    })
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
  editAddressBtn = () => {
    const { mobile, addressInfo, receiptName, addressArr, orderId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'order/editAddress',
      payload: {
        mobile,
        name: receiptName,
        address: addressInfo,
        province: addressArr[0].id,
        city: addressArr[1].id,
        region: addressArr[2].id,
        order_id: orderId,
      },
    });
    this.handAddressCancel();
  };
  showManulOrder = () => {
    this.setState({
      isManualOrder: true
    })
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
      sn: pack.pack_id,
      isSnModal: true,
      shipNumber: pack.pack_express_code,
      expressId: pack.pack_express_id,
      isEditType: 1,
    });
  };

  checkAbnormal=()=>{
    const that = this;
    confirm({
      content: '该操作会检测所有未支付订单异常。',
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        const { values } = that.state;
        const { dispatch } = that.props;
        dispatch({
          type: 'order/checkAbnormal',
          values,
        });
      },
      onCancel() {},
    });
  }

  completeOrder = (pack) => {
    const that = this;
    confirm({
      content: '该操作会检查在【微信支付】中该订单是否已付款成功，如付款成功，将会自动执行订单的所有触发操作，如升级身份等。',
      okText: '我已知晓',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        const { values } = that.state;
        const { dispatch } = that.props;
        dispatch({
          type: 'order/manualCompleteOrder',
          payload: pack.order_id,
          values,
          callback: () => {
            message.success('已完成修正');
          },
        });
      },
      onCancel() {
      },
    });
  }

  collectGoods = (pack) => {
    const that = this;
    confirm({
      content: '你确定收货这个吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { values } = that.state;
        const { dispatch } = that.props;
        dispatch({
          type: 'order/collectGoods',
          payload: pack.pack_id,
          values,
          callback: () => {
            message.success('收货成功！');
          },
        });
      },
      onCancel() {
      },
    });
  }
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
  getApplets = () => {
    request('/merchant/wechat-accounts', {
      method: 'POST'
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({
          applets: res.data
        })
      }
    })
  }
  filterGoods = v => {
    request('/merchant/goods/list', {
      method: 'POST',
      body: {
        goods_name: v,
        page_number: 99
      },
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          manualOrderGoods: res.data.list
        })
      }
    })
  }
  hideManualOrder = () => {
    let {manualOrder} = this.state
    manualOrder = {
      user_id: '',
      sku_id: ''
    }
    this.setState({
      isManualOrder: false,
      manualOrder
    })
  }
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
  changeAddress = (value, selectedOptions) => {
    this.setState({
      addressArr: selectedOptions,
    });
  };
  loadData = value => {
    const { dispatch, address: { addressList } } = this.props;
    value = value[value.length - 1];
    const id = value.id;
    for (const val of addressList) {
      if (val.id === id) {
        if (!val.children) {
          dispatch({
            type: 'address/fetch',
            payload: {
              parent_id: id,
            },
          });
        }
        break;
      }
      if (val.children) {
        for (const vals of val.children) {
          if (vals.id === id) {
            if (!vals.children) {
              dispatch({
                type: 'address/fetch',
                payload: {
                  parent_id: id,
                  type: 1,
                },
              });
            }
            break;
          }
        }
      }
    }
  };
  changeManualOrderId = e => {
    var {manualOrder} = this.state;
    manualOrder.user_id = e.target.value
    this.setState({
      manualOrder
    })
  }
  handleChangeManualOrderGoods = v => {
    var {manualOrder} = this.state;
    manualOrder.sku_id = v
    this.setState({
      manualOrder
    })
  }
  // handleChangeManualOrderApplets = v => {
  //   var {manualOrder} = this.state;
  //   manualOrder.wechat_account_id = v
  //   this.setState({
  //     manualOrder
  //   })
  // }
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
  exportOrderList = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields(async (err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      const { minPrice, maxPrice } = this.state;
      if (minPrice && maxPrice) {
        values.start_order_amount = minPrice;
        values.end_order_amount = maxPrice;
      }
      if (values.end_order_time) {
        values.end_order_time = parseInt(new Date(moment(values.end_order_time).format('YYYY-MM-DD 23:59:59')).getTime()/ 1000, 10);
        // console.log(new Date(values.end_order_time).getTime());
      } else {
        delete values.end_order_time;
      }
      if (values.start_order_time) {
        values.start_order_time = parseInt(new Date(moment(values.start_order_time).format('YYYY-MM-DD 00:00:00')).getTime()/ 1000, 10);
        // console.log(new Date(values.start_order_time).getTime());
      } else {
        delete values.start_order_time;
      }

      let token = localStorage.getItem('token');
      let res = await fetch(`${apiurl}/merchant/order/export/ticket`, {
        method: 'post',
        headers: {
          mode: 'no-cors',
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      res.json().then(res => {
        console.log(res)
        res.data.url && window.open(res.data.url)
      })
      // res.blob().then(blob => {
      //   let blobUrl = window.URL.createObjectURL(blob);
      //   let a = window.document.createElement('a');
      //   let date = new Date();
      //   let timer = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      //   a.href = blobUrl
      //   a.download = `订单数据${timer}.csv`
      //   a.click()
      //   a.remove()
      // })
    })
  }
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
      type: 'order/fetchOrder',
      payload: {
        page,
      },
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    // const { page } = this.state;
    this.setState({
      page: 1,
    })

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      const { minPrice, maxPrice } = this.state;
      values.page = 1;
      if (minPrice && maxPrice) {
        values.start_order_amount = minPrice;
        values.end_order_amount = maxPrice;
      }
      if (values.end_order_time) {
        values.end_order_time = parseInt(new Date(moment(values.end_order_time).format('YYYY-MM-DD 23:59:59')).getTime()/ 1000, 10);
        // console.log(new Date(values.end_order_time).getTime());
      } else {
        delete values.end_order_time;
      }
      if (values.start_order_time) {
        values.start_order_time = parseInt(new Date(moment(values.start_order_time).format('YYYY-MM-DD 00:00:00')).getTime()/ 1000, 10);
        // console.log(new Date(values.start_order_time).getTime());
      } else {
        delete values.start_order_time;
      }
      this.setState({
        values,
        page: 1,
      });
      dispatch({
        type: 'order/fetchOrder',
        payload: values,
      });
    });
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.handleSearch} autoComplete="OFF">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="订单SN">
              {getFieldDecorator('pack_order_sn')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="订单状态">
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
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary"  htmlType="submit" >
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.exportOrderList}>
                导出
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.showManulOrder}>
                添加订单
              </Button>
              <Button style={{ marginLeft: 8 }} type="danger" onClick={()=>this.checkAbnormal()}>
                检测异常
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
      <Form layout="inline" autoComplete="OFF" onSubmit={this.handleSearch} >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单SN">
              {getFieldDecorator('pack_order_sn')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
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
            <FormItem label="商品类型">
              {getFieldDecorator('order_type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">普通商品</Option>
                  <Option value="1">身份商品</Option>
                  <Option value="2">升级码商品</Option>
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
            <FormItem label="联系人手机">
              {getFieldDecorator('mobile')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('nickname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户ID">
              {getFieldDecorator('user_id')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="开始时间">
              {getFieldDecorator('start_order_time')(<DatePicker />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="结束时间">
              {getFieldDecorator('end_order_time')(<DatePicker  />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('consignee')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="支付类型">
              {getFieldDecorator('pay_type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">微信支付</Option>
                  <Option value="2">支付宝支付</Option>
                  <Option value="3">扫呗支付</Option>
                  <Option value="4">线下支付</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={this.exportOrderList}>
              导出
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.showManulOrder}>
              添加订单
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
  cancelOrderConfirm =(record) =>{
    const { values } = this.state;
    this.props.dispatch({
      type:"order/cancelOrder",
      payload:{
        sku_id:record.has_order_goods[0].has_order_goods_sku.order_goods_sku_id,
        pack_id:record.pack_id,
      },
      values
    })
  }

  render() {
    const {
      order: { orderList, orderListPage, expressList },
      address: { addressList },
      loading,
    } = this.props;
    const {
      isSnModal,
      isManualOrder,
      manualOrder,
      manualOrderGoods,
      applets,
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
    const manualOrderGoodsItem = [];
    if (manualOrderGoods.length) {
      manualOrderGoods.map(v => {
        manualOrderGoodsItem.push(
          <Option value={v.has_shop_goods_sku[0].sku_id} key={v.goods_id}>{v.goods_name}</Option>
        )
      })
    }

    const appletsItem = [];
    if (applets.length) {
      applets.map(v => {
        appletsItem.push(
          <Option value={v.id} key={v.id}>{v.name}</Option>
        )
      })
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
                  <img src={val ? val.avatar : ''} alt="图片" style={{ width: 60, maxHeight: 60 }} />
                </Col>
                <Col span={16}>
                  <div>{val ? val.nickname : ''}</div>
                  <div>id:{val ? val.fake_id : ''}</div>
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
              <Row key={res.order_goods_id}>

                <Col span={6}>
                  <img src={res.has_order_goods_sku.http_url} alt="图片" style={{ width: 60 }} />
                </Col>
                <Col span={13}>
                  <div>{res.goods_name}</div>
                  <div>规格：{res.has_order_goods_sku.sku_goods_name}</div>
                </Col>
                <Col span={5}>
                  <div>¥{res.has_order_goods_sku.unit_price}</div>
                  <div>*{res.has_order_goods_sku.total_goods_number}</div>
                </Col>
              </Row>
            );
          }),
      },
      {
        title: '213',
        width: '12%',
        dataIndex: 'total_price',
      },
      {
        title: '21',
        width: '12%',
        dataIndex: 'has_store',
        render: (val) => val ? (
          <div>
            <div>{val.shop_name}</div>
            {
              val.type ? (
                <div>Id:{val.shop_store_user_id}</div>
              ) : null
            }
          </div>
        ) : null,
      },
      {
        title: '直播简介',
        width: '8%',
        dataIndex: 'order_status',
        render: val => oredrStatus[val],
      },
      {
        title: '直简介',
        width: '12%',
        render: (text, record) => {
          return (
          <Fragment>
            {record.order_status === 2 && record.isBtn ? (
              <Button style={grayBtn} onClick={this.ship.bind(this, record.pack_id)}>
                发货
              </Button>
            ) : record.order_status === 3 && record.isBtn ? (
              <Fragment>
                <Button style={grayBtn} onClick={this.editShip.bind(this, record)}>
                  修改发货
                </Button>
                <Button style={grayBtn} onClick={this.collectGoods.bind(this, record)}>
                  确认收货
                </Button>
                {record.pay_type===4&&<Button style={grayBtn} onClick={this.cancelOrderConfirm.bind(this, record)}>
                  撤销订单
                </Button>}
              </Fragment>
            ) : record.order_status === 0 ? (
              <Fragment>
                <Button style={grayBtn} onClick={this.completeOrder.bind(this, record)}>
                  检测异常
                </Button>
              </Fragment>
            ) : null}
            {/* <a href={`#/order/order-detail/${record.order_id}`} style={grayBtn} >
              查看详情
            </a> */}
          </Fragment>
        )},
      },
    ];

    return (
      <PageHeaderLayout>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <Card bordered={false} hoverable={false} loading={loading}>
          <Row
            style={{
              backgroundColor: '#F5F5F5',
              height: 34,
              marginBottom: 10,
              fontSize: 12
            }}
            align="middle"
            type="flex"
          >
            <Col span={5} style={{ paddingLeft: 20 }}>
              会员信息
            </Col>
            <Col span={8} style={{ paddingLeft: 20 }}>
              订单详情
            </Col>
            <Col span={3} style={{ paddingLeft: 10 }}>
              金额
            </Col>
            <Col span={3} style={{ paddingLeft: 10 }}>
              仓库
            </Col>
            <Col span={2} style={{ paddingLeft: 10 }}>
              状态
            </Col>
            <Col span={3} style={{ paddingLeft: 10 }}>
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
                const { dispatch } = this.props;
                dispatch({
                  type: 'order/fetchOrder',
                  payload: values,
                });
              },
              ...orderListPage,
            }}
            dataSource={orderList}
            renderItem={item => (
              <List.Item key={item.order_sn} className={styles.listItem}>
                <Card className={styles.RowItem} hoverable={false}>
                  <Row
                    style={{ backgroundColor: '#F5F5F5', height: 48, fontSize: 12 }}
                    align="middle"
                    type="flex"
                  >
                    <Col span={4} style={{ paddingLeft: 20 }}>
                      {moment(item.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
                    </Col>
                    {
                      item.pay_type === 4 ? (
                        <Col span={6} style={{ paddingLeft: 10, color: '#f44' }}>
                          订单类型：线下订单
                        </Col>
                      ) : ''
                    }
                    <Col span={6} style={{ paddingLeft: 10 }}>
                      订单号：{item.order_sn}
                    </Col>
                    <Col span={6} style={{ paddingLeft: 10 }}>
                      总金额：{item.total_amount}
                    </Col>
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
                  <Row style={smallStyle} >
                    <a href={`#/order/order-detail/${item.order_id}`} style={grayBtn} >
                      查看详情
                    </a>
                  </Row>
                  {/* {item.order_status === 2 ? (
                    <Row style={smallStyle}>
                      <Button style={grayBtn} onClick={this.editAddress.bind(this, item)}>
                        修改地址
                      </Button>
                    </Row>
                  ) : (
                    <Row style={smallStyle} />
                  )} */}
                  {item.has_order_pack &&
                    item.has_order_pack.map((res) => {
                      return (
                        <div key={res.pack_id}>
                          {/* <Card.Grid style={{ padding: 0, width: '100%' }}> */}
                          <Row
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
                            <Col span={2}>包裹</Col>
                            <Col span={5}>包裹订单号：{res.order_sn}</Col>
                            <Col span={3}>运费：{res.shipping_fee}</Col>
                          </Row>
                          <Table
                            bordered
                            showHeader={false}
                            // dataSource={item.has_order_pack}
                            dataSource={[res]}
                            rowKey={record => record.pack_id}
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
          title="添加订单"
          visible={isManualOrder}
          onCancel={this.hideManualOrder.bind(this)}
          footer=""
          destroyOnClose="true"
        >
          <Row style={{ margin: '20px 0' }}>
            <Col span={8}>订单购买人ID</Col>
            <Col span={16}>
              <Input
                defaultValue={manualOrder.id}
                placeholder="请输入购买人ID"
                onChange={this.changeManualOrderId}
              />
            </Col>
          </Row>
          <Row style={{ margin: '20px 0'}}>
            <Col span={8}>订单商品</Col>
            <Col span={16}>
              <Select
                defaultValue={expressId}
                showSearch
                style={{ width: 200 }}
                placeholder="选择商品"
                optionFilterProp="children"
                onSearch={this.filterGoods}
                onChange={this.handleChangeManualOrderGoods.bind(this)}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {manualOrderGoodsItem}
              </Select>
            </Col>
          </Row>
          {/**
          <Row style={{marginBottom: '20px'}}>
            <Col span={8}>订单对应小程序</Col>
            <Col span={16}>
              <Select
                defaultValue={expressId}
                showSearch
                style={{ width: 200 }}
                placeholder="选择对应小程序"
                optionFilterProp="children"
                onChange={this.handleChangeManualOrderApplets.bind(this)}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {appletsItem}
              </Select>
            </Col>
          </Row>*/}
          <Button loading={loading} onClick={this.saveManualOrder} type="primary" style={{textAlign: 'right'}}>
            确认添加
          </Button>
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
        <Modal
          title="地址"
          visible={isAddressModal}
          onCancel={this.handAddressCancel.bind(this)}
          footer=""
          destroyOnClose="true"
        >
          <Row>
            <Col span={4}>手机号码</Col>
            <Col span={20}>
              <Input
                defaultValue={mobile}
                placeholder="请输入手机号码"
                onChange={this.changeMobile}
              />
            </Col>
          </Row>
          <Row style={{ margin: '20px 0' }}>
            <Col span={4}>收货人</Col>
            <Col span={20}>
              <Input
                defaultValue={receiptName}
                placeholder="请输入收货人姓名"
                onChange={this.changeReceiptName}
              />
            </Col>
          </Row>
          <Row>
            <Col span={4}>省市区</Col>
            <Col span={20}>
              <Cascader
                defaultValue={addressArr}
                style={{ width: 300 }}
                options={addressList}
                onChange={this.changeAddress}
                loadData={this.loadData}
                fieldNames={{ label: 'region_name', value: 'id' }}
                changeOnSelect
              />
            </Col>
          </Row>
          <Row style={{ margin: '20px 0' }}>
            <Col span={4}>详细地址</Col>
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
