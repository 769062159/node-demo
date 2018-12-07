import React, { Component } from 'react';
import { Select, Form, Input, Button, Row, Col } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class SearchForm extends Component {
  // 新增修改提交
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { handleSearch } = this.props;
      handleSearch(fieldsValue);
    });
  };
  handleFormReset = () => {
    const { form, handleFormReset } = this.props;
    form.resetFields();
    handleFormReset();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} style={{ margin: '20px 0' }} layout="inline" autoComplete="OFF">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('goods_name')(<Input placeholder="请输入昵称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户id">
              {getFieldDecorator('goods_name')(<Input placeholder="请输入用户id" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('goods_status')(
                <Select placeholder="请选择" style={{ width: 200 }}>
                  <Option value="0">上架中</Option>
                  <Option value="1">未上架</Option>
                  <Option value="2">下架</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default SearchForm;
