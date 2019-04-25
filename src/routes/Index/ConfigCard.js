import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import {
  Form,
  Button,
  // Dropdown,
  // Menu,
  Switch,
  Input,
  message,
  // DatePicker,
} from 'antd';
// import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

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

@connect(({ config, loading }) => ({
  config,
  loading: loading.models.config,
}))
@Form.create()
export default class CardConfig extends PureComponent {
  state = {
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'config/cardConfig',
    });
  }
  handleSubmit =  e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields((err, value) => {
      if (!err) {
        const { dispatch } = this.props;
        value.user_ids = value.user_ids.toString();
        dispatch({
          type: 'config/saveCardConfig',
          payload: value,
          callback: () => {
            message.success(`设置成功`);
          },
        });
      }
    });
  };
  render() {
    const { loading, form, config: { config } } = this.props;
    const { getFieldDecorator } = form;
    console.log(1, config);

    // const { header, previewImage, previewVisible } = this.state;

    return (
      <PageHeaderLayout>
        <Form>
          <FormItem {...formItemLayout} label="官方模板指定用户ID">
            {getFieldDecorator('user_ids', {
              initialValue: config.user_ids,
              rules: [
                {
                  required: true,
                  message: '请输入用户ID',
                },
              ],
            })(<Input style={{width: 200}} />)}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" loading={loading}  onClick={this.handleSubmit}>
              提交
            </Button>
          </FormItem>
        </Form>
      </PageHeaderLayout>
    );
  }
}
