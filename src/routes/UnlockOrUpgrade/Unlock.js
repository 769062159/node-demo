import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Select,Card,Row,Col,Input,DatePicker,Button,Table,message } from 'antd'
import moment from 'moment';
import SysModal from './sysModal'
import {toDateTime} from '../../utils/date'
import styles from './uou.less'
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
const { Option } = Select;
import { connect } from 'dva';
class Unlock extends Component {
  state={
    code_type:0,
    action_type:0,
    source:0,
    search_type:0,
    search_input:'',
    openTime:[],
  }
  showModal = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = e => {
    this.setState({
      visible: false,
    })
  }
  handleOk = params => {
    const {dispatch}=this.props
    const { upgrade_user_id,upgrade_amount,upgrade_remark }= params
    let body={
      user_id:upgrade_user_id,
      amount:upgrade_amount,
      remark:upgrade_remark,
    }
    if(upgrade_user_id&&upgrade_amount&&upgrade_remark){
      dispatch({
        type:'unlockorupgrade/createUnlockCode',
        payload:body
      })
    }else{
      message.error('字段缺失，请补充完整')
    }
    this.sysmodal.handleCancel()
  };
  searchMethod=()=>{
    const {dispatch}=this.props
    const {search_type,search_input,code_type,action_type,source,openTime}=this.state
    let body={}
    if(search_type&&search_input) { body[search_type] = search_input }else{
      if(search_type){ message.error('请补齐搜索条件！') }
    }
    if(code_type){ body.code_type=code_type }
    if(action_type){ body.action_type=action_type }
    if(source){ body.source=source }
    if(openTime.length){ body.openTime=openTime }

    dispatch({
      type:'unlockorupgrade/getUnlockChangeList',
      payload:body
    })
    this.clearData()
  }
  clearData=()=>{
    this.setState({
      search_type:0,
      search_input:'',
      code_type:0,
      action_type:0,
      source:0,
      openTime:[],
      keyValue:new Date()
    })
  }
  componentDidMount(){
    const {dispatch}=this.props
    dispatch({ type:'unlockorupgrade/getUnlockChangeList'})
  }
  render() {
    const {unlockorupgrade} =this.props

    const columns = [
      {
        title: '用户昵称',
        dataIndex: 'user',
        key: 'nickname',
        render:(text)=>{
          return text.nickname
        }
      },
      {
        title: '用户ID',
        dataIndex: 'user',
        key: 'user',
        render:(text)=>{
          return text.id
        }
      },
      {
        title: '业务类型',
        dataIndex: 'code_type',
        key: 'code_type'
      },
      {
        title: '用户身份版本',
        dataIndex: 'action_type',
        key: 'action_type',
      },
      {
        title: '涉及升级码数量',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '剩余升级码数量',
        dataIndex: 'balance',
        key: 'balance',
      },
      {
        title: '发生时间',
        dataIndex: 'time',
        key: 'time',
        render:(text)=>{
          return toDateTime(text)
        }
      },
      {
        title: '对应商城订单号',
        dataIndex: 'order_sn',
        key: 'order_sn',
      },
      {
        title: '使用对象',
        dataIndex: 'action_user',
        key: 'action_user',
        render:(text)=>{
          return text.nickname
        }
      },
      {
        title: '对象ID',
        dataIndex: 'action_user',
        key: 'action_user_id',
        render:(text)=>{
          return text.id
        }
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
    ];
    return (
      <PageHeaderLayout>
        <Card>
          <Row className={styles.rowStyle}>
            <Col span={2} className={styles.labelTitle}>搜索：</Col>
            <Col span={10}>
              <InputGroup compact style={{display:'flex',flexWrap:'nowrap'}}>
                <Select
                  style={{width:'150px'}}
                  placeholder="请选择搜索类型"
                  defaultValue={0}
                  value={this.state.search_type}
                  onChange={(value)=>{
                    this.setState({search_type:value})
                  }}
                >
                  <Option value={0}>全部</Option>
                  <Option value='order_sn'>商城订单号</Option>
                  <Option value='user_id'>用户ID</Option>
                  <Option value='action_user_id'>使用对象ID</Option>
                  <Option value='user_nickname'>用户昵称</Option>
                  <Option value='action_user_nickname'>使用对象昵称</Option>
                </Select>
                <Input
                  style={{ width: '50%' }}
                  placeholder="请输入关联条件"
                  value={this.state.search_input}
                  onChange={(e)=>{this.setState({search_input:e.target.value})}}/>
              </InputGroup>
            </Col>
          </Row>
          <Row className={styles.rowStyle}>
            <Col span={2} className={styles.labelTitle}>发生时间：</Col>
            <Col span={10}>
              <RangePicker
                value={moment[this.state.openTime]}
                onChange={(value,dateStrings)=>{
                  this.setState({openTime:dateStrings},()=>{console.log(this.state.openTime)})

                }}/>
            </Col>
          </Row>

          <Row className={styles.rowStyle}>
            <Col span={2} className={styles.labelTitle}>业务类型：</Col>
            <Col span={3}>
              <Select
                style={{width:'200px'}}
                placeholder="请选择搜索类型"
                value={this.state.source}
                defaultValue={0}
                onChange={(value)=>{
                  this.setState({source:value})
                }}
              >
                <Option value={0}>全部</Option>
                <Option value={1}>赠送</Option>
                <Option value={2}>购买</Option>
                <Option value={3}>正常消费</Option>
                <Option value={4}>返还</Option>
                <Option value={5}>系统调整</Option>
              </Select>
            </Col>
          </Row>
          <Row className={styles.rowStyle}>
            <Col span={2} className={styles.labelTitle}>操作类型：</Col>
            <Col span={3}>
              <Select
                style={{width:'200px'}}
                // placeholder="请选择搜索类型"
                value={this.state.action_type}
                defaultValue={0}
                onChange={(value)=>{
                  this.setState({action_type:value})
                }}
              >
                <Option value={0}>全部</Option>
                <Option value={1}>收入</Option>
                <Option value={2}>支出</Option>
              </Select>
            </Col>
          </Row>
          <Row className={styles.rowStyle}>
            <Col span={2} style={{height:'30px',lineHeight:'30px'}}></Col>
            <Col span={2}>
              <Button type='primary' onClick={()=>{this.searchMethod()}}>搜索</Button>
            </Col>
            <Col span={2}>
              <Button type='primary' onClick={()=>{}}>导出</Button>
            </Col>
            <Col span={2}>
              <Button type='primary' onClick={()=>{this.sysmodal.showModal()}}>系统调整</Button>
            </Col>
          </Row>

        </Card>
        <Card>
          <Table
            dataSource={unlockorupgrade.unlockChangeList}
            columns={columns}
            rowKey={(record)=>record.id}
          />
        </Card>
        <SysModal
          type='unlock'
          ref={node=>this.sysmodal=node}
          unlockHandleOk={(params)=>this.handleOk(params)}
        />
      </PageHeaderLayout>
    );
  }
}

export default connect(({ unlockorupgrade })=>({
  unlockorupgrade,
}))(Unlock);
