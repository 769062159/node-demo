import React, { Component } from 'react';
import { connect } from 'dva';
import { Select, Form, Input, Button, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const formSubmitLayout = {
  wrapperCol: {
    span: 19,
    offset: 5,
  },
};

@connect(({ frontUser, loading }) => ({
  frontUser,
  loading: loading.models.frontUser,
}))
@Form.create()
class TypeForm extends Component {
  // 新增修改提交
  handleSubmit = (type, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch, editDataId, pagination, type, handAddleCancel } = this.props;
        // const { editDataId, pagination, type } = this.state;
        values.page = pagination;
        values.user_id = editDataId;
        if (type === 1) {
          values.referee_id = values.level_id;
          dispatch({
            type: 'frontUser/updateUpLevel',
            payload: values,
          });
        } else {
          dispatch({
            type: 'frontUser/updateMemberLevel',
            payload: values,
          });
        }
        message.success('修改成功');
        // this.handAddleCancel();
        handAddleCancel();
      }
    });
  };
  renderAddForm() {
    const { loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this, 0)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem {...formItemLayout} label="上级id">
          {getFieldDecorator('level_id', {
            rules: [
              {
                required: true,
                message: '请输入上级id',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
  renderEditForm() {
    const { loading, userRankList: datas } = this.props;
    const levelItem = [];
    if (datas.length) {
      datas.forEach(res => {
        levelItem.push(
          <Option value={res.id} key={res.id}>
            {res.name}
          </Option>
        );
      });
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this, 1)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem {...formItemLayout} label="用户等级">
          {getFieldDecorator('level_id', {
            rules: [
              {
                required: true,
                message: '请输入用户等级',
              },
            ],
          })(<Select>{levelItem}</Select>)}
        </FormItem>
        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            修改
          </Button>
        </FormItem>
      </Form>
    );
  }
  // 渲染修改还是新增
  renderForm() {
    const { type } = this.props;
    return type === 1 ? this.renderAddForm() : this.renderEditForm();
  }
  render() {
    return <div>{this.renderForm()}</div>;
  }
}

export default TypeForm;
