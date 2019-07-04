import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Form, Select,Card,Row,Col,Input,DatePicker,Button,Table } from 'antd'
const { RangePicker } = DatePicker;
const { Option } = Select;
class Upgrade extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  searchMethod=()=>{
    console.log()
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
    };
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: '请选择搜索时间段!' }],
    };
    const dataSource = [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
      },
    ];

    const columns = [
      {
        title: '用户昵称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '用户ID',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '用户身份版本',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '业务类型',
        dataIndex: 'address',
        key: 'address1',
      },
      {
        title: '涉及升级码数量',
        dataIndex: 'address',
        key: 'address2',
      },
      {
        title: '剩余升级码数量',
        dataIndex: 'address',
        key: 'address3',
      },
      {
        title: '发生时间',
        dataIndex: 'address',
        key: 'address4',
      },
      {
        title: '对应商城订单号',
        dataIndex: 'address',
        key: 'address5',
      },
      {
        title: '使用对象',
        dataIndex: 'address',
        key: 'address6',
      },
      {
        title: '对象ID',
        dataIndex: 'address',
        key: 'address7',
      },
      {
        title: '备注',
        dataIndex: 'address',
        key: 'address8',
      },
    ];
    return (
      <PageHeaderLayout>
        <Card>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Row>
              <Col span={2} style={{height:'30px',lineHeight:'30px'}}>搜索：</Col>
              <Col span={3} >
                <Form.Item>
                  {getFieldDecorator('selectSearchType', {
                    rules: [{ required: true, message: '请选择搜索类型' }],
                    initialValue:0
                  })(
                    <Select placeholder="Please select a country">
                      <Option value={0}>商城订单号</Option>
                      <Option value={1}>用户昵称</Option>
                      <Option value={2}>用户ID</Option>
                      <Option value={3}>使用对象昵称</Option>
                      <Option value={4}>使用对象ID</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item>
                  {getFieldDecorator('selectSearchInput', {
                    rules: [{ required: true, message: 'Please input your Data!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={2} style={{height:'30px',lineHeight:'30px'}}>发生时间：</Col>
              <Col span={10}>
                <Form.Item>
                  {getFieldDecorator('range-picker', rangeConfig)(<RangePicker />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={2} style={{height:'30px',lineHeight:'30px'}}>业务类型：</Col>
              <Col span={3} >
                <Form.Item>
                  {getFieldDecorator('selectBusinessType', {
                    rules: [{ required: true, message: '请选择搜索类型' }],
                    initialValue:0
                  })(
                    <Select placeholder="请选择搜索类型">
                      <Option value={0}>全部</Option>
                      <Option value={1}>赠送店主升级码</Option>
                      <Option value={2}>赠送盟主升级码</Option>
                      <Option value={3}>使用店主升级码</Option>
                      <Option value={4}>使用盟主升级码</Option>
                      <Option value={5}>系统调整店主升级码</Option>
                      <Option value={6}>系统调整盟主升级码</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={2} style={{height:'30px',lineHeight:'30px'}}></Col>
              <Col span={2}>
                <Button type='primary' onClick={()=>{this.searchMethod()}}>搜索</Button>
              </Col>
              <Col span={2}>
                <Button type='primary' onClick={()=>{}}>导出</Button>
              </Col>
              <Col span={2}>
                <Button type='primary' onClick={()=>{}}>系统调整</Button>
              </Col>
            </Row>

          </Form>

        </Card>
        <Card>
          <Table dataSource={dataSource} columns={columns} />
        </Card>
      </PageHeaderLayout>

    );
  }
}

export default Form.create({
  mapPropsToFields(){},
  onFieldsChange(){}
})(Upgrade);
