import React, { Component } from 'react';
import { message, Form, Input, Button, Cascader, InputNumber, TimePicker, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
// import { timeFormat } from '../../utils/utils';
// import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Maps from '../../components/Map/index';

const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

@connect(({ shop, address, loading }) => ({
    shop,
    address,
    loading: loading.models.shop,
}))
@Form.create()
export default class AddShop extends Component {
  state = {
    // expandForm: false,
    addressArr: [],
    Jingwei: {},
    // propsAddress: '',
  };
  componentDidMount() {
    const { id } = this.props.match.params;
    const { dispatch, address: { addressList } } = this.props;
    if (!addressList.length) {
      dispatch({
        type: 'address/fetch',
        payload: {},
      });
    }
    dispatch({
      type: 'shop/fetchShopDetail',
      payload: {
        store_id: id,
      },
      callback: () => {
        const { shop: { shopDetail } } = this.props;
        const addressArr = [];
        addressArr.push(shopDetail.province_id);
        addressArr.push(shopDetail.city_id);
        addressArr.push(shopDetail.region_id);
        dispatch({
          type: 'address/fetchAll',
          payload: {
            addressArr,
          },
        });
      },
    });
    // dispatch({
    //   type: 'address/fetch',
    //   payload: {},
    // });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/clearAddress',
    });
  }
  
  // toggleForm = () => {
  //   const { addressArr } = this.state;
  //   console.log(addressArr);
  //   this.setState({
  //     expandForm: !this.state.expandForm,
  //   });
  // };
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
  // 从子组件获取值
  handleMapAddress = (Jingwei, address) => {
    if (address) {
      this.props.form.setFields({
        address: {
          value: address,
        },
      });
    }
    this.setState({
      Jingwei,
    })
  }
  // 新增修改提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return false;
      }
      values.close_time = values.close_time.needTime;
      values.open_time = values.open_time.needTime;
      const { addressBig } = values;
      const { Jingwei } = this.state;
      if (!addressBig.length) {
        message.error('请选择地址！');
        return false;
      }
      values.store_id = this.props.match.params.id;
      values.province_id = values.addressBig[0];
      values.city_id = values.addressBig[1];
      values.region_id = values.addressBig[2];
      values.latitude = Jingwei.lat;
      values.longitude = Jingwei.lng;
      const { dispatch } = this.props;
      dispatch({
        type: 'shop/updateShop',
        payload: values,
        callback: () => {
          message.success('修改成功！')
        },
      });
      // if (!err) {
      // }
    });
  };
  location = () => {
    const { form, dispatch } = this.props;
    let propsAddress = form.getFieldValue('address');
    const { addressArr } = this.state;
    if (addressArr.length) {
      let str = '';
      addressArr.forEach(res => {
        str += res.region_name;
      })
      propsAddress = str + propsAddress;
    }
    dispatch({
      type: 'shop/setPropsAddress',
      payload: {
        propsAddress,
      },
    });
  }
  // 修改信息
  editDataMsg = (data, e) => {
    e.preventDefault();
    this.showModal();
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/editHomeMsgs',
      payload: {
        data,
      },
    });
  };
  // 修改表单值
  changeFormVal = val => {
    const { dispatch } = this.props;
    const obj = {};
    for (const key of Object.keys(val)) {
      obj[key] = val[key].value;
    }
    dispatch({
      type: 'indexs/changeFormVal',
      payload: {
        obj,
      },
    });
  };

  render() {
    const {
        address: { addressList },
        shop: { shopDetail },
        loading,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { propsAddress } = shopDetail;
    const addressArr = [];
    if (shopDetail.province_id) {
      addressArr.push(shopDetail.province_id);
      addressArr.push(shopDetail.city_id);
      addressArr.push(shopDetail.region_id);
    }
    return (
      <PageHeaderLayout>
        <Form autoComplete="OFF" >
          <FormItem {...formItemLayout} label="门店类别">
            {getFieldDecorator('type', {
              initialValue: shopDetail.type || '',
              rules: [
                {
                  required: true,
                  message: '请输入门店类别',
                },
              ],
            })(
              <Select>
                <Option value={1}>商户版本</Option>
                <Option value={2}>社群版本</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="门店名称">
            {getFieldDecorator('shop_name', {
              initialValue: shopDetail.shop_name,
              rules: [
                {
                  required: true,
                  message: '请输入门店名称',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="门店地址"
          >
            {getFieldDecorator('addressBig', {
              initialValue: addressArr,
              rules: [
                {
                  required: true,
                  message: '请输入地址',
                },
              ],
            })(
              <Cascader
                style={{ width: 300 }}
                options={addressList}
                onChange={this.changeAddress}
                loadData={this.loadData}
                fieldNames={{ label: 'region_name', value: 'id' }}
                changeOnSelect
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="详细地址"
            extra={<Button size="small" onClick={this.location}>定位</Button>}
          >
            {getFieldDecorator('address', {
              initialValue: shopDetail.address,
              rules: [
                {
                  required: true,
                  message: '请输入详细地址',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="地图"
          >
            {getFieldDecorator('maps', {
            })(<Maps handleMapAddress={this.handleMapAddress} propsAddress={propsAddress} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="店铺简介">
            {getFieldDecorator('shop_desc', {
              initialValue: shopDetail.shop_desc,
              rules: [
                {
                  required: true,
                  message: '请输入店铺简介',
                },
              ],
            })(<TextArea placeholder="请输入店铺简介" autosize />)}
          </FormItem>
          <FormItem {...formItemLayout} label="店铺电话">
            {getFieldDecorator('mobile', {
              rules: [
                {
                  required: true,
                  message: '请输入店铺电话',
                },
              ],
              initialValue: shopDetail.mobile,
            })(<InputNumber style={{ width: 200}} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="开业时间">
            {getFieldDecorator('open_time', {
              rules: [
                {
                  required: true,
                  message: '请输入开业时间',
                },
              ],
              getValueFromEvent: (date, dateString) => {
                date.needTime = dateString;
                return date;
              },
              initialValue:  moment(shopDetail.open_time, 'HH:mm:ss'),
            })(
              <TimePicker />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="关门时间">
            {getFieldDecorator('close_time', {
              rules: [
                {
                  required: true,
                  message: '请输入关门时间',
                },
              ],
              getValueFromEvent: (date, dateString) => {
                date.needTime = dateString;
                return date;
              },
              initialValue:  moment(shopDetail.close_time, 'HH:mm:ss'),
            })(
              <TimePicker />
            )}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={loading} onClick={this.handleSubmit}>
              提交
            </Button>
          </FormItem>
        </Form>
      </PageHeaderLayout>
    );
  }
}
