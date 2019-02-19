import React, { Component, Fragment } from 'react';
import { Form, Input, Button, Radio, message } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const formSubmitLayout = {
  wrapperCol: {
    span: 16,
    offset: 8,
  },
};
const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    const { codeForm } = props;
    return {
      trade_type: Form.createFormField({
        value: codeForm.trade_type,
      }),
      merchant_num: Form.createFormField({
        value: codeForm.merchant_num,
      }),
      wealth_num: Form.createFormField({
        value: codeForm.wealth_num,
      }),
      group_num: Form.createFormField({
        value: codeForm.group_num,
      }),
      is_commission: Form.createFormField({
        value: codeForm.is_commission,
      }),
      commission: Form.createFormField({
        value: codeForm.commission,
      }),
      remark: Form.createFormField({
        value: codeForm.remark,
      }),
      password: Form.createFormField({
        value: codeForm.password,
      }),
      trade_amount: Form.createFormField({
        value: codeForm.trade_amount,
      }),
    };
  },
})(props => {
  const { getFieldDecorator, validateFields } = props.form;
  const onValidateForm = e => {
    e.preventDefault();
    const { submitCode } = props;
    validateFields((err, values) => {
      if (!err) {
        submitCode(values);
      } else {
        message.error('请填写信息');
      }
    });
  };
  const { codeForm } = props;
  return (
    <Form
      onSubmit={this.handleSubmit}
      style={{ marginTop: 8 }}
      autoComplete="OFF"
    >
      <FormItem {...formItemLayout} label="交易类型">
        {getFieldDecorator('trade_type', {
          rules: [
            {
              required: true,
              message: '请输入交易类型',
            },
          ],
        })(
          <RadioGroup >
            <Radio value={1}>线下转账</Radio>
            <Radio value={2}>地网交易</Radio>
            <Radio value={3}>奖励</Radio>
          </RadioGroup>
        )}
      </FormItem>
      {
        codeForm.trade_type !== 3 ? (
          <FormItem {...formItemLayout} label="交易金额">
            {getFieldDecorator('trade_amount', {
              rules: [
                {
                  required: true,
                  message: '请输入交易金额',
                },
              ],
            })(<Input />)}
          </FormItem>
        ) : null
      }
      <FormItem {...formItemLayout} label="商户版数量">
        {getFieldDecorator('merchant_num', {
          rules: [
            {
              required: true,
              message: '请输入商户版数量',
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem {...formItemLayout} label="财道版数量">
        {getFieldDecorator('wealth_num', {
          rules: [
            {
              required: true,
              message: '请输入财道版数量',
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem {...formItemLayout} label="视群版数量">
        {getFieldDecorator('group_num', {
          rules: [
            {
              required: true,
              message: '请输入视群版数量',
            },
          ],
        })(<Input />)}
      </FormItem>
      {
        codeForm.trade_type !== 3 ? (
          <Fragment>
            <FormItem {...formItemLayout} label="上级是否有佣金">
              {getFieldDecorator('is_commission', {
                rules: [
                  {
                    required: true,
                    message: '请输入上级是否有佣金',
                  },
                ],
              })(
                <RadioGroup >
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="佣金金额">
              {getFieldDecorator('commission', {
                rules: [
                  {
                    required: true,
                    message: '请输入佣金金额',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Fragment>
        ) : null
      }
      <FormItem {...formItemLayout} label="备注">
        {getFieldDecorator('remark', {
        })(<Input />)}
      </FormItem>
      <FormItem {...formItemLayout} label="操作密码">
        {getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: '请输入佣金金额',
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
        <Button type="primary" htmlType="submit" onClick={onValidateForm}>
          提交
        </Button>
      </FormItem>
    </Form>
  );
});

class TypeForm extends Component {
  // 新增修改提交
  handleSubmit = (e) => {
    const { codeOK } = this.props;
    codeOK(e);
  };
  // 修改表单值
  changeFormVal = val => {
    const obj = {};
    for (const key of Object.keys(val)) {
      obj[key] = val[key].value;
    }
    const { changeFormVals } = this.props;
    changeFormVals(obj);
    // dispatch({
    //   type: 'classModel/changeFormVal',
    //   payload: {
    //     obj,
    //   },
    // });
  };
  render() {
    const { codeForm } = this.props;
    return <CustomizedForm codeForm={codeForm} submitCode={this.handleSubmit} onChange={this.changeFormVal} />;
  }
}

export default TypeForm;
