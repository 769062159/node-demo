import React, { Component } from 'react';
import { Button, Row, Col, Modal, Input } from 'antd';
import { connect } from 'dva/index';
@connect(({ global, login  }) => ({
  global,
  login
}))
class ActionPassword extends Component {
  state = {
    passwordVisible: true,
    password: ''
  }
  handlePasswordCancel = () => {
    this.setState({
      passwordVisible: false,
      password: ''
    });
  };
  handlePasswordChange = e => { this.setState({ password: e.target.value }) }

  handlePasswordConfirm = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/checkPassword',
      payload: {
        password: this.state.password
      },
      callback: () => {
        this.setState({
          passwordVisible: false
        })
        dispatch({
          type: 'global/saveActionPassword',
          payload: this.state.password
        })

      }
    });
  };
  render() {
    return (
      <div>
        <Modal
          title='校验操作密码'
          visible={this.state.passwordVisible}
          onCancel={this.handlePasswordCancel.bind(this)}
          destroyOnClose="true"
          onOk={()=>this.handlePasswordConfirm()}
          footer={[
            // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
            null,
            <Button key="submit" type="primary" onClick={()=>this.handlePasswordConfirm()}>
              确认
            </Button>
          ]}
          maskClosable={false}
          closable={true}
          keyboard={false}
          cancelText={null}
        >
          <Row>
            <Col span={4} style={{height:'36px',lineHeight:'36px'}}>操作密码：</Col>
            <Col span={20}>
              <Input.Password
                style={{height:'36px',lineHeight:'36px'}}
                value={this.state.password}
                onChange={(e)=>this.handlePasswordChange(e)}
                onPressEnter={()=>this.handlePasswordConfirm()}
              />
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

export default ActionPassword;
