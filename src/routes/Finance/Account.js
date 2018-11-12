import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

// const FormItem = Form.Item;
// const formItemLayout = {
//   labelCol: {
//     span: 5,
//   },
//   wrapperCol: {
//     span: 19,
//   },
// };
// const formSubmitLayout = {
//   wrapperCol: {
//     span: 19,
//     offset: 5,
//   },
// };
// const { confirm } = Modal;

@connect(({ finance, loading }) => ({
  finance,
  loading: loading.models.finance,
}))
@Form.create()
export default class Rank extends PureComponent {
  state = {
    expandForm: false,
    // editData: {},
    // formVisible: false,
    // formValues: {},
    page: 1, // 页脚
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'finance/fetchAccountList',
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

  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      page: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/fetchAccountList',
      payload: {
        page: current,
      },
    });
  };

  render() {
    const { finance: { accountList: datas, accountListPage }, loading } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const progressColumns = [
      {
        title: '昵称',
        dataIndex: 'has_user',
        key: 'user_id',
        render: val => val.nickname,
      },
      {
        title: '累计收益',
        dataIndex: 'account_total_income',
      },
      {
        title: '提现金额',
        dataIndex: 'account_withdrawed_cash',
      },
      {
        title: '未到账收入',
        dataIndex: 'projected_income',
      },
      // {
      //   title: '账户余额',
      //   dataIndex: 'account_commission',
      // },
      {
        title: '账户佣金',
        dataIndex: 'account_commission',
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            <a href={`#/finance/detail/${record.account_id}`}>详情</a>
            {/* <Divider type="vertical" /> */}
            {/* <a onClick={this.deleteGoods.bind(this, record.id)}>删除</a> */}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              onChange={this.handleTableChange}
              dataSource={datas}
              rowKey={record => record.account_id}
              loading={loading}
              columns={progressColumns}
              pagination={accountListPage}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
