import React, { Component } from 'react';
import { Card, Button, Row, Col, Modal, Form, Select, Input,message,Table,Pagination } from 'antd';
import styles from './uou.less';
const { Search } = Input;
class GoodsConfig extends Component {
  state = {
    selectGoodsStatus:false,
    currentPage:1
  }
  showSelectGoodsModal = () => {this.setState({ selectGoodsStatus: true })}
  handleSelectGoodsCancel=()=>{this.setState({ selectGoodsStatus: false })}
  //选择商品
  onShowSizeChange=(current, pageSize)=> {
    console.log(current, pageSize);
  }
  render() {
    const columns = [
      {
        title: '商品示意图',
        dataIndex: 'img',
        key: 'img',
        width:150,
        render:(text)=>(
          <img src={text} style={{width:'60px',height:'60px'}} alt=""/>
        )
      },
      {
        title: '商品名称',
        dataIndex: 'goods_name',
        key: 'goods_name',
      },
      {
        title: '售价',
        dataIndex: 'goods_price',
        key: 'goods_price',
        render:(text)=>{
          return `￥${text}`
        }
      },
      {
        title: '操作',
        key: 'action',
        render:()=>(
          <Button type='primary'>选取</Button>
        )
      },
    ];
    const {goods}=this.props
    return (
      <Modal
        visible={this.state.selectGoodsStatus}
        closable={false}
        footer={null}
        onCancel={this.handleSelectGoodsCancel}
      >
        <Row className={styles.onlineGoods}>
          <Col span={4} className={styles.goods}>已上架商品</Col>
          <Col span={20} className={styles.goods}>
            <Search
              placeholder="请输入搜索商品名称"
              enterButton="搜索"
              onSearch={value => console.log(value)}
            />
          </Col>
        </Row>
        <Table
          dataSource={goods.goodsList}
          columns={columns}
          rowKey={(record)=>record.goods_id}
          pagination={false}
        />
        <Pagination
          current={this.state.currentPage}
          defaultCurrent={6}
          total={goods.goodsListPage.total}
          onChange={(page, pageSize)=>{
            this.setState({currentPage:page})
            this.props.getGoodsList(page)
          }}
        />
        {/*{goods.goodsList.map(item=>(
          <Row className={styles.goodsList} key={item.goods_id}>
            <Col span={5}><img src={item.img} alt=""/></Col>
            <Col span={14}>
              <Row>{item.goods_name}</Row>
              <Row>售价:￥{item.goods_price}</Row>
            </Col>
            <Col span={4}><Button type='primary' style={{float:'right'}}>选取</Button></Col>
          </Row>
        ))}*/}
      </Modal>
    );
  }
}

export default GoodsConfig;
