import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Modal, Select,Card,Row,Col,Input,DatePicker,Button,Table,Radio,message } from 'antd'
import {toDateTime} from '../../utils/date'
import styles from './uou.less'
import SysModal from './sysModal'
import moment from 'moment'
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
const { Option } = Select;
import { connect } from 'dva';
import ActionPassword from '../../utils/actionPassword';
class Upgrade extends Component {
  state={
    visible:false,
    openTime:[],

    search_type:0,
    search_input:'',
    code_type:0,
    action_type:0,
    source:0,
  }

  handleOk = params => {
    const {dispatch}=this.props
    const { upgrade_code_type,upgrade_user_id,upgrade_amount,upgrade_remark}= params
    let body={
      code_type:upgrade_code_type,
      user_id:upgrade_user_id,
      amount:upgrade_amount,
      remark:upgrade_remark,
    }
    if(upgrade_code_type&&upgrade_user_id&&upgrade_amount&&upgrade_remark){
      dispatch({
        type:'unlockorupgrade/createUpgradeCode',
        payload:body
      })
    }else{
      message.error('字段缺失，请补充完整')
    }
    this.sysmodal.handleCancel()
  };
  searchMethod=(type)=>{
    const {dispatch}=this.props
    const {search_type,search_input,code_type,action_type,source,openTime}=this.state
    let body={}
    if(search_type&&search_input) { body[search_type] = search_input }else{if(search_type){ message.error('请补齐搜索条件！') }}
    if(code_type){ body.code_type=code_type }
    if(action_type){ body.action_type=action_type }
    if(source){ body.source=source }
    if(openTime.length&&openTime[0]&&openTime[1]){
      body.start=openTime[0]
      body.end=openTime[1]
    }
    if(type=='export'){
      dispatch({
        type:'unlockorupgrade/exportUpgradeCode',
        payload:body
      })
    }else{
      dispatch({
        type:'unlockorupgrade/getUpgradeChangeList',
        payload:body
      })
    }
    // this.clearData()
  }
  clearData=()=>{
    this.setState({
      search_type:0,
      search_input:'',
      code_type:0,
      action_type:0,
      source:0,
    })
  }
  componentDidMount(){
    const {dispatch}=this.props
    dispatch({ type:'unlockorupgrade/getUpgradeChangeList'})
    dispatch({ type: 'frontUser/fetchFrontUserList' });
  }
  render() {
    const {unlockorupgrade,global} =this.props

    const columns = [
      {
        title: '用户昵称',
        dataIndex: 'user',
        key: 'nickname',
        render:(text)=>{
          return <div style={{whiteSpace:'nowrap'}}>{text.nickname}</div>
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
        title: '用户身份/运营中心',
        dataIndex: 'permission',
        key: 'permission',
        render:(text)=>{
          if(text.operate.key==0){
            return <div>{text.permission.value}</div>
          }else{
            return <div>{text.operate.value}</div>
          }
        }
      },
      {
        title: '业务类型',
        dataIndex: 'code_type',
        key: 'code_type',
        render:(text)=>{
          return <div style={{whiteSpace:'nowrap'}}>{text.value}</div>
        }
      },
      {
        title: '操作类型',
        dataIndex: 'data',
        key: 'type',
        render:(text)=>(
          <div>{text.type==1?'收入':'支出'}</div>
        )
      },
      {
        title: '操作来源',
        dataIndex: 'source',
        key: 'source',
        render:(text)=>(
          <div>{text.value}</div>
        )
      },
      {
        title: '涉及升级码数量',
        dataIndex: 'data',
        key: 'data',
        render:(text)=>(
          <div>{text.type==1?'+':'-'}{text.amount}</div>
        )
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
          return toDateTime(text*1000)
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
      global.actionPassword != '' ?
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
                    placeholder="请输入查询条件"
                    style={{ width: '50%' }}
                    value={this.state.search_input}
                    onChange={(e)=>{this.setState({search_input:e.target.value})}}/>
                </InputGroup>
              </Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={2} className={styles.labelTitle}>发生时间：</Col>
              <Col span={10}>
                <RangePicker
                  format="YYYY-MM-DD"
                  onChange={(value,dateStrings)=>{
                    this.setState({openTime:dateStrings})
                  }}
                  /*disabledDate={(current) => {
                    return  current > moment().endOf('day').add(1,'day')  ;
                  }}*/
                />
              </Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={2} className={styles.labelTitle}>升级码类型：</Col>
              <Col span={3}>
                <Select
                  style={{width:'200px'}}
                  defaultValue={0}
                  value={this.state.code_type}
                  onChange={(value)=>{
                    this.setState({code_type:value})
                  }}
                >
                  <Option value={0}>全部</Option>
                  <Option value={1}>店主</Option>
                  <Option value={2}>盟主</Option>
                </Select>
              </Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={2} className={styles.labelTitle}>操作来源：</Col>
              <Col span={3}>
                <Select
                  style={{width:'200px'}}
                  placeholder="请选择搜索类型"
                  defaultValue={0}
                  value={this.state.source}
                  onChange={(value)=>{
                    this.setState({source:value})
                  }}
                >
                  <Option value={0}>全部</Option>
                  <Option value={1}>手动</Option>
                  <Option value={2}>系统调整</Option>
                </Select>
              </Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={2} className={styles.labelTitle}>操作类型：</Col>
              <Col span={3}>
                <Select
                  style={{width:'200px'}}
                  placeholder="请选择搜索类型"
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
                <Button type='primary' onClick={()=>{this.searchMethod('export')}}>导出</Button>
              </Col>
              <Col span={2}>
                <Button type='primary' onClick={()=>{
                  this.sysmodal.showModal()
                  // console.log(this.sysM)
                }}>系统调整</Button>
              </Col>
            </Row>
          </Card>
          <Card className={styles.standardTable}>
            <Table
              dataSource={unlockorupgrade.upgradeChangeList}
              columns={columns}
              rowKey={(record)=>record.id+Math.random()}
            />
          </Card>
          <SysModal
            ref={node=>this.sysmodal=node}
            type='upgrade'
            handleOk={(params)=>this.handleOk(params)}
            showUserInfo={(id)=>{this.showUserInfo(id)}}
            userInfo={this.props.unlockorupgrade.userInfo}
          />

        </PageHeaderLayout>
          :
        <PageHeaderLayout>
          <ActionPassword/>
        </PageHeaderLayout>
    );
  }

  showUserInfo=(id)=>{
    const {dispatch}=this.props
    const body={ user_id:id }
    dispatch({
      type: 'unlockorupgrade/getAcount',
      payload: body,
    });
  }
}

export default connect(({ unlockorupgrade,global })=>({
  unlockorupgrade,
  global
}))(Upgrade);