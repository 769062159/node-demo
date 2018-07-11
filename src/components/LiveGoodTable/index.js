import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Col, Form, Row, Button } from 'antd';
import { dedupe } from '../../utils/utils';

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
    selectList: [],
    selectArr: [],
  };
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
    let { selectList } = this.state;
    const { selectArr } = this.state;
    selectList = selectList.filter(res => {
      return res.goods_id !== goods.goods_id;
    });
    selectArr.push(goods.goods_id);
    this.setState({
      selectList,
      selectArr,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'live/selectLiveGood',
      payload: {
        goods,
      },
    });
  };
  deleteSelect = goods => {
    let { selectArr } = this.state;
    selectArr = selectArr.filter(res => {
      return res !== goods.goods_id;
    });
    this.setState({
      selectArr,
    });
    console.log(selectArr);
    const { dispatch } = this.props;
    dispatch({
      type: 'live/deleteLiveGood',
      payload: {
        goods,
      },
    });
  };
  allSelectAdd = () => {
    const { selectList } = this.state;
    console.log(selectList);
    const { dispatch } = this.props;
    this.setState({
      selectList: [],
    });
    dispatch({
      type: 'live/selectLiveGood',
      payload: {
        goods: selectList,
      },
    });
  };
  // 换页
  handleTableChange = pagination => {
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
        page_number: 3,
      },
    });
  };
  selectGoods = selectList => {
    const { live: { goodsList: datas } } = this.props;
    const arrSet = new Set(selectList);
    // let data = datas.filter(res => {
    //   return arrSet.has(res.goods_id) && res.disabled !== 1;
    // });
    const { selectList: list } = this.state;
    let merge = dedupe(datas.concat(list));
    merge = merge.filter(res => {
      return arrSet.has(res.goods_id) && res.disabled !== 1;
    });
    this.setState({ selectList: merge, selectArr: selectList });
  };

  render() {
    const { live: { goodsList: datas, goodsListPage, liveGoods }, loading } = this.props;
    const { selectArr, selectList } = this.state;
    console.log(selectArr);
    console.log(datas);
    const rowSelection = {
      selectedRowKeys: selectArr,
      onChange: this.selectGoods,
      getCheckboxProps: record => ({
        defaultChecked: record.disabled === 1,
      }),
    };
    const progressColumns = [
      {
        title: '商品图片',
        dataIndex: 'img',
        key: 'goods_id',
        render: val => (val ? <img src={val} style={{ width: '60px' }} alt="图片" /> : null),
      },
      {
        title: '商品名',
        dataIndex: 'goods_name',
        width: 150,
      },
      {
        title: '价格',
        dataIndex: 'goods_price',
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            {record.disabled === 1 ? (
              '添加'
            ) : (
              <a onClick={this.joinSelect.bind(this, record)}>添加</a>
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
        render: val => (val ? <img src={val} style={{ width: '60px' }} alt="图片" /> : null),
      },
      {
        title: '商品名',
        dataIndex: 'goods_name',
        width: 150,
      },
      {
        title: '价格',
        dataIndex: 'goods_price',
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
            dataSource={liveGoods}
            rowKey={record => record.goods_id}
            columns={progressColumnsdel}
            pagination={{ pageSize: 3 }}
            // footer={() => (
            //   <Button
            //     type="primary"
            //     disabled={datas.length}
            //     loading={loading}
            //   >
            //     批量移除
            //   </Button>
            // )}
          />
        </Col>
      </Row>
    );
  }
}
