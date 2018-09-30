import React from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { Form, Button, Input, Select, Upload, Icon, Modal, Tag, message, Spin, Switch, Pagination, InputNumber } from 'antd';
// import { Form, Button, Input, Upload, Icon, Modal, Tag, message } from 'antd';
import request from '../../../utils/request';
import LiveGoodTable from '../../../components/LiveGoodTable';
import styles from './style.less';

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
        value: props.liveForm.play_type || '',
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
  // onValuesChange(_, values) {
  //   console.log(values);
  // },
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
    liveForm,
    fetching,
    homeVod,
    fetchVod,
    vod,
    handleChangesVod,
    uploadUrl,
    openVod,
    openVideo,
  } = props;
  // console.log(homeVod);

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
              beforeUpload={beforeUpload}
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
      <Form.Item
        {...formItemLayout}
        label="录播列表"
      >
        {getFieldDecorator('xa', {})(<Button type="primary" onClick={openVod}>录播视频</Button>)}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="上传视频列表"
      >
        {getFieldDecorator('xy', {})(<Button type="primary" onClick={openVideo}>上传视频</Button>)}
      </Form.Item>
      <FormItem {...formItemLayout} label="播放类别">
        {getFieldDecorator('play_type', {})(
          <Select style={{ width: 200 }}>
            <Option value={2}>直播点播</Option>
            <Option value={3}>腾讯视频</Option>
          </Select>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="主播id">
        {getFieldDecorator('user_id', {
          rules: [
            {
              required: true,
              message: '请输入主播id',
            },
          ],
        })(
          <InputNumber />
        )}
      </FormItem>
      {liveForm.play_type === 1 ? (
        <FormItem {...formItemLayout} label="录播">
          <Select
            // mode="multiple"
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
class EditLiveStep2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchVod = debounce(this.fetchVod, 800);
  }
  state = {
    isVideoModal: false,
    isVodModal: false,
    previewVisible: false,
    previewImage: '',
    vod: [],
    fetching: false,
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  componentDidMount() {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchLiveDetail',
      payload: {
        live_id: id,
        page: 1,
        goods_status: 0,
        page_number: 10,
      },
    });
  }

  // 模糊查询
  fetchVod = value => {
    const { live: { liveForm } } = this.props;
    const liveId = liveForm.stv_live_id;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ vod: [], fetching: true });
    request('/merchant/vod/list', {
      method: 'POST',
      body: {
        title: value,
        live_id: liveId,
      },
    }).then(body => {
      if (fetchId !== this.lastFetchId) {
        // for fetch callback order
        return;
      }
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
    const {
      dispatch,
      live: { liveForm, shareImg, liveGoods, homeVod },
    } = this.props;
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
    if (liveForm.play_type === 1) {
      liveForm.vod_id = homeVod.key;
      liveForm.remark = homeVod.label;
      liveForm.play_url = '';
    }
    const arrId = [];
    const arrName = [];
    liveGoods.forEach(res => {
      arrId.push(res.goods_id);
      arrName.push(res.goods_name);
    });
    liveForm.goods_ids = arrId;
    liveForm.goods_names = arrName;
    // liveForm.cover = uploadLiveImg[0].url;
    liveForm.share_cover = shareImg[0].url;
    liveForm.cover = liveForm.share_cover;
    liveForm.live_id = liveForm.id;
    dispatch({
      type: 'live/editLive',
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
  // 跳页vod
  changeVodPage = (pagination) => {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchCheckVod',
      payload: {
        liveid: id,
        pagination,
      },
    });
  }
  // 跳页 video
  changeVideoPage = (pagination) => {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchCheckVideo',
      payload: {
        liveid: id,
        pagination,
      },
    });
  }
  // 打开Vod
  openVod = () => {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchCheckVod',
      payload: {
        liveid: id,
      },
    });
    this.openOrCloseVod();
  }
  // 打开Video
  openVideo = () => {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchCheckVideo',
      payload: {
        liveid: id,
      },
    });
    this.openOrCloseVideo();
  }
  // 录播modal
  openOrCloseVod = () => {
    const { isVodModal } = this.state;
    this.setState({
      isVodModal: !isVodModal,
    })
  }
  // video
  openOrCloseVideo = () => {
    const { isVideoModal } = this.state;
    this.setState({
      isVideoModal: !isVideoModal,
    })
  }
  // 关闭Vod
  // handleCancelVod = () => {
  //   console.log('取消')
  // }
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
  changeSwitch = (id, type,checked) => {
    const { id: liveId } = this.props.match.params;
    const operation = checked ? 1 : 0;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/checkSwitch',
      payload: {
        type,
        operation,
        id,
        live_id: liveId,
      },
      callback: () => {
        message.success('设置成功!');
      },
    });
  }
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
    const {
      live: { liveForm, uploadLiveImg, shareImg, liveGoods, homeVod, vodList, vodListPage, videoList, videoListPage },
      uploadUrl,
    } = this.props;
    console.log(11);
    console.log(videoList);
    const vodListItem = [];
    const videoListItem = [];
    vodList.forEach(res => {
      vodListItem.push(
        <div className={styles.listItem} key={res.id}>
          <img src={res.cover} alt="图片" />
          <div className={styles.word}>
            {res.title}
          </div>
          <div className={styles.switch}>
            <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />} onChange={this.changeSwitch.bind(this, res.id, 0)} defaultChecked={res.is_bind} />
          </div>
        </div>
      )
    });
    videoList.forEach(res => {
      videoListItem.push(
        <div className={styles.listItem} key={res.id}>
          <img src={res.cover} alt="图片" />
          <div className={styles.word}>
            {res.title}
          </div>
          <div className={styles.switch}>
            <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />} onChange={this.changeSwitch.bind(this, res.id, 1)} defaultChecked={res.is_bind} />
          </div>
        </div>
      )
    });
    const { header, previewVisible, previewImage, fetching, vod, isVodModal, isVideoModal } = this.state;
    return (
      <div>
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
          handleChangesVod={this.handleChangesVod}
          fetchVod={this.fetchVod}
          handleShareImg={this.handleShareImg}
          liveGoods={liveGoods}
          submitForm={this.submitForm}
          openVod={this.openVod}
          openVideo={this.openVideo}
          uploadUrl={uploadUrl}
        />
        <Modal
          title="录播视频"
          width={760}
          visible={isVodModal}
          footer=""
          onCancel={this.openOrCloseVod}
        >
          <div className={styles.modalBox}>
            {vodListItem}
          </div>
          <Pagination pageSize={18} current={vodListPage.current || 1} total={vodListPage.total} onChange={this.changeVodPage} />
        </Modal>
        <Modal
          title="上传视频"
          width={760}
          visible={isVideoModal}
          footer=""
          onCancel={this.openOrCloseVideo}
        >
          <div className={styles.modalBox}>
            {videoListItem}
          </div>
          <Pagination pageSize={18} current={videoListPage.current || 1} total={videoListPage.total} onChange={this.changeVideoPage} />
        </Modal>
      </div>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['goods/addShop'],
  data: form.step,
}))(EditLiveStep2);
