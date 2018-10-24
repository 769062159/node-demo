import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Select, Upload, Icon, Modal, Tag, message, Table, InputNumber, Row, Col } from 'antd';
// import { Form, Button, Input, Upload, Icon, Modal, Tag, message } from 'antd';
// import LiveGoodTable from '../../../components/LiveGoodTable';
import Wangeditor from '../../../components/Wangeditor';

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
    openClassList,
    openGoodList,
    openSmallVideoList,
    setDescription,
    header,
    liveForm,
    uploadUrl,
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
      <FormItem {...formItemLayout} label="直播公告">
        {getFieldDecorator('announcement', {
          rules: [
            {
              required: true,
              message: '请输入公告',
            },
          ],
        })(<TextArea placeholder="请输入简介" autosize />)}
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
      <FormItem {...formItemLayout} label="是否收费">
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
      ) : null}
      <FormItem {...formItemLayout} label="播放类别">
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
          {getFieldDecorator('play_url', {})(<Input style={{ width: '400px' }} />)}
        </Form.Item>
      ) : liveForm.play_type === 2 ? (
        <Form.Item {...formItemLayout} label="播放地址">
          {getFieldDecorator('vod_play_url', {})(<Input style={{ width: '400px' }} />)}
        </Form.Item>
      ) : null}
      <Form.Item {...formItemLayout} label="商品列表">
        {getFieldDecorator('good_list', {})(
          <Button type="primary" onClick={openGoodList}>
            添加商品
          </Button>
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="课程列表">
        {getFieldDecorator('good_list', {})(
          <Button type="primary" onClick={openClassList}>
            添加课程
          </Button>
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="视频列表">
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

@connect(({ live, goods, classModel, loading }) => ({
  live,
  goods,
  classModel,
  loading: loading.models.live,
}))
// @Form.create()
class EditLiveStep2 extends React.PureComponent {
  state = {
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
  }
   // 添加描述
   setDescription = (e) => {
    const obj = {};
    obj.live_detail = {
      value: e,
    };
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
      live: { liveForm, uploadLiveImg, liveGoods, smallVideoList, smallVideoListPage  },
      classModel: { classList, classListPage },
      goods: { goodsList, goodsListPage },
      uploadUrl,
    } = this.props;
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
    const { header, isGoodModal, isSmallVideoModal, isClassModal, selectedRowKeys, selectedClassKeys, selectedSmallVideoKeys } = this.state;
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
