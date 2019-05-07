import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Table,
  Modal,
  Card,
  Form,
  Button,
  Input,
  InputNumber
  // Divider,
} from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const { confirm } = Modal;

const FormItem = Form.Item;
// const Option = Select.Option;
// const { TextArea } = Input;
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
const formSubmitLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};


@connect(({ global, shop, login, loading }) => ({
  shop,
  global,
  login,
  loading: loading.models.shop,
}))
@Form.create()
export default class ShopList extends PureComponent {
  state = {
    // expandForm: false,
    // formVisible: false,
    // editData: {},
    // isFromEdit: false, // 从修改打开modal
    // // selectedRows: [],
    // formValues: {},
    page: 1, // 页脚
    passwordVisible: true,
    password: ''
  };

  componentDidMount() {
    if (this.props.global.actionPassword != '') {
      this.setState({
        password: this.props.global.actionPassword,
        passwordVisible: false
      }, function() {
        this.handlePasswordConfirm();
      })
    }

  }

  handlePasswordChange = e => {
    this.setState({
      password: e.target.value
    })
  }
  handlePasswordConfirm = () => {
    // 开一个专门校验密码的
    const { dispatch } = this.props;
    dispatch({
      type: 'login/checkPassword',
      payload: {
        password: this.state.password
      },
      callback: () => {
        const { dispatch } = this.props;
        this.setState({
          passwordVisible: false
        })
        this.props.dispatch({
          type: 'global/saveActionPassword',
          payload: this.state.password
        })

        const {  page } = this.state;
        dispatch({
          type: 'shop/fetchShop',
          payload: {
            page,
            // page_number: 1,
          },
        });
      }
    });
  };
  handlePasswordCancel = () => {
    this.setState({
      passwordVisible: false,
      password: ''
    });
  };


  // 删除商品
  deleteDataMsg = data => {
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
        const storeId = data.id.toString();
        dispatch({
          type: 'shop/delShop',
          payload: {
            store_id: storeId,
            page,
          },
        });
        // that.setState({
        //   dataSource: DelDataSource,
        // });
      },
      onCancel() {
      },
    });
  };
  goAddPath = () => {
    const { dispatch } = this.props;
    const url = `/shop/add-store`;
    dispatch(routerRedux.push(url));
  };
  goEditPath = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const url = `/shop/edit-store/${id}`;
    dispatch(routerRedux.push(url));
  }

 
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      page: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/fetchShop',
      payload: {
        page: current,
        // page_number: 1,
      },
    });
  };

  render() {
    const { shop: { shopList: datas, shopListPage }, loading } = this.props;

    const progressColumns = [
      {
        title: '门店名',
        dataIndex: 'shop_name',
        key: 'shop_name',
      },
      {
        title: '门店Logo',
        dataIndex: 'http_url',
        key: 'http_url',
        render(text) {
          return text ? <img alt="图片" src={text} width={60} /> : null
        },
      },
      {
        title: '门店类别',
        dataIndex: 'type',
        key: 'type',
        render(text) {
          return text ? '分店' : '总店'
        },
      },
      {
        title: '门店地址',
        dataIndex: 'address',
        render(text, record) {
          return record.province_name + record.city_name + record.region_name + text;
        },
      },
      {
        title: '账号',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '联系电话',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '门店营业时间',
        dataIndex: 'open_time',
        key: 'open_time',
        render(text, record) {
          return `${text} - ${record.close_time}`;
        },
      },
      // {
      //   title: '更新时间',
      //   dataIndex: 'update_time',
      // },
      {
        title: '操作',
        render: record => (
          <Fragment>
            <a onClick={this.goEditPath.bind(this, record)}>修改</a>
            {/* <Divider type="vertical" />
            <a onClick={this.deleteDataMsg.bind(this, record)}>删除</a> */}
          </Fragment>
        ),
      },
    ];
    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 4 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 20 },
    //   },
    // };
    // const formSubmitLayout = {
    //   wrapperCol: {
    //     xs: { span: 24, offset: 24 },
    //     sm: { span: 20, offset: 4 },
    //   },
    // };
    // const formItemLayoutWithOutLabel = {
    //   wrapperCol: {
    //     xs: { span: 24, offset: 0 },
    //     sm: { span: 20, offset: 4 },
    //   },
    // };


    return (
      this.props.global.actionPassword != '' ? (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.goAddPath.bind(this)}>
                新建
              </Button>
            </div>
            <Table
              onChange={this.handleTableChange}  // 换页
              className="components-table-demo-nested"
              // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
              dataSource={datas}
              rowKey={record => record.id + record.create_time}
              loading={loading}
              columns={progressColumns}
              pagination={shopListPage}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    ) : (
      <PageHeaderLayout>
        <Modal
        title='校验操作密码'
        visible={this.state.passwordVisible}
        onCancel={this.handlePasswordCancel.bind(this)}
        destroyOnClose="true"
        footer=""
        maskClosable={false}
        closable={true}
        keyboard={false}
      >
          <FormItem label={`操作密码`} {...formItemLayout}>
            <Input.Password value={this.state.password} onChange={this.handlePasswordChange} onPressEnter={this.handlePasswordConfirm}/>
          </FormItem>
          <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
            <Button type="primary" onClick={this.handlePasswordConfirm}>
              确认
            </Button>
          </FormItem>
      </Modal>
    </PageHeaderLayout> )
    );
  }
}
