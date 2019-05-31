import React, { Component } from 'react';
import { Select, Form, Input, Button, Row, Col } from 'antd';

const { apiurl } = process.env[process.env.API_ENV];
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
  exportWithdraw = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      if (err) return;
      let token = localStorage.getItem('token');
      let res = await fetch(`${apiurl}/merchant/withdraw/export/ticket`, {
        method: 'post',
        headers: {
          mode: 'no-cors',
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fieldsValue),
      });
      res.json().then(res => {
        console.log(res)
        res.data.url && window.open(res.data.url)
      })
      // res.blob().then(blob => {
      //   let blobUrl = window.URL.createObjectURL(blob);
      //   let a = window.document.createElement('a');
      //   let date = new Date();
      //   let timer = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      //   a.href = blobUrl
      //   a.download = `提现记录${timer}.csv`
      //   a.click()
      //   a.remove()
      // })
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} style={{ margin: '20px 0' }} layout="inline" autoComplete="OFF">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('nickname')(<Input placeholder="请输入昵称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户id">
              {getFieldDecorator('user_id')(<Input placeholder="请输入用户id" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: 200 }}>
                  <Option value={0}>待提现</Option>
                  <Option value={1}>已提现</Option>
                  <Option value={2}>已拒绝</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} style={{margin: 8}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button type="primary" style={{marginLeft: 8}} onClick={this.exportWithdraw}>
              导出
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default SearchForm;
