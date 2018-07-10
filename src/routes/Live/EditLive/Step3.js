import React, { Fragment } from 'react';
import { connect } from 'dva';
import copy from 'copy-to-clipboard';
import { Button, Row, Icon, message } from 'antd';
import { routerRedux } from 'dva/router';
import Result from 'components/Result';
import styles from './style.less';

class EditLiveStep3 extends React.PureComponent {
  state = {
    url: `${localStorage.getItem('liveUrl')}`,
  };
  copyBtn = val => {
    copy(val);
    message.success('成功复制到剪贴板');
  };
  render() {
    const { dispatch } = this.props;
    const { url } = this.state;
    console.log(this.props);
    const onFinish = () => {
      dispatch(routerRedux.push('/live/list'));
    };
    const actions = (
      <Fragment>
        <Row>
          {url}
          <Icon
            type="copy"
            style={{ display: 'inline-block' }}
            onClick={this.copyBtn.bind(this, url)}
          />
        </Row>
        <Button type="primary" onClick={onFinish}>
          直播列表
        </Button>
        {/* <Button>查看账单</Button> */}
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="修改成功"
        // description={this.state.url}
        // extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect(({ form }) => ({
  data: form.step,
}))(EditLiveStep3);
