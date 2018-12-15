import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import { Row, Steps, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './List.less';

const { Step } = Steps;
const oredrStatus = ['未支付', '已取消', '待发货', '已发货', '待评价', '已评价', '退款成功'];
@connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))
export default class orderDetail extends PureComponent {
  state = {
  }
  
  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'order/getDetail',
      payload: {
        order_id: id,
      },
    });
  }

  render() {
    const { order: { orderDetail } } = this.props;
    const goodColumns = [
      {
        title: '商品',
        dataIndex: 'has_order_goods',
        render: (val) => {
          return (
            <div className={styles.goodMsg}>
              <img alt="商品" src={val[0].has_order_goods_sku.http_url} />
              {val[0].goods_name}
            </div>
          );
        },
      },
      {
        title: '单价',
        dataIndex: 'goods_amount',
        render: (val, record) => {
          return (
            record.has_order_goods[0].has_order_goods_sku.unit_price
          );
        },
      },
      {
        title: '快递',
        dataIndex: 'pack_express_code',
        render: (val, record) => {
          return (
            <div>
              {val}
              <div>
                {record.pack_express_com}
              </div>
            </div>
          );
        },
      },
      {
        title: '运费',
        dataIndex: 'shipping_fee',
      },
      {
        title: '数量',
        dataIndex: 'group_id',
        render: (val, record) => {
          return (
            record.has_order_goods[0].goods_num
          );
        },
      },
      {
        title: '小计',
        dataIndex: 'amount',
        render: (val, record) => {
          return (
            record.has_order_goods[0].goods_num * record.has_order_goods[0].has_order_goods_sku.unit_price
          );
        },
      },
    ];
    return (
      <PageHeaderLayout>
        <div className={styles.whiteBlock}>
          <Row className={styles.grayBlock}>订单编号:<span className={styles.sn}>{orderDetail.order_sn}</span></Row>
          <Row className={styles.stepBlock}>
            {
              orderDetail.order_status === 1 ? (
                <Steps current={1}>
                  <Step title="创建订单" />
                  <Step title="订单取消" />
                </Steps>
              ) : orderDetail.order_status === 6 ? (
                <Steps current={2}>
                  <Step title="创建订单" />
                  <Step title="付款成功" />
                  <Step title="订单已退款" />
                </Steps>
              ) : (
                <Steps current={orderDetail.stepStatus}>
                  <Step title="创建订单" />
                  <Step title="付款成功" />
                  <Step title="卖家发货" />
                  <Step title="确认收货" />
                </Steps>
              )
            }
          </Row>
        </div>
        <div className={styles.CardBlock}>
          <Row className={styles.grayBlock}>订单信息</Row>
          <Row className={styles.stepBlock}>
            <div className={styles.orderMsg}>订单状态:{oredrStatus[orderDetail.order_status]}</div>
            {/* <div className={styles.orderMsg}>包裹编号:{orderDetail.order_sn}</div> */}
            <div className={styles.orderMsg}>配送方式:快递</div>
            <div className={styles.orderMsg}>收货人:{orderDetail.consignee}<span>联系电话:{orderDetail.mobile}</span><span>地址:{orderDetail.province_name + orderDetail.city_name + orderDetail.district_name + orderDetail.address}</span></div>
            <div className={styles.orderMsg}>会员信息:({orderDetail.has_user.nickname} {orderDetail.has_user.fake_id})</div>
          </Row>
        </div>
        <Table
          bordered
          dataSource={orderDetail.has_order_pack}
          rowKey={record => record.pack_id}
          columns={goodColumns}
          pagination={false}
        />
        <div className={styles.goodPrice}>
          <div>商品小计:¥{orderDetail.order_amount}</div>
          <div className={styles.payment}>实际支付:<span>¥{orderDetail.order_amount}</span></div>
        </div>
      </PageHeaderLayout>
    );
  }
}
