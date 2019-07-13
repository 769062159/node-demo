import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Modal, Select,Card,Row,Col,Input,DatePicker,Button,Table,Radio } from 'antd'
import {toDateTime} from '../../utils/date'
import styles from './uou.less'
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
const { Option } = Select;
import { connect } from 'dva';
class Upgrade extends Component {
  state={
    visible:false,
    openTime:[],
    radio:1
    /*search_type:'',
    search_input:'',
    code_type:'',
    action_type:"",
    source:'',*/
  }
  showModal = () => {
    this.setState({
      visible: true
    })
  }
  handleOk = e => {
    this.setState({ visible: false });
  };
  handleCancel = e => {
    this.setState({
      visible: false,
    })
  }
  onChangeRadio=(e)=>{
    this.setState({
      radio: e.target.value,
    });
  }
  searchMethod=()=>{
    const {dispatch}=this.props
    const {search_type,search_input,code_type,action_type,source,openTime}=this.state
    let body={}
    if(search_type&&search_input) { body[search_type] = search_input }
    if(code_type){ body.code_type=code_type }
    if(action_type){ body.action_type=action_type }
    if(source){ body.source=source }
    if(openTime.length){ body.openTime=openTime }

    dispatch({
      type:'unlockorupgrade/getUpgradeChangeList',
      payload:body
    })
    this.clearData()
  }
  clearData=()=>{
    this.setState({
      search_type:'',
      search_input:'',
      code_type:'',
      action_type:'',
      source:'',
      openTime:[]
    })
  }
  componentDidMount(){
    const {dispatch}=this.props
    dispatch({ type:'unlockorupgrade/getUpgradeChangeList'})
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
        key: 'code_type',
        render:(text)=>{
          return text.value
        }
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
                    value={this.state.search_type}
                    onChange={(value)=>{
                      this.setState({search_type:value})
                    }}
                  >
                    <Option value='order_sn'>商城订单号</Option>
                    <Option value='user_id'>用户ID</Option>
                    <Option value='action_user_id'>使用对象ID</Option>
                    <Option value='user_nickname'>用户昵称</Option>
                    <Option value='action_user_nickname'>使用对象昵称</Option>
                  </Select>
                  <Input
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
                   onChange={(value,dateStrings)=>{
                   this.setState({openTime:dateStrings})
                 }}/>
              </Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={2} className={styles.labelTitle}>升级码类型：</Col>
              <Col span={3}>
                  <Select
                    style={{width:'200px'}}
                    placeholder="请选择搜索类型"
                    value={this.state.code_type}
                    onChange={(value)=>{
                      this.setState({code_type:value})
                    }}
                  >
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
                value={this.state.source}
                onChange={(value)=>{
                  this.setState({source:value})
                }}
              >
                <Option value={1}>系统</Option>
                <Option value={2}>手工</Option>
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
                onChange={(value)=>{
                  this.setState({action_type:value})
                }}
              >
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
                <Button type='primary' onClick={()=>{this.showModal()}}>系统调整</Button>
              </Col>
            </Row>
        </Card>
        <Card>
          <Table
            dataSource={unlockorupgrade.upgradeChangeList}
            columns={columns}
            rowKey={(record)=>record.id}
          />
        </Card>
        <Modal
          title='充值升级码'
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Row>
            <Col>
              <Radio.Group onChange={this.onChangeRadio} value={this.state.radio}>
                <Radio value={1}>店主升级码</Radio>
                <Radio value={2}>盟主升级码</Radio>
              </Radio.Group>
            </Col>
          </Row>
          <Row className={styles.rowStyle}>
            <Col span={6} className={styles.labelTitle}>请输入用户ID：</Col>
            <Col span={10}>
                <Input
                  style={{ width: '100%' }}
                  value={this.state.search_input}
                  onChange={(e)=>{this.setState({search_input:e.target.value})}}/>
            </Col>
          </Row>
          <Row className={styles.rowStyle}>
            <Col span={6} className={styles.labelTitle}>请输入调整数量：</Col>
            <Col span={10}>
              <Input
                style={{ width: '100%' }}
                value={this.state.search_input}
                onChange={(e)=>{this.setState({search_input:e.target.value})}}/>
            </Col>
          </Row>
          <Row className={styles.rowStyle}>
            <Col span={6} className={styles.labelTitle}>备注：</Col>
            <Col span={10}>
              <Input
                style={{ width: '100%' }}
                value={this.state.search_input}
                onChange={(e)=>{this.setState({search_input:e.target.value})}}/>
            </Col>
          </Row>
        </Modal>
      </PageHeaderLayout>

    );
  }
}

export default connect(({ unlockorupgrade })=>({
  unlockorupgrade,
}))(Upgrade);
