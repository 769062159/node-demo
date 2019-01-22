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
export default class Phone extends PureComponent {
  state = {
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'config/fetchConfig',
    });
  }
  handleSubmit =  e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields((err, value) => {
      if (!err) {
        const { dispatch } = this.props;
        value.mobile = value.mobile.toString();
        value.video_audio = Number(value.video_audio) ;
        dispatch({
          type: 'config/addConfig',
          payload: value,
        });
      }
    });
  };
  videoSwitch = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'config/setting',
      payload: {
        key: 'video_audio',
        value: Number(e),
      },
    });
  }
  render() {
    const { loading, form, config: { config } } = this.props;
    const { getFieldDecorator } = form;
    console.log(1, config);

    // const { header, previewImage, previewVisible } = this.state;

    return (
      <PageHeaderLayout>
        <Form>
          <FormItem {...formItemLayout} label="联系方式">
            {getFieldDecorator('mobile', {
              initialValue: config.mobile,
              rules: [
                {
                  required: true,
                  message: '请输入联系方式',
                },
              ],
            })(<Input style={{width: 200}} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="小视频是否审核">
            {getFieldDecorator('video_audio', {
              valuePropName: 'checked',
              initialValue: config.video_audio,
            })(<Switch onChange={this.videoSwitch} />)}
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
