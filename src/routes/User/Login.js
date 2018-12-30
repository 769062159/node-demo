import React, { Component } from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Alert, Checkbox } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type, autoLogin } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
          autoLogin,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            this.renderMessage('账户或密码错误')}
          <div className={styles.title}>账户登录</div>
          <div className={styles.inputBox}>
            <UserName name="user_name" placeholder="请输入账户" />
            <Password name="password" placeholder="请输入密码" />
            <div>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                记住账号密码
              </Checkbox>
            </div>
            <Submit loading={submitting}>登录</Submit>
          </div>
        </Login>
      </div>
    );
  }
}
