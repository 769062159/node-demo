import React from 'react';
import { Modal, Input, Spin } from 'antd';
import { connect } from 'dva';

@connect(({login, global}) => ({
  login,
  global,
}))
export default class AuthDialog extends React.Component {
  state = {
    show: true,
    password: '',
    loading: false,
    authorized: false,
  }
  componentDidMount = () => {
    if (this.props.global.actionPassword !== '') {
      this.setState({
        password: this.props.global.actionPassword,
        show: false,
      }, this.onOk);
    }
  }
  onOk = () => {
    const { dispatch } = this.props;
    const { password } = this.state;

    this.setState({loading: true});
    dispatch({
      type: 'login/checkPassword',
      payload: {
        password,
      },
      callback: () => {
        dispatch({
          type: 'global/saveActionPassword',
          payload: password,
        });

        this.setState({ loading: false, authorized: true });
        this.close();
        this.props.onAuth(true);
      },
    })
  }
  close = () => {
    this.setState({ show: false });
  }
  render() {
    const { show, password, authorized } = this.state;
    const { children } = this.props;

    if (authorized) {
      return children;
    } else {
      return (
        <Modal
          title="请输入操作密码"
          visible={show}
          onOk={this.onOk}
          onCancel={this.close}
        >
          <Spin spinning={this.state.loading}>
            <Input
              type="password"
              placeholder="请输入操作密码"
              value={password}
              onChange={event => this.setState({
                password: event.target.value,
              })}
            />
          </Spin>
        </Modal>
      )
    }
  }
}
