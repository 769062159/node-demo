import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import moment from 'moment';
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
  Divider,
  Select,
  Spin,
  Tag,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';
import request from '../../utils/request';

const FormItem = Form.Item;
const Option = Select.Option;
// const { TextArea } = Input;
const { confirm } = Modal;
const homeType = ['', '热销商品', '直播商品', '轮播图'];
const jumpType = ['', '跳转商品', '跳转外部链接', '无跳转'];
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
    console.log(props);
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
      xxx: Form.createFormField({
        value: props.homeForm.xxx,
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
    uploadHomeImg,
    handlePreviewImg,
    handleChangeImg,
    previewVisible,
    previewImage,
    handleCancelImg,
    homeForm,
    homeGoods,
    fetching,
    fetchUser,
    data,
    handleChangesShop,
  } = props;
  return (
    <Form>
      <FormItem {...formItemLayout} label="标题">
        {getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: '请输入标题',
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="类型"
        extra={
          homeForm.type === 3 ? (
            <Tag color="blue">轮播图750*370</Tag>
          ) : homeForm.type === 2 ? (
            <Tag color="blue">直播商品220*240</Tag>
          ) : (
            <Tag color="blue">热销商品370*370</Tag>
          )
        }
      >
        {getFieldDecorator('type', {
          rules: [
            {
              required: true,
              message: '请输入类型',
            },
          ],
        })(
          <Select style={{ width: 120 }}>
            <Option value={1}>热销商品</Option>
            <Option value={2}>直播商品</Option>
            <Option value={3}>轮播图</Option>
          </Select>
        )}
      </FormItem>
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
            <Option value={2}>跳转外部链接</Option>
            <Option value={3}>不跳转</Option>
          </Select>
        )}
      </FormItem>
      {homeForm.jump_type === 1 ? (
        <FormItem {...formItemLayout} label="直播商品">
          <Select
            // mode="multiple"
            showSearch
            labelInValue
            value={homeGoods}
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
      ) : homeForm.jump_type === 2 ? (
        <FormItem {...formItemLayout} label="跳转链接">
          {getFieldDecorator('url', {
            rules: [
              {
                required: true,
                message: '请输入跳转链接',
              },
            ],
          })(<Input />)}
        </FormItem>
      ) : null}
      <Form.Item {...formItemLayout} label="封面">
        {getFieldDecorator('xxx', {
          rules: [{ required: true, message: '请填写封面' }],
        })(
          <div className="clearfix">
            <Upload
              action="http://hlsj.test.seastart.cn/admin/upload"
              listType="picture-card"
              fileList={uploadHomeImg}
              onPreview={handlePreviewImg}
              onChange={handleChangeImg}
              data={payload}
              headers={header}
            >
              {uploadHomeImg.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={handleCancelImg}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
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

@connect(({ indexs, loading }) => ({
  indexs,
  loading: loading.models.indexs,
}))
export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }
  state = {
    expandForm: false,
    homeVisible: false,
    fetching: false,
    data: [],
    // formValues: {},
    previewVisible: false,
    previewImage: '',
    pagination: 1, // 页脚
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'indexs/fetchHome',
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
    request('/admin/goods/list', {
      method: 'POST',
      body: {
        goods_name: value,
        goods_status: 0,
      },
    }).then(body => {
      console.log(999);
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

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };
  handleChangesShop = value => {
    this.setState({
      data: [],
      fetching: false,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/setHomeShops',
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
          type: 'indexs/deleteHome',
          payload: {
            id,
            pagination,
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 新增修改提交
  handleSubmit = () => {
    const { dispatch, indexs: { homeForm, uploadHomeImg, homeGoods } } = this.props;
    if (!uploadHomeImg.length) {
      message.error('请上传封面');
      return;
    }
    const { pagination } = this.state;
    console.log(homeGoods);
    if (homeForm.jump_type === 1) {
      homeForm.remark = homeGoods.label;
      homeForm.target_id = homeGoods.key;
    } else {
      homeForm.remark = '';
      homeForm.target_id = '';
    }
    homeForm.pagination = pagination;
    homeForm.cover = uploadHomeImg[0].url;
    if (homeForm.id) {
      dispatch({
        type: 'indexs/editHome',
        payload: homeForm,
      });
      message.success('修改成功');
    } else {
      dispatch({
        type: 'indexs/addHome',
        payload: homeForm,
      });
      message.success('添加成功');
    }
    this.handAddleCancel();
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
  // 新增modal显示
  showModal = () => {
    this.setState({
      homeVisible: true,
    });
  };
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      homeVisible: false,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/clearHomeMsgs',
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
        pagination: current,
      },
    });
  };

  render() {
    const {
      indexs: { homeList: datas, homeListPage, uploadHomeImg, homeForm, homeGoods },
      loading,
    } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { homeVisible, previewVisible, previewImage, fetching, data } = this.state;
    const progressColumns = [
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
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: val => homeType[val],
      },
      {
        title: '跳转类型',
        dataIndex: 'jump_type',
        render: val => jumpType[val],
      },
      {
        title: '跳转关联',
        dataIndex: 'jump_type',
        render: (val, text) => (val === 1 ? text.remark : val === 2 ? text.url : '无关联'),
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '修改时间',
        dataIndex: 'update_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            <a onClick={this.editDataMsg.bind(this, record)}>修改</a>
            <Divider type="vertical" />
            <a onClick={this.deleteDataMsg.bind(this, record.id)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.showModal.bind(this)}>
                新建
              </Button>
            </div>
            <Table
              onChange={this.handleTableChange}
              dataSource={datas}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
              pagination={homeListPage}
            />
          </div>
        </Card>
        <Modal
          title="首页"
          visible={homeVisible}
          onCancel={this.handAddleCancel.bind(this)}
          footer=""
        >
          <CustomizedForm
            onChange={this.changeFormVal}
            previewVisible={previewVisible}
            uploadHomeImg={uploadHomeImg}
            homeForm={homeForm}
            previewImage={previewImage}
            handleSubmit={this.handleSubmit}
            handleCancelImg={this.handleCancelImg}
            handleChangeImg={this.handleChangeImg}
            handlePreviewImg={this.handlePreviewImg}
            homeGoods={homeGoods}
            fetching={fetching}
            data={data}
            fetchUser={this.fetchUser}
            handleChangesShop={this.handleChangesShop}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
