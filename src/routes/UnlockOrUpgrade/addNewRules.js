import React, { Component } from 'react';
import styles from './uou.less';
import {Row, Col } from 'antd';
class AddNewRules extends Component {
  render() {
    const data=[
      {
        type:'盟主',
        number:'10'
      }]
    return (
      <ul className={styles.uouContent}>
        <li>
          <Row className={styles.uouListH}>
            <Col span={4} className={styles.listBor}>身份版本</Col>
            <Col span={4} className={styles.listBor}>赠送解锁码数量（个）</Col>
          </Row>
        </li>
        {data.map(item=>{
          return (
            <li key={item.type}>
              <Row className={styles.uouListH}>
                <Col span={4} className={styles.listBor}>{item.type}</Col>
                <Col span={4} className={styles.listBor}>{item.number}</Col>
              </Row>
            </li>
          )
        })}
      </ul>
    );
  }
}

export default AddNewRules;
