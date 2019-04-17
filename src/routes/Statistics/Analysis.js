import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Icon,
  Popover,
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
const totalOverview = <Fragment><div>总销售额：上线至更新时间，客户购买商品的合计金额</div><div>总订单数：上线至更新时间，成功支付的订单数</div><div>会员总数：上线至更新时间，注册的用户总数</div><div>付费导师会员数：上线至更新时间，客户成功支付升级为导师的会员数</div><div>免费导师会员数：上线至更新时间，后台设置为导师的会员数</div><div>付费群主会员数：上线至更新时间，客户成功支付升级为群主的会员数</div><div>免费群主会员数：上线至更新时间，后台设置为群主的会员数</div></Fragment>; // 今日概况
const overview = <Fragment><div>今日销售额：今日零时至更新时间，客户购买商品的合计金额</div><div>今日订单数：今日零时至更新时间，成功支付的订单数</div><div>今日商品订单数：今日零时至更新时间，成功支付的普通订单数和拼团订单数</div><div>今日导师订单数：今日零时至更新时间，成功支付升级为导师的订单数</div><div>今日群主订单数：今日零时至更新时间，成功支付升级为群主的订单数</div><div>今日补差价升级：今日零时至更新时间，群主客户成功支付升级为导师的订单数</div><div>今日佣金：今日零时至更新时间，合计产生的佣金总额</div><div>今日会员数：今日零时至更新时间，新注册的用户数</div></Fragment>; // 今日概况
const commission = <Fragment><div>佣金总额：上线至更新时间，合计产生的佣金总额。佣金总额=已提现金额+申请中金额+佣金余额</div><div>已提现金额：上线至更新时间，客户已经申请提现的佣金总金额</div><div>申请中金额：上线至更新时间，客户发起佣金提现，需商家在后台操作处理的佣金总额</div><div>佣金余额：上线至更新时间，已经产生并且尚未被提现的佣金总额</div><div>已支付金额：上线至更新时间，客户发起佣金提现，商家实际支付的佣金金额，已支付金额小于等于已提现金额。</div></Fragment>; // 佣金


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
        <div className={styles.cardTitle}>
          待处理（个）<Popover title="数据说明" overlayClassName={styles.txtTip} content={processed}><Icon type='question-circle' /></Popover>
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.txtCenter}>
            <a href="#/order/list">
              <div className={styles.txtTitle}>普通待发货</div>
              <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.delivery_normal_order_num || 0}</div>
            </a>
          </div>
          <div className={styles.txtCenter}>
            <a href="#/order/group-list-online">
              <div className={styles.txtTitle}>拼团待发货</div>
              <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.delivery_group_order_num || 0}</div>
            </a>
          </div>
          <div  className={styles.txtCenter}>
            <a href="#/finance/withdraw">
              <div className={styles.txtTitle}>待提现</div>
              <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.withdraw_order_num || 0}</div>
            </a>
          </div>
          <div  className={styles.txtCenter}>
            <a href="#/community/certification">
              <div className={styles.txtTitle}>待认证</div>
              <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.user_verify_num || 0}</div>
            </a>
          </div>
          <div  className={styles.txtCenter}>
            <a href="#/saled/refund">
              <div className={styles.txtTitle}>待退款</div>
              <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.refund_order_num || 0}</div>
            </a>
          </div>
        </div>
        <div className={styles.cardTitle}>
          今日概况<Popover title="数据说明"  overlayClassName={styles.txtTip} content={overview}><Icon type='question-circle' /></Popover>
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.txtCenter}>
            <div className={styles.txtTitle}>销售额（元）</div>
            <div className={styles.txtNumber}>{statistics.today_sale_amount || 0}</div>
            <div className={`${styles.txtYesterday} ${styles.txtBottom}`}>昨日：{statistics.yesterday_sale_amount || '0'}</div>
          </div>
          <div className={styles.txtCenter}>
            <div className={styles.txtTitle}>订单数</div>
            <div className={styles.txtNumber}>{statistics.today_order_num || '0'}</div>
            <div className={`${styles.txtYesterday} ${styles.txtBottom}`}>昨日：{statistics.yesterday_order_num || '0'}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>商品订单</div>
            <div className={styles.txtNumber}>{statistics.today_goods_order_num || '0'}</div>
            <div className={`${styles.txtYesterday} ${styles.txtBottom}`}>昨日：{statistics.yesterday_goods_order_num || '0'}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>导师</div>
            <div className={styles.txtNumber}>{statistics.today_merchant_order_num || '0'}</div>
            <div className={`${styles.txtYesterday} ${styles.txtBottom}`}>昨日：{statistics.yesterday_merchant_order_num || '0'}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>盟主</div>
            <div className={`${styles.txtNumber}`}>{statistics.today_wealth_order_num || '0'}</div>
            <div className={`${styles.txtYesterday} ${styles.txtBottom}`}>昨日：{statistics.yesterday_wealth_order_num || '0'}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>群主</div>
            <div className={styles.txtNumber}>{statistics.today_group_order_num || '0'}</div>
            <div className={`${styles.txtYesterday} ${styles.txtBottom}`}>昨日：{statistics.yesterday_group_order_num || '0'}</div>
          </div>
          <div className={styles.txtCenter}>
            <div className={styles.txtTitle}>补差价商户(群主)</div>
            <div className={`${styles.txtNumber}`}>{statistics.today_group_supplement_merchant_order_num || '0'}</div>
            <div className={`${styles.txtYesterday} ${styles.txtBottom}`}>昨日：{statistics.yesterday_group_supplement_merchant_order_num || '0'}</div>
          </div>
          <div className={styles.txtCenter}>
            <div className={styles.txtTitle}>补差价商户(盟主)</div>
            <div className={`${styles.txtNumber}`}>{statistics.today_wealth_supplement_merchant_order_num || '0'}</div>
            <div className={`${styles.txtYesterday} ${styles.txtBottom}`}>昨日：{statistics.yesterday_wealth_supplement_merchant_order_num || '0'}</div>
          </div>
          {/* <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>补差价商户</div>
            <div className={`${styles.txtNumber}`}>{statistics.today_supplement_merchant_order_num || '0'}</div>
            <div className={`${styles.txtYesterday} ${styles.txtBottom}`}>昨日：{statistics.yesterday_supplement_merchant_order_num || '0'}</div>
          </div> */}
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>补差价财道</div>
            <div className={`${styles.txtNumber}`}>{statistics.today_supplement_wealth_order_num || '0'}</div>
            <div className={`${styles.txtYesterday} ${styles.txtBottom}`}>昨日：{statistics.yesterday_supplement_wealth_order_num || '0'}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>佣金（元）</div>
            <div className={styles.txtNumber}><Popover placement="topLeft" title="概要" content={(statistics.today_upgrade_commission || 0)+'(升级商品) + ' + (statistics.today_other_commission || 0)+'(订单+门店+手动)'} arrowPointAtCenter><a href="javascript:;">{statistics.today_commission || 0}</a></Popover></div>
            <div className={`${styles.txtYesterday} ${styles.txtBottom}`}>昨日：{statistics.yesterday_commission || '0'}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>会员数</div>
            <div className={styles.txtNumber}>{statistics.today_user_num || 0}</div>
            <div className={`${styles.txtYesterday} ${styles.txtBottom}`}>昨日：{statistics.yesterday_user_num || '0'}</div>
          </div>
        </div>
        <div className={styles.cardTitle}>
          总概况<Popover title="数据说明" overlayClassName={styles.txtTip} content={totalOverview}><Icon type='question-circle' /></Popover>
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.txtCenter}>
            <div className={styles.txtTitle}>总销售额（元）</div>
            <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.sale_amount || 0}</div>
          </div>
          <div className={styles.txtCenter}>
            <div className={styles.txtTitle}>总订单数</div>
            <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.sale_order_num || 0}</div>
          </div>
          <div  className={styles.txtCenter}>
            <a href="#/front-users/front-user-list">
              <div className={styles.txtTitle}>会员总数</div>
              <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.member_account_count || 0}</div>
            </a>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>付费导师会员数</div>
            <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.charge_merchant_account_count || 0}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>免费导师会员数</div>
            <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.free_merchant_account_count || 0}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>付费群主会员数</div>
            <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.charge_group_account_count || 0}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>免费群主会员数</div>
            <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.free_group_account_count || 0}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>付费版财道会员数</div>
            <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.wealth_account_count || 0}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>免费财道会员数</div>
            <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.charge_wealth_account_count || 0}</div>
          </div>
        </div>
        <div className={styles.cardTitle}>
          佣金概况<Popover title="数据说明" overlayClassName={styles.txtTip} content={commission}><Icon type='question-circle' /></Popover>
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.txtCenter}>
            <a href="#/finance/account">
              <div className={styles.txtTitle}>佣金总额（元）</div>
              <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.commission_amount || 0}</div>
            </a>
          </div>
          <div className={styles.txtCenter}>
            <div className={styles.txtTitle}>已提现总额（元</div>
            <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.commission_withdrawed || 0}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>申请中总额（元）</div>
            <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.applying_withdrawed || 0}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>佣金余额（元）</div>
            <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.account_commission || 0}</div>
          </div>
          <div  className={styles.txtCenter}>
            <div className={styles.txtTitle}>已支付金额（元）</div>
            <div className={`${styles.txtNumber} ${styles.txtBottom}`}>{statistics.pass_withdrawed || 0}</div>
          </div>
        </div>
        {/* <div className={styles.twoCard}>
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
                  <div>{statistics.today_commission || 0}</div>
                </Fragment>
              </Col>
              <Col span={4} className={styles.txtCenter}>
                <Fragment>
                  <div>会员数</div>
                  <div>{statistics.today_user_num || 0}</div>
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
                  <div>{statistics.sale_order_num || 0}</div>
                </Fragment>
              </Col>
            </Row>
          </Card>
        </div> */}
        {/* <Card title={<div>佣金概况<Tooltip overlayClassName={styles.txtLine} placement="topLeft" title={commission}><Icon type='question-circle' /></Tooltip></div>} >
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
                <div>{statistics.account_commission || 0}</div>
              </Fragment>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <Fragment>
                <div>已支付金额（元）</div>
                <div>{statistics.pass_withdrawed || 0}</div>
              </Fragment>
            </Col>
          </Row>
        </Card> */}
        {/* <Card title={<div>会员概况</div>} style={{ marginTop: 20 }}>
          <Row type="flex" justify="space-between">
            <Col span={4} className={styles.txtCenter}>
              <a href="#/front-users/front-user-list">
                <div>会员总数</div>
                <div>-</div>
              </a>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <Fragment>
                <div>付费导师会员数</div>
                <div>-</div>
              </Fragment>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <Fragment>
                <div>免费导师会员数</div>
                <div>-</div>
              </Fragment>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <Fragment>
                <div>付费群主会员数</div>
                <div>-</div>
              </Fragment>
            </Col>
            <Col span={4} className={styles.txtCenter}>
              <Fragment>
                <div>免费群主会员数</div>
                <div>-</div>
              </Fragment>
            </Col>
          </Row>
        </Card> */}
      </Fragment>
    );
  }
}
