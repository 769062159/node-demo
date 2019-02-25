import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import { Table, message, Modal, Form, Button, InputNumber, Upload, Select, Icon, Tag, Row, Col, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Style.less';

const FormItem = Form.Item;
const Option = Select.Option;
// const { TextArea } = Input;
const { confirm } = Modal;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
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
    return {
      type: Form.createFormField({
        value: props.homeForm.type,
      }),
      title: Form.createFormField({
        value: props.homeForm.title,
      }),
      jump_type: Form.createFormField({
        value: props.homeForm.jump_type,
      }),
      target_id: Form.createFormField({
        value: props.homeForm.target_id,
      }),
      url: Form.createFormField({
        value: props.homeForm.url,
      }),
      sort: Form.createFormField({
        value: props.homeForm.sort,
      }),
      xxx: Form.createFormField({
        value: props.homeForm.xxx,
      }),
    };
  },
  // onValuesChange(_, values) {
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
  const header = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  const {
    loading,
    GoodList,
    GoodListPage,
    goodListChange,
    homeForm,
    uploadHomeImg,
    handlePreviewImg,
    handleChangeImg,
    previewVisible,
    handleCancelImg,
    previewImage,
    LiveList,
    LiveListPage,
    goodLiveChange,
    goodSelect,
    liveSelect,
    GoodKey,
    LiveKey,
    uploadUrl,
    beforeUpload,
    getLiveId,
    searchLive,
  } = props;
  const goodListColumns = [
    {
      title: '商品名',
      dataIndex: 'goods_name',
      key: 'goods_name',
    },
    {
      title: '封面',
      dataIndex: 'img',
      render: val => (val ? <img src={val} style={{ width: '120px' }} alt="图片" /> : null),
    },
    {
      title: '价格',
      dataIndex: 'goods_price',
    },
    {
      title: '库存',
      dataIndex: 'goods_total_inventory',
    },
  ];
  const goodLiveColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '封面',
      dataIndex: 'cover',
      render: val => (val ? <img src={val} style={{ width: '120px' }} alt="图片" /> : null),
    },
  ];
  return (
    <Form>
      {/* <FormItem {...formItemLayout} label="标题">
        {getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: '请输入标题',
            },
          ],
        })(<Input />)}
      </FormItem> */}
      <FormItem
        {...formItemLayout}
        label="排序"
        // extra={<Tag color="blue">建议尺寸220px*240px</Tag>}
      >
        {getFieldDecorator('sort', {
          rules: [
            {
              required: true,
              message: '请输入排序',
            },
          ],
        })(<InputNumber step={1} min={0} />)}
      </FormItem>
      {homeForm.type === 3 ? (
        <div>
          <FormItem {...formItemLayout} label="跳转类型">
            {getFieldDecorator('jump_type', {
              rules: [
                {
                  required: true,
                  message: '请输入跳转类型',
                },
              ],
            })(
              <Select style={{ width: 200 }}>
                <Option value={1}>跳转商品</Option>
                <Option value={3}>不跳转</Option>
                <Option value={4}>跳转直播间</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="封面"
            extra={<Tag color="blue">建议尺寸为750px*370px，大小不得大于1M</Tag>}
          >
            <Upload
              action={uploadUrl}
              listType="picture-card"
              beforeUpload={beforeUpload}
              fileList={uploadHomeImg}
              onPreview={handlePreviewImg}
              onChange={handleChangeImg}
              data={payload}
              headers={header}
            >
              {uploadHomeImg.length >= 1 ? null : uploadButton}
            </Upload>
          </FormItem>
          <Modal visible={previewVisible} footer={null} onCancel={handleCancelImg}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      ) : null}
      {homeForm.jump_type === 1 ? (
        <FormItem {...formItemLayout} label="商品列表" className={styles.tableHeaders}>
          <Table
            style={{ width: 600 }}
            onChange={goodListChange}
            // onSelect={goodSelect}
            dataSource={GoodList}
            rowSelection={{ type: 'radio', onSelect: goodSelect, selectedRowKeys: GoodKey }}
            rowKey={record => record.goods_id}
            loading={loading}
            columns={goodListColumns}
            pagination={GoodListPage}
          />
        </FormItem>
      ) : homeForm.jump_type === 4 ? (
        <Fragment>
          <Row style={{ marginBottom: 20 }}>
            <Col span={17} offset={7}>
              <Input placeholder="请输入用户id" style={{ width: 200 }} onChange={getLiveId} />
              <Button style={{ marginLeft: 20 }} onClick={searchLive}>搜索</Button>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label="直播列表" className={styles.tableHeaders}>
            <Table
              style={{ width: 600 }}
              onChange={goodLiveChange}
              // onSelect={liveSelect}
              dataSource={LiveList}
              rowSelection={{ type: 'radio', onSelect: liveSelect, selectedRowKeys: LiveKey }}
              rowKey={record => record.stv_live_id}
              loading={loading}
              columns={goodLiveColumns}
              pagination={LiveListPage}
            />
          </FormItem>
        </Fragment>
      ) : null}
      <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
        <Button type="primary" htmlType="submit" onClick={onValidateForm}>
          提交
        </Button>
      </FormItem>
    </Form>
  );
});

@connect(({ indexs, loading }) => ({
  indexs,
  loading: loading.models.indexs,
}))
export default class Home extends PureComponent {
  state = {
    liveId: '',
    expandForm: false,
    pagination: 1, // 页脚
    previewVisible: false,
    previewImage: '',
    // page: 1, // 商品页脚
  };
  componentDidMount() {
    const { dispatch } = this.props;
    // const { pagination } = this.state;
    const { id } = this.props.match.params;
    dispatch({
      type: 'indexs/fetchDetail',
      payload: {
        index_id: id,
      },
    });
    // dispatch({
    //   type: 'indexs/fetchHome',
    //   payload: {
    //     page: pagination,
    //     type: 3,
    //   },
    // });
    dispatch({
      type: 'indexs/fetchGoodList',
      payload: {
        page: 1,
        page_number: 10,
      },
    });
    dispatch({
      type: 'indexs/fetchLiveList',
      payload: {
        page: 1,
        page_number: 10,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/clearHomeMsgs',
    });
  }

  getLiveId = (e) => {
    this.setState({
      liveId: e.target.value,
    });
  }

  searchLive = () => {
    const { liveId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/fetchLiveList',
      payload: {
        user_id: liveId,
        page: 1,
        page_number: 10,
      },
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  // 删除商品
  deleteDataMsg = id => {
    event.preventDefault();
    const that = this;
    confirm({
      content: '你确定删除这个吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        const { pagination } = that.state;
        dispatch({
          type: 'indexs/deleteHome',
          payload: {
            id,
            page: pagination,
          },
        });
      },
      onCancel() {
      },
    });
  };
  // 新增修改提交
  handleSubmit = () => {
    const { dispatch, indexs: { homeForm, uploadHomeImg, GoodKey, LiveKey, remark } } = this.props;
    if (uploadHomeImg.length) {
      homeForm.cover = uploadHomeImg[0].url;
    }
    const { pagination } = this.state;
    // homeForm.type = type;
    if (homeForm.type === 2) {
      homeForm.jump_type = 4;
    } else if (homeForm.type === 1) {
      homeForm.jump_type = 1;
    }
    if (homeForm.jump_type === 1) {
      homeForm.target_id = GoodKey[0];
    } else if (homeForm.jump_type === 4) {
      homeForm.target_id = LiveKey[0];
    }
    homeForm.target_name = remark;
    homeForm.page = pagination;
    dispatch({
      type: 'indexs/editHome',
      payload: homeForm,
    });
    message.success('修改成功');
    history.back();
    // if (homeForm.id) {
    //   dispatch({
    //     type: 'indexs/editHome',
    //     payload: homeForm,
    //   });
    //   message.success('修改成功');
    // } else {
    //   dispatch({
    //     type: 'indexs/addHome',
    //     payload: homeForm,
    //   });
    //   message.success('添加成功');
    // }
  };
  // 修改信息
  editDataMsg = (data, e) => {
    e.preventDefault();
    this.showModal();
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/editHomeMsgs',
      payload: {
        data,
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
      type: 'indexs/changeFormVal',
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
  //  限制大小
  beforeUpload = (file) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('图片不能超过1M!');
    }
    return isLt1M;
  }
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
      type: 'indexs/setHomeImgs',
      payload: {
        fileList,
      },
    });
  };
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      pagination: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/fetchHome',
      payload: {
        page: current,
      },
    });
  };
  goodListChange = pagination => {
    const { current } = pagination;
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/fetchGoodList',
      payload: {
        page: current,
        page_number: 10,
      },
    });
  };
  goodLiveChange = pagination => {
    const { current } = pagination;
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/fetchLiveList',
      payload: {
        page: current,
        page_number: 10,
      },
    });
  };
  goodSelect = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/selectGood',
      payload: {
        data: record,
      },
    });
  };
  liveSelect = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/selectLive',
      payload: {
        data: record,
      },
    });
  };

  render() {
    const {
      indexs: {
        GoodList,
        GoodListPage,
        homeForm,
        uploadHomeImg,
        LiveList,
        LiveListPage,
        LiveKey,
        GoodKey,
      },
      loading,
      uploadUrl,
    } = this.props;
    const { previewVisible, previewImage } = this.state;

    return (
      <PageHeaderLayout>
        <CustomizedForm
          onChange={this.changeFormVal}
          handleSubmit={this.handleSubmit}
          GoodList={GoodList}
          GoodListPage={GoodListPage}
          LiveList={LiveList}
          LiveListPage={LiveListPage}
          goodListChange={this.goodListChange}
          loading={loading}
          homeForm={homeForm}
          uploadHomeImg={uploadHomeImg}
          handlePreviewImg={this.handlePreviewImg}
          handleChangeImg={this.handleChangeImg}
          previewVisible={previewVisible}
          handleCancelImg={this.handleCancelImg}
          previewImage={previewImage}
          goodLiveChange={this.goodLiveChange}
          beforeUpload={this.beforeUpload}
          goodSelect={this.goodSelect}
          liveSelect={this.liveSelect}
          GoodKey={GoodKey}
          LiveKey={LiveKey}
          getLiveId={this.getLiveId}
          uploadUrl={uploadUrl}
          searchLive={this.searchLive}
        />
      </PageHeaderLayout>
    );
  }
}
