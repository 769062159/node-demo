import React from 'react';
import { connect } from 'dva';
import copy from 'copy-to-clipboard';
import debounce from 'lodash/debounce';
import { Form, Button, Input, Select, Upload, Icon, Modal, Tag, message, Spin, InputNumber } from 'antd';
// import { Form, Button, Input, Upload, Icon, Modal, Tag, message, Select } from 'antd';
import request from '../../../utils/request';
import LiveGoodTable from '../../../components/LiveGoodTable';
// import styles from './style.less';

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
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
      play_type: Form.createFormField({
        value: props.liveForm.play_type,
      }),
      play_url: Form.createFormField({
        value: props.liveForm.play_url,
      }),
      xxx: Form.createFormField({
        value: props.liveForm.xxx,
      }),
      yyy: Form.createFormField({
        value: props.liveForm.yyy,
      }),
      vod_play_url: Form.createFormField({
        value: props.liveForm.vod_play_url,
      }),
      user_id: Form.createFormField({
        value: props.liveForm.user_id,
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
    // uploadLiveImg,
    handleShareImg,
    shareImg,
    handlePreviewImg,
    // handleChangeImg,
    header,
    previewVisible,
    previewImage,
    handleCancelImg,
    handleChangesVod,
    vod,
    fetching,
    homeVod,
    fetchVod,
    liveForm,
    uploadUrl,
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
      {/* <Form.Item
        {...formItemLayout}
        label="直播封面"
        extra={<Tag color="blue">建议尺寸750px*370px，大小不得大于1M</Tag>}
      >
        {getFieldDecorator('xxx', {
          rules: [{ required: true, message: '请填写直播封面' }],
        })(
          <div className="clearfix">
            <Upload
              action={uploadUrl}
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
      </Form.Item> */}
      <Form.Item
        {...formItemLayout}
        label="分享图片"
        extra={<Tag color="blue">建议尺寸300px*240px，大小不得大于1M</Tag>}
      >
        {getFieldDecorator('yyy', {
          rules: [{ required: true }],
        })(
          <div className="clearfix">
            <Upload
              action={uploadUrl}
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
      <FormItem {...formItemLayout} label="播放类别">
        {getFieldDecorator('play_type', {})(
          <Select style={{ width: 200 }}>
            {/* <Option value={1}>播放指定录播</Option> */}
            <Option value={2}>直播点播</Option>
            <Option value={3}>腾讯视频</Option>
          </Select>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="用户id">
        {getFieldDecorator('user_id', {
          rules: [
            {
              required: true,
              message: '请输入用户id',
            },
          ],
        })(
          <InputNumber />
        )}
      </FormItem>
      {liveForm.play_type === 1 ? (
        <FormItem {...formItemLayout} label="录播">
          <Select
            showSearch
            labelInValue
            value={homeVod}
            placeholder="输入录播名字搜索"
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={false}
            onSearch={fetchVod}
            onChange={handleChangesVod}
            style={{ width: '100%' }}
          >
            {vod.map(d => (
              <Option key={d.value} value={d.text}>
                {d.value}
              </Option>
            ))}
          </Select>
        </FormItem>
      ) : liveForm.play_type === 3 ? (
        <Form.Item
          {...formItemLayout}
          label="播放地址"
          extra={<Tag color="blue">目前只支持腾讯视频，一定要填写带有vid的视频地址</Tag>}
        >
          {getFieldDecorator('play_url', {})(<Input style={{ width: '400px' }} />)}
        </Form.Item>
      ) : liveForm.play_type === 2 ? (
        <Form.Item {...formItemLayout} label="播放地址">
          {getFieldDecorator('vod_play_url', {})(<Input style={{ width: '400px' }} />)}
        </Form.Item>
      ) : null}
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
    this.fetchVod = debounce(this.fetchVod, 800);
  }
  state = {
    pagination: 1,
    previewVisible: false,
    previewImage: '',
    vod: [],
    // value: [],
    fetching: false,
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchAddGoods',
      payload: {
        page: 1,
        goods_status: 0,
        page_number: 10,
      },
    });
  }

  // 模糊查询
  fetchVod = value => {
    console.log('fetching user', value);
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ vod: [], fetching: true });
    request('/merchant/vod/list', {
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
      const vod = body.data.models.map(user => ({
        text: `${user.id}`,
        value: user.title,
      }));
      this.setState({ vod, fetching: false });
    });
  };
  handleChangesVod = value => {
    this.setState({
      vod: [],
      fetching: false,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'live/setHomeVod',
      payload: {
        value,
      },
    });
  };
  // 新增修改提交
  submitForm = () => {
    const { dispatch, live: { liveForm, shareImg, liveGoods } } = this.props;
    // if (!uploadLiveImg.length) {
    //   message.error('请上传封面');
    //   return;
    // }
    if (!liveGoods.length) {
      message.error('请选择商品');
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
    // liveForm.cover = uploadLiveImg[0].url;
    liveForm.share_cover = shareImg[0].url;
    liveForm.cover = liveForm.share_cover;
    liveForm.live_id = liveForm.id;
    dispatch({
      type: 'live/addLive',
      payload: liveForm,
    });
    message.success('添加成功');
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
  copyBtn = val => {
    copy(val);
    message.success('成功复制到剪贴板');
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
    const {
      live: { liveForm, uploadLiveImg, shareImg, liveGoods, homeVod },
      uploadUrl,
    } = this.props;
    const { header, previewVisible, previewImage, fetching, vod } = this.state;
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
        vod={vod}
        homeVod={homeVod}
        fetchVod={this.fetchVod}
        handleShareImg={this.handleShareImg}
        handleChangesVod={this.handleChangesVod}
        liveGoods={liveGoods}
        submitForm={this.submitForm}
        uploadUrl={uploadUrl}
      />
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['goods/addShop'],
  data: form.step,
}))(AddLiveStep2);
