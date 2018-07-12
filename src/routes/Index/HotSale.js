import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Table, message, Modal, Card, Form, Input, Button, Divider, Tag, InputNumber } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
// const Option = Select.Option;
// const { TextArea } = Input;
const { confirm } = Modal;
const homeType = ['', '热销商品', '直播商品', '轮播图'];
const jumpType = ['', '跳转商品', '跳转外部链接', '无跳转', '跳转直播间', '跳转录播'];
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
      sort: Form.createFormField({
        value: props.homeForm.sort,
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
  //   const uploadButton = (
  //     <div>
  //       <Icon type="plus" />
  //       <div className="ant-upload-text">上传</div>
  //     </div>
  //   );
  // 上传图片参数
  //   const payload = {
  //     type: 2,
  //   };
  //   const header = {
  //     Authorization: `Bearer ${localStorage.getItem('token')}`,
  //   };
  const { loading, GoodList, GoodListPage, goodListChange } = props;
  const goodListColumns = [
    {
      title: '标题',
      dataIndex: 'goods_name',
      key: 'goods_name',
    },
    {
      title: '封面',
      dataIndex: 'cover',
      render: val => (val ? <img src={val} style={{ width: '120px' }} alt="图片" /> : null),
    },
  ];
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

      <Table
        onChange={goodListChange}
        dataSource={GoodList}
        rowSelection={{ type: 'radio' }}
        rowKey={record => record.goods_id}
        loading={loading}
        columns={goodListColumns}
        pagination={GoodListPage}
      />
      <FormItem
        {...formItemLayout}
        label="排序"
        extra={<Tag color="blue">建议尺寸220px*240px</Tag>}
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
    expandForm: false,
    homeVisible: false,
    pagination: 1, // 页脚
    // page: 1, // 商品页脚
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'indexs/fetchHome',
      payload: {
        page: pagination,
        type: 1,
      },
    });
    dispatch({
      type: 'indexs/fetchGoodList',
      payload: {
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
        console.log('Cancel');
      },
    });
  };
  // 新增修改提交
  handleSubmit = () => {
    const { dispatch, indexs: { homeForm, uploadHomeImg, homeGoods, homeLive } } = this.props;
    if (!uploadHomeImg.length) {
      message.error('请上传封面');
      return;
    }
    const { pagination } = this.state;
    console.log(homeGoods);
    if (homeForm.jump_type === 1) {
      homeForm.remark = homeGoods.label;
      homeForm.target_id = homeGoods.key;
    } else if (homeForm.jump_type === 4) {
      homeForm.target_name = homeGoods.label;
      homeForm.target_id = homeGoods.key;
      homeForm.remark = homeLive.label;
      homeForm.live_id = homeLive.key;
    } else {
      homeForm.remark = '';
      homeForm.target_id = '';
    }
    homeForm.page = pagination;
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
    // this.setState({
    //   pagination: current,
    // });
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/fetchGoodList',
      payload: {
        page: current,
        page_number: 10,
      },
    });
  };
  goPath = index => {
    const { dispatch } = this.props;
    const url = `/market/AddForm/${index}`;
    dispatch(routerRedux.push(url));
  };

  render() {
    const {
      indexs: { homeList: datas, homeListPage, GoodList, GoodListPage, homeForm },
      loading,
    } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { homeVisible } = this.state;
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
        dataIndex: 'remark',
        render: (val, text) =>
          text.jump_type === 1
            ? val
            : text.jump_type === 2
              ? text.url
              : text.jump_type === 4 ? text.remark : text.jump_type === 5 ? text.remark : '无关联',
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
            <a href={`#/market/EditForm/${record.id}`}>修改</a>
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
              <Button icon="plus" type="primary" onClick={this.goPath.bind(this, 1)}>
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
          title="热卖商品"
          visible={homeVisible}
          onCancel={this.handAddleCancel.bind(this)}
          footer=""
        >
          <CustomizedForm
            handleSubmit={this.handleSubmit}
            GoodList={GoodList}
            GoodListPage={GoodListPage}
            goodListChange={this.goodListChange}
            loading={loading}
            homeForm={homeForm}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
