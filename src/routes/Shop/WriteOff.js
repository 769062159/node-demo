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
    page: 1, // 店铺的页脚
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
    dispatch({
      type: 'shop/fetchShop',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/clearTable',
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
        const { dispatch, shop: { selectedShop } } = this.props;
        if (!selectedShop.length) {
          message.error('请选择店铺');
          return false;
        }
        data.shop_store_id = selectedShop[0];
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
  selectShop = selectList => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/selectShop',
      payload: {
        data: selectList,
      },
    });
  };
  renderSimpleForm() {
    const { loading, shop: { shopList, shopListPage, selectedShop } } = this.props;
    const { previewVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const shopColumns = [
      {
        title: '店铺名',
        dataIndex: 'shop_name',
        key: 'shop_name',
      },
    ];
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: selectedShop,
      onChange: this.selectShop,
    };
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
        <FormItem label="配置店铺" {...formItemLayout} >
          {getFieldDecorator('shop_id', {
          })(
            <Table
              rowSelection={rowSelection}
              dataSource={shopList}
              rowKey={record => record.id}
              loading={loading}
              columns={shopColumns}
              pagination={shopListPage}
            />
          )}
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
        // render: val => (val ? val.nickname : null),
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
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
              pagination={false}
            />
          </div>
        </Card>
        <Modal
          title="核销员"
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
