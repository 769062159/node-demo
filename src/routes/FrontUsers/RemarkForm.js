import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;
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
        const { remarkOK } = this.props;
        remarkOK(values);
      }
    });
  };
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
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