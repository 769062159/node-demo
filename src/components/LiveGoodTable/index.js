import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Col, Form, Row, Button } from 'antd';
import styles from './List.less';
// import { dedupe } from '../../utils/utils';
// ant-table-thead
// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');
// const statusMap = ['processing', 'processing', 'error'];
// const goodsStatus = ['上架', '未上架', '下架'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];

@connect(({ live, loading }) => ({
  live,
  loading: loading.models.live,
}))
@Form.create()
export default class Live extends PureComponent {
  state = {
    // pagination: 1,
    // selectArr: [],
  };
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/destroyPages',
    });
  }
  //   componentDidMount() {
  // const {  } = this.props;
  // const { pagination } = this.state;
  // dispatch({
  //   type: 'live/fetchLiveGoods',
  //   payload: {
  //     page: pagination,
  //     goods_status: 0,
  //     page_number: 3,
  //   },
  // });
  //   }

  joinSelect = goods => {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/selectLiveGood',
      payload: {
        goods,
      },
    });
  };
  deleteSelect = goods => {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/deleteLiveGood',
      payload: {
        goods,
      },
    });
  };
  allSelectAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/leftBatch',
    });
  };
  allSelectRemove = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/rightBatch',
    });
  };
  // 换页
  handleTableChange = pagination => {
    console.log(pagination);
    const { current } = pagination;
    // this.setState({
    //   selectList: [],
    // });
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchLiveGoods',
      payload: {
        page: current,
        goods_status: 0,
        page_number: 10,
      },
    });
  };
  selectGoods = selectList => {
    console.log(selectList);
    const { dispatch } = this.props;
    dispatch({
      type: 'live/leftSelectAction',
      payload: {
        selectList,
      },
    });
  };
  rightSelect = selectList => {
    const { dispatch } = this.props;
    dispatch({
      type: 'live/rightSelectAction',
      payload: {
        selectList,
      },
    });
  };

  render() {
    const {
      live: { goodsList: datas, goodsListPage, liveGoods, leftBatchArr, leftKeyArr, rightKeyArr },
      loading,
    } = this.props;
    // const { current } = this.state;
    // const { selectArr, selectList } = this.state;
    console.log(leftBatchArr);
    console.log(leftKeyArr);
    const rowSelection = {
      selectedRowKeys: leftKeyArr,
      onChange: this.selectGoods,
    };
    const rightSelection = {
      selectedRowKeys: rightKeyArr,
      onChange: this.rightSelect,
    };
    const progressColumns = [
      {
        title: '商品图片',
        dataIndex: 'img',
        key: 'goods_id',
        width: 100,
        render: val => (val ? <img src={val} style={{ width: '60px' }} alt="图片" /> : null),
      },
      {
        title: '商品名',
        dataIndex: 'goods_name',
        width: 150,
      },
      {
        title: '价格',
        width: 70,
        dataIndex: 'goods_price',
      },
      {
        title: '库存',
        width: 80,
        dataIndex: 'goods_total_inventory',
      },
      {
        title: '操作',
        width: 100,
        render: (text, record) => (
          <Fragment>
            {record.disabled === 1 ? null : (
              <Button type="primary" onClick={this.joinSelect.bind(this, record)}>
                添加
              </Button>
            )}
          </Fragment>
        ),
      },
    ];
    const progressColumnsdel = [
      {
        title: '商品图片',
        dataIndex: 'img',
        key: 'goods_id',
        width: 100,
        render: val => (val ? <img src={val} style={{ width: '60px' }} alt="图片" /> : null),
      },
      {
        title: '商品名',
        dataIndex: 'goods_name',
        width: 150,
      },
      {
        title: '价格',
        width: 70,
        dataIndex: 'goods_price',
      },
      {
        title: '库存',
        width: 80,
        dataIndex: 'goods_total_inventory',
      },
      {
        title: '操作',
        // fixed: 'right',
        width: 100,
        render: (text, record) => (
          <Fragment>
            <Button type="primary" onClick={this.deleteSelect.bind(this, record)}>
              移除
            </Button>
          </Fragment>
        ),
      },
    ];
    console.log(goodsListPage);
    return (
      <Row>
        <Col span={12}>选择商品：</Col>
        <Col span={12}>已选商品：</Col>
        <Col span={12} className={styles.tableHeaders}>
          <Table
            bordered
            rowSelection={rowSelection}
            dataSource={datas}
            rowKey={record => record.goods_id}
            loading={loading}
            columns={progressColumns}
            pagination={goodsListPage}
            onChange={this.handleTableChange}
            scroll={{ x: true, y: 479 }}
            // footer={() => (
            //   <Row>
            //     <Col span={8}>
            //       <Button type="primary" onClick={this.allSelectAdd} disabled={!leftBatchArr.length}>
            //         批量添加
            //       </Button>
            //     </Col>
            //     <Col span={16}>
            //       <Pagination {...goodsListPage}  onChange={this.handleTableChange} />
            //     </Col>
            //   </Row>
            // )}
          />
          <Button
            style={{ position: 'reletive', top: '-50px', right: '-20px' }}
            type="primary"
            onClick={this.allSelectAdd}
            disabled={!leftBatchArr.length}
          >
            批量添加
          </Button>
        </Col>
        <Col span={12} className={styles.tableHeaders}>
          <Table
            bordered
            rowSelection={rightSelection}
            dataSource={liveGoods}
            rowKey={record => record.goods_id}
            columns={progressColumnsdel}
            pagination={false}
            scroll={{ x: true, y: 479 }}
            // footer={() => (
            //   <Button type="primary" disabled={!rightKeyArr.length} onClick={this.allSelectRemove}>
            //     批量移除
            //   </Button>
            //   <Row>
            //     <Col span={8}>
            //       <Button type="primary" disabled={!rightKeyArr.length} onClick={this.allSelectRemove}>
            //         批量移除
            //       </Button>
            //     </Col>
            //     <Col span={16}>
            //       <Pagination pageSize={3} total={liveGoods.length} current={current} onClick={this.rightPagination}  />
            //     </Col>
            //   </Row>
            // )}
          />
          <Button
            style={{ position: 'reletive', top: '16px', right: '-20px' }}
            type="primary"
            disabled={!rightKeyArr.length}
            onClick={this.allSelectRemove}
          >
            批量移除
          </Button>
        </Col>
      </Row>
    );
  }
}
