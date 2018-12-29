import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Button,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Wangeditor from '../../components/Wangeditor';



@connect(({ protocol, loading }) => ({
    protocol,
  loading: loading.models.protocol,
}))
export default class Protocol extends PureComponent {
  state = {
      header: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      newRichText: '',
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'protocol/getMerchantAgr',
      payload: {
          type: 3,
      },
    });
  }
  // 添加描述
  setDescription = (e) => {
    this.setState({
        newRichText: e,
    })
  }
  editProtocol = () => {
    const { newRichText } = this.state;
    const { dispatch } = this.props;
    dispatch({
        type: 'protocol/setMerchantAgr',
        payload: {
            type: 3,
            agreement_upgrade_merchant: newRichText,
        },
        callback: () => {
            message.success('设置成功');
        },
    });
  }
  render() {
    const { header } = this.state;
    const { loading, protocol: { userProtocol } } = this.props;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Row>
            <Col span={4}>
              协议
            </Col>
            <Col span={20}>
              <Wangeditor
                detail={userProtocol}
                header={header}
                setDescription={this.setDescription}
              />
            </Col>
            <Col span={4} />
            <Col span={20}>
              <Button loading={loading} style={{ margin: 10 }} type="primary" onClick={this.editProtocol}>修改</Button>
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}