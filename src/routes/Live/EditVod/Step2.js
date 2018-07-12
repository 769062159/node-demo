import React from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
// import { Form, Button, Input, Select, Upload, Icon, Modal, Tag, message, InputNumber } from 'antd';
import { Form, Button, Input, Upload, Icon, Modal, Tag, message } from 'antd';
import request from '../../../utils/request';
import LiveGoodTable from '../../../components/LiveGoodTable';
// import styles from './style.less';

const { TextArea } = Input;
const FormItem = Form.Item;
// const Option = Select.Option;
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
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    const arr = {
      desc: Form.createFormField({
        value: props.liveForm.desc,
      }),
      title: Form.createFormField({
        value: props.liveForm.title,
      }),
      share_cover: Form.createFormField({
        value: props.liveForm.share_cover,
      }),
      fee: Form.createFormField({
        value: props.liveForm.fee,
      }),
      is_free: Form.createFormField({
        value: props.liveForm.is_free,
      }),
      xxx: Form.createFormField({
        value: props.liveForm.xxx,
      }),
      yyy: Form.createFormField({
        value: props.liveForm.yyy,
      }),
    };
    return arr;
  },
  onValuesChange(_, values) {
    console.log(values);
  },
})(props => {
  //  111
  const { getFieldDecorator, validateFields } = props.form;
  const onValidateForm = e => {
    e.preventDefault();
    const { submitForm } = props;
    validateFields((err, values) => {
      if (!err) {
        submitForm(values);
      }
    });
  };
  const {
    uploadLiveImg,
    handleShareImg,
    shareImg,
    handlePreviewImg,
    handleChangeImg,
    header,
    previewVisible,
    previewImage,
    handleCancelImg,
    // liveForm,
  } = props;

  // 上传按钮
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">主体图片</div>
    </div>
  );
  // 上传图片参数
  const payload = {
    type: 2,
  };
  return (
    <Form autoComplete="OFF">
      <FormItem {...formItemLayout} label="直播标题">
        {getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: '请输入标题',
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem {...formItemLayout} label="直播简介">
        {getFieldDecorator('desc', {
          rules: [
            {
              required: true,
              message: '请输入简介',
            },
          ],
        })(<TextArea placeholder="请输入简介" autosize />)}
      </FormItem>
      <Form.Item
        {...formItemLayout}
        label="直播封面"
        extra={<Tag color="blue">建议尺寸750px*370px</Tag>}
      >
        {getFieldDecorator('xxx', {
          rules: [{ required: true, message: '请填写直播封面' }],
        })(
          <div className="clearfix">
            <Upload
              action="http://hlsj.test.seastart.cn/admin/upload"
              listType="picture-card"
              fileList={uploadLiveImg}
              onPreview={handlePreviewImg}
              onChange={handleChangeImg}
              data={payload}
              headers={header}
            >
              {uploadLiveImg.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={handleCancelImg}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="分享图片"
        extra={<Tag color="blue">建议尺寸300px*240px</Tag>}
      >
        {getFieldDecorator('yyy', {
          rules: [{ required: true }],
        })(
          <div className="clearfix">
            <Upload
              action="http://hlsj.test.seastart.cn/admin/upload"
              listType="picture-card"
              fileList={shareImg}
              onPreview={handlePreviewImg}
              onChange={handleShareImg}
              data={payload}
              headers={header}
            >
              {shareImg.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={handleCancelImg}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        )}
      </Form.Item>
      {/* <FormItem {...formItemLayout} label="直播商品">
        <Select
          mode="multiple"
          labelInValue
          value={liveGoods}
          placeholder="Select users"
          notFoundContent={fetching ? <Spin size="small" /> : null}
          filterOption={false}
          onSearch={fetchUser}
          onChange={handleChangesShop}
          style={{ width: '100%' }}
        >
          {data.map(d => (
            <Option key={d.value} value={d.text}>
              {d.value}
            </Option>
          ))}
        </Select>
      </FormItem> */}
      {/* <FormItem {...formItemLayout} label="是否收费">
        {getFieldDecorator('is_free', {
          rules: [
            {
              required: true,
              message: '请输入是否收费',
            },
          ],
        })(
          <Select style={{ width: 200 }}>
            <Option value={1}>否</Option>
            <Option value={0}>是</Option>
          </Select>
        )}
      </FormItem>
      {liveForm.is_free === 0 ? (
        <Form.Item {...formItemLayout} label="费用">
          {getFieldDecorator('fee', {
            rules: [{ required: true, message: '请填写费用' }],
          })(<InputNumber step={0.01} precision={2} min={0.01} style={{ width: '200px' }} />)}
        </Form.Item>
      ) : null} */}
      <LiveGoodTable />
      <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
        <Button type="primary" htmlType="submit" onClick={onValidateForm}>
          提交
        </Button>
      </FormItem>
    </Form>
  );
});

@connect(({ live, goods, loading }) => ({
  live,
  goods,
  loading: loading.models.live,
}))
// @Form.create()
class AddLiveStep2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }
  state = {
    pagination: 1,
    previewVisible: false,
    previewImage: '',
    data: [],
    value: [],
    fetching: false,
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  componentDidMount() {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchVodDetail',
      payload: {
        vod_id: id,
        page: 1,
        goods_status: 0,
        page_number: 10,
      },
    });
  }

  // 模糊查询
  fetchUser = value => {
    console.log('fetching user', value);
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    request('/admin/goods/list', {
      method: 'POST',
      body: {
        goods_name: value,
        goods_status: 0,
      },
    }).then(body => {
      if (fetchId !== this.lastFetchId) {
        // for fetch callback order
        return;
      }
      console.log(body);
      const data = body.data.list.map(user => ({
        text: `${user.goods_id}`,
        value: user.goods_name,
      }));
      this.setState({ data, fetching: false });
    });
  };
  handleChangesShop = value => {
    this.setState({
      data: [],
      fetching: false,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'live/setLiveShop',
      payload: {
        value,
      },
    });
  };
  // 新增修改提交
  submitForm = () => {
    const { dispatch, live: { liveForm, uploadLiveImg, shareImg, liveGoods } } = this.props;
    if (!uploadLiveImg.length) {
      message.error('请上传封面');
      return;
    }
    if (!shareImg.length) {
      message.error('请上传分享图片');
      return;
    }
    const { pagination } = this.state;
    const arrId = [];
    const arrName = [];
    liveGoods.forEach(res => {
      arrId.push(res.goods_id);
      arrName.push(res.goods_name);
    });
    liveForm.goods_ids = arrId;
    liveForm.goods_names = arrName;
    liveForm.pagination = pagination;
    liveForm.cover = uploadLiveImg[0].url;
    liveForm.share_cover = shareImg[0].url;
    liveForm.vod_id = liveForm.id;
    dispatch({
      type: 'live/editVod',
      payload: liveForm,
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
      type: 'live/changeFormVal',
      payload: {
        obj,
      },
    });
  };
  // 放大图片
  handlePreviewImg = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  // 关闭放大图片
  handleCancelImg = () => this.setState({ previewVisible: false });
  // 上传图片
  handleChangeImg = data => {
    let { fileList } = data;
    fileList = fileList.map(item => {
      if (item.status === 'done' && item.uploaded !== 'done') {
        const img = {};
        img.status = 'done';
        img.uploaded = 'done';
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
      type: 'live/setLiveImg',
      payload: {
        fileList,
      },
    });
  };
  handleShareImg = data => {
    let { fileList } = data;
    fileList = fileList.map(item => {
      if (item.status === 'done' && item.uploaded !== 'done') {
        const img = {};
        img.status = 'done';
        img.uploaded = 'done';
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
      type: 'live/setShareImgs',
      payload: {
        fileList,
      },
    });
  };
  render() {
    const { live: { liveForm, uploadLiveImg, shareImg, liveGoods } } = this.props;
    const { header, previewVisible, previewImage, fetching, value, data } = this.state;
    return (
      <CustomizedForm
        liveForm={liveForm}
        shareImg={shareImg}
        onChange={this.changeFormVal}
        handlePreviewImg={this.handlePreviewImg}
        handleChangeImg={this.handleChangeImg}
        header={header}
        previewVisible={previewVisible}
        previewImage={previewImage}
        uploadLiveImg={uploadLiveImg}
        handleCancelImg={this.handleCancelImg}
        fetching={fetching}
        value={value}
        data={data}
        fetchUser={this.fetchUser}
        handleShareImg={this.handleShareImg}
        handleChangesShop={this.handleChangesShop}
        liveGoods={liveGoods}
        submitForm={this.submitForm}
      />
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['goods/addShop'],
  data: form.step,
}))(AddLiveStep2);
