import React, { Component } from 'react';
import styles from './uou.less';
import {Row, Col ,Input,Table} from 'antd';
import { message, Modal } from 'antd/lib/index';
const { confirm } = Modal;
class AddNewRules extends Component {
  render() {
    const {unlock}=this.props
    const columns = [
      {
        title: '身份版本',
        dataIndex: 'type_name',
        key: 'type_name',
      },
      {
        title: '赠送解锁码数量',
        dataIndex: 'amount',
        key: 'amount',
        render:(record)=>{
          return <Input
            style={{textAlign:"center",border:'0',outline:'none'}}
            defaultValue={record}
            onPressEnter={(e)=>{
              confirm({
                content: '你确定修改这个吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                  /*dispatch({
                    type: 'video/cancelOrPosition',
                    payload: {
                      user_id: fakeid,
                      status,
                    }
                  });*/
                }
              });
            }}
          />
        }
      }
    ];
    return (
      <Table
        dataSource={unlock}
        columns={columns}
        className={styles.tableStyleRow}
      />
    );
  }
}
{/*<ul className={styles.uouContent}>
        <li>
          <Row className={styles.uouListH}>
            <Col span={4} className={styles.listBor}>身份版本</Col>
            <Col span={4} className={styles.listBor}>赠送解锁码数量（个）</Col>
          </Row>
        </li>
        {unlock&&unlock.map(item=>{
          return (
            <li key={item.id}>
              <Row className={styles.uouListH}>
                <Col span={4} className={styles.listBor}>{item.type_name }</Col>
                <Col span={4} className={styles.listBor}>
                  <Input
                    style={{textAlign:"center",border:'0',outline:'none'}}
                    defaultValue={item.amount}
                    onPressEnter={(e)=>console.log(e.target.value)}
                  />
                </Col>
              </Row>
            </li>
          )
        })}
      </ul>*/}
export default AddNewRules;
