import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
// import { Table, Tabs } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from '../../components/Ellipsis';

import styles from './Style.less';

// const { confirm } = Modal;

@connect(({ code, loading }) => ({
  code,
  loading: loading.models.code,
}))
// @Form.create()
export default class UserCode extends PureComponent {
  state = {
    page: 1,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'code/getUserCode',
      payload: {
        page,
        page_number: 10,
      },
    });
  }
  handleStandardTableChange = (e) => {
    const { current } = e;
    const { dispatch } = this.props;
    this.setState({
      page: current,
    });
    dispatch({
      type: 'code/getUserCode',
      payload: {
        page: current,
        page_number: 10,
      },
    });
  }

  render() {
    // const { frontUser: { userRankList: datas }, loading } = this.props;
    const { loading, code: { userCode } } = this.props;
    const progressColumns = [
      {
        title: '会员',
        dataIndex: 'nickname',
        render: (val, record) => (
          <div className={styles.userMsg}>
            <img src={record.avatar} alt="图片" />
            <div>
              <Ellipsis lines={1}>昵称:{val}</Ellipsis>
              <span>id:{record.fakeid}</span>
            </div>
          </div>
        ),
      },
      {
        title: '商户授权码',
        dataIndex: 'merchant_author_code_num',
        key: 'merchant_author_code_num',
      },
      {
        title: '财道授权码',
        dataIndex: 'wealth_author_code_num',
        key: 'wealth_author_code_num',
      },
      {
        title: '群主授权码',
        dataIndex: 'group_author_code_num',
      },
      {
        title: '群主待授权码',
        dataIndex: 'payment_code_num',
      },
      {
        title: '操作',
        width: 150,
        render: record => (
          <a href={`#/code/detail/${record.fakeid}`}>修改</a>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
        <StandardTable
          rowKey={record => record.user_id}
          loading={loading}
          selectedRows={false}
          data={userCode}
          columns={progressColumns}
          onChange={this.handleStandardTableChange}
        />
      </PageHeaderLayout>
    );
  }
}
