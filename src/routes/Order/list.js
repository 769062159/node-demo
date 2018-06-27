import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Row, Col, List } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

// import styles from './TableList.less';

// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');
// const statusMap = ['processing', 'processing', 'error'];
// const goodsStatus = ['上架', '未上架', '下架'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];

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
    const listData = [];
    for (let i = 0; i < 23; i++) {
      listData.push({
        href: 'http://ant.design',
        title: `ant design part ${i}`,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        description:
          'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
          'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      });
    }

    return (
      <PageHeaderLayout title="订单列表">
        <Card bordered={false}>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 3,
            }}
            dataSource={orderList}
            // footer={<div><b>ant design</b> footer part</div>}
            renderItem={item => (
              <List.Item>
                <Card title={`订单号:${item.order_sn}`}>
                  <Card>
                    <Row gutter={24}>
                      <Col span={8}>收货人: {item.consignee}</Col>
                      <Col span={8}>联系电话: {item.mobile}</Col>
                      <Col span={8}>订单金额: {item.total_amount}</Col>
                    </Row>
                    <div>
                      生成时间: {moment(item.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                    <div>
                      订单地址:{' '}
                      {item.province_name + item.city_name + item.district_name + item.address}
                    </div>
                  </Card>
                  {item.has_order_pack.map((res, index) => {
                    return (
                      <Card title={`包裹${index + 1}`}>
                        {res.has_order_goods.map(ele => {
                          return (
                            <Row gutter={24}>
                              <Col span={8}>商品名称: {ele.goods_name}</Col>
                              <Col span={8}>{/* 数量: {ele.mobile} */}</Col>
                              <Col span={8}>销售价格: {ele.sell_goods_price}</Col>
                            </Row>
                          );
                        })}
                      </Card>
                    );
                  })}
                </Card>
              </List.Item>
              // <List.Item
              //   key={item.title}
              //   actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
              //   extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
              // >
              //   <List.Item.Meta
              //     avatar={<Avatar src={item.avatar} />}
              //     title={<a href={item.href}>{item.title}</a>}
              //     description={item.description}
              //   />
              //   {item.content}
              // </List.Item>
            )}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
