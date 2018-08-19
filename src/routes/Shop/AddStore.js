import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
// import { routerRedux } from 'dva/router';
import { message, Form, Input, Button, Cascader } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Maps from '../../components/Map/index';

// import styles from './TableList.less';

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
// const CustomizedForm = Form.create({
//   onFieldsChange(props, changedFields) {
//     props.onChange(changedFields);
//   },
//   mapPropsToFields(props) {
//     console.log(props);
//     return {
//       shopName: Form.createFormField({
//         value: props.shopForm.shopName,
//       }),
//       addressDetail: Form.createFormField({
//         value: props.shopForm.addressDetail,
//       }),
//       address: Form.createFormField({
//         value: props.shopForm.address,
//       }),
//     };
//   },
//   onValuesChange(_, values) {
//     console.log(values);
//   },
// })(props => {
//   const { getFieldDecorator, validateFields } = props.form;
//   const onValidateForm = e => {
//     e.preventDefault();
//     const { handleSubmit } = props;
//     validateFields(err => {
//       if (!err) {
//         handleSubmit();
//       }
//     });
//   };
//   const { addressList, loadData, changeAddress } = props;
//   return (
//     <Form autoComplete="OFF">
//       <FormItem {...formItemLayout} label="门店名称">
//         {getFieldDecorator('title', {
//           rules: [
//             {
//               required: true,
//               message: '请输入门店名称',
//             },
//           ],
//         })(<Input />)}
//       </FormItem>
//       <FormItem
//         {...formItemLayout}
//         label="门店地址"
//       >
//         {getFieldDecorator('address', {
//           rules: [
//             {
//               required: true,
//               message: '请输入门店地址',
//             },
//           ],
//         })(
//           <Cascader
//             style={{ width: 300 }}
//             options={addressList}
//             onChange={changeAddress}
//             loadData={loadData}
//             fieldNames={{ label: 'region_name', value: 'id' }}
//             changeOnSelect
//           />
//         )}
//       </FormItem>
//       <FormItem>
//         {getFieldDecorator('addressDetail', {
//           rules: [
//             {
//               required: true,
//               message: '请输入详细地址',
//             },
//           ],
//         })(<Input />)}
//       </FormItem>
//       <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
//         <Button type="primary" htmlType="submit" onClick={onValidateForm}>
//           提交
//         </Button>
//       </FormItem>
//     </Form>
//   );
// });

@connect(({ shop, address, loading }) => ({
    shop,
    address,
    loading: loading.models.shop,
}))
@Form.create()
export default class Home extends PureComponent {
  state = {
    expandForm: false,
    addressArr: [],
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'address/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    const { addressArr } = this.state;
    console.log(addressArr);
    this.setState({
      expandForm: !this.state.expandForm,
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

  // 新增修改提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      const { address } = values;
      if (!address.length) {
        message.error('请选择地址！');
      }
      // const { addressArr } = this.state;
      // console.log(addressArr);
      // if (!err) {
      // }
    });
  };
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
        loading,
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderLayout>
        <Form autoComplete="OFF" >
          <FormItem {...formItemLayout} label="门店名称">
            {getFieldDecorator('title', {
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
            {getFieldDecorator('address', {
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
                // onChange={this.changeAddress}
                loadData={this.loadData}
                fieldNames={{ label: 'region_name', value: 'id' }}
                changeOnSelect
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="详细地址"
          >
            {getFieldDecorator('addressDetail', {
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
            })(<Maps />)}
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
