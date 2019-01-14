import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Tooltip,
//   Tabs,
//   Table,
//   Radio,
//   DatePicker,
//   Tooltip,
//   Menu,
//   Dropdown,
} from 'antd';

import styles from './Analysis.less';

// 提示
const processed = <Fragment><div>普通待发货：支付成功但还未发货的普通订单</div><div>拼团待发货：支付成功但还未发货的拼团订单</div><div>待退款：客户发起退款或退货退款，需商家在后台操作处理的订单</div><div>待提现：客户发起佣金提现，需商家在后台操作处理的佣金</div><div>待认证：客户发起身份认证，需商家在后台操作处理的身份认证</div></Fragment>; // 待处理
const overview = <Fragment><div>今日销售额：今日零时至更新时间，客户购买商品的合计金额</div><div>今日订单数：今日零时至更新时间，成功支付的订单数</div><div>今日佣金：今日零时至更新时间，合计产生的佣金总额</div><div>今日会员数：今日零时至更新时间，新注册的用户数</div></Fragment>; // 今日概况
const totalOverview = <Fragment><div>总销售额：上线至更新时间，客户购买商品的合计金额</div><div>总订单数：上线至更新时间，成功支付的订单数</div></Fragment>; // 总概况
const commission = <Fragment><div>佣金总额：上线至更新时间，合计产生的佣金总额。佣金总额=已提现金额+申请中金额+佣金余额</div><div>已提现金额：上线至更新时间，客户已经申请提现的佣金总金额</div><div>申请中金额：上线至更新时间，客户发起佣金提现，需商家在后台操作处理的佣金总额</div><div>佣金余额：上线至更新时间，已经产生并且尚未被提现的佣金总额</div><div>已支付金额：上线至更新时间，客户发起佣金提现，商家实际支付的佣金金额</div><div>已支付金额小于等于已提现金额</div></Fragment>; // 总概况


@connect(({ statistics, loading }) => ({
  statistics,
  loading: loading.effects.statistics,
}))
export default class Analysis extends Component {
  state = {
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'statistics/fetch',
    });
  }

  render() {
    const { statistics: { statistics } } = this.props;
  
    return (
      <Fragment>
        <Card title={<div>待处理（个）<Tooltip overlayClassName={styles.txtLine} placement="topLeft" title={processed}><Icon type='question-circle' /></Tooltip></div>} >
          <Row type="flex" justify="space-between">
            <Col span={4} className={styles.txtCenter}>
              <a href="#/order/list">
                <div>普通待发货</div>
                <div>{statistics.delivery_normal_order_num || 0}</div>
              </a>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <a href="#/order/group-list-online">
                <div>拼团待发货</div>
                <div>{statistics.delivery_group_order_num || 0}</div>
              </a>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <a href="#/finance/withdraw">
                <div>待提现</div>
                <div>{statistics.withdraw_order_num || 0}</div>
              </a>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <a href="#/community/certification">
                <div>待认证</div>
                {/* todo */}
                <div>-</div>
              </a>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <a href="#/saled/refund">
                <div>待退款</div>
                <div>{statistics.withdraw_order_num || 0}</div>
              </a>
            </Col>
          </Row>
        </Card>
        <div className={styles.twoCard}>
          <Card className={styles.leftCard} type="inner" title={<div>今日概况<Tooltip overlayClassName={styles.txtLine} placement="topLeft" title={overview}><Icon type='question-circle' /></Tooltip></div>} >
            <Row type="flex" justify="space-between">
              <Col span={4} className={styles.txtCenter}>
                <Fragment>
                  <div>销售额（元）</div>
                  <div>{statistics.today_sale_amount || 0}</div>
                </Fragment>
              </Col>
              <Col span={4} className={styles.txtCenter}>
                <Fragment>
                  <div>订单数</div>
                  <div>{statistics.today_order || 0}</div>
                </Fragment>
              </Col>
              <Col span={4} className={styles.txtCenter}>
                <Fragment>
                  <div>佣金（元）</div>
                  {/* todo */}
                  <div>-</div>
                </Fragment>
              </Col>
              <Col span={4} className={styles.txtCenter}>
                <Fragment>
                  <div>会员数</div>
                  {/* todo */}
                  <div>-</div>
                </Fragment>
              </Col>
            </Row>
          </Card>
          <Card className={styles.rightCard} type="inner" title={<div>总概况<Tooltip overlayClassName={styles.txtLine} placement="topLeft" title={totalOverview}><Icon type='question-circle' /></Tooltip></div>} >
            <Row type="flex" justify="space-between">
              <Col span={4} className={styles.txtCenter}>
                <Fragment>
                  <div>总销售额（元）</div>
                  <div>{statistics.sale_amount || 0}</div>
                </Fragment>
              </Col>
              <Col span={4} className={styles.txtCenter}>
                <Fragment>
                  <div>总订单数</div>
                  {/* todo */}
                  <div>-</div>
                </Fragment>
              </Col>
            </Row>
          </Card>
        </div>
        <Card title={<div>佣金概况<Tooltip overlayClassName={styles.txtLine} placement="topLeft" title={commission}><Icon type='question-circle' /></Tooltip></div>} >
          <Row type="flex" justify="space-between">
            <Col span={4} className={styles.txtCenter}>
              <a href="#/finance/account">
                <div>佣金总额（元）</div>
                <div>{statistics.commission_amount || 0}</div>
              </a>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <Fragment>
                <div>已提现总额（元）</div>
                <div>{statistics.commission_withdrawed || 0}</div>
              </Fragment>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <Fragment>
                <div>申请中总额（元）</div>
                <div>{statistics.applying_withdrawed || 0}</div>
              </Fragment>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <Fragment>
                <div>佣金余额（元）</div>
                {/* todo */}
                <div>-</div>
              </Fragment>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <Fragment>
                <div>已支付金额（元）</div>
                <div>{statistics.withdraw_order_num || 0}</div>
              </Fragment>
            </Col>
          </Row>
        </Card>
        <Card title={<div>会员概况</div>} style={{ marginTop: 20 }}>
          <Row type="flex" justify="space-between">
            <Col span={4} className={styles.txtCenter}>
              <a href="#/front-users/front-user-list">
                <div>会员总数</div>
                {/* todo */}
                <div>-</div>
              </a>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <Fragment>
                <div>付费商户版会员数</div>
                {/* todo */}
                <div>-</div>
              </Fragment>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <Fragment>
                <div>免费商户版会员数</div>
                {/* todo */}
                <div>-</div>
              </Fragment>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <Fragment>
                <div>付费视群版会员数</div>
                {/* todo */}
                <div>-</div>
              </Fragment>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <Fragment>
                <div>免费视群版会员数</div>
                {/* todo */}
                <div>-</div>
              </Fragment>
            </Col>
          </Row>
        </Card>
      </Fragment>
    );
  }
}
