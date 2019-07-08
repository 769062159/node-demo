import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Tabs } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

// import styles from './TableList.less';

const TabPane = Tabs.TabPane;
// const { confirm } = Modal;

@connect(({ frontUser, loading }) => ({
  frontUser,
  loading: loading.models.frontUser,
}))
// @Form.create()
export default class Rank extends PureComponent {
  state = {
    page: 1,
    tabIndex: 1,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { page, tabIndex } = this.state;
    dispatch({
      type: 'frontUser/getRecord',
      payload: {
        type: tabIndex,
        page,
        page_number: 10,
      },
    });
  }
  changeTabs = (e) => {
      this.setState({
        tabIndex: e,
        page: 1,
      })
      const { dispatch } = this.props;
      dispatch({
        type: 'frontUser/getRecord',
        payload: {
          type: e,
          page: 1,
          page_number: 10,
        },
      });
  }

  handleStandardTableChange = (e) => {
    const { current } = e;
    const { dispatch } = this.props;
    this.setState({
      page: current,
    })
    const { tabIndex } = this.state;
    dispatch({
      type: 'frontUser/getRecord',
      payload: {
        type: tabIndex,
        page: current,
        page_number: 10,
      },
    });
  }


  render() {
    // const { frontUser: { userRankList: datas }, loading } = this.props;
    const { loading, frontUser: { levelRecord, superiorRecord, versionRecord, codeRecord, commissionRecord } } = this.props;
    const progressColumns = [
        {
            title: '操作账户',
            dataIndex: 'admin_user_id',
            key: 'admin_user_id',
            render: val => val ? '超级管理员' : null,
          },
      {
        title: '操作对象',
        dataIndex: 'has_user',
        key: 'has_user',
        render: val => val ? val.nickname : null,
      },
      {
        title: '操作时间',
        dataIndex: 'create_time',
        render: val => val ? moment(val * 1000).format('YYYY-MM-DD HH:mm:ss') : null,
      },
      {
        title: '操作内容',
        dataIndex: 'remark',
      },
    ];
    return (
      <PageHeaderLayout>
        <Tabs onChange={this.changeTabs} type="card">
          <TabPane tab="设置等级" key="1">
            <StandardTable
              rowKey={record => record.id}
              loading={loading}
              selectedRows={false}
              data={levelRecord}
              columns={progressColumns}
              onChange={this.handleStandardTableChange}
            />
          </TabPane>
          <TabPane tab="设置VIP" key="2">
            {/* <Table
              dataSource={superiorRecord.list}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
            /> */}
            <StandardTable
              rowKey={record => record.id}
              loading={loading}
              selectedRows={false}
              data={superiorRecord}
              columns={progressColumns}
              onChange={this.handleStandardTableChange}
            />
          </TabPane>
          <TabPane tab="设置版本" key="3">
            {/* <Table
              dataSource={versionRecord.list}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
            /> */}
            <StandardTable
              rowKey={record => record.id}
              loading={loading}
              selectedRows={false}
              data={versionRecord}
              columns={progressColumns}
              onChange={this.handleStandardTableChange}
            />
          </TabPane>
          <TabPane tab="设置授权码" key="4">
            {/* <Table
              dataSource={codeRecord.list}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
            /> */}
            <StandardTable
              rowKey={record => record.id}
              loading={loading}
              selectedRows={false}
              data={codeRecord}
              columns={progressColumns}
              onChange={this.handleStandardTableChange}
            />
          </TabPane>
          <TabPane tab="更改佣金" key="5">
            {/* <Table
              dataSource={commissionRecord.list}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
            /> */}
            <StandardTable
              rowKey={record => record.id}
              loading={loading}
              selectedRows={false}
              data={commissionRecord}
              columns={progressColumns}
              onChange={this.handleStandardTableChange}
            />
          </TabPane>
        </Tabs>
      </PageHeaderLayout>
    );
  }
}
