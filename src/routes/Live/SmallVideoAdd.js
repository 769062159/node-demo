import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  message,
  Form,
  Input,
  Button,
  Progress,
  // Modal,
  // Table,
} from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less'
import { uploadJSSDK2 as uploadJSSDK } from '../../utils/utils';
// import styles from './TableList.less';
// import request from '../../utils/request';


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
const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    const data = {
      title: Form.createFormField({
        value: props.smallVideoForm.title,
      }),
      zz: Form.createFormField({
        value: props.smallVideoForm.zz,
      }),
      user_id: Form.createFormField({
        value: props.smallVideoForm.user_id,
      }),
    };
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
  const {
    smallVideoForm,
    uploadVideo,
  } = props;
  return (
    <Form autoComplete="OFF">
      <FormItem {...formItemLayout} label="视频标题">
        {getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: '请输入视频标题',
            },
          ],
        })(<Input />)}
      </FormItem>
      <Form.Item {...formItemLayout} label="上传视频">
        {getFieldDecorator(`zz`, {rules: [{ required: true, message: '请上传视频' }]})(
          <div className={styles.fileBox}>
            <input type="file" className={styles.fileBtn} onChange={uploadVideo} />
            <div className={styles.add}>+</div>
            {
              smallVideoForm.zz ? (
                <video className={styles.videoItem} src={smallVideoForm.zz} controls><track kind="captions" /></video>
              ) : null
            }
          </div>
        )}
      </Form.Item>
      <FormItem {...formItemLayout} label="用户id">
        {getFieldDecorator('user_id', {
          rules: [
            {
              required: true,
              message: '请输入用户id',
            },
          ],
        })(<Input />)}
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
    isLoading: false,
    loadingPercent: 0,
    // header: {
    //   Authorization: `Bearer ${localStorage.getItem('token')}`,
    // },
    isLiveModal: false,
    index: 0,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchToken',
    });
  }
  handleSubmit = () => {
    const { live: { smallVideoForm } } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/addSmallVideo',
      payload: {
        smallVideoForm,
      },
      callback: () => {
        message.success('添加成功！');
        const { dispatch } = this.props;
        const url = `/live/small-video`;
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
      type: 'live/changeVideoFormVal',
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
  uploadVideo = (e) => {
    const files = e.target.files;
    if (files[0].type !== 'video/mp4') {
      message.error('请上传mp4格式文件');
      return false;
    }
    const { live: { token }, user: { currentUser } } = this.props;
    const size = files[0].size;
    const randomNum = new Date().getTime() + parseInt(Math.random() * 100, 10);
    const name = `${randomNum}.mp4`;
    this.setState({
      isLoading: true,
    });
    // 上传
    for(let i=0;i<files.length;i++){
      uploadJSSDK({
          file: files[i],   // 文件，必填,html5 file类型，不需要读数据流，
          name, // 文件名称，选填，默认为文件名称
          token,  // token，必填
          dir: `videos/${currentUser.id}`,  // 目录，选填，默认根目录''
          maxSize: 1024 * 1024 * 1024,  // 上传大小限制，选填，默认0没有限制
          callback: (percent, result) => {
            if (percent > 0) {
              this.setState({
                loadingPercent: percent,
              });
            }
            if (percent === -1) {
              this.setState({
                isLoading: false,
                loadingPercent: 0,
              });
              
              message.error(`${result.responseText}`);
            }
            if (percent === 100 && result) {
              this.setState({
                isLoading: false,
                loadingPercent: 0,
              });
              message.success(`上传成功！`);
              const { url } = result;
              const videoDom = document.getElementById('video');
              videoDom.src = url;
              videoDom.addEventListener("loadedmetadata", () => {
                const data = {
                  size,
                  zz: url,
                  width: videoDom.videoWidth,
                  height: videoDom.videoHeight,
                  dir: `videos/${currentUser.id}`,
                  file_name: `${randomNum}.mp4`,
                  extension: 'mp4',
                };
                const { dispatch } = this.props;
                dispatch({
                  type: 'live/setSmallVideo',
                  payload: {
                    data,
                  },
                });
              });
              // const { dispatch } = this.props;
              // dispatch({
              //   type: 'classModel/setVodurl',
              //   payload: {
              //     index,
              //     url,
              //     type: 1,
              //   },
              // });
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
    const { isLiveModal } = this.state;
    this.setState({
      isLiveModal: !isLiveModal,
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
  
  render() {
    const {  live: { smallVideoForm } } = this.props;
    const { isLoading, loadingPercent } = this.state;
    return (
      <PageHeaderLayout>
        <video id="video" controls style={{ display: 'none' }} >
          <track kind="captions" />
        </video>
        <CustomizedForm uploadVideo={this.uploadVideo} handleSubmit={this.handleSubmit} smallVideoForm={smallVideoForm} onChange={this.changeFormVal} />
        {
          isLoading ? (
            <div className={styles.loadingModal}>
              <Progress percent={loadingPercent} status="active" />
            </div>
          ) : null
        }
      </PageHeaderLayout>
    );
  }
}
