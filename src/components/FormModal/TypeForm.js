import React, { Component } from 'react';
import { Select, Upload, Modal, Form, Input, Button } from 'antd';

const FormItem = Form.Item;
class TypeForm extends Component {
  render() {
    const { FromVisible, header, payload, uploadButton, loading, fileList } = this.props;
    const { getFieldDecorator } = this.props.form;
    const items = [];
    this.props.length.forEach(res => {
      items.push(
        <Select.Option value={res.name} className="item" key={res.name}>
          {res.name}
        </Select.Option>
      );
    });

    return (
      <Modal
        title="分类"
        visible={FromVisible}
        onCancel={this.handAddleCancel.bind(this)}
        footer=""
      >
        <Form
          onSubmit={this.handleSubmit}
          hideRequiredMark
          style={{ marginTop: 8 }}
          autoComplete="OFF"
        >
          <FormItem label="分类名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入分类名称',
                },
              ],
            })(<Input placeholder="给分类起个名字" />)}
          </FormItem>
          <FormItem label="上级分类">
            {getFieldDecorator('parent_id', {})(
              <Select style={{ width: 120 }} onChange={this.selectOption}>
                {/* {selectItem} */}
              </Select>
            )}
          </FormItem>
          <div className="clearfix">
            <Upload
              action={this.props.uploadUrl}
              headers={header}
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
              data={payload}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal> */}
          </div>
          <FormItem style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default TypeForm;
