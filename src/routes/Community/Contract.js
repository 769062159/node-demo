import React from 'react';
import { connect } from 'dva';
// import { Form, Button, Input, Select, Upload, Icon, Modal, Tag, message, InputNumber } from 'antd';
import { Form, Button, Upload, Icon, Tag, message, Card } from 'antd';
import styles from './style.less';
import Wangeditor from '../../components/Wangeditor';
// import { router } from 'sw-toolbox';
// import LiveGoodTable from '../../../components/LiveGoodTable';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 },
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    console.log('change', props, changedFields);
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    const arr = {
      front: Form.createFormField({
        value: props.protocolForm.front,
      }),
      back: Form.createFormField({
        value: props.protocolForm.back,
      }),
      people: Form.createFormField({
        value: props.protocolForm.people,
      }),
      desc: Form.createFormField({
        value: props.protocolForm.desc,
      }),
    };
    return arr;
  },
  // onValuesChange(_, values) {
  //   console.log(values);
  // },
})(props => {
  //  111
  const { getFieldDecorator, validateFields } = props.form;
  const {
    uploadUrl,
    protocolForm,
    // handleChangeImg,
    header,
    setDescription,
  } = props;
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
  // const headers = {
  //   token,
  // }

  // 上传按钮
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">图片</div>
    </div>
  );
  // 上传图片参数
  const payload = {
    type: 2,
  };
  //  限制大小
  const beforeUpload = (file) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('图片不能超过1M!');
    }
    return isLt1M;
  }
  return (
    <Form autoComplete="OFF">
      <Form.Item
        className={styles.extraTag}
        {...formItemLayout}
        label="身份证正面"
        extra={<Tag color="blue">大小不得大于1M</Tag>}
      >
        {getFieldDecorator('front', {
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
          rules: [{ required: true }],
        })(
          <Upload
            action={uploadUrl}
            beforeUpload={beforeUpload}
            listType="picture-card"
            // onPreview={handlePreviewImg}
            data={payload}
            headers={header}
          >
            {protocolForm.front.length ? null : uploadButton}
          </Upload>
        )}
      </Form.Item>
      <Form.Item
        className={styles.extraTag}
        {...formItemLayout}
        label="身份证反面"
        extra={<Tag color="blue">大小不得大于1M</Tag>}
      >
        {getFieldDecorator('back', {
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
          rules: [{ required: true }],
        })(
          <Upload
            action={uploadUrl}
            beforeUpload={beforeUpload}
            listType="picture-card"
            // onPreview={handlePreviewImg}
            data={payload}
            headers={header}
          >
            {protocolForm.back.length ? null : uploadButton}
          </Upload>
        )}
      </Form.Item>
      <Form.Item
        className={styles.extraTag}
        {...formItemLayout}
        label="手持证件半身照"
        extra={<Tag color="blue">大小不得大于1M</Tag>}
      >
        {getFieldDecorator('people', {
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
          rules: [{ required: true }],
        })(
          <Upload
            action={uploadUrl}
            beforeUpload={beforeUpload}
            listType="picture-card"
            // onPreview={handlePreviewImg}
            data={payload}
            headers={header}
          >
            {protocolForm.people.length ? null : uploadButton}
          </Upload>
        )}
      </Form.Item>
      <FormItem
        className={styles.extraTag}
        {...formItemLayout}
        label="合同模版"
        extra={<Tag color="blue">请填写合同模版</Tag>}
      >
        {getFieldDecorator('desc', {
          rules: [{ required: true }],
        })(
          <Wangeditor
            detail={protocolForm.desc}
            header={header}
            setDescription={setDescription}
          />
        )}
      </FormItem>
      <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
        <Button type="primary" htmlType="submit" onClick={onValidateForm}>
          提交
        </Button>
      </FormItem>
    </Form>
  );
});

@connect(({ protocol, loading }) => ({
  protocol,
  loading: loading.models.live,
}))
// @Form.create()
class EditVodStep2 extends React.PureComponent {
  state = {
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'protocol/getProtocol',
    });
  }

  // 添加描述
  setDescription = (e) => {
    console.log(e, 'setDesc');
    const obj = {};
    obj.desc = {
      value: e,
    };
    this.changeFormVal(obj);
  }
  // 新增修改提交
  submitForm = (vals) => {
    console.log(vals);
    const { dispatch } = this.props;
    const data = {
      agreement: vals.desc,
      id_card_pic_front: vals.front[0].response.data,
      id_card_pic_back: vals.back[0].response.data,
      id_card_pic_hand: vals.people[0].response.data,
    };
    console.log(data);
    dispatch({
      type: 'protocol/setDefaultProtocol',
      payload: data,
      callback: () => {
        message.success('设置成功');
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
      type: 'protocol/changeFormVals',
      payload: {
        obj,
      },
    });
  };
  render() {
    const { uploadUrl, protocol: { protocolForm } } = this.props;
    const { header } = this.state;
    return (
      <div>
        <Card>
          <p>请按照提示填写本人真实的资料</p>
          <CustomizedForm
            protocolForm={protocolForm}
            uploadUrl={uploadUrl}
            onChange={this.changeFormVal}
            header={header}
            submitForm={this.submitForm}
            setDescription={this.setDescription}
          />
        </Card>
      </div>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['goods/addShop'],
  data: form.step,
}))(EditVodStep2);
