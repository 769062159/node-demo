import React from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
// import { Form, Button, Input, Select, Upload, Icon, Modal, Tag, message, InputNumber } from 'antd';
import { Form, Button, Input, Upload, Icon, Modal, Tag, message, Select } from 'antd';
import request from '../../../utils/request';
import { uploadJSSDK } from '../../../utils/utils';
import styles from './style.less'
// import { router } from 'sw-toolbox';
// import LiveGoodTable from '../../../components/LiveGoodTable';

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
      play_url: Form.createFormField({
        value: props.liveForm.play_url,
      }),
      type: Form.createFormField({
        value: props.liveForm.type,
      }),
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
      tencent_url: Form.createFormField({
        value: props.liveForm.tencent_url,
      }),
    };
    return arr;
  },
  // onValuesChange(_, values) {
  // },
})(props => {
  //  111
  const { getFieldDecorator, validateFields } = props.form;
  const onValidateForm = e => {
    e.preventDefault();
    const { submitForm } = props;
    validateFields((err) => {
      if (!err) {
        submitForm();
      } else {
        message.error('请填写信息');
      }
    });
  };
  const {
    uploadUrl,
    // uploadLiveImg,
    handleShareImg,
    shareImg,
    handlePreviewImg,
    // handleChangeImg,
    header,
    previewVisible,
    previewImage,
    handleCancelImg,
    uploadVideo,
    liveForm,
  } = props;
  // const headers = {
  //   token,
  // }

  // 上传按钮
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">主体图片</div>
    </div>
  );
  //  限制大小
  const beforeUpload = (file) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('图片不能超过1M!');
    }
    return isLt1M;
  }
  // 上传图片参数
  const payload = {
    type: 2,
  };
  return (
    <Form autoComplete="OFF">
      <FormItem {...formItemLayout} label="录播标题">
        {getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: '请输入标题',
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem {...formItemLayout} label="录播简介">
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
        label="录播封面"
        extra={<Tag color="blue">建议尺寸300px*240px，大小不得大于1M</Tag>}
      >
        {getFieldDecorator('yyy', {
          rules: [{ required: true }],
        })(
          <div className="clearfix">
            <Upload
              action={uploadUrl}
              listType="picture-card"
              beforeUpload={beforeUpload}
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
      <FormItem {...formItemLayout} label="录播类型">
        {getFieldDecorator('type', {
          rules: [
            {
              required: true,
              message: '请输入录播类型',
            },
          ],
        })(
          <Select>
            <Option value={1}>上传视频</Option>
            <Option value={2}>外部链接</Option>
            <Option value={3}>腾讯视频</Option>
          </Select>
        )}
      </FormItem>
      {
        (() => {
          switch (liveForm.type) {
            case 2:
              return (
                <Form.Item {...formItemLayout} label="播放地址">
                  {getFieldDecorator('play_url', {rules: [{ required: true, message: '请填写播放地址' }]})(<Input style={{ width: '400px' }} />)}
                </Form.Item>
              );
            case 1:
              return (
                <Form.Item {...formItemLayout} label="播放地址">
                  {getFieldDecorator('zz', {rules: [{ required: false, message: '请上传视频' }]})(
                    <div className={styles.fileBox}>
                      <input type="file" className={styles.fileBtn} onChange={uploadVideo} />
                      <div className={styles.add}>+</div>
                      {
                        liveForm.zz ? (
                          <video className={styles.videoItem} src={liveForm.zz} controls><track kind="captions" /></video>
                        ) : null
                      }
                    </div>
                  )}
                </Form.Item>
              );
            case 3:
              return (
                <Form.Item {...formItemLayout} label="播放地址">
                  {getFieldDecorator('tencent_url', {rules: [{ required: true, message: '请填写腾讯地址' }]})(<Input style={{ width: '400px' }} />)}
                </Form.Item>
              );
            default:
              break;
          }
        })()
      }
      {/* {
        liveForm.type === 2 ? (
          <Form.Item {...formItemLayout} label="播放地址">
            {getFieldDecorator('play_url', {})(<Input style={{ width: '400px' }} />)}
          </Form.Item>
        ) : (
          <Form.Item {...formItemLayout} label="播放地址">
            {getFieldDecorator('zz', {})(
              <div className={styles.fileBox}>
                <input type="file" className={styles.fileBtn} onChange={uploadVideo} />
                <div className={styles.add}>+</div>
                {
                  liveForm.zz ? (
                    <video className={styles.videoItem} src={liveForm.zz} controls><track kind="captions" /></video>
                  ) : null
                }
              </div>
            )}
          </Form.Item>
        )
      } */}
      <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
        <Button type="primary" htmlType="submit" onClick={onValidateForm}>
          提交
        </Button>
      </FormItem>
    </Form>
  );
});

@connect(({ live, goods, loading, user }) => ({
  live,
  goods,
  user,
  loading: loading.models.live,
}))
// @Form.create()
class EditVodStep2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }
  state = {
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
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchToken',
    });
  }

  // 模糊查询
  fetchUser = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    request('/merchant/goods/list', {
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
    const { dispatch, live: { liveForm, shareImg } } = this.props;
    if (liveForm.type === 1 && !liveForm.vod_url) {
      message.error('请上传视频');
      return false;
    }
    // if (!uploadLiveImg.length) {
    //   message.error('请上传封面');
    //   return;
    // }
    if (!shareImg.length) {
      message.error('请上传分享图片');
      return;
    }
    // const arrId = [];
    // const arrName = [];
    // liveGoods.forEach(res => {
    //   arrId.push(res.goods_id);
    //   arrName.push(res.goods_name);
    // });
    // liveForm.goods_ids = arrId;
    // liveForm.goods_names = arrName;
    // liveForm.cover = uploadLiveImg[0].url;
    liveForm.share_cover = shareImg[0].url;
    liveForm.cover = shareImg[0].url;
    // liveForm.vod_id = liveForm.id;
    dispatch({
      type: 'live/addVod',
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
  uploadVideo = (e) => {
    const { live: { token }, user: { currentUser } } = this.props;
    const files = e.target.files;
    const name = `${new Date().getTime()}.mp4`;
    // 上传
    for(let i=0;i<files.length;i++){
      uploadJSSDK({
          file: files[i],   // 文件，必填,html5 file类型，不需要读数据流，
          name, // 文件名称，选填，默认为文件名称
          token,  // token，必填
          dir: `vods/${currentUser.id}`,  // 目录，选填，默认根目录''
          maxSize: 1024 * 1024 * 1024,  // 上传大小限制，选填，默认0没有限制
          callback: (percent, result) => {
            if (percent === 100 && result) {
              message.success(`上传成功！`);
              const { url } = result;
              const { dispatch } = this.props;
              dispatch({
                type: 'live/setVodurl',
                payload: {
                  url,
                },
              });
            } else if (percent > 0) {
              message.success(`已上传${percent}%`);
            } else {
              message.error(`${result}`);
            }
          },
        });
    }
  }
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
    if (!data.file.status) {
      return;
    }
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
    if (!data.file.status) {
      return;
    }
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
    const { live: { liveForm, uploadLiveImg, shareImg, liveGoods }, uploadUrl } = this.props;
    const { header, previewVisible, previewImage, fetching, value, data } = this.state;
    return (
      <CustomizedForm
        uploadUrl={uploadUrl}
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
        uploadVideo={this.uploadVideo}
      />
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['goods/addShop'],
  data: form.step,
}))(EditVodStep2);
