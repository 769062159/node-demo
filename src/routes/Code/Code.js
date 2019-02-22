import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, message, Button, Input, Tag, Upload, Icon } from 'antd';
import ReactEditor from 'components/ReactEditor';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { UPLOAD_TYPE } from '../../utils/config';

// import styles from './TableList.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
const formSubmitLayout = {
  wrapperCol: {
    span: 20,
    offset: 4,
  },
};
const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    const { codeConfig: form } = props;
    return {
      share_title: Form.createFormField({
        value: form.share_title,
      }),
      xxx: Form.createFormField({
        value: form.xxx,
      }),
      background_pic: Form.createFormField({
        value: form.background_pic,
      }),
      rule: Form.createFormField({
        value: form.rule,
      }),
    };
  },
})(props => {
  const { getFieldDecorator, validateFields } = props.form;
  const onValidateForm = e => {
    e.preventDefault();
    const { submitForm } = props;
    validateFields((err, values) => {
      if (!err) {
        submitForm(values);
      } else {
        message.error('请填写信息');
      }
    });
  };
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">上传</div>
    </div>
  );
  // 上传图片参数
  const payload = {
    type: UPLOAD_TYPE.share,
  };
  const header = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  //  限制大小
  const beforeUpload = (file) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('图片不能超过1M!');
    }
    return isLt1M;
  }
  const { loading, uploadUrl, setDescription, codeConfig } = props;
  return (
    <Form
      onSubmit={onValidateForm}
      style={{ marginTop: 8 }}
      autoComplete="OFF"
    >
      <FormItem {...formItemLayout} label="分享标题">
        {getFieldDecorator('share_title', {
          rules: [
            {
              required: true,
              message: '请输入分享标题',
            },
          ],
        })(<Input />)}
      </FormItem>
      <Form.Item
        {...formItemLayout}
        label="分享图"
        extra={<Tag color="blue">建议尺寸640px*360px，大小不得大于1M</Tag>}
      >
        {getFieldDecorator('xxx', {
          valuePropName: 'fileList',
          getValueFromEvent(...args) {
            const { fileList, file } = args[0];
            if (!file.status) {
              const list = fileList.filter(res => {
                return res.uid !== file.uid;
              });
              return list;
            }
            return fileList;
          },
          rules: [{ required: true, message: '请填写分享图' }],
        })(
          <Upload
            action={uploadUrl}
            beforeUpload={beforeUpload}
            listType="picture-card"
            data={payload}
            headers={header}
          >
            {codeConfig.xxx.length ? null : uploadButton}
          </Upload>
        )}
      </Form.Item>
      <FormItem {...formItemLayout} label="描述">
        {getFieldDecorator('share_titles', {
        })(
          <ReactEditor
            goodsId={1}
            uploadUrl={uploadUrl}
            valueSon={codeConfig.desc}
            setDescription={setDescription.bind(this, 'descs')}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="使用规则说明">
        {getFieldDecorator('share_titless', {
        })(
          <ReactEditor
            goodsId={2}
            uploadUrl={uploadUrl}
            valueSon={codeConfig.rule}
            setDescription={setDescription.bind(this, 'rules')}
          />
        )}
      </FormItem>
      <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
        <Button loading={loading} type="primary" htmlType="submit">
          提交
        </Button>
      </FormItem>
    </Form>
  );
});
// const { confirm } = Modal;

@connect(({ code, loading }) => ({
  code,
  loading: loading.models.code,
}))
// @Form.create()
export default class Order extends PureComponent {
  state = {
  };
  
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'code/fetchCode',
    });
  }
  // 添加描述
  setDescription = (key, e) => {
    const obj = {};
    obj[key] = {
      value: e,
    };
    this.changeFormVal(obj);
  }
  submitForm = () => {
    const { dispatch, code: { codeConfig } } = this.props;
    if (!codeConfig.descs || !codeConfig.rules) {
      message.error('请填写信息');
      return false;
    }
    codeConfig.desc = codeConfig.descs;
    codeConfig.rule = codeConfig.rules;
    codeConfig.share_pic = codeConfig.xxx[0].response.data;
    delete codeConfig.xxx;
    delete codeConfig.descs;
    delete codeConfig.rules;
    dispatch({
      type: 'code/saveCodeConfig',
      payload: codeConfig,
      callback: () => {
        message.success('设置成功');
      },
    });
  }
  // 修改表单值
  changeFormVal = val => {
    const obj = {};
    for (const key of Object.keys(val)) {
      obj[key] = val[key].value;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'code/changeFormVal',
      payload: {
        obj,
      },
    });
  };


  render() {
    // const { frontUser: { userRankList: datas }, loading } = this.props;
    const { loading, code: { codeConfig }, uploadUrl } = this.props;
    return (
      <PageHeaderLayout>
        <CustomizedForm codeConfig={codeConfig} submitForm={this.submitForm} setDescription={this.setDescription} uploadUrl={uploadUrl} onChange={this.changeFormVal} loading={loading} />
      </PageHeaderLayout>
    );
  }
}
