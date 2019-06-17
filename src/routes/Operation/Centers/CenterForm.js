import React from 'react';
import { Form, Modal, Row, Col, Select, Input, Cascader } from 'antd';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const addressOptions = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

export default class CenterForm extends React.PureComponent {
  render() {
    const { visible, form, onDialogCancel, onDialogSure, onUpdateFormItem, mode } = this.props;

    return (
      <Modal
        title={mode === 'create' ? '运营中心创建' : '运营中心编辑'}
        visible={visible}
        onCancel={onDialogCancel}
        onOk={onDialogSure}
      >
        <Form layout="horizontal">
          <Form.Item {...formItemLayout} label="代理身份">
            <Select
              value={form.identity}
              onChange={value => {
                onUpdateFormItem({
                  identity: value,
                });
              }}
            >
              <Select.Option value="">请选择</Select.Option>
              <Select.Option value={0}>大区代理</Select.Option>
              <Select.Option value={1}>省级代理</Select.Option>
              <Select.Option value={2}>市级代理</Select.Option>
              <Select.Option value={3}>区县代理</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item {...formItemLayout} label="代理区域">
            <Select
              value={form.area}
              onChange={value => {
                onUpdateFormItem({
                  area: value,
                });
              }}
            >
              <Select.Option value="">请选择</Select.Option>
              <Select.Option value={0}>西南大区</Select.Option>
              <Select.Option value={1}>东北大区</Select.Option>
              <Select.Option value={2}>东南大区</Select.Option>
              <Select.Option value={3}>西北大区</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item {...formItemLayout} label="代理职位">
            <Select
              value={form.position}
              onChange={value => {
                onUpdateFormItem({
                  position: value,
                });
              }}
            >
              <Select.Option value="">请选择</Select.Option>
              <Select.Option value={0}>大区运营总裁</Select.Option>
              <Select.Option value={1}>大区运营组长</Select.Option>
              <Select.Option value={2}>大区运营专员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item {...formItemLayout} label="联系人">
            <Input
              type="text"
              placeholder="请输入"
              value={form.contactName}
              onChange={event => {
                onUpdateFormItem({
                  contactName: event.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} label="联系电话">
            <Input
              type="text"
              placeholder="请输入"
              value={form.contactMobile}
              onChange={event => {
                onUpdateFormItem({
                  contactMobile: event.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} label="地址">
            <Cascader
              options={addressOptions}
              placeholder="请选择省市区"
              value={form.address}
              onChange={value => {
                onUpdateFormItem({
                  address: value,
                });
              }}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} label="详细地址">
            <Input
              type="text"
              placeholder="请输入"
              value={form.secondAddress}
              onChange={event => {
                onUpdateFormItem({
                  secondAddress: event.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} label="用户Id">
            <Input
              type="text"
              placeholder="请输入"
              value={form.userId}
              onChange={event => {
                onUpdateFormItem({
                  userId: event.target.value,
                });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
