import React, { Component ,Fragment} from 'react';
import {Modal, Row,Col,Input,Radio,message } from 'antd'
import styles from './uou.less'
import '../../utils/emptyUtils'
class SysModal extends Component {
  state={
    visible:false,
    upgrade_code_type:1,
  }

  showModal = () => { this.setState({ visible: true })}

  handleCancel = e => {
    this.setState({
      visible: false,
      upgrade_code_type:1,
      upgrade_user_id:'',
      upgrade_amount:'',
      upgrade_remark:''
    })
  }
  /*componentDidMount(){
    if(this.props.getDefaultList){
      this.setState({expList:this.props.getDefaultList})
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({expList:nextProps.getDefaultList})
  }*/
  onChangeRadio=(e)=>{ this.setState({ upgrade_code_type: e.target.value })}

  render() {
    const {type}=this.props
    const {upgrade_code_type,upgrade_user_id,upgrade_amount,upgrade_remark} = this.state
    return (
      <Modal
        title={type=='upgrade'?"充值升级码":"充值解锁码"}
        visible={this.state.visible}
        onOk={()=>{
          if(this.props.type=='unlock'){
            this.props.unlockHandleOk({
              upgrade_user_id,
              upgrade_amount,
              upgrade_remark
            })
          }else{
            this.props.handleOk({
              upgrade_code_type,
              upgrade_user_id,
              upgrade_amount,
              upgrade_remark
            })
          }
        }}
        onCancel={this.handleCancel}
      >
        {this.props.type=='upgrade'?
          <Row className={styles.rowStyle}>
            <Col>
              <Radio.Group onChange={this.onChangeRadio} value={this.state.upgrade_code_type}>
                <Radio value={1}>店主升级码</Radio>
                <Radio value={2}>盟主升级码</Radio>
              </Radio.Group>
            </Col>
          </Row>
          :
          null
        }

        <Row className={styles.rowStyle}>
          <Col span={6} className={styles.labelTitle}>请输入用户ID：</Col>
          <Col span={18}>
            <Input
              style={{ width: '100%' }}
              value={this.state.upgrade_user_id}
              onChange={(e)=>{
                this.setState({upgrade_user_id:e.target.value})
              }}
              onBlur={()=>{
                if(this.props.showUserInfo){
                  this.props.showUserInfo(this.state.upgrade_user_id)
                }
              }}
            />

          </Col>
        </Row>

        {empty.check(this.props.userInfo.user)&&this.state.upgrade_user_id==this.props.userInfo.user.fake_id?
          <Fragment>
            <Row className={styles.rowStyle1}>
              <Col span={6} className={styles.labelTitle}></Col>
                <Col span={18}  className={styles.labelText}>
                  用户昵称：{empty.check(this.props.userInfo.user)?this.props.userInfo.user.nickname:'无此用户'}
                </Col>
            </Row>
            <Row className={styles.rowStyle1}>
              <Col span={6} className={styles.labelTitle}></Col>
                <Col span={18}  className={styles.labelText}>
                  用户剩余解锁码数量(个)：{empty.check(this.props.userInfo.account)?this.props.userInfo.account.unlock_code_amount:'无此信息'}
                </Col>
            </Row>
          </Fragment>
          :
          null
        }

        <Row className={styles.rowStyle}>
          <Col span={6} className={styles.labelTitle}>请输入调整数量：</Col>
          <Col span={18}>
            <Input
              style={{ width: '100%' }}
              value={this.state.upgrade_amount}
              onChange={(e)=>{this.setState({upgrade_amount:e.target.value})}}/>
          </Col>
        </Row>
        {this.state.upgrade_amount?
          <Row className={styles.rowStyle}>
            <Col span={6} className={styles.labelTitle}></Col>
            <Col span={18} style={{color:'#e60012',lineHeight:'20px'}}>如果要减少，请输入负数，负数的最大值为用户剩余的升级码数量</Col>
          </Row>
          :null
        }


        <Row className={styles.rowStyle}>
          <Col span={6} className={styles.labelTitle}>备注：</Col>
          <Col span={18}>
            <Input
              placeholder='请输入备注，不超过30个字'
              style={{ width: '100%' }}
              value={this.state.upgrade_remark}
              onChange={(e)=>{this.setState({upgrade_remark:e.target.value})}}/>
          </Col>
        </Row>
      </Modal>
    );
  }

}

export default SysModal;
