import React, { Component } from 'react';
import { Card, Button, Row, Col, Modal, Form, Select, Input } from 'antd';
import AddNewRules from './addNewRules'
import styles from './uou.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


const { Option } = Select;

class Unlock extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    },()=>{this.props.form.resetFields()});
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    },()=>{this.props.form.resetFields()});
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <PageHeaderLayout>
        <Card title="解锁码赠送设置">
          <Button type='primary' onClick={this.showModal}>新建赠送规则</Button>
          <AddNewRules />
        </Card>
        <Card title="解锁码购买设置">
          <Row>购买指定商品可获得解锁码：</Row>
          <Button type='primary' onClick={this.showModal}>选择商品</Button>
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
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Modal
            title="新建赠送规则"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Row>
              <Col span={24}>
                <Form.Item label="请选择身份版本：">
                  {getFieldDecorator('selectIdentityType', {
                    rules: [{ required: true, message: '请选择身份版本' }],
                  })(
                    <Select placeholder="请选择身份版本" style={{width:'100%'}}>
                      <Option value={0}>群主</Option>
                      <Option value={1}>店主</Option>
                      <Option value={2}>补差价升级店主</Option>
                      <Option value={3}>盟主</Option>
                      <Option value={4}>补差价升级盟主</Option>
                      <Option value={5}>区代</Option>
                      <Option value={6}>市代</Option>
                      <Option value={7}>省代</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="赠送解锁码数量(个)：">
                  {getFieldDecorator('GiftUnlockNum', {
                    rules: [{ required: true, message: '赠送解锁码数量！' }],
                  })(<Input/>)}
                </Form.Item>
              </Col>
            </Row>
          </Modal>
        </Form>
      </PageHeaderLayout>
    );
  }
}

export default Form.create()(Unlock);
