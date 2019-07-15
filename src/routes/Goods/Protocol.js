import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Button,
  message,
} from 'antd';
import ReactEditor from 'components/ReactEditor';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';



@connect(({ protocol, loading }) => ({
    protocol,
  loading: loading.models.protocol,
}))
export default class Protocol extends PureComponent {
  state = {
      newRichText: '',
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'protocol/getMerchantAgr',
      payload: {
          type: 2,
      },
    });
  }
  // 添加描述
  setDescription = (e) => {
    let str = '<span style="text-decoration: underline;">'
    let str1=e.replace(/\<span\>\<u\>/g, str)
      // .replace(/\<span style=\"background:#fff;\"\>\<u\>/g, str)
      .replace(/\<u\>/g,str)
      // .replace(/\<\/span\>\<\/u\>/g, '</span>')
      .replace(/<\/u>/ig, "</span>")
      .replace(/span style=\"/g, 'span style="display:inline;')
      .replace(/\<span\>/g, '<span style="display:inline;">')
      .replace(/\<strong\>/g, '<strong style="display:inline;">')
    str1 = `<div style="background: #fff; padding: 20px; box-sizing: border-box;">${str1}</div>`
    // let str=e.replace(/<[\/]?(u)([^<>]*)>/g, (m)=>m.replace('u', 'span'));
    this.setState({
        newRichText: str1 ,
    },()=>{console.log(this.state.newRichText)})
  }
  editProtocol = () => {
    const { newRichText } = this.state;
    const { dispatch } = this.props;
    dispatch({
        type: 'protocol/setMerchantAgr',
        payload: {
            type: 2,
            agreement_upgrade_group: newRichText,
        },
        callback: () => {
            message.success('设置成功');
        },
    });
  }
  render() {
    const { loading, protocol: { userProtocol }, uploadUrl } = this.props;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Row>
            <Col span={4}>
              协议
            </Col>
            <Col span={20}>
              <ReactEditor
                uploadUrl={uploadUrl}
                valueSon={userProtocol}
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
