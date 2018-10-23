import React from 'react';
import { connect } from 'dva';
import copy from 'copy-to-clipboard';
// import debounce from 'lodash/debounce';
import { Form, Button, Input, Select, Upload, Icon, Modal, Tag, message, InputNumber, Table, Row, Col } from 'antd';
// import { Form, Button, Input, Upload, Icon, Modal, Tag, message, Select } from 'antd';
// import request from '../../../utils/request';
import Wangeditor from '../../../components/Wangeditor';
// import LiveGoodTable from '../../../components/LiveGoodTable';
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
      announcement: Form.createFormField({
        value: props.liveForm.announcement,
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
    // uploadLiveImg,
    openClassList,
    // handleChangeImg,
    header,
    liveForm,
    uploadUrl,
    openGoodList,
    openSmallVideoList,
    setDescription,
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
          描述 :
        </Col>
        <Col span={15}>
          <Wangeditor
            header={header}
            setDescription={setDescription}
          />
        </Col>
      </Row>
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
            {/* <Option value={1}>播放指定录播</Option> */}
            <Option value={2}>直播点播</Option>
            <Option value={3}>腾讯视频</Option>
          </Select>
        )}
      </FormItem>
      {liveForm.play_type === 1 ? (
        null
        // <FormItem {...formItemLayout} label="录播">
        //   <Select
        //     showSearch
        //     labelInValue
        //     value={homeVod}
        //     placeholder="输入录播名字搜索"
        //     notFoundContent={fetching ? <Spin size="small" /> : null}
        //     filterOption={false}
        //     onSearch={fetchVod}
        //     onChange={handleChangesVod}
        //     style={{ width: '100%' }}
        //   >
        //     {vod.map(d => (
        //       <Option key={d.value} value={d.text}>
        //         {d.value}
        //       </Option>
        //     ))}
        //   </Select>
        // </FormItem>
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
class AddLiveStep2 extends React.PureComponent {
  state = {
    isSmallVideoModal: false,
    selectedSmallVideoKeys: [],
    smallVideoKey: [],
    isClassModal: false,
    selectedClassKeys: [],
    classKey: [],
    selectedRowKeys: [],
    goodsKey: [],
    isGoodModal: false,
    // pagination: 1,
    // value: [],
    // fetching: false,
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
  // 添加描述
  setDescription = (e) => {
    const obj = {};
    obj.live_details = {
      value: e,
    };
    this.changeFormVal(obj);
  }
  // 模糊查询
  // fetchVod = value => {
  //   console.log('fetching user', value);
  //   this.lastFetchId += 1;
  //   const fetchId = this.lastFetchId;
  //   this.setState({ vod: [], fetching: true });
  //   request('/merchant/vod/list', {
  //     method: 'POST',
  //     body: {
  //       goods_name: value,
  //       goods_status: 0,
  //     },
  //   }).then(body => {
  //     if (fetchId !== this.lastFetchId) {
  //       // for fetch callback order
  //       return;
  //     }
  //     console.log(body);
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
    const { dispatch, live: { liveForm } } = this.props;
    const { goodsKey, smallVideoKey, classKey } = this.state;
    // if (!uploadLiveImg.length) {
    //   message.error('请上传封面');
    //   return;
    // }
    if (!liveForm.yyy.length) {
      message.error('请选择商品');
      return;
    }
    // if (!shareImg.length) {
    //   message.error('请上传分享图片');
    //   return;
    // }
    // const { pagination } = this.state;
    // const arrId = [];
    // liveGoods.forEach(res => {
    //   arrId.push(res.goods_id);
    //   arrName.push(res.goods_name);
    // });
    liveForm.goods_ids = goodsKey;
    liveForm.video_ids = smallVideoKey;
    liveForm.course_ids = classKey;
    // liveForm.pagination = pagination;
    // liveForm.cover = uploadLiveImg[0].url;
    liveForm.share_cover = liveForm.yyy[0].response.data;
    liveForm.cover = liveForm.share_cover;
    liveForm.live_detail = liveForm.live_details || liveForm.live_detail;
    // liveForm.live_id = liveForm.id;
    dispatch({
      type: 'live/addLive',
      payload: liveForm,
      callback: () => {
        message.success('添加成功');
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
      type: 'live/changeFormVal',
      payload: {
        obj,
      },
    });
  };
  // 打开商品并开始设置
  openGoodList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/fetchGoods',
      payload: {
        page_number: 3,
        goods_status: 0,
      },
    });
    this.setState({
      isGoodModal: true,
    })
  };
  openClassList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'classModel/getclassList',
    });
    this.setState({
      isClassModal: true,
    })
  }
  openSmallVideoList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchSmallVideo',
      payload: {
        status: 1,
      },
    });
    this.setState({
      isSmallVideoModal: true,
    })
  }
  // 关商品modal
  CloseGoodModal = () => {
    const { goodsKey } = this.state;
    this.setState({
      isGoodModal: false,
      selectedRowKeys: goodsKey,
    })
  };
  CloseClassModal = () => {
    const { classKey } = this.state;
    this.setState({
      isClassModal: false,
      selectedClassKeys: classKey,
    })
  }
  CloseSmallVideoModal = () => {
    const { smallVideoKey } = this.state;
    this.setState({
      isSmallVideoModal: false,
      selectedSmallVideoKeys: smallVideoKey,
    })
  }
  copyBtn = val => {
    copy(val);
    message.success('成功复制到剪贴板');
  };
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
  handleTableChange = (pagination) => {
    const { current } = pagination;
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/fetchGoods',
      payload: {
        goods_status: 0,
        page_number: 3,
        page: current,
      },
    });
  };
  handleClassChange = (pagination) => {
    const { current } = pagination;
    const { dispatch } = this.props;
    dispatch({
      type: 'classModel/getclassList',
      payload: {
        page: current,
      },
    });
  };
  handleSmallVideoChange = (pagination) => {
    const { current } = pagination;
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchSmallVideo',
      payload: {
        page: current,
        status: 1,
      },
    });
  };
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
  selcetGood = () => {
    const { selectedRowKeys } = this.state;
    this.setState({
      isGoodModal: false,
      goodsKey: selectedRowKeys,
    })
  }
  selcetClass = () => {
    const { selectedClassKeys } = this.state;
    this.setState({
      isClassModal: false,
      classKey: selectedClassKeys,
    })
  }
  selcetSmallVideo = () => {
    const { selectedSmallVideoKeys } = this.state;
    this.setState({
      isSmallVideoModal: false,
      smallVideoKey: selectedSmallVideoKeys,
    })
  }
  handleRowSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };
  handleClassSelectChange = (selectedRowKeys) => {
    this.setState({ selectedClassKeys: selectedRowKeys });
  }
  handleSmallVideoSelectChange = (selectedRowKeys) => {
    this.setState({ selectedSmallVideoKeys: selectedRowKeys });
  }
  render() {
    const {
      live: { liveForm, uploadLiveImg, liveGoods, smallVideoList, smallVideoListPage },
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
    const { header, isGoodModal, selectedRowKeys, isClassModal, selectedClassKeys, isSmallVideoModal, selectedSmallVideoKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };
    const classSelection = {
      selectedRowKeys: selectedClassKeys,
      onChange: this.handleClassSelectChange,
    };
    const smallVideoSelection = {
      selectedRowKeys: selectedSmallVideoKeys,
      onChange: this.handleSmallVideoSelectChange,
    };
    return (
      <div>
        <CustomizedForm
          setDescription={this.setDescription}
          openSmallVideoList={this.openSmallVideoList}
          openClassList={this.openClassList}
          liveForm={liveForm}
          onChange={this.changeFormVal}
          header={header}
          uploadLiveImg={uploadLiveImg}
          liveGoods={liveGoods}
          submitForm={this.submitForm}
          uploadUrl={uploadUrl}
          openGoodList={this.openGoodList}
        />
        <Modal
          title="选择商品列表"
          width={760}
          onOk={this.selcetGood}
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
          onOk={this.selcetClass}
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
          onOk={this.selcetSmallVideo}
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
}))(AddLiveStep2);
