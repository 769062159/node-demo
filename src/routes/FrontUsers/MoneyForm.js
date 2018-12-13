import React, { Component } from 'react';
import { Select, Form, Input, Button, InputNumber, Tag } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
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

@Form.create()
class TypeForm extends Component {
  // 新增修改提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { moneyOK } = this.props;
        moneyOK(values);
      }
    });
  };
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { name, money } = this.props;
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem {...formItemLayout} label="会员名字">
          {name}
        </FormItem>
        <FormItem {...formItemLayout} label="当前余额">
          {money}
        </FormItem>
        <FormItem {...formItemLayout} label="修改类型">
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '请输入修改类型',
              },
            ],
          })(
            <Select>
              <Option value={0}>减少</Option>
              <Option value={1}>增加</Option>
            </Select>
          )}
        </FormItem>
        {/* white-space: pre-wrap; */}
        <FormItem {...formItemLayout} label="金额" extra={<Tag style={{ 'white-space': 'pre-wrap', height: 'auto' }}  color="blue">若用户当前余额为1元，修改类型选择增加，金额填2元，即用户可提现余额变为1+2=3元</Tag>}>
          {getFieldDecorator('money', {
            rules: [
              {
                required: true,
                message: '请输入金额',
              },
            ],
          })(<InputNumber min={0} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('remark', {
            rules: [
              {
                required: true,
                message: '请输入备注',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" >
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
  render() {
    return <div>{this.renderForm()}</div>;
  }
}

export default TypeForm;
