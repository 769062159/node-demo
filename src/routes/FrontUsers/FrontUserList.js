import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Card, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

@connect(({ frontUser, loading }) => ({
  frontUser,
  loading: loading.models.frontUser,
}))
@Form.create()
export default class FrontUserList extends PureComponent {
  state = {
    pagination: 1, // 页脚
    // header: {
    //   Authorization: `Bearer ${localStorage.getItem('token')}`,
    // },
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'frontUser/fetchFrontUserList',
      payload: {
        pagination,
      },
    });
  }

  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      pagination: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'frontUser/fetchFrontUserList',
      payload: {
        pagination: current,
      },
    });
  };

  render() {
    const { frontUser: { frontUserList: datas, frontUserListPage }, loading } = this.props;
    const progressColumns = [
      {
        title: '用户id',
        dataIndex: 'id',
        key: 'id',
        render: val => <span>{val}</span>,
      },
      {
        title: '用户昵称',
        dataIndex: 'nickname',
        render: val => <span>{val}</span>,
        key: 'nickname',
      },
      {
        title: '用户头像',
        dataIndex: 'avatar',
        render: val => (val ? <img src={val} alt="图片" /> : null),
        key: 'avatar',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
        key: 'create_time',
      },
      {
        title: '修改时间',
        dataIndex: 'update_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
        key: 'update_time',
      },
    ];

    return (
      <PageHeaderLayout title="前台用户">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              onChange={this.handleTableChange}
              dataSource={datas}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
              pagination={frontUserListPage}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
