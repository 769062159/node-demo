import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Row, Col, List } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './List.less';

// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');
// const statusMap = ['processing', 'processing', 'error'];
// const goodsStatus = ['上架', '未上架', '下架'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];
const oredrStatus = ['未支付', '已取消', '已发货', '已收货', '已评价'];
const packStatus = ['订单正常', '订单已确认收货', '订单已取消', '订单已关闭'];
const warehouseType = ['仓库', '供应商', '本地仓库供应商货'];
const bigStyle = {
  width: '90%',
  textAlign: 'center',
  height: '100%',
};
const smallStyle = {
  width: '10%',
  textAlign: 'center',
  height: '100%',
};
const allStyle = {
  width: '100%',
  textAlign: 'center',
  height: '100%',
};

@connect(({ order, loading }) => ({
  order,
  loading: loading.models.indexs,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    // pagination: 1, // 页脚
  };

  // 换页
  // handleTableChange = pagination => {
  //   const { current } = pagination;
  //   this.setState({
  //     pagination: current,
  //   });
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'indexs/fetchAds',
  //     payload: {
  //       pagination: current,
  //     },
  //   });
  // };

  componentDidMount() {
    const { dispatch } = this.props;
    // const { pagination } = this.state;
    dispatch({
      type: 'order/fetchOrder',
      payload: {},
    });
  }

  render() {
    const { order: { orderList } } = this.props;

    return (
      <PageHeaderLayout>
        <Card bordered={false} hoverable={false}>
          <List
            itemLayout="vertical"
            className={styles.noMouse}
            // size="large"
            size="small"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 3,
            }}
            dataSource={orderList}
            // footer={<div><b>ant design</b> footer part</div>}
            renderItem={item => (
              <List.Item key={item.order_sn} className={styles.listItem}>
                <Card className={styles.RowItem} hoverable={false}>
                  <Card.Grid style={bigStyle}>
                    <Row >
                      <Col span={5}>
                        订单号：{item.order_sn}
                      </Col>
                      <Col span={3}>
                        总金额：{item.total_amount}
                      </Col>
                      <Col span={6}>
                        联系电话：{item.mobile}
                      </Col>
                      <Col span={6}>
                        下单时间：{moment(item.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
                      </Col>
                      <Col span={4}>
                        订单状态：{oredrStatus[item.order_status]}
                      </Col>
                    </Row>
                  </Card.Grid>
                  <Card.Grid style={smallStyle}>
                    <Row>
                      <Col>
                        操作
                      </Col>
                    </Row>
                  </Card.Grid>
                  {item.has_order_pack.map((res, index) => {
                    return (
                      <div key={index}>
                        <Card.Grid style={bigStyle}>
                          <Card bordered={false} hoverable={false}>
                            <Card.Grid style={allStyle}>
                              <Row gutter={24} >
                                <Col span={2}>
                                  包裹{ index + 1 }
                                </Col>
                                <Col span={5}>
                                  sn：{res.order_sn}
                                </Col>
                                <Col span={3}>
                                  状态：{packStatus[res.pack_order_status]}
                                </Col>
                                <Col span={3}>
                                  运费：{res.pack_shipping_fee}
                                </Col>
                                <Col span={3}>
                                  发货类型：{warehouseType[res.warehouse_type]}
                                </Col>
                                {
                                  res.pack_express_sn ? (
                                    <Col span={3}>
                                      快递单号：{res.pack_express_sn}
                                    </Col>
                                  ) : null
                                }
                                {
                                  res.pack_express_name ? (
                                    <Col span={3}>
                                      快递公司：{res.pack_express_name}
                                    </Col>
                                  ) : null
                                }
                                {
                                  res.pack_shipping_time ? (
                                    <Col span={3}>
                                      配送时间：{moment(res.pack_shipping_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
                                    </Col>
                                  ) : null
                                }
                              </Row>
                            </Card.Grid>
                          </Card>
                          <Row gutter={24}>
                            <Col span={4}>
                              图片
                            </Col>
                            <Col span={4}>
                              商品名
                            </Col>
                            <Col span={4}>
                              数量
                            </Col>
                            <Col span={4}>
                              单价
                            </Col>
                            <Col span={4}>
                              总价
                            </Col>
                            <Col span={4}>
                              状态
                            </Col>
                          </Row>
                          {res.has_order_goods.map((ele, eleIndex) => {
                            return (
                              <Row key={eleIndex} align="middle" type="flex">
                                <Col span={4}>
                                  <img src={ele.has_order_goods_sku.http_url} alt="图片" style={{width: '80%'}} />
                                </Col>
                                <Col span={4}>
                                  {ele.goods_name}
                                </Col>
                                <Col span={4}>
                                  {ele.has_order_goods_sku.total_goods_number}
                                </Col>
                                <Col span={4}>
                                  {ele.has_order_goods_sku.unit_price}
                                </Col>
                                <Col span={4}>
                                  {ele.sell_goods_price}
                                </Col>
                                <Col span={4}>
                                  {ele.goods_name}
                                </Col>
                              </Row>
                            )}
                          )}
                        </Card.Grid>
                        <Card.Grid style={smallStyle}>
                          <Row>
                            <Col>
                              操作
                            </Col>
                          </Row>
                        </Card.Grid>
                      </div>
                    );
                  })}
                </Card>
              </List.Item>
            )}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
