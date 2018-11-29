import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Upload,
  Tag,
  message,
  Form,
  Input,
  Icon,
  Button,
  InputNumber,
  Select,
  Modal,
  Pagination,
  Checkbox,
  Row,
  Col,
} from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less'
import { uploadJSSDK } from '../../utils/utils';
// import styles from './TableList.less';
// import request from '../../utils/request';
import Wangeditor from '../../components/Wangeditor';


const FormItem = Form.Item;
const Option = Select.Option;

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
const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    const { classForm: { keys } } = props;
    const data = {
      title: Form.createFormField({
        value: props.classForm.title,
      }),
      xxx: Form.createFormField({
        value: props.classForm.xxx,
      }),
      yyy: Form.createFormField({
        value: props.classForm.yyy,
      }),
      desc: Form.createFormField({
        value: props.classForm.desc,
      }),
      detail: Form.createFormField({
        value: props.classForm.detail,
      }),
      sort: Form.createFormField({
        value: props.classForm.sort,
      }),
    };
    keys.forEach(ele => {
      data[ele] = Form.createFormField({
        value: props.classForm[ele],
      })
    });
    return data;
  },
  // onValuesChange(_, values) {
  //   console.log(values);
  // },
})(props => {
  const { getFieldDecorator, validateFields } = props.form;
  const onValidateForm = e => {
    e.preventDefault();
    const { handleSubmit } = props;
    validateFields(err => {
      if (!err) {
        handleSubmit();
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
  const {
    uploadUrl,
    header,
    classForm,
    addClassList,
    uploadVideo,
    minusItem,
    upItem,
    downItem,
    setDescription,
    openVod,
  } = props;
  return (
    <Form autoComplete="OFF">
      <FormItem {...formItemLayout} label="课程标题">
        {getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: '请输入课程标题',
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem {...formItemLayout} label="简介">
        {getFieldDecorator('desc', {
          rules: [
            {
              required: true,
              message: '请输入简介',
            },
          ],
        })(<Input />)}
      </FormItem>
      <Row>
        <Col span={7} style={{ textAlign: "right", paddingRight: 8 }}>
          详情 :
        </Col>
        <Col span={15}>
          <Wangeditor
            header={header}
            setDescription={setDescription}
          />
        </Col>
      </Row>
      {/* <Form.Item label="描述" {...formItemLayout}>
        {getFieldDecorator('goods_description', {
          rules: [{ required: true, message: '请填写描述' }],
        })(
          <Wangeditor
            header={header}
            setDescription={setDescription}
          />
        )}
      </Form.Item> */}
      <Form.Item
        {...formItemLayout}
        label="课程封面"
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
          rules: [{ required: true, message: '请填写课程封面' }],
        })(
          <Upload
            action={uploadUrl}
            beforeUpload={beforeUpload}
            listType="picture-card"
            // onPreview={handlePreviewImg}
            data={payload}
            headers={header}
          >
            {classForm.xxx.length ? null : uploadButton}
          </Upload>
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="分享图片"
        extra={<Tag color="blue">建议尺寸300px*240px，大小不得大于1M</Tag>}
      >
        {getFieldDecorator('yyy', {
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
          rules: [{ required: true, message: '请填写分享图片' }],
        })(
          <Upload
            action={uploadUrl}
            beforeUpload={beforeUpload}
            listType="picture-card"
            // onPreview={handlePreviewImg}
            data={payload}
            headers={header}
          >
            {classForm.yyy.length ? null : uploadButton}
          </Upload>
        )}
      </Form.Item>
      {
        classForm.list.map((res, index) => {
          return (
            <Fragment key={index}>
              <FormItem {...formItemLayout} label="课程价格">
                {getFieldDecorator(`price${index}`, {
                  rules: [
                    {
                      required: true,
                      message: '请输入课程价格',
                    },
                  ],
                })(<InputNumber />)}
                <Icon onClick={upItem.bind(this, index)} style={{marginRight: 15}} type="caret-up" />
                <Icon className="dynamic-delete-button" style={{marginRight: 15}} onClick={downItem.bind(this, index, classForm.list.length)} type="caret-down" />
                {classForm.list.length > 1 ? (
                  <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    disabled={classForm.list.length === 1}
                    onClick={minusItem.bind(this, index)}
                  />
                ) : null}
              </FormItem>
              <FormItem {...formItemLayout} label="播放类型">
                {getFieldDecorator(`vtype${index}`, {
                  rules: [
                    {
                      required: true,
                      message: '请输入播放类型',
                    },
                  ],
                })(
                  <Select>
                    <Option key={0} value={0}>
                      直播点播
                    </Option>
                    <Option key={1} value={1}>
                      腾讯视频
                    </Option>
                  </Select>
                )}
              </FormItem>
              {/* {
                (() => {
                  console.log(classForm[`type${index}`]);
                  switch (classForm[`type${index}`]) {
                    case 1:
                      return (
                        <Form.Item {...formItemLayout} label="播放地址">
                          {getFieldDecorator(`zz${index}`, {rules: [{ required: false, message: '请上传视频' }]})(
                            <div className={styles.fileBox}>
                              <input type="file" className={styles.fileBtn} onChange={uploadVideo.bind(this, index)} />
                              <div className={styles.add}>+</div>
                              {
                                classForm[`zz${index}`] ? (
                                  <video className={styles.videoItem} src={classForm[`zz${index}`]} controls><track kind="captions" /></video>
                                ) : null
                              }
                            </div>
                          )}
                        </Form.Item>
                      );
                    case 0:
                      return (
                        <Form.Item {...formItemLayout} label="选择录播">
                          {getFieldDecorator(`zz${index}`, {})(
                            <Button type="primary" onClick={openVod}>录播视频</Button>
                          )}
                        </Form.Item>
                      );
                    default:
                      break;
                  }
                })
              } */}
              {
                classForm[`vtype${index}`] === 0 ? (
                  <FormItem {...formItemLayout} label="播放地址" extra={<Tag color="blue">亲，您可以填写视频地址，或选择录播视频，或上传视频</Tag>}>
                    {getFieldDecorator(`vodTitle${index}`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入播放地址',
                        },
                      ],
                    })(<Input />)}
                    <div className={styles.fileBoxs} onClick={openVod.bind(this, index)}>
                      录播视频
                    </div>
                    <div className={styles.fileBoxs}>
                      <input type="file" className={styles.fileBtns} onChange={uploadVideo.bind(this, index)} />
                      上传视频
                    </div>
                  </FormItem>
                ) : (
                  <FormItem {...formItemLayout} label="播放地址" extra={<Tag color="blue">目前只支持腾讯视频，一定要填写带有vid的视频地址</Tag>}>
                    {getFieldDecorator(`url${index}`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入播放地址',
                        },
                      ],
                    })(<Input />)}
                  </FormItem>
                )
              }
            </Fragment>
          )
        })
      }
      <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
        <Button  onClick={addClassList}>
          添加课程列表
        </Button>
      </FormItem>
      <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
        <Button type="primary" onClick={onValidateForm}>
          提交
        </Button>
      </FormItem>
    </Form>
  );
});

@connect(({ classModel, live, user, loading }) => ({
  classModel,
  live,
  user,
  loading: loading.models.classModel,
}))
@Form.create()
export default class ClassAdd extends PureComponent {
  // constructor(props, context) {
  //   super(props, context);
  //   this.state = {
  //     editorContent: '',
  //     header: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   }
  //   this.editorElem = React.createRef();
  // }
  state = {
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    isVodModal: false,
    isVideoModal: false,
    index: 0,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchToken',
    });
  }
  // 添加描述
  setDescription = (e) => {
    const obj = {};
    obj.details = {
      value: e,
    };
    this.changeFormVal(obj);
  }
  handleSubmit = () => {
    const { classModel: { classForm: { title, xxx, list, yyy, desc, details, detail } } } = this.props;
    const { dispatch } = this.props;
    if (!details&&!detail) {
      message.error('请输入描述');
      return false;
    }
    if (!list.length) {
      message.error('请添加课程内容');
      return false;
    }
    const data = {
      desc,
      detail: details || detail,
      title,
      cover: xxx[0].response.data,
      share_cover: yyy[0].response.data,
      episodes: [],
    };
    list.forEach(res => {
      if (res.vtype) {
        res.type = 3;
      }
      if (res.type === 1) {
        res.http_url = res.vodTitle;
      } else if (res.type === 0) {
        res.vod_id = res.vod_id;
        res.vod_title = res.vodTitle;
      } else if (res.type === 2) {
        res.http_url = res.vodTitle;
      } else {
        res.http_url = res.url;
      }
      data.episodes.push(res);
    })
    dispatch({
      type: 'classModel/addClass',
      payload: {
        data,
      },
      callback: () => {
        message.success('添加成功！');
        const { dispatch } = this.props;
        const url = `/community/class-list`;
        dispatch(routerRedux.push(url));
      },
    });
  }
  // 修改表单值
  changeFormVal = val => {
    const { dispatch } = this.props;
    const obj = {};
    for (const key of Object.keys(val)) {
      obj[key] = val[key].value;
    }
    dispatch({
      type: 'classModel/changeFormVal',
      payload: {
        obj,
      },
    });
  };
  // 打开Video
  openVideo = (index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchVideo',
      payload: {
        pagination: 1,
        not_tencent_url: 1,
      },
    });
    this.setState({
      index,
    })
    this.openOrCloseVideo();
  }
  // video
  openOrCloseVideo = () => {
    const { isVideoModal } = this.state;
    this.setState({
      isVideoModal: !isVideoModal,
    })
  }
  // 向上
  upItem = (index) => {
    if (index === 0) {
      message.error('已是最前项');
      return false;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'classModel/moveItem',
      payload: {
        type: 1,
        index,
      },
    });
  }
  // 向下
  downItem = (index, length) => {
    if (index === length -1) {
      message.error('已是最后项');
      return false;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'classModel/moveItem',
      payload: {
        type: 0,
        index,
      },
    });
  }
  openVod = (index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchVod',
      payload: {
        pagination: 1,
        'per-page': 18,
      },
    });
    this.setState({
      index,
    })
    this.openOrCloseVod();
  }
  // 跳页vod
  changeVodPage = (pagination) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchVod',
      payload: {
        pagination,
        'per-page': 18,
      },
    });
  }
  // 添加课程列表
  addClassList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'classModel/addClassList',
    });
  }
  minusItem = (index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'classModel/removeForm',
      payload: {
        index,
      },
    });
  }
  uploadVideo = (index, e) => {
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
                type: 'classModel/setVodurl',
                payload: {
                  index,
                  url,
                  type: 1,
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
  // 跳页vod
  changeVodPage = (pagination) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchVod',
      payload: {
        pagination,
        'per-page': 18,
      },
    });
  }
  // 跳页 video
  changeVideoPage = (pagination) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchVideo',
      payload: {
        pagination,
        not_tencent_url: 1,
      },
    });
  }
  // 录播modal
  openOrCloseVod = () => {
    const { isVodModal } = this.state;
    this.setState({
      isVodModal: !isVodModal,
    })
  }
  changeSwitch = (id, title) => {
    const { index } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'classModel/setVodId',
      payload: {
        index,
        id,
        title,
        type: 0,
      },
    });
    this.openOrCloseVod();
  }
  changeSwitchs = (res) => {
    const { index } = this.state;
    const { dispatch } = this.props;
    const { id, type, vod_url: vod, play_url: play } = res;
    let title = '';
    if (type === 1) {
      title = vod;
    } else {
      title = play;
    }
    dispatch({
      type: 'classModel/setVideoId',
      payload: {
        index,
        id,
        title,
        type: 1,
      },
    });
    this.openOrCloseVideo();
  }
  
  // 放大图片
  // handlePreviewImg = file => {
  //   this.setState({
  //     previewImage: file.url || file.thumbUrl,
  //     previewVisible: true,
  //   });
  // };
  // 关闭放大图片
  // handleCancelImg = () => this.setState({ previewVisible: false });
  // 上传图片
  // handleChangeImg = data => {
  //   if (!data.file.status) {
  //     return;
  //   }
  //   let { fileList } = data;
  //   fileList = fileList.map(item => {
  //     if (item.status === 'done' && item.uploaded !== 'done') {
  //       const img = {};
  //       img.status = 'done';
  //       img.uploaded = 'done';
  //       img.response = { status: 'success' };
  //       img.name = item.name;
  //       img.uid = item.uid;
  //       img.url = item.response.data;
  //       return img;
  //     }
  //     return item;
  //   });
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'live/setLiveImg',
  //     payload: {
  //       fileList,
  //     },
  //   });
  // };
  render() {
    const {  classModel: { classForm }, uploadUrl, live: { vodListPage, vodList, videoListPage, videoList } } = this.props;
    const { header, isVodModal, isVideoModal } = this.state;
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
            {/* <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />} onChange={this.changeSwitch.bind(this, res.id, 0)} defaultChecked={res.is_bind} /> */}
            <Checkbox onChange={this.changeSwitch.bind(this, res.id, res.title)} />
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
            {/* <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />} onChange={this.changeSwitch.bind(this, res.id, 1)} defaultChecked={res.is_bind} /> */}
            <Checkbox onChange={this.changeSwitchs.bind(this, res)} />
          </div>
        </div>
      )
    });

    return (
      <PageHeaderLayout>
        <Modal
          title="录播视频"
          width={760}
          visible={isVodModal}
          footer=""
          onCancel={this.openOrCloseVod}
          destroyOnClose="true"
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
          destroyOnClose="true"
        >
          <div className={styles.modalBox}>
            {videoListItem}
          </div>
          <Pagination pageSize={18} current={videoListPage.current || 1} total={videoListPage.total} onChange={this.changeVideoPage} />
        </Modal>
        <CustomizedForm uploadVideo={this.uploadVideo} openVod={this.openVod} setDescription={this.setDescription} downItem={this.downItem} upItem={this.upItem} minusItem={this.minusItem} handleSubmit={this.handleSubmit} addClassList={this.addClassList} header={header} classForm={classForm} uploadUrl={uploadUrl} onChange={this.changeFormVal} />
      </PageHeaderLayout>
    );
  }
}
