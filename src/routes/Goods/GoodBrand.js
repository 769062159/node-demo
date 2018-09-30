import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, message, Upload, Modal, Card, Form, Input, Icon, Button, Divider, Tag } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { confirm } = Modal;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const formSubmitLayout = {
  wrapperCol: {
    span: 19,
    offset: 5,
  },
};
// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');
// const statusMap = ['processing', 'processing', 'error'];
// const goodsStatus = ['上架', '未上架', '下架'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
@Form.create()
export default class GoodBrand extends PureComponent {
  state = {
    page: 1,
    expandForm: false,
    editData: {},
    formVisible: false,
    previewVisible: false,
    previewImage: '',
    fileList: [],
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'goods/fetchBrand',
      payload: {
        page,
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
        const { page } = that.state;
        dispatch({
          type: 'goods/deleteBrand',
          payload: {
            brand_id: id,
            page,
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
    this.setState({
      editData: data,
    });
    this.showModal();
  };
  // 新增modal显示
  showModal = () => {
    this.setState({
      formVisible: true,
    });
    this.renderForm();
  };
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      formVisible: false,
      editData: {},
      fileList: [],
    });
  };
  // 新增修改提交
  handleSubmit = (type, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.fileList.length) {
          values.cover = this.state.fileList[0].url;
        } else {
          message.error('请上传封面');
          return false;
        }
        const { dispatch } = this.props;
        const { editData, page } = this.state;
        values.page = page;
        if (Object.keys(editData).length) {
          values.brand_id = editData.brand_id;
          dispatch({
            type: 'goods/editBrand',
            payload: values,
          });
          message.success('修改成功');
        } else {
          dispatch({
            type: 'goods/addBrand',
            payload: values,
          });
          message.success('添加成功');
        }
        this.handAddleCancel();
      }
    });
  };
  // 上传图片
  handleCancel = () => this.setState({ previewVisible: false });
  removeImg = () => {
    const { editData } = this.state;
    editData.banner_img = '';
    this.setState({ editData });
  };
  // 放大图片
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  //  限制大小
  beforeUpload = (file) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('图片不能超过1M!');
    }
    return isLt1M;
  }
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      page: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/fetchBrand',
      payload: {
        page: current,
      },
    });
  };

  handleChange = ({ fileList }) => {
    // const { response } = fileList;
    fileList = fileList.map(item => {
      if (item.status === 'done') {
        const img = {};
        img.status = 'done';
        img.response = { status: 'success' };
        img.name = item.name;
        img.uid = item.uid;
        img.url = item.response.data;
        return img;
      }
      return item;
    });
    this.setState({ fileList });
  };
  renderAddForm() {
    const { loading } = this.props;
    const { header, fileList, previewImage, previewVisible } = this.state;
    // 上传icon
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
    const { getFieldDecorator } = this.props.form;
    // 上传图片dom
    const uploadItem = (
      <div className="clearfix">
        <Upload
          action={this.props.uploadUrl}
          headers={header}
          listType="picture-card"
          beforeUpload={this.beforeUpload}
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          data={payload}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this, 0)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem label="店铺" {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入店铺',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="简介" {...formItemLayout}>
          {getFieldDecorator('desc', {
            rules: [
              {
                required: true,
                message: '请输入简介',
              },
            ],
          })(<TextArea placeholder="请输入简介" autosize />)}
        </FormItem>
        <FormItem
          label="店铺封面"
          {...formItemLayout}
          extra={<Tag color="blue">建议尺寸为100px*100px，大小不超过1M</Tag>}
        >
          {uploadItem}
        </FormItem>
        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
  renderEditForm() {
    const { loading } = this.props;
    const { header, editData, fileList, previewVisible } = this.state;
    let { previewImage } = this.state;
    const desc = editData.brand_desc;
    if (editData.banner_img) {
      const img = {
        uid: -1,
        status: 'done',
      };
      img.name = `${editData.brand_id}.png`;
      img.url = editData.banner_img;
      previewImage = img.url;
      fileList[0] = img;
    }
    // 上传icon
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    // 上传图片参数
    const payload = {
      type: 2,
    };
    const { getFieldDecorator } = this.props.form;
    // 上传图片dom
    const uploadItem = (
      <div className="clearfix">
        <Upload
          action={this.props.uploadUrl}
          headers={header}
          listType="picture-card"
          beforeUpload={this.beforeUpload}
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          data={payload}
          onRemove={this.removeImg}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this, 1)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem label="店铺" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: editData.brand_name,
            rules: [
              {
                required: true,
                message: '请输入店铺',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="简介" {...formItemLayout}>
          {getFieldDecorator('desc', {
            initialValue: desc,
            rules: [
              {
                required: true,
                message: '请输入简介',
              },
            ],
          })(<TextArea placeholder="请输入简介" autosize />)}
        </FormItem>
        <FormItem
          label="店铺封面"
          {...formItemLayout}
          extra={<Tag color="blue">建议尺寸为100px*100px，大小不超过1M</Tag>}
        >
          {editData.cover !== 1 ? uploadItem : null}
        </FormItem>
        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            修改
          </Button>
        </FormItem>
      </Form>
    );
  }
  // 渲染修改还是新增
  renderForm() {
    const { editData } = this.state;
    const length = Object.keys(editData).length;
    return length ? this.renderEditForm() : this.renderAddForm();
  }
  render() {
    const { goods: { brandList: datas, brandListPage }, loading } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { formVisible } = this.state;
    const progressColumns = [
      {
        title: '店铺',
        dataIndex: 'brand_name',
        key: 'brand_name',
      },
      {
        title: '简介',
        dataIndex: 'brand_desc',
        key: 'brand_desc',
      },
      {
        title: '封面',
        dataIndex: 'logo_file_path',
        render: val => (val ? <img src={val} style={{ width: '80px' }} alt="图片" /> : null),
      },
      {
        title: '销售额',
        dataIndex: 'sales_volume',
      },
      {
        title: '销量',
        dataIndex: 'sales_num',
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
            <a onClick={this.deleteDataMsg.bind(this, record.brand_id)}>删除</a>
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
              rowKey={record => record.brand_id}
              loading={loading}
              columns={progressColumns}
              pagination={brandListPage}
            />
          </div>
        </Card>
        <Modal
          title="店铺"
          visible={formVisible}
          onCancel={this.handAddleCancel.bind(this)}
          footer=""
        >
          {this.renderForm()}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
