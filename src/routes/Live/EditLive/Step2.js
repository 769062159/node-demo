import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Select, Upload, Icon, Modal, Tag, message, Table, InputNumber, Row, Col, Pagination, Checkbox } from 'antd';
// import { Form, Button, Input, Upload, Icon, Modal, Tag, message } from 'antd';
// import LiveGoodTable from '../../../components/LiveGoodTable';
import Wangeditor from '../../../components/Wangeditor';
import { uploadJSSDK } from '../../../utils/utils';
import { env } from '../../../utils/config';
// import LiveGoodTable from '../../../components/LiveGoodTable';
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
      access_type: Form.createFormField({
        value: props.liveForm.access_type,
      }),
      mobile: Form.createFormField({
        value: props.liveForm.mobile,
      }),
      user_level: Form.createFormField({
        value: props.liveForm.user_level,
      }),
      money: Form.createFormField({
        value: props.liveForm.money,
      }),
      password: Form.createFormField({
        value: props.liveForm.password,
      }),
      play_type: Form.createFormField({
        value: props.liveForm.play_type || '',
      }),
      play_url: Form.createFormField({
        value: props.liveForm.play_url,
      }),
      announcement: Form.createFormField({
        value: props.liveForm.announcement,
      }),
      xxx: Form.createFormField({
        value: props.liveForm.xxx,
      }),
      all_prohibit: Form.createFormField({
        value: props.liveForm.all_prohibit,
      }),
      default_page: Form.createFormField({
        value: props.liveForm.default_page,
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
      } else {
        message.error('请填写信息');
      }
    });
  };
  const {
    userRankList,
    openVod,
    openUpload,
    openClassList,
    openGoodList,
    openSmallVideoList,
    setDescription,
    header,
    liveForm,
    uploadUrl,
  } = props;
  const rankItem = [];
  userRankList.forEach(res => {
    rankItem.push(
      <Option key={res.id} value={res.id}>
        {res.name}
      </Option>
    );
  });
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
      <FormItem {...formItemLayout} label="主播id">
        {getFieldDecorator('user_id', {
          rules: [
            {
              required: true,
              message: '请输入主播id',
            },
          ],
        })(
          <InputNumber style={{ width: 200 }} />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="社群标题">
        {getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: '请输入标题',
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem {...formItemLayout} label="社群简介">
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
            {liveForm.yyy && liveForm.yyy.length ? null : uploadButton}
          </Upload>
        )}
      </Form.Item>
      <FormItem {...formItemLayout} label="社群公告">
        {getFieldDecorator('announcement', {
        })(<TextArea placeholder="请输入社群公告" autosize />)}
      </FormItem>
      <Row>
        <Col span={7} style={{ textAlign: "right", paddingRight: 8 }}>
          详情 :
        </Col>
        <Col span={15}>
          <Wangeditor
            detail={liveForm.live_detail}
            header={header}
            setDescription={setDescription}
          />
        </Col>
      </Row>
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
      <FormItem {...formItemLayout} label="进群权限">
        {getFieldDecorator('access_type', {
          rules: [
            {
              required: true,
              message: '请输入进群权限',
            },
          ],
        })(
          <Select style={{ width: 200 }}>
            <Option value={3}>密码</Option>
            <Option value={2}>会员</Option>
            <Option value={1}>付费</Option>
            <Option value={0}>免费</Option>
          </Select>
        )}
      </FormItem>
      {
        (() => {
          switch (liveForm.access_type) {
            case 1:
              return (
                <Form.Item {...formItemLayout} label="价格">
                  {getFieldDecorator('money', {
                    rules: [{ required: true, message: '请填写价格' }],
                  })(<InputNumber step={0.01} precision={2} min={0.01} style={{ width: '200px' }} />)}
                </Form.Item>
              )
            case 2:
              return (
                <Form.Item {...formItemLayout} label="用户等级">
                  {getFieldDecorator('user_level', {
                    rules: [{ required: true, message: '请填写用户等级' }],
                  })(
                    <Select style={{ width: '200px' }}>
                      {rankItem}
                    </Select>
                  )}
                </Form.Item>
              )
            case 3:
              return (
                <Form.Item {...formItemLayout} label="密码">
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请填写密码' }],
                  })(<Input style={{ width: '200px' }} />)}
                </Form.Item>
              )
            default:
              break;
          }
        })()
      }
      <FormItem {...formItemLayout} label="客服电话">
        {getFieldDecorator('mobile', {
          rules: [
            {
              required: true,
              message: '请输入客服电话',
            },
          ],
        })(
          <InputNumber />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="全场禁言">
        {getFieldDecorator('all_prohibit', {
          rules: [
            {
              required: true,
              message: '请输入全场禁言',
            },
          ],
        })(
          <Select style={{ width: 200 }}>
            <Option value={1}>是</Option>
            <Option value={0}>否</Option>
          </Select>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="默认首开">
        {getFieldDecorator('default_page', {
          rules: [
            {
              required: true,
              message: '请输入默认首开',
            },
          ],
        })(
          <Select style={{ width: 200 }}>
            <Option value={5}>视频</Option>
            <Option value={4}>课程</Option>
            <Option value={3}>详情</Option>
            <Option value={2}>综合</Option>
            <Option value={1}>直播</Option>
            <Option value={0}>社群</Option>
          </Select>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="播放类型">
        {getFieldDecorator('play_type', {})(
          <Select style={{ width: 200 }}>
            <Option value={2}>直播点播</Option>
            <Option value={3}>腾讯视频</Option>
          </Select>
        )}
      </FormItem>
      {liveForm.play_type === 1 ? (
        null
      ) : liveForm.play_type === 3 ? (
        <Form.Item
          {...formItemLayout}
          label="播放地址"
          extra={<Tag color="blue">目前只支持腾讯视频，一定要填写带有vid的视频地址</Tag>}
        >
          {getFieldDecorator('play_url', {
            required: true,
            message: '请输入地址',
          })(<Input  />)}
        </Form.Item>
      ) : liveForm.play_type === 2 ? (
        <Form.Item {...formItemLayout} label="播放地址">
          {getFieldDecorator('vod_play_url', {
            required: true,
            message: '请输入地址',
          })(<Input  />)}
          <div className={styles.fileBoxs} onClick={openVod}>
            录播视频
          </div>
          <div className={styles.fileBoxs} onClick={openUpload}>
            上传列表
          </div>
        </Form.Item>
      ) : null}
      <Form.Item {...formItemLayout} label="关联商品">
        {getFieldDecorator('good_list', {})(
          <Button type="primary" onClick={openGoodList}>
            添加商品
          </Button>
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="关联课程">
        {getFieldDecorator('good_list', {})(
          <Button type="primary" onClick={openClassList}>
            添加课程
          </Button>
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="关联视频">
        {getFieldDecorator('good_list', {})(
          <Button type="primary" onClick={openSmallVideoList}>
            添加视频
          </Button>
        )}
      </Form.Item>
      <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
        <Button type="primary" htmlType="submit" onClick={onValidateForm}>
          提交
        </Button>
      </FormItem>
    </Form>
  );
});

@connect(({ live, goods, user, classModel, frontUser, loading }) => ({
  live,
  goods,
  user,
  classModel,
  frontUser,
  loading: loading.models.live,
}))
// @Form.create()
class EditLiveStep2 extends React.PureComponent {
  state = {
    uploadPage: 1,
    isVideoModal: false,
    isVodModal:false,
    selectedSmallVideoKeys: [],
    selectedClassKeys: [],
    selectedRowKeys: [],
    isClassModal: false,
    isSmallVideoModal: false,
    isGoodModal: false,
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
    dispatch({
      type: 'live/fetchToken',
    });
    dispatch({
      type: 'frontUser/fetchUserRankList',
    });
  }
   // 添加描述
   setDescription = (e) => {
    const obj = {};
    obj.live_details = {
      value: e,
    };
    console.log(e);
    this.changeFormVal(obj);
  }

  // 模糊查询
  // fetchVod = value => {
  //   const { live: { liveForm } } = this.props;
  //   const liveId = liveForm.stv_live_id;
  //   this.lastFetchId += 1;
  //   const fetchId = this.lastFetchId;
  //   this.setState({ vod: [], fetching: true });
  //   request('/merchant/vod/list', {
  //     method: 'POST',
  //     body: {
  //       title: value,
  //       live_id: liveId,
  //     },
  //   }).then(body => {
  //     if (fetchId !== this.lastFetchId) {
  //       // for fetch callback order
  //       return;
  //     }
  //     const vod = body.data.models.map(user => ({
  //       text: `${user.id}`,
  //       value: user.title,
  //     }));
  //     this.setState({ vod, fetching: false });
  //   });
  // };
  // handleChangesVod = value => {
  //   this.setState({
  //     vod: [],
  //     fetching: false,
  //   });
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'live/setHomeVod',
  //     payload: {
  //       value,
  //     },
  //   });
  // };
  // 新增修改提交
  submitForm = () => {
    const {
      dispatch,
      live: { liveForm },
    } = this.props;
    // if (!uploadLiveImg.length) {
    //   message.error('请上传封面');
    //   return;
    // }
    // if (!liveGoods.length) {
    //   message.error('请选择商品');
    //   return;
    // }
    if (!liveForm.yyy.length) {
      message.error('请上传分享图片');
      return;
    }
    // if (liveForm.play_type === 1) {
    //   liveForm.vod_id = homeVod.key;
    //   liveForm.remark = homeVod.label;
    //   liveForm.play_url = '';
    // };
    // liveForm.cover = uploadLiveImg[0].url;
    liveForm.share_cover = liveForm.yyy[0].response.data;
    liveForm.cover = liveForm.share_cover;
    liveForm.live_detail = liveForm.live_details || liveForm.live_detail;
    liveForm.live_detail = liveForm.live_detail || '';
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
  // handlePreviewImg = file => {
  //   this.setState({
  //     previewImage: file.url || file.thumbUrl,
  //     previewVisible: true,
  //   });
  // };
  // 跳页vod
  // changeVodPage = (pagination) => {
  //   const { id } = this.props.match.params;
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'live/fetchCheckVod',
  //     payload: {
  //       liveid: id,
  //       pagination,
  //     },
  //   });
  // }
  // 跳页 video
  // changeVideoPage = (pagination) => {
  //   const { id } = this.props.match.params;
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'live/fetchCheckVideo',
  //     payload: {
  //       liveid: id,
  //       pagination,
  //     },
  //   });
  // }
  // // 打开Vod
  // openVod = () => {
  //   const { id } = this.props.match.params;
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'live/fetchCheckVod',
  //     payload: {
  //       liveid: id,
  //     },
  //   });
  //   this.openOrCloseVod();
  // }
  // // 打开Video
  // openVideo = () => {
  //   const { id } = this.props.match.params;
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'live/fetchCheckVideo',
  //     payload: {
  //       liveid: id,
  //     },
  //   });
  //   this.openOrCloseVideo();
  // }
  // 录播modal
  // openOrCloseVod = () => {
  //   const { isVodModal } = this.state;
  //   this.setState({
  //     isVodModal: !isVodModal,
  //   })
  // }
  // video
  // openOrCloseVideo = () => {
  //   const { isVideoModal } = this.state;
  //   this.setState({
  //     isVideoModal: !isVideoModal,
  //   })
  // }
  // 打开商品并开始设置
  openGoodList = () => {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/fetchGoods',
      payload: {
        page_number: 3,
        check_live_id: id,
        goods_status: 0,
      },
      callback: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys,
        });
      },
    });
    this.setState({
      isGoodModal: true,
    })
  };
  openClassList = () => {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'classModel/getclassList',
      payload: {
        check_live_id: id,
      },
      callback: (selectedClassKeys) => {
        this.setState({
          selectedClassKeys,
        });
      },
    });
    this.setState({
      isClassModal: true,
    })
  }
  openSmallVideoList = () => {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchSmallVideo',
      payload: {
        check_live_id: id,
        page_number: 3,
        status: 1,
      },
      callback: (selectedSmallVideoKeys) => {
        this.setState({
          selectedSmallVideoKeys,
        });
      },
    });
    this.setState({
      isSmallVideoModal: true,
    })
  }
  // 跳页 vod
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
  openUpload = () => {
    const { dispatch, user: { currentUser } } = this.props;
    const { uploadPage } = this.state;
    dispatch({
      type: 'classModel/getUpload',
      payload: {
        dir: `${env.videoUrl}/${currentUser.id}/${currentUser.shop_store_id}`,
        page: uploadPage,
        pageSize: 10,
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
  changeSwitch = (url) => {
    const obj = {};
    obj.vod_play_url = {
      value: url,
    };
    this.changeFormVal(obj);
    this.openOrCloseVod();
  }
  // video
  openOrCloseVideo = () => {
    const { isVideoModal } = this.state;
    this.setState({
      isVideoModal: !isVideoModal,
    })
  }
  openVod = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchVod',
      payload: {
        pagination: 1,
        'per-page': 18,
      },
    });
    this.openOrCloseVod();
  }
  selectUpload = (selectList) => {
    const obj = {};
    obj.vod_play_url = {
      value: selectList[0],
    };
    this.changeFormVal(obj);
    this.openOrCloseVideo();
  }
  uploadVideo = (e) => {
    const { live: { token }, user: { currentUser } } = this.props;
    const files = e.target.files;
    const randomNum = `${new Date().getTime()}_${parseInt(Math.random() * 100, 10)}`;
    const name = `${randomNum}.mp4`;
    // 上传
    for(let i=0;i<files.length;i++){
      uploadJSSDK({
          file: files[i],   // 文件，必填,html5 file类型，不需要读数据流，
          name, // 文件名称，选填，默认为文件名称
          token,  // token，必填
          dir: `${env.videoUrl}/${currentUser.id}/${currentUser.shop_store_id}`,
          maxSize: 1024 * 1024 * 1024,  // 上传大小限制，选填，默认0没有限制
          callback: (percent, result) => {
            if (result) {
              message.success(`上传成功！`);
              // const { url } = result;
              const { dispatch } = this.props;
              dispatch({
                type: 'classModel/setUploadImg',
                payload: {
                  dir: `${env.videoUrl}/${currentUser.id}/${currentUser.shop_store_id}`,
                  filename: randomNum,
                  ext: 'mp4',
                  pic_dir: `${env.pic}/${currentUser.id}/${currentUser.shop_store_id}`,
                },
              });
              this.setState({
                uploadPage: 1,
              })
            } else {
              message.success(`已上传${percent}%`);
            }
          },
        });
    }
  }
  handleTableChange = (pagination) => {
    const { id } = this.props.match.params;
    const { current } = pagination;
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/fetchGoods',
      payload: {
        page_number: 3,
        page: current,
        check_live_id: id,
        goods_status: 0,
      },
      callback: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys,
        });
      },
    });
  };
  handleClassChange = (pagination) => {
    const { current } = pagination;
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'classModel/getclassList',
      payload: {
        page: current,
        check_live_id: id,
      },
      callback: (selectedClassKeys) => {
        this.setState({
          selectedClassKeys,
        });
      },
    });
  };
  handleSmallVideoChange = (pagination) => {
    const { current } = pagination;
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'live/fetchSmallVideo',
      payload: {
        page: current,
        check_live_id: id,
        page_number: 3,
        status: 1,
      },
      callback: (selectedSmallVideoKeys) => {
        this.setState({
          selectedSmallVideoKeys,
        });
      },
    });
  };
  // 关商品modal
  CloseGoodModal = () => {
    this.setState({
      isGoodModal: false,
    })
  };
  CloseClassModal = () => {
    this.setState({
      isClassModal: false,
    })
  }
  CloseSmallVideoModal = () => {
    this.setState({
      isSmallVideoModal: false,
    })
  }
  // 关闭Vod
  // handleCancelVod = () => {
  //   console.log('取消')
  // }
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
  handleRowSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };
  goodSelect = (record, selected) => {
    const { id } = this.props.match.params;
    const payload = {};
    if (selected) {
      payload.operation = 1;
    } else {
      payload.operation = 0;
    }
    payload.goods_ids = [record.goods_id];
    payload.live_id = id;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/bindLiveGood',
      payload,
      callback: () => {
        message.success('设置成功!');
      },
      errorMsg: () => {
        message.error('设置失败，请重新设置!');
      },
    });
  }
  goodSelectAll = (selected) => {
    const { id } = this.props.match.params;
    const payload = {};
    if (selected) {
      payload.operation = 1;
    } else {
      payload.operation = 0;
    }
    payload.live_id = id;
    payload.goods_ids = [];
    const { dispatch,  goods: { goodsList } } = this.props;
    goodsList.forEach(res => {
      payload.goods_ids.push(res.goods_id);
    })
    dispatch({
      type: 'live/bindLiveGood',
      payload,
      callback: () => {
        message.success('设置成功!');
      },
      errorMsg: () => {
        message.error('设置失败，请重新设置!');
      },
    });
  }
  classSelect = (record, selected) => {
    console.log(22);
    const { id } = this.props.match.params;
    const payload = {};
    if (selected) {
      payload.operation = 1;
    } else {
      payload.operation = 0;
    }
    payload.course_ids = [record.id];
    payload.live_id = id;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/bindLiveClass',
      payload,
      callback: () => {
        message.success('设置成功!');
      },
      errorMsg: () => {
        message.error('设置失败，请重新设置!');
      },
    });
  }
  classSelectAll = (selected) => {
    const { id } = this.props.match.params;
    const payload = {};
    if (selected) {
      payload.operation = 1;
    } else {
      payload.operation = 0;
    }
    payload.live_id = id;
    payload.course_ids = [];
    const { dispatch,  classModel: { classList } } = this.props;
    classList.forEach(res => {
      payload.course_ids.push(res.id);
    })
    dispatch({
      type: 'live/bindLiveClass',
      payload,
      callback: () => {
        message.success('设置成功!');
      },
      errorMsg: () => {
        message.error('设置失败，请重新设置!');
      },
    });
  }
  smallvideoSelect = (record, selected) => {
    const { id } = this.props.match.params;
    const payload = {};
    if (selected) {
      payload.operation = 1;
    } else {
      payload.operation = 0;
    }
    payload.video_ids = [record.id];
    payload.live_id = id;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/bindLiveVideo',
      payload,
      callback: () => {
        message.success('设置成功!');
      },
      errorMsg: () => {
        message.error('设置失败，请重新设置!');
      },
    });
  }
  smallvideoSelectAll = (selected) => {
    const { id } = this.props.match.params;
    const payload = {};
    if (selected) {
      payload.operation = 1;
    } else {
      payload.operation = 0;
    }
    payload.live_id = id;
    payload.video_ids = [];
    const { dispatch,  live: { smallVideoList } } = this.props;
    smallVideoList.forEach(res => {
      payload.video_ids.push(res.id);
    })
    dispatch({
      type: 'live/bindLiveVideo',
      payload,
      callback: () => {
        message.success('设置成功!');
      },
      errorMsg: () => {
        message.error('设置失败，请重新设置!');
      },
    });
  }
  handleUploadSelectChange = pagination => {
    const { current } = pagination;
    const { dispatch, user: { currentUser } } = this.props;
    dispatch({
      type: 'classModel/getUpload',
      payload: {
        dir: `${env.videoUrl}/${currentUser.id}/${currentUser.shop_store_id}`,
        page: current,
        pageSize: 10,
      },
    });
  }
  handleClassSelectChange = (selectedRowKeys) => {
    this.setState({ selectedClassKeys: selectedRowKeys });
  }
  handleSmallVideoSelectChange = (selectedRowKeys) => {
    this.setState({ selectedSmallVideoKeys: selectedRowKeys });
  }
  // handleShareImg = data => {
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
  //     type: 'live/setShareImgs',
  //     payload: {
  //       fileList,
  //     },
  //   });
  // };
  render() {
    const {
      live: { liveForm, uploadLiveImg, liveGoods, smallVideoList, smallVideoListPage, vodListPage, vodList },
      classModel: { classList, classListPage, uploadList, uploadListPage },
      frontUser: { userRankList },
      goods: { goodsList, goodsListPage },
      imgUrl,
      uploadUrl,
    } = this.props;
    const { header, isGoodModal, selectedRowKeys, isClassModal, selectedClassKeys, isSmallVideoModal, selectedSmallVideoKeys, isVideoModal, isVodModal } = this.state;
    const vodListItem = [];
    vodList.forEach(res => {
      vodListItem.push(
        <div className={styles.listItem} key={res.id}>
          <img src={res.cover} alt="图片" />
          <div className={styles.word}>
            {res.title}
          </div>
          <div className={styles.switch}>
            {/* <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />} onChange={this.changeSwitch.bind(this, res.id, 0)} defaultChecked={res.is_bind} /> */}
            <Checkbox onChange={this.changeSwitch.bind(this, res.play_url)} />
          </div>
        </div>
      )
    });
    const uploadListColumns = [
      {
        title: '视频封面',
        dataIndex: 'pic',
        key: 'pic',
        width: 100,
        render: val => (val ? <img src={`${imgUrl}${val}`} style={{ width: '60px', height: 60 }} alt="图片" /> : null),
      },
      {
        title: '视频路径',
        dataIndex: 'url',
        width: 150,
      },
    ]
    const rowSelections = {
      type: 'radio',
      // selectedRowKeys: selectedMember,
      onChange: this.selectUpload,
    };
    const goodsColumns = [
      {
        title: '商品图片',
        dataIndex: 'img',
        key: 'goods_id',
        width: 100,
        render: val => (val ? <img src={val} style={{ width: '60px', height: 60 }} alt="图片" /> : null),
      },
      {
        title: '商品名',
        dataIndex: 'goods_name',
        width: 150,
      },
      {
        title: '价格',
        width: 70,
        dataIndex: 'goods_price',
      },
      {
        title: '库存',
        width: 80,
        dataIndex: 'goods_total_inventory',
      },
    ]
    const classColumns = [
      {
        title: '课程封面',
        dataIndex: 'cover',
        key: 'cover',
        width: 100,
        render: val => (val ? <img src={val} style={{ width: '60px', height: 60 }} alt="图片" /> : null),
      },
      {
        title: '课程名称',
        dataIndex: 'title',
        width: 150,
      },
      {
        title: '课程集数',
        width: 70,
        dataIndex: 'lesson_num',
        render: val => `${val}集`,
      },
    ];
    const smallVideoColumns = [
      {
        title: '短视频封面',
        dataIndex: 'cover',
        key: 'cover',
        width: 100,
        render: val => (val ? <img src={val} style={{ width: '60px', height: 60 }} alt="图片" /> : null),
      },
      {
        title: '短视频名称',
        dataIndex: 'title',
        width: 150,
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      onSelect: this.goodSelect,
      onSelectAll: this.goodSelectAll,
    };
    const classSelection = {
      selectedRowKeys: selectedClassKeys,
      onChange: this.handleClassSelectChange,
      onSelect: this.classSelect,
      onSelectAll: this.classSelectAll,
    };
    const smallVideoSelection = {
      selectedRowKeys: selectedSmallVideoKeys,
      onChange: this.handleSmallVideoSelectChange,
      onSelect: this.smallvideoSelect,
      onSelectAll: this.smallvideoSelectAll,
    };

    return (
      <div>
        <CustomizedForm
          openVod={this.openVod}
          openUpload={this.openUpload}
          userRankList={userRankList}
          setDescription={this.setDescription}
          openSmallVideoList={this.openSmallVideoList}
          openClassList={this.openClassList}
          openGoodList={this.openGoodList}
          liveForm={liveForm}
          onChange={this.changeFormVal}
          header={header}
          uploadLiveImg={uploadLiveImg}
          liveGoods={liveGoods}
          submitForm={this.submitForm}
          uploadUrl={uploadUrl}
        />
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
          <div className={styles.fileBoxs}>
            <input type="file" className={styles.fileBtns} onChange={this.uploadVideo} />
            上传视频
          </div>
          <Table
            dataSource={uploadList}
            rowKey={record => record.url}
            rowSelection={rowSelections}
            columns={uploadListColumns}
            pagination={uploadListPage}
            onChange={this.handleUploadSelectChange}
          />
        </Modal>
        <Modal
          title="选择商品列表"
          width={760}
          footer=""
          visible={isGoodModal}
          onCancel={this.CloseGoodModal}
          destroyOnClose="true"
        >
          <Table
            dataSource={goodsList}
            rowSelection={rowSelection}
            rowKey={record => record.goods_id}
            columns={goodsColumns}
            pagination={goodsListPage}
            onChange={this.handleTableChange}
          />
        </Modal>
        <Modal
          title="选择课程列表"
          width={760}
          footer=""
          visible={isClassModal}
          onCancel={this.CloseClassModal}
          destroyOnClose="true"
        >
          <Table
            dataSource={classList}
            rowSelection={classSelection}
            rowKey={record => record.id}
            columns={classColumns}
            pagination={classListPage}
            onChange={this.handleClassChange}
          />
        </Modal>
        <Modal
          title="选择小视频列表"
          width={760}
          footer=""
          visible={isSmallVideoModal}
          onCancel={this.CloseSmallVideoModal}
          destroyOnClose="true"
        >
          <Table
            dataSource={smallVideoList}
            rowSelection={smallVideoSelection}
            rowKey={record => record.id}
            columns={smallVideoColumns}
            pagination={smallVideoListPage}
            onChange={this.handleSmallVideoChange}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['goods/addShop'],
  data: form.step,
}))(EditLiveStep2);
