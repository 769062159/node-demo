import React, { Component } from 'react';
import { Card, Button, Row, Col, Modal, Form, Select, Input } from 'antd';
import AddNewRules from './addNewRules';
import styles from './uou.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const { Search } = Input;

const { Option } = Select;

class Unlock extends Component {
  state = { visible: false,selectGoodsStatus:false }

  //显示新增规则
  showModal = () => { this.setState({ visible: true, }) }

  //选择商品
  showSelectGoodsModal = () => { this.setState({ selectGoodsStatus: true, }) }

  handleOk = e => {
    this.setState({
      visible: false,
    }, () => {
      this.props.form.resetFields();
    });
  };

  handleCancel = e => {this.setState({ visible: false, })}

  handleSelectGoodsCancel=e=>{this.setState({ selectGoodsStatus: false, })}

  render() {
    const imgData=[
      {
        img:'',
        name:'1',
        price:'21'
      },
      {
        img:'',
        name:'2',
        price:'234'
      },
    ]
    return (
      <PageHeaderLayout>
        <Card title="解锁码赠送设置">
          <Button type='primary' onClick={this.showModal}>新建赠送规则</Button>
          <AddNewRules/>
        </Card>
        <Card title="解锁码购买设置">
          <Row>购买指定商品可获得解锁码：</Row>
          <Button type='primary' onClick={this.showSelectGoodsModal}>选择商品</Button>
          <Row>购买指定商品可获得解锁码的商品列表</Row>
          <Row className={styles.goodContent}>
            <Col span={4} className={styles.goodImg}><img src="" alt=""/></Col>
            <Col span={10} className={styles.goodText}>
              <div className="goodName">这个是商品名称名称名称名称名称名称最多2行展示...</div>
              <div className="goodPrice">售价：¥45.55</div>
            </Col>
          </Row>
          <Row>
            购买该设定的商品的1个库存后，可以获得
            10
            个解锁码
          </Row>
        </Card>
        <Card title="升级码赠送设置">
          <ul className={styles.uouContent}>
            <li>
              <Row className={styles.uouListH}>
                <Col span={4} className={styles.listBor}>身份版本</Col>
                <Col span={4} className={styles.listBor}>赠送店主升级码数量（个）</Col>
                <Col span={4} className={styles.listBor}>赠送盟主升级码数量（个）</Col>
              </Row>
            </li>
            <li>
              <Row className={styles.uouListH}>
                <Col span={4} className={styles.listBor}>区代</Col>
                <Col span={4} className={styles.listBor}>10</Col>
                <Col span={4} className={styles.listBor}>5</Col>
              </Row>
            </li>
            <li>
              <Row className={styles.uouListH}>
                <Col span={4} className={styles.listBor}>市代</Col>
                <Col span={4} className={styles.listBor}>10</Col>
                <Col span={4} className={styles.listBor}>5</Col>
              </Row>
            </li>
            <li>
              <Row className={styles.uouListH}>
                <Col span={4} className={styles.listBor}>省代</Col>
                <Col span={4} className={styles.listBor}>10</Col>
                <Col span={4} className={styles.listBor}>5</Col>
              </Row>
            </li>
            <li>
              <Row className={styles.uouListH}>
                <Col span={4} className={styles.listBor}>盟主</Col>
                <Col span={4} className={styles.listBor}>10</Col>
                <Col span={4} className={styles.listBor}>5</Col>
              </Row>
            </li>
          </ul>

        </Card>

        <Modal
          title="新建赠送规则"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Row className={styles.addRulesModal}>
            <Col span={7}>请选择身份版本：</Col>
            <Col span={17}>
              <Select
                placeholder="请选择身份版本"
                style={{ width: '100%' }}
                onChange={() => {
                }}
              >
                <Option value={0}>群主</Option>
                <Option value={1}>店主</Option>
                <Option value={2}>补差价升级店主</Option>
                <Option value={3}>盟主</Option>
                <Option value={4}>补差价升级盟主</Option>
                <Option value={5}>区代</Option>
                <Option value={6}>市代</Option>
                <Option value={7}>省代</Option>
              </Select>
            </Col>
          </Row>
          <Row className={styles.addRulesModal}>
            <Col span={7}>赠送解锁码数量(个)：</Col>
            <Col span={17}>
              <Input/>
            </Col>
          </Row>
        </Modal>
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
          {imgData.map(item=>(
            <Row className={styles.goodsList}>
              <Col span={8}><img src={item.img} alt=""/></Col>
              <Col span={12}>
                <Row>{item.name}</Row>
                <Row>{item.price}</Row>
              </Col>
              <Col span={4}><Button type='primary'>选取</Button></Col>
            </Row>
          ))}

        </Modal>
      </PageHeaderLayout>
    );
  }
}

export default Form.create()(Unlock);
