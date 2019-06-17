import React from 'react';
import { Icon, Card, Input, Button, Table, Row, Col, Form, Select, Modal } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '代理身份',
    dataIndex: 'identity',
    key: 'identity',
  },
  {
    title: '代理区域',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '排序',
    dataIndex: 'order',
    key: 'order',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
  },
  {
    title: '操作',
    key: 'action',
    render(text) {
      return (
        <div>
          <Button type="primary" style={{ marginRight: '10px' }}>
            编辑
          </Button>
          <Button type="danger">删除</Button>
        </div>
      );
    },
  },
];

const dataSource = [
  {
    id: 'yyx990803',
    identity: '省级运营中心',
    area: 'X省X市',
    order: 9,
    create_time: '1989-12-25 13:14:00',
  },
];

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

export default class Operating extends React.PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          {/* 查询 */}
          <Row type="flex" gutter={10}>
            <Col span={6}>
              <Row type="flex" align="middle" gutter={10}>
                <Col
                  span={6}
                  style={{
                    textAlign: 'right',
                  }}
                >
                  <span>联系人</span>
                </Col>
                <Col span={18}>
                  <Input type="text" prefix={<Icon type="search" />} placeholder="联系人" />
                </Col>
              </Row>
            </Col>
            <Col>
              <Button type="primary">查询</Button>
            </Col>
          </Row>

          {/* 添加代理区域 */}
          <Row
            style={{
              marginTop: '30px',
            }}
          >
            <Col>
              <Button type="primary">添加</Button>
            </Col>
          </Row>

          {/* 代理区域表格 */}
          <Table
            dataSource={dataSource}
            columns={columns}
            style={{
              marginTop: '10px',
            }}
          />

          {/* 编辑、创建代理区域 */}
          <Modal title="编辑可代理区域" visible>
            <Form layout="horizontal">
              <Form.Item {...formItemLayout} label="代理身份">
                <Select>
                  <Select.Option value="">请选择</Select.Option>
                  <Select.Option value={0}>大区代理</Select.Option>
                  <Select.Option value={1}>省级代理</Select.Option>
                  <Select.Option value={2}>市级代理</Select.Option>
                  <Select.Option value={3}>区县代理</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="代理区域">
                <Select>
                  <Select.Option value="">请选择</Select.Option>
                  <Select.Option value={0}>西南大区</Select.Option>
                  <Select.Option value={1}>东北大区</Select.Option>
                  <Select.Option value={2}>东南大区</Select.Option>
                  <Select.Option value={3}>西北大区</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="排序">
                <Input type="text" placeholder="数字越大，排序越靠前" />
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
