import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Row, Steps, Table, Card,Col } from 'antd';

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
        dataIndex: 'has_order_goods_sku',
        render: (val, record) => {
          return (
            <div className={styles.goodMsg}>
              <img alt="商品" src={val.http_url} />
              {record.goods_name}
            </div>
          );
        },
      },
      {
        title: '单价',
        dataIndex: 'goods_amount',
        render: (val, record) => {
          return (
            record.has_order_goods_sku.unit_price
          );
        },
      },
      {
        title: '数量',
        dataIndex: 'group_id',
        render: (val, record) => {
          return (
            record.goods_num
          );
        },
      },
      {
        title: '小计',
        dataIndex: 'amount',
        render: (val, record) => {
          return (
            record.goods_num * record.has_order_goods_sku.unit_price
          );
        },
      },
    ];
    return (
      <PageHeaderLayout>
        <div className={styles.CardBlock}>
          <Row className={styles.grayBlock}>订单信息</Row>
          <Row className={styles.stepBlock}>
            <div className={styles.orderMsg}>订单状态:{oredrStatus[orderDetail.order_status]}</div>
            <div className={styles.orderMsg}>配送方式:快递</div>
            <div className={styles.orderMsg}>收货人:{orderDetail.consignee}<span>联系电话:{orderDetail.mobile}</span><span>地址:{orderDetail.province_name + orderDetail.city_name + orderDetail.district_name + orderDetail.address}</span></div>
            <div className={styles.orderMsg}>会员信息:({orderDetail.has_user.nickname} {orderDetail.has_user.fake_id})</div>
          </Row>
        </div>
        {
          orderDetail.has_order_pack.map((res) => {
            return (
              <Card title={`包裹${res.index}`} key={res.pack_id} style={{ marginTop: 10  }} bordered={false} >
                <div className={styles.whiteBlock}>
                  <Row className={styles.grayBlock}>
                    <Col>包裹编号: <span className={styles.sn}>{res.order_sn?res.order_sn:'暂无'}</span></Col>
                    <Col>第三方订单号: <span className={styles.sn}>{res.pay_sn?res.pay_sn:'暂无'}</span></Col>
                    <Col>支付类型: <span className={styles.sn}>{payType[res.pay_type-1]?payType[res.pay_type-1]:'暂无'}</span></Col>
                  </Row>

                  <Row className={styles.stepBlock}>
                    {
                      res.order_status === 1 ? (
                        <Steps current={1}>
                          <Step title="创建订单" />
                          <Step title="订单取消" />
                        </Steps>
                      ) : res.order_status === 6 ? (
                        <Steps current={2}>
                          <Step title="创建订单" />
                          <Step title="付款成功" />
                          <Step title="订单已退款" />
                        </Steps>
                      ) : (
                        <Steps current={res.stepStatus}>
                          <Step title="创建订单" />
                          <Step title="付款成功" />
                          <Step title="卖家发货" />
                          <Step title="确认收货" />
                        </Steps>
                      )
                    }
                  </Row>
                </div>
                {
                  res.order_status > 2 ? (
                    <div className={styles.whiteBlock}>
                      <Row className={styles.grayBlock}>快递公司:<span className={styles.sn}>{res.pack_express_name}</span><span className={styles.exp}>快递单号:</span><span className={styles.expCode}>{res.pack_express_sn}</span></Row>
                    </div>
                  ) : null
                }
                <Table
                  bordered
                  dataSource={res.has_order_goods}
                  rowKey={record => record.goods_id}
                  columns={goodColumns}
                  pagination={false}
                />
                <div className={styles.goodPrice}>
                  <div>商品小计:¥{res.amount}</div>
                  <div>运费:¥{res.shipping_fee}</div>
                </div>
              </Card>
            )
          })
        }
        <div className={styles.goodPrice}>
          <div className={styles.payment}>实际支付:<span>¥{orderDetail.order_amount}</span></div>
        </div>
      </PageHeaderLayout>
    );
  }
}
