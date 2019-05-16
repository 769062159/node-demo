import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Card, Table, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BasicProfile.less';

const { Description } = DescriptionList;
const upgrade = ['普通商品', '盟主专属', '群主专属'];

@connect(({ finance, loading, order }) => ({
  finance,
  order,
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
  goOrder = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/goOrder',
      payload: record.order_sn,
    });
    let url = '';
    if (record.is_group) {
      url = `/order/group-list-online`;
    } else {
      console.log('不拼团');
      url = `/order/list`;
    }
    dispatch(routerRedux.push(url));
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
        title: '订单',
        dataIndex: 'order_sn',
        key: 'order_sn',
        render: (val, record) => (
          <div style={{color: '#40a9ff', cursor: 'pointer'}} onClick={this.goOrder.bind(this, record)}>{val}</div>
        ),
      },
      {
        title: '类型',
        dataIndex: 'upgrade_type_text',
        key: 'upgrade_type_text'
      },
      {
        title: '备注',
        dataIndex: 'desc',
        key: 'desc',
        render: (val, record) => {
          return `${val}, ${record.upgrade_type ? `失效时间${moment(record.create_time * 1000 + 7 * 1000 * 3600 * 24).format('YYYY-MM-DD HH:mm:ss')}` : ''}`
        },
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
