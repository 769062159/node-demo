import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
// import { Table, Tabs } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

// import styles from './TableList.less';

// const { confirm } = Modal;

@connect(({ code, loading }) => ({
  code,
  loading: loading.models.code,
}))
// @Form.create()
export default class Order extends PureComponent {
  state = {
    page: 1,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'code/getCodeLog',
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
      type: 'code/getCodeLog',
      payload: {
        page: current,
        page_number: 10,
      },
    });
  }

  render() {
    // const { frontUser: { userRankList: datas }, loading } = this.props;
    const { loading, code: { codeLog } } = this.props;
    const progressColumns = [
      {
        title: '时间',
        dataIndex: 'create_time',
        render: val => val ? moment(val * 1000).format('YYYY-MM-DD HH:mm:ss') : null,
      },
      {
        title: '使用者',
        dataIndex: 'has_user',
        key: 'has_user',
        render: val => val ? val.nickname : null,
      },
      {
        title: '使用对象',
        dataIndex: 'has_payer',
        key: 'has_payer',
        render: val => val ? val.nickname : null,
      },
      {
        title: '金额',
        dataIndex: 'money',
      },
    ];
    return (
      <PageHeaderLayout>
        <StandardTable
          rowKey={record => record.id}
          loading={loading}
          selectedRows={false}
          data={codeLog}
          columns={progressColumns}
          onChange={this.handleStandardTableChange}
        />
      </PageHeaderLayout>
    );
  }
}
