import React, { Component } from 'react';
import { message, Form, Input, Button, Cascader, InputNumber, TimePicker, Tag, Upload, Icon } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
// import { timeFormat } from '../../utils/utils';
// import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { UPLOAD_TYPE } from '../../utils/config';
import Maps from '../../components/Map/index';

const { TextArea } = Input;
// const { Option } = Select;
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
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
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
        if (shopDetail.region_id !== 0) {
          addressArr.push(shopDetail.province_id);
          addressArr.push(shopDetail.city_id);
          addressArr.push(shopDetail.region_id);
          dispatch({
            type: 'address/fetchAll',
            payload: {
              addressArr,
            },
          });
        }
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
      const { shop: { shopLogo } } = this.props;
      if (!shopLogo.length) {
        message.error('上传logo');
      }
      values.http_url = shopLogo[0].url;
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
          message.success('修改成功！');
          const { dispatch } = this.props;
          const url = `/shop/store`;
          dispatch(routerRedux.push(url));
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
  beforeUpload = (file) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('图片不能超过1M!');
    }
    return isLt1M;
  }
  changeImg = (data) => {
    if (!data.file.status) {
      return;
    }
    let { fileList } = data;
    fileList = fileList.map(item => {
      if (item.status === 'done') {
        const img = {};
        img.status = 'done';
        img.response = { status: 'success' };
        img.name = item.name;
        img.uid = item.uid;
        img.url = item.response.data;
        return img;
      }
      return item;
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/setShopLogo',
      payload: fileList,
    });
  };

  render() {
    const {
        address: { addressList },
        shop: { shopDetail, shopLogo },
        loading,
        uploadUrl,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { propsAddress } = shopDetail;
    const addressArr = [];
    // 上传图片参数
    const payload = {
      type: UPLOAD_TYPE.store,
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const { header } = this.state;
    if (shopDetail.province_id) {
      addressArr.push(shopDetail.province_id);
      addressArr.push(shopDetail.city_id);
      addressArr.push(shopDetail.region_id);
    }
    return (
      <PageHeaderLayout>
        <Form autoComplete="OFF" >
          {/* <FormItem {...formItemLayout} label="门店类别">
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
                <Option value={1}>导师</Option>
                <Option value={2}>社群版本</Option>
              </Select>
            )}
          </FormItem> */}
          <Form.Item
            {...formItemLayout}
            label="门店logo"
            extra={<Tag color="blue">建议尺寸100px*100px，大小不得大于1M</Tag>}
          >
            {getFieldDecorator('yyy', {
              rules: [{ required: false, message: '请填写门店logo' }],
            })(
              <Upload
                fileList={shopLogo}
                action={uploadUrl}
                beforeUpload={this.beforeUpload}
                listType="picture-card"
                onChange={this.changeImg}
                // onPreview={handlePreviewImg}
                data={payload}
                headers={header}
              >
                {shopLogo.length ? null : uploadButton}
              </Upload>
            )}
          </Form.Item>
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
              initialValue: shopDetail.open_time ? moment(shopDetail.open_time, 'HH:mm:ss') : null,
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
              initialValue: shopDetail.close_time ? moment(shopDetail.close_time, 'HH:mm:ss') : null,
            })(
              <TimePicker />
            )}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" loading={loading} onClick={this.handleSubmit}>
              提交
            </Button>
          </FormItem>
        </Form>
      </PageHeaderLayout>
    );
  }
}
