import React, { Component, Fragment } from 'react';
import { Card, Button, Row, Col, Modal, Form, Select, Input,message,Table } from 'antd';
import '../../utils/emptyUtils'
import styles from './uou.less';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import GoodsConfig from './goodsConfig';


const { Option } = Select;
const { confirm } = Modal;

class Config extends Component {
  state = { visible: false,selectGoodsStatus:false }

  //显示新增升级/解锁码赠送规则
  showUpgradeModal=()=>{this.setState({ upgradeVisible: true })}
  showModal = (value) => {
    //value，0解锁，1升级
    this.setState({
      visible: true ,
      modalStatus:value
    })
  }
  //选择商品
  selectGoods=(record)=> {

    const body={
      goods_id:record.goods_id,
    }
    const {dispatch} = this.props
    dispatch({
      type:'unlockorupgrade/setUnlockGoods',
      payload:body
    })
    this.goodsConfig.handleSelectGoodsCancel()
  }

  handleOk = e => {
    const {modalStatus}=this.state
    if(modalStatus){
      this.addUpgradeRules()
    }else{
      this.addUnlockRules()
    }
    this.setState({ visible: false });
  };
  addUnlockRules=()=>{
    //新增解锁码赠送规则
    const { unlock_type, unlock_number }=this.state
    if(unlock_type&&unlock_number){
      const { dispatch }=this.props
      dispatch({
        type:'unlockorupgrade/unlockRules',
        payload:{
          type:unlock_type,
          amount:unlock_number,
        }
      })
    }else{
      message.error('输入有误请重新输入！')
    }
  }

  addUpgradeRules=()=>{
    //新增升级码赠送规则
    const { upgrade_type, upgrade_number1,upgrade_number2 }=this.state
    if(upgrade_type&&upgrade_number1&&upgrade_number2){
      const { dispatch }=this.props
      dispatch({
        type:'unlockorupgrade/upgradeRules',
        payload:{
          type:upgrade_type,
          v1_amount:upgrade_number1,
          v2_amount:upgrade_number2,
        }
      })
    }else{
      message.error('输入有误请重新输入！')
      return false
    }
  }

  /*showSelectGoodsModal = () => {

    this.setState({ selectGoodsStatus: true })
  }*/

  getGoodsList=(params)=>{
    const {dispatch}=this.props
    const body={ page_number: 10 }
    if(params){body.page=params}
    dispatch({
      type: 'goods/fetchGoods',
      payload: body,
    });
  }

  handleCancel = e => {
    this.setState({
      visible: false,
      unlock_type:'',
      unlock_number:'',
      upgrade_type:'',
      upgrade_number1:'',
      upgrade_number2:'',
    })
  }



  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({ type:'unlockorupgrade/getCodeInfo' })
    dispatch({ type:'unlockorupgrade/unlockTypeList' })
    dispatch({ type:'unlockorupgrade/upgradeTypeList' })
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      goods_amount:nextProps.unlockorupgrade.unlock_goods.amount
    })
  }

  render() {
    const columns1 =[
      {
        title: '身份版本',
        dataIndex: 'type_name',
        key: 'type_name',
      },
      {
        title: '赠送店主升级码数量',
        dataIndex: 'v1_amount',
        key: 'v1_amount',
        render:(record)=>{
          return <Input
            defaultValue={record}
            onChange={(e)=>{this.setState({temporary_upgrade_number1:e.target.value})}}
            onPressEnter={(e)=>{
              const _this=this
              confirm({
                content: '你确定修改这个吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                  const {dispatch}=_this.props
                  if(_this.state.temporary_upgrade_type&&_this.state.temporary_upgrade_number1){
                    dispatch({
                      type:'unlockorupgrade/upgradeRules',
                      payload:{
                        type:_this.state.temporary_upgrade_type,
                        v1_amount:_this.state.temporary_upgrade_number1
                      }
                    });
                  }else{
                    message.error('修改有误')
                  }
                }
              });
            }}
          />
        }
      },
      {
        title: '赠送盟主升级码数量',
        dataIndex: 'v2_amount',
        key: 'v2_amount',
        render:(record)=>{
          return <Input
            defaultValue={record}
            onChange={(e)=>{this.setState({temporary_upgrade_number2:e.target.value})}}
            onPressEnter={(e)=>{
              const _this=this
              confirm({
                content: '你确定修改这个吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                  const {dispatch}=_this.props
                  if(_this.state.temporary_upgrade_type&&_this.state.temporary_upgrade_number2){
                    dispatch({
                      type:'unlockorupgrade/upgradeRules',
                      payload:{
                        type:_this.state.temporary_upgrade_type,
                        v2_amount:_this.state.temporary_upgrade_number2,
                      }
                    });
                  }
                }
              });
            }}
          />
        }
      }
    ]
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
            defaultValue={record}
            onChange={(e)=>{this.setState({temporary_unlock_number:e.target.value})}}
            onPressEnter={(e)=>{
              const _this=this
              confirm({
                content: '你确定修改这个吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                  const {dispatch}=_this.props
                  if(_this.state.temporary_unlock_type&&_this.state.temporary_unlock_number){
                    dispatch({
                      type:'unlockorupgrade/unlockRules',
                      payload:{
                        type:_this.state.temporary_unlock_type,
                        amount:_this.state.temporary_unlock_number,
                      }
                    });
                  }
                }
              });
            }}
          />
        }
      }
    ];
    const {modalStatus}=this.state
    const {unlockorupgrade,goods}=this.props
    return (
      <PageHeaderLayout>
        <Card title="解锁码赠送设置" className={styles.cardStyle}>
          <Button type='primary' onClick={()=>this.showModal(0)}>新建解锁码赠送规则</Button>

          <Table
            dataSource={unlockorupgrade.unlock}
            columns={columns}
            className={styles.tableStyleRow}
            rowKey={(record)=>record.id}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({
                    temporary_unlock_type:record.type,
                    temporary_unlock_number:record.amount
                  })
                  console.log(record)
                }, // 点击行
              };
            }}
          />
        </Card>


        <Card title="解锁码购买设置" className={styles.cardStyle}>
          <Row>购买指定商品可获得解锁码：</Row>
          <Button type='primary' onClick={()=>{
            this.goodsConfig.showSelectGoodsModal()
            this.getGoodsList()
          }}>选择商品</Button>
          <Row>购买指定商品可获得解锁码的商品列表</Row>
          {unlockorupgrade.unlock_goods.goods&&[unlockorupgrade.unlock_goods.goods].map(item=>(
            <div  key={item.img}>
              <Row className={styles.goodContent} >
                <Col span={5} className={styles.goodImg}>
                  <img src={item.img} alt=""/>
                </Col>
                <Col span={10} className={styles.goodText}>
                  <div className={styles.goodName}>{item.name}</div>
                  <div className={styles.goodPrice}>售价：¥{item.price}</div>
                </Col>
              </Row>

            </div>
          ))
          }
          {unlockorupgrade.unlock_goods&&[unlockorupgrade.unlock_goods].map((item,index)=>(
            <Row className={styles.selectGoods} key={index}>
              <div style={{display:'flex',flexWrap:'nowrap'}}>
                <div className={styles.text}>购买该设定的商品的1个库存后，可以获得</div>
                <div>
                  <Input
                    style={{width:'200px'}}

                    value={this.state.goods_amount}
                    onChange={(e)=>this.setState({goods_amount:e.target.value})}
                    onPressEnter={()=>{
                      const _this=this
                      confirm({
                        content: '你确定修改对应商品解锁码数量？',
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk() {
                          const {dispatch}=_this.props
                          if(_this.state.goods_amount){
                            dispatch({
                              type:'unlockorupgrade/setUnlockGoods',
                              payload:{amount:_this.state.goods_amount}
                            })
                          }
                        }
                      });
                    }}
                  />
                </div>
                <div className={styles.text}>个解锁码</div>
              </div>
            </Row>
          ))}


          <GoodsConfig
            ref={node=>this.goodsConfig=node}
            goods={goods}
            getGoodsList={(params)=>this.getGoodsList(params)}
            selectGoods={(record)=>{this.selectGoods(record)}}
          />

        </Card>



        <Card title="升级码赠送设置" className={styles.cardStyle}>
          <Button type='primary' onClick={()=>this.showModal(1)}>新建升级码赠送规则</Button>
          <Table
            dataSource={unlockorupgrade.upgrade}
            columns={columns1}
            className={styles.tableStyleRow}
            rowKey={(record)=>record.id}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({
                    temporary_upgrade_type:record.type,
                    temporary_upgrade_number1:record.v1_amount,
                    temporary_upgrade_number2:record.v2_amount
                  })
                  console.log(record)
                }, // 点击行
              };
            }}
          />
        </Card>

        <Modal
          title={modalStatus==1?"新建升级码赠送规则":"新建解锁码赠送规则"}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Row className={styles.addRulesModal}>
            <Col span={7}>请选择身份版本：</Col>
            <Col span={17}>
              {modalStatus==0?
                <Select
                  placeholder="请选择身份版本"
                  style={{ width: '100%' }}
                  onChange={(value) => {this.setState({unlock_type:value})}}
                  value={this.state.unlock_type}
                >
                  {
                    unlockorupgrade.unlockTypeList.length&&unlockorupgrade.unlockTypeList.map(item=>(
                      <Option value={item.key} key={item.key}>{item.value}</Option>
                    ))
                  }
                </Select>
                :
                <Select
                  placeholder="请选择身份版本"
                  style={{ width: '100%' }}
                  onChange={(value) => {this.setState({upgrade_type:value})}}
                  value={this.state.upgrade_type}
                >
                  {unlockorupgrade.upgradeTypeList.length&&unlockorupgrade.upgradeTypeList.map(item=>(
                    <Option value={item.key} key={item.key}>{item.value}</Option>
                  ))}
                </Select>
              }
            </Col>
          </Row>
          {modalStatus==0?
            <Row className={styles.addRulesModal}>
              <Col span={7}>赠送解锁码数量(个)：</Col>
              <Col span={17}>
                <Input
                  value={this.state.unlock_number}
                  onChange={(e)=>{
                    const reg = new RegExp("^[0-9]*$")
                    if(reg.test(e.target.value)){
                      this.setState({unlock_number:e.target.value})
                    }
                  }}
                />
              </Col>
            </Row>
            :
            <Fragment>
              <Row className={styles.addRulesModal}>
                <Col span={9}>赠送店主升级码数量(个)：</Col>
                <Col span={15}>
                  <Input
                    value={this.state.upgrade_number1}
                    onChange={(e)=>{
                      const reg = new RegExp("^[0-9]*$")
                      if(reg.test(e.target.value)){
                        this.setState({upgrade_number1:e.target.value})
                      }
                    }}
                  />
                </Col>
              </Row>
              <Row className={styles.addRulesModal}>
                <Col span={9}>赠送盟主升级码数量(个)：</Col>
                <Col span={15}>
                  <Input
                    value={this.state.upgrade_number2}
                    onChange={(e)=>{
                      const reg = new RegExp("^[0-9]*$")
                      if(reg.test(e.target.value)){
                        this.setState({upgrade_number2:e.target.value})
                      }
                    }}
                  />
                </Col>
              </Row>
            </Fragment>
          }
        </Modal>

      </PageHeaderLayout>
    );
  }
}

export default connect(({ unlockorupgrade ,goods})=>({
  unlockorupgrade,
  goods
}))(Config);


