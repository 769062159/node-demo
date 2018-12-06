import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
      md: { span: 15 },
    },
  };
  const submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  };
@connect(({ live, loading }) => ({
  live,
  loading: loading.models.live,
}))
@Form.create()
export default class Certification extends PureComponent {
  state = {}
  
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form autoComplete="OFF">
            <FormItem {...formItemLayout} label="分类名称">
              {getFieldDecorator('name', {
                rules: [
                    {
                    required: true,
                    message: '请输入分类名称',
                    },
                ],
              })(<Input placeholder="给分类起个名字" />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" >
                修改
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
