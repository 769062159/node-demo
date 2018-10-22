import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import { routerRedux } from 'dva/router';
import {
  Table,
  message,
  Upload,
  Modal,
  Card,
  Form,
  Input,
  Icon,
  Button,
  // Divider,
  Select,
  Spin,
  Tag,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import request from '../../utils/request';
// import LiveGoodTable from '../../components/LiveGoodTable';

const Option = Select.Option;

const FormItem = Form.Item;
const { TextArea } = Input;
const { confirm } = Modal;

// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');
// const statusMap = ['processing', 'processing', 'error'];
// const goodsStatus = ['上架', '未上架', '下架'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];
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
    console.log(props);
    return {
      desc: Form.createFormField({
        value: props.liveForm.desc,
      }),
      title: Form.createFormField({
        value: props.liveForm.title,
      }),
      rtmp_push: Form.createFormField({
        value: props.liveForm.rtmp_push,
      }),
      xxx: Form.createFormField({
        value: props.liveForm.xxx,
      }),
    };
  },
  onValuesChange(_, values) {
    console.log(values);
  },
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
    uploadLiveImg,
    handlePreviewImg,
    handleChangeImg,
    header,
    previewVisible,
    previewImage,
    handleCancelImg,
    fetching,
    data,
    fetchUser,
    handleChangesShop,
    liveGoods,
  } = props;
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
      <FormItem {...formItemLayout} label="直播地址">
        {getFieldDecorator('rtmp_push', {
          rules: [
            {
              required: true,
              message: '请输入直播地址',
            },
          ],
        })(<TextArea placeholder="请输入简介" autosize />)}
      </FormItem>
      <Form.Item
        {...formItemLayout}
        label="直播封面"
        extra={<Tag color="blue">建议尺寸750px*370px，大小不得大于1M</Tag>}
      >
        {getFieldDecorator('xxx', {
          rules: [{ required: true, message: '请填写直播封面' }],
        })(
          <div className="clearfix">
            <Upload
              action={this.props.uploadUrl}
              beforeUpload={beforeUpload}
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
      <FormItem {...formItemLayout} label="直播商品">
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
      </FormItem>
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
@Form.create()
export default class Live extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }
  state = {
    pagination: 1,
    liveVisible: false,
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
    const { pagination } = this.state;
    dispatch({
      type: 'live/fetchLive',
      payload: {
        pagination,
      },
    });
  }
  // 模糊查询
  fetchUser = value => {
    console.log('fetching user', value);
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
          type: 'live/deleteLive',
          payload: {
            live_id: id,
            pagination,
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 修改信息
  editDataMsg = (data, e) => {
    e.preventDefault();
    this.showModal();
    const { dispatch } = this.props;
    dispatch({
      type: 'live/editLiveMsg',
      payload: {
        data,
      },
    });
  };
  // 新增modal显示
  showModal = () => {
    this.setState({
      liveVisible: true,
    });
  };
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      liveVisible: false,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'live/clearLiveMsg',
    });
  };
  // 新增修改提交
  handleSubmit = () => {
    const { dispatch, live: { liveForm, uploadLiveImg, liveGoods } } = this.props;
    if (!uploadLiveImg.length) {
      message.error('请上传封面');
      return;
    }
    const { pagination } = this.state;
    const arrId = [];
    const arrName = [];
    liveGoods.forEach(res => {
      arrId.push(res.key);
      arrName.push(res.label);
    });
    liveForm.goods_ids = arrId;
    liveForm.goods_names = arrName;
    liveForm.pagination = pagination;
    liveForm.cover = uploadLiveImg[0].url;
    if (liveForm.id) {
      liveForm.live_id = liveForm.id;
      dispatch({
        type: 'live/editLive',
        payload: liveForm,
      });
      message.success('修改成功');
    } else {
      dispatch({
        type: 'live/addLive',
        payload: liveForm,
      });
      message.success('添加成功');
    }
    this.handAddleCancel();
  };
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      pagination: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchLive',
      payload: {
        pagination: current,
      },
    });
  };
  copyBtn = val => {
    copy(val);
    message.success('成功复制到剪贴板');
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
  goPath = () => {
    const { dispatch } = this.props;
    const url = `/community/add-live`;
    dispatch(routerRedux.push(url));
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
  render() {
    const {
      live: { liveList: datas, liveListPage, liveForm, uploadLiveImg, liveGoods },
      loading,
    } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { liveVisible, header, previewVisible, previewImage, fetching, value, data } = this.state;
    const progressColumns = [
      {
        title: '直播标题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '直播简介',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '直播封面',
        dataIndex: 'cover',
        render: val => (val ? <img src={val} style={{ width: '80px' }} alt="图片" /> : null),
      },
      {
        title: '分享路径',
        dataIndex: 'stv_live_id',
        render: val => `/pages/live/main?live_id=${val}&referee_id=`,
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            {/* <a onClick={this.copyBtn.bind(this, record.rtmp_push)}>推流地址</a>
            <Divider type="vertical" /> */}
            <a href={`#/community/edit-live/confirm/${record.id}`}>修改</a>
            {/* <Divider type="vertical" />
            <a onClick={this.deleteDataMsg.bind(this, record.id)}>删除</a> */}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.goPath.bind(this)}>
                新建
              </Button>
            </div> */}
            <Table
              dataSource={datas}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
              pagination={liveListPage}
            />
          </div>
        </Card>
        <Modal
          title="直播"
          width={700}
          visible={liveVisible}
          onCancel={this.handAddleCancel.bind(this)}
          footer=""
        >
          <CustomizedForm
            liveForm={liveForm}
            onChange={this.changeFormVal}
            handleSubmit={this.handleSubmit}
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
            handleChangesShop={this.handleChangesShop}
            liveGoods={liveGoods}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
