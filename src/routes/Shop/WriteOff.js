import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Table,
  message,
  Upload,
  Modal,
  Card,
  Form,
  Input,
  Tag,
  Icon,
  Button,
  InputNumber,
  Divider,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
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

@connect(({ shop, loading }) => ({
  shop,
  loading: loading.models.shop,
}))
@Form.create()
export default class WriteOff extends PureComponent {
  state = {
    expandForm: false,
    dataIndex: {},
    formVisible: false,
    // selectedRows: [],
    formValues: {},
    previewVisible: false,
    previewImage: '',
    fileList: [],
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    // selectOption: 0,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/fetchMenber',
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
      content: '你确定移除这个吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        dispatch({
          type: 'shop/cancelMenber',
          payload: {
            user_id: id,
          },
          callback: () => {
            message.success('取消成功');
          }
        });
        // that.setState({
        //   dataSource: DelDataSource,
        // });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 修改信息
  editDataMsg = (id, e) => {
    e.preventDefault();
    this.setState({
      dataIndex: id,
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
      dataIndex: {},
      fileList: [],
    });
  };
  // 新增修改提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          ...values,
        };
        const { dispatch } = this.props;
        dispatch({
          type: 'shop/setMember',
          payload: data,
          callback: () => {
            message.success('添加成功');
          }
        });
        this.handAddleCancel();
      }
    });
  };
  // 选择option
  //   selectOption = value => {
  //     console.log(value);
  //     this.setState({
  //       selectOption: value,
  //     });
  //   };
  // 上传图片
  handleCancel = () => this.setState({ previewVisible: false });
  removeImg = () => {
    const { dataIndex } = this.state;
    dataIndex.class_img_url = '';
    this.setState({ dataIndex });
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
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
  renderAdvancedForm() {
    const { loading } = this.props;
    const { header, fileList, previewImage, previewVisible } = this.state;
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
    // const selectItem = [];
    // selectItem.push(
    //   <Option key={9999} value={0}>
    //     顶级分类
    //   </Option>
    // );
    // datas.forEach(res => {
    //   selectItem.push(
    //     <Option key={res.class_id} value={res.class_id}>
    //       {res.class_name}
    //     </Option>
    //   );
    // });
    // 上传图片dom
    const uploadItem = (
      <div className="clearfix">
        <Upload
          action={this.props.uploadUrl}
          headers={header}
          listType="picture-card"
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
        <FormItem label="分类名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入分类名称',
              },
            ],
          })(<Input placeholder="给分类起个名字" />)}
        </FormItem>
        <FormItem
          label="排序"
          {...formItemLayout}
          extra={<Tag color="blue">排序数值越大，类别排得越前面</Tag>}
        >
          {getFieldDecorator('sort', {
            rules: [
              {
                required: true,
                message: '请输入排序',
              },
            ],
          })(<InputNumber placeholder="排序" min={0} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="图片"
          extra={<Tag color="blue">建议尺寸80px*80px，大小不得大于1M</Tag>}
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
  renderSimpleForm() {
    const { loading } = this.props;
    const { previewVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem label="用户id" {...formItemLayout}>
          {getFieldDecorator('user_id', {
            rules: [
              {
                required: true,
                message: '请输入用户id',
              },
            ],
          })(<Input placeholder="请输入用户id" />)}
        </FormItem>
        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            新增
          </Button>
        </FormItem>
      </Form>
    );
  }
  // 渲染修改还是新增
  renderForm() {
    // const { dataIndex } = this.state;
    // const length = Object.keys(dataIndex).length;
    return this.renderSimpleForm();
  }
  render() {
    const { shop: { WriteOffList: datas }, loading } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { formVisible } = this.state;
    const progressColumns = [
      {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      // {
      //   title: '排序',
      //   dataIndex: 'id',
      // },
      {
        title: '头像',
        dataIndex: 'avatar',
        render: val => (val ? <img src={val} style={{ width: 80 }} alt="图片" /> : null),
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={this.deleteDataMsg.bind(this, record.id)}>移除</a>
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
              dataSource={datas}
              rowKey={record => record.class_id}
              loading={loading}
              columns={progressColumns}
              pagination={false}
            />
          </div>
        </Card>
        <Modal
          title="分类"
          visible={formVisible}
          destroyOnClose="true"
          onCancel={this.handAddleCancel.bind(this)}
          footer=""
        >
          {this.renderForm()}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
