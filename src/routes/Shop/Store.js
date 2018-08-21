import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Table,
  Modal,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Divider,
  Select,
  InputNumber,
  message,
} from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { Option } = Select;

@connect(({ shop, loading }) => ({
  shop,
  loading: loading.models.shop,
}))
@Form.create()
export default class ShopList extends PureComponent {
  state = {
    expandForm: false,
    formVisible: false,
    editData: {},
    isFromEdit: false, // 从修改打开modal
    // selectedRows: [],
    formValues: {},
    page: 1, // 页脚
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const {  page } = this.state;
    dispatch({
      type: 'shop/fetchShop',
      payload: {
        page,
        // page_number: 1,
      }
    });
  }


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
        const store_id = data.id.toString();
        dispatch({
          type: 'shop/delShop',
          payload: {
            store_id,
            page,
          },
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
        title: '门店地址',
        dataIndex: 'address',
        render(text, record) {
          return record.province_name + record.city_name + record.region_name + text;
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
            <Divider type="vertical" />
            <a onClick={this.deleteDataMsg.bind(this, record)}>删除</a>
          </Fragment>
        ),
      },
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formSubmitLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 24 },
        sm: { span: 20, offset: 4 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };


    return (
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
    );
  }
}
