import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import { Row, Steps, Table } from 'antd';
import { timeFormat } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './List.less';

const { Step } = Steps;
const orderStatus = ['待支付', '已取消', '待取货', '已发货', '已取货', '已评价', '已退款'];
@connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))
export default class GroupDetail extends PureComponent {
  state = {
  }
  
  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'order/getGroupDetail',
      payload: {
        order_id: id,
      },
    });
  }

  render() {
    const { order: { groupDetail } } = this.props;
    const userColumns = [
      {
        title: '类别',
        dataIndex: 'total_price',
        render: (val, record, index) => {
          return index === 0 ? '团长' : '团员';
        },
      },
      {
        title: '会员id',
        dataIndex: 'id',
        render:(val, record) => (
          record.has_user.id
        ),
      },
      {
        title: '会员昵称',
        dataIndex: 'has_user',
        render: (val) => (
          val.nickname
        ),
      },
      {
        title: '订单号',
        dataIndex: 'order_sn',
      },
      {
        title: '收货人',
        dataIndex: 'name',
      },
      {
        title: '收货人手机号码',
        dataIndex: 'mobile',
      },
    ];
    const goodColumns = [
      {
        title: '商品',
        dataIndex: 'goods_title',
        render: (val, record) => {
          return (
            <div className={styles.goodMsg}>
              <img alt="商品" src={record.http_url} />
              {val}
            </div>
          );
        },
      },
      {
        title: '单价/拼团价',
        dataIndex: 'group_price',
      },
      {
        title: '数量',
        dataIndex: 'id',
        render: () => (1),
      },
      // {
      //   title: '会员昵称',
      //   dataIndex: 'has_user',
      //   render: (val) => (
      //     val.nickname
      //   ),
      // },
      {
        title: '小计',
        dataIndex: 'create_time',
        render: (val, record) => (record.group_price),
      },
    ];
    let userList = [];
    const good = [];
    if (groupDetail.userList) {
      userList = groupDetail.userList;
    }
    if (groupDetail.has_group) {
      good.push(groupDetail.has_group);
    }
    return (
      <PageHeaderLayout>
        <div className={styles.whiteBlock}>
          <Row className={styles.grayBlock}>订单编号:<span className={styles.sn}>{groupDetail.order_sn}</span></Row>
          <Row className={styles.stepBlock}>
            {
              groupDetail.order_status === 1 ? (
                <Steps current={1}>
                  <Step title="创建订单" />
                  <Step title="订单取消" />
                </Steps>
              ) : groupDetail.groupStatus === 2 ? (
                <Steps current={2}>
                  <Step title="创建订单" />
                  <Step title="付款成功" />
                  <Step title="拼团失败" />
                </Steps>
              ) : (
                <Steps current={groupDetail.stepStatus}>
                  <Step title="创建订单" />
                  <Step title="付款成功" />
                  <Step title="拼团成功" />
                  <Step title="确认收货" />
                </Steps>
              )
            }
          </Row>
        </div>
        <div className={styles.CardBlock}>
          <Row className={styles.grayBlock}>订单信息</Row>
          <Row className={styles.stepBlock}>
            <div className={styles.orderMsg}>订单状态:{orderStatus[groupDetail.order_status]}</div>
            <div className={styles.orderMsg}>
              配送方式:{
                groupDetail.sale_channel ? (
                  '自提'
                ) : groupDetail.express_name ? (
                  groupDetail.express_name + ( groupDetail.express_code )
                ): null
              }
            </div>
            <div className={styles.orderMsg}>收货人:{groupDetail.consignee}<span>联系电话:{groupDetail.mobile}</span></div>
            <div className={styles.orderMsg}>
              {
                groupDetail.sale_channel ? (
                  '门店信息'
                ) : '收货地址'
              }:{groupDetail.store_name}({groupDetail.province_name + groupDetail.city_name + groupDetail.district_name + groupDetail.address})
              {
                groupDetail.sale_channel ? (
                  <span>联系电话:{groupDetail.shopMobile}</span>
                ) : null
              }
            </div>
            {
              (groupDetail.order_status === 4 || groupDetail.order_status === 5) ? (
                <div>
                  <div className={styles.orderMsg}>核销人:{groupDetail.has_check_user ? groupDetail.has_check_user.nickname : null}</div>
                  <div className={styles.orderMsg}>核销时期:{timeFormat(groupDetail.check_time)}</div>
                </div>
              ) : null
            }
            <div className={styles.orderMsg}>会员信息:{groupDetail.user_nickname}</div>
          </Row>
        </div>
        <div className={styles.CardBlock}>
          <Row className={styles.grayBlock}>团购成员基本信息</Row>
          <Row className={styles.stepBlock}>
            <Table
              bordered
              dataSource={userList}
              rowKey={record => record.id}
              columns={userColumns}
              pagination={false}
            />
          </Row>
        </div>
        <Table
          bordered
          dataSource={good}
          rowKey={record => record.id}
          columns={goodColumns}
          pagination={false}
        />
        {/* <div className={styles.CardBlock}>
          商品信息table
        </div> */}
        <div className={styles.goodPrice}>
          <div>商品小计:¥{groupDetail.order_amount}</div>
          {/* <div>运费:¥1.00</div> */}
          <div className={styles.payment}>实际支付:<span>¥{groupDetail.order_amount}</span></div>
        </div>
      </PageHeaderLayout>
    );
  }
}
