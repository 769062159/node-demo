import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BasicProfile.less';

const { Description } = DescriptionList;

@connect(({ finance, loading }) => ({
  finance,
  loading: loading.effects.finance,
}))
export default class BasicProfile extends Component {
  state = {
    page: 1,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    const { page } = this.state;
    dispatch({
      type: 'finance/fetchAccountDetail',
      payload: {
        account_id: id,
        page,
      },
    });
  }

  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    const { id } = this.props.match.params;
    this.setState({
      page: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/fetchAccountDetail',
      payload: {
        page: current,
        account_id: id,
      },
    });
  };

  render() {
    const { finance: { detailMsg, detailList, detailListPage }, loading } = this.props;
    let nickname = '';
    let mobile = '';
    let referee = '';
    let createTime = '';
    let total = '';
    let balance = '';
    if (Object.keys(detailMsg).length) {
      nickname = detailMsg.has_user.nickname;
      mobile = detailMsg.has_user.mobile;
      referee = detailMsg.has_user.has_referee ? detailMsg.has_user.has_referee.nickname : '';
      total = detailMsg.account_total_income;
      balance = detailMsg.account_commission;
      createTime = moment(detailMsg.has_user.create_time * 1000).format('YYYY-MM-DD HH:mm:ss');
    }
    const goodsColumns = [
      {
        title: '收入（元）',
        dataIndex: 'money',
      },
      {
        title: '备注',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '到账时间',
        dataIndex: 'profit_time',
        render: (val, record) => record.status === 1 ? <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span> : record.status === 2 ? '已失效' : '未到账',
        key: 'profit_time',
      },
    ];
    return (
      <PageHeaderLayout title="佣金详情">
        <Card bordered={false}>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="昵称/姓名">{nickname}</Description>
            <Description term="手机号码">{mobile}</Description>
            <Description term="直属上级">{referee}</Description>
            <Description term="佣金总收入">{total}</Description>
            <Description term="佣金余额">{balance}</Description>
            <Description term="创建时间">{createTime}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>佣金列表</div>
          <Table
            style={{ marginBottom: 24 }}
            onChange={this.handleTableChange}
            pagination={detailListPage}
            loading={loading}
            dataSource={detailList}
            columns={goodsColumns}
            rowKey="id"
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
