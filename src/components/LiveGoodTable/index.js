import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Col, Form, Row, Button } from 'antd';

// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');
// const statusMap = ['processing', 'processing', 'error'];
// const goodsStatus = ['上架', '未上架', '下架'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
@Form.create()
export default class Live extends PureComponent {
  state = {
    pagination: 1,
    selectList: [],
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'goods/fetchGoods',
      payload: {
        page: pagination,
        goods_status: 0,
        page_number: 3,
      },
    });
  }

  joinSelect = goods => {
    let { selectList } = this.state;
    selectList = selectList.filter(res => {
      return res !== goods;
    });
    this.setState({
      selectList,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/selectLiveGood',
      payload: {
        goods,
      },
    });
  };
  deleteSelect = goods => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/deleteLiveGood',
      payload: {
        goods,
      },
    });
  };
  allSelectAdd = () => {
    const { selectList } = this.state;
    console.log(selectList);
  };
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      pagination: current,
      selectList: [],
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/fetchGoods',
      payload: {
        page: current,
        goods_status: 0,
        page_number: 3,
      },
    });
  };
  selectGoods = selectList => {
    const { goods: { goodsList: datas } } = this.props;
    const arrSet = new Set(selectList);
    const data = datas.filter(res => {
      return arrSet.has(res.goods_id);
    });
    this.setState({ selectList: data });
  };

  render() {
    const { goods: { goodsList: datas, goodsListPage, selectGoodsList }, loading } = this.props;
    const { selectList } = this.state;
    const rowSelection = {
      selectList,
      onChange: this.selectGoods,
    };
    const progressColumns = [
      {
        title: '商品图片',
        dataIndex: 'img',
        render: val => (val ? <img src={val} style={{ width: '60px' }} alt="图片" /> : null),
      },
      {
        title: '商品名',
        dataIndex: 'goods_name',
        width: 150,
        key: 'goods_name',
      },
      {
        title: '价格',
        dataIndex: 'shop_shipping_price',
        key: 'shop_shipping_price',
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            <a onClick={this.joinSelect.bind(this, record)}>添加</a>
          </Fragment>
        ),
      },
    ];
    const progressColumnsdel = [
      {
        title: '商品图片',
        dataIndex: 'img',
        render: val => (val ? <img src={val} style={{ width: '60px' }} alt="图片" /> : null),
      },
      {
        title: '商品名',
        dataIndex: 'goods_name',
        width: 150,
        key: 'goods_name',
      },
      {
        title: '价格',
        dataIndex: 'shop_shipping_price',
        key: 'shop_shipping_price',
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            <a onClick={this.deleteSelect.bind(this, record)}>移除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <Row>
        <Col span={12}>
          <Table
            bordered
            rowSelection={rowSelection}
            dataSource={datas}
            rowKey={record => record.goods_id}
            loading={loading}
            columns={progressColumns}
            pagination={goodsListPage}
            onChange={this.handleTableChange}
            footer={() => (
              <Button
                type="primary"
                onClick={this.allSelectAdd}
                disabled={!selectList.length}
                loading={loading}
              >
                批量添加
              </Button>
            )}
          />
        </Col>
        <Col span={12}>
          <Table
            bordered
            dataSource={selectGoodsList}
            rowKey={record => record.goods_id}
            columns={progressColumnsdel}
            pagination={false}
            footer={() => (
              <Button
                type="primary"
                // onClick={this.start}
                disabled={datas.length}
                loading={loading}
              >
                批量移除
              </Button>
            )}
          />
        </Col>
      </Row>
    );
  }
}
