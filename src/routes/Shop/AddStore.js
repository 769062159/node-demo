import React, { Component } from 'react';
import { message, Form, Input, Button, Cascader, InputNumber, TimePicker } from 'antd';
import { connect } from 'dva';
// import moment from 'moment';
// import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Maps from '../../components/Map/index';

import styles from './Style.less';

const { TextArea } = Input;
const FormItem = Form.Item;
// const Option = Select.Option;
// const { TextArea } = Input;
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
    phone: '',
    // expandForm: false,
    addressArr: [],
    Jingwei: {},
    propsAddress: '',
  };
  componentDidMount() {
    const { dispatch, address: { addressList } } = this.props;
    if (!addressList.length) {
      dispatch({
        type: 'address/fetch',
        payload: {},
      });
    }
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
      values.province_id = values.addressBig[0];
      values.city_id = values.addressBig[1];
      values.region_id = values.addressBig[2];
      values.latitude = Jingwei.lat;
      values.longitude = Jingwei.lng;
      const { dispatch } = this.props;
      dispatch({
        type: 'shop/addShop',
        payload: values,
        callback: () => {
          message.success('添加成功！')
        },
      });
      // if (!err) {
      // }
    });
  };
  location = () => {
    const { form } = this.props;
    let propsAddress = form.getFieldValue('address');
    const { addressArr } = this.state;
    if (addressArr.length) {
      let str = '';
      addressArr.forEach(res => {
        str += res.region_name;
      })
      propsAddress = str + propsAddress;
    }
    this.setState({
      propsAddress,
    })
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
  // 修改手机
  editPhone = (phone) => {
    this.setState({
      phone,
    })
  }
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
        loading,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { propsAddress, phone } = this.state;
    return (
      <PageHeaderLayout>
        <Form autoComplete="OFF" >
          <FormItem {...formItemLayout} label="店铺电话">
            {getFieldDecorator('mobile', {
              rules: [
                {
                  required: true,
                  message: '请输入店铺电话',
                },
              ],
            })(<InputNumber onChange={this.editPhone} style={{ width: 200}} />)}
          </FormItem>
          <FormItem className={styles.extraTag} {...formItemLayout} label="账号id" extra={`@${phone}`}>
            {getFieldDecorator('user_id', {
              rules: [
                {
                  required: true,
                  message: '请输入账号id',
                },
              ],
            })(<InputNumber style={{ width: 200}} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码',
                },
              ],
            })(<Input minLength={6} maxLength={20} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="门店名称">
            {getFieldDecorator('shop_name', {
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
              rules: [
                {
                  required: true,
                  message: '请输入店铺简介',
                },
              ],
            })(<TextArea placeholder="请输入店铺简介" autosize />)}
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
