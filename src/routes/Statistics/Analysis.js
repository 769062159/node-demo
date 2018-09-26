import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
//   Icon,
//   Card,
//   Tabs,
//   Table,
//   Radio,
//   DatePicker,
//   Tooltip,
//   Menu,
//   Dropdown,
} from 'antd';
// import numeral from 'numeral';
import {
//   ChartCard,
//   yuan,
//   MiniArea,
//   MiniBar,
//   MiniProgress,
//   Field,
//   Bar,
//   Pie,
//   TimelineChart,
} from 'components/Charts';
// import Trend from 'components/Trend';
// import NumberInfo from 'components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';

import styles from './Analysis.less';

// const { TabPane } = Tabs;
// const { RangePicker } = DatePicker;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ statistics, loading }) => ({
  statistics,
  loading: loading.effects.statistics,
}))
export default class Analysis extends Component {
  state = {
    // salesType: 'all',
    // currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'statistics/fetch',
    });
  }

  // componentWillUnmount() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'chart/clear',
  //   });
  // }

//   handleChangeSalesType = e => {
//     this.setState({
//       salesType: e.target.value,
//     });
//   };

//   handleTabChange = key => {
//     this.setState({
//       currentTabKey: key,
//     });
//   };

  handleRangePickerChange = rangePickerValue => {
    this.setState({
      rangePickerValue,
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  render() {
    // const { rangePickerValue, currentTabKey } = this.state;
    // salesType
    const { statistics: { statistics } } = this.props;
    // const {
    //   visitData,
    //   visitData2,
    //   salesData,
    //   searchData,
    //   offlineData,
    //   offlineChartData,
    //   salesTypeData,
    //   salesTypeDataOnline,
    //   salesTypeDataOffline,
    // } = chart;

    // const salesPieData =
    //   salesType === 'all'
    //     ? salesTypeData
    //     : salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;

    // const menu = (
    //   <Menu>
    //     <Menu.Item>操作一</Menu.Item>
    //     <Menu.Item>操作二</Menu.Item>
    //   </Menu>
    // );

    // const iconGroup = (
    //   <span className={styles.iconGroup}>
    //     <Dropdown overlay={menu} placement="bottomRight">
    //       <Icon type="ellipsis" />
    //     </Dropdown>
    //   </span>
    // );

    // const salesExtra = (
    //   <div className={styles.salesExtraWrap}>
    //     <div className={styles.salesExtra}>
    //       <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
    //         今日
    //       </a>
    //       <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
    //         本周
    //       </a>
    //       <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
    //         本月
    //       </a>
    //       <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
    //         全年
    //       </a>
    //     </div>
    //     <RangePicker
    //       value={rangePickerValue}
    //       onChange={this.handleRangePickerChange}
    //       style={{ width: 256 }}
    //     />
    //   </div>
    // );

    // const columns = [
    //   {
    //     title: '排名',
    //     dataIndex: 'index',
    //     key: 'index',
    //   },
    //   {
    //     title: '搜索关键词',
    //     dataIndex: 'keyword',
    //     key: 'keyword',
    //     render: text => <a href="/">{text}</a>,
    //   },
    //   {
    //     title: '用户数',
    //     dataIndex: 'count',
    //     key: 'count',
    //     sorter: (a, b) => a.count - b.count,
    //     className: styles.alignRight,
    //   },
    //   {
    //     title: '周涨幅',
    //     dataIndex: 'range',
    //     key: 'range',
    //     sorter: (a, b) => a.range - b.range,
    //     render: (text, record) => (
    //       <Trend flag={record.status === 1 ? 'down' : 'up'}>
    //         <span style={{ marginRight: 4 }}>{text}%</span>
    //       </Trend>
    //     ),
    //     align: 'right',
    //   },
    // ];

    // const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    // const CustomTab = ({ data, currentTabKey: currentKey }) => (
    //   <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
    //     <Col span={12}>
    //       <NumberInfo
    //         title={data.name}
    //         subTitle="转化率"
    //         gap={2}
    //         total={`${data.cvr * 100}%`}
    //         theme={currentKey !== data.name && 'light'}
    //       />
    //     </Col>
    //     <Col span={12} style={{ paddingTop: 36 }}>
    //       <Pie
    //         animate={false}
    //         color={currentKey !== data.name && '#BDE4FF'}
    //         inner={0.55}
    //         tooltip={false}
    //         margin={[0, 0, 0, 0]}
    //         percent={data.cvr * 100}
    //         height={64}
    //       />
    //     </Col>
    //   </Row>
    // );

    // const topColResponsiveProps = {
    //   xs: 24,
    //   sm: 12,
    //   md: 12,
    //   lg: 12,
    //   xl: 6,
    //   style: { marginBottom: 24 },
    // };

    return (
      <Fragment>
        <Row style={{ minHeight: 400}}>
          <Col md={24} xl={18}>
            <Row gutter={16}  className={styles.boxAll}>
              <Col span={6}>
                <div className={styles.boxOne}>
                  <img src="/img/totalsales.png" alt="" />
                  <div className={styles.word}>
                    <div className={styles.title}>总销售额</div>
                    <div className={styles.price}>¥{statistics.sale_amount || 0}</div>
                    <div className={`${styles.tip} ${styles.none}`}>1</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.boxTwo}>
                  <img src="/img/salesvolume.png" alt="" />
                  <div className={styles.word}>
                    <div className={styles.title}>今日销售额</div>
                    <div className={styles.price}>¥{statistics.today_sale_amount || 0}</div>
                    <div className={`${styles.tip} ${styles.none}`} >1</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.boxThree}>
                  <img src="/img/order.png" alt="" />
                  <div className={styles.word}>
                    <div className={styles.title}>今日订单数</div>
                    <div className={styles.price}>{statistics.today_order || 0}</div>
                    <div className={styles.tip}>拼团：{statistics.today_normal_order_num || 0} 普通：{statistics.today_group_order_num || 0}</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.boxFour}>
                  <img src="/img/pending.png" alt="" />
                  <div className={styles.word}>
                    <div className={styles.title}>待自提</div>
                    <div className={styles.price}>{statistics.claim_group_order_num || 0}</div>
                    <a href="#/order/group-list"><div className={styles.tip}>拼团：{statistics.claim_group_order_num || 0} 普通：0</div></a>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.boxFive}>
                  <img src="/img/tobedelivered.png" alt="" />
                  <div className={styles.word}>
                    <div className={styles.title}>待发货</div>
                    <div className={styles.price}>{statistics.deliverys || 0}</div>
                    <div className={styles.tip}>拼团：{statistics.delivery_group_order_num || 0} 普通：{statistics.delivery_normal_order_num || 0}</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <a href="#/saled/refund">
                  <div className={styles.boxSix}>
                    <img src="/img/refund.png" alt="" />
                    <div className={styles.word}>
                      <div className={styles.title}>退款审核</div>
                      <div className={styles.price}>{statistics.refund_order_num || 0}</div>
                      <div className={`${styles.tip} ${styles.none}`} >1</div>
                    </div>
                  </div>
                </a>
              </Col>
              <Col span={6}>
                <a href="#/finance/withdraw">
                  <div className={styles.boxSeven}>
                    <img src="/img/review.png" alt="" />
                    <div className={styles.word}>
                      <div className={styles.title}>提现审核</div>
                      <div className={styles.price}>{statistics.withdraw_order_num || 0}</div>
                      <div className={`${styles.tip} ${styles.none}`} >1</div>
                    </div>
                  </div>
                </a>
              </Col>
            </Row>
          </Col>
          <Col xl={6} md={24}>
            {/* <div>折线表</div> */}
          </Col>
        </Row>
      </Fragment>
    );
  }
}
