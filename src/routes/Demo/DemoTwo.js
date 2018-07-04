import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  // DatePicker,
  Select,
  Button,
  Card,
  // InputNumber,
  // Radio,
  Icon,
  // Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
// const { RangePicker } = DatePicker;
// const { TextArea } = Input;

@connect(({ menu, loading }) => ({
  menu,
  submitting: loading.effects['form/submitAddMenuForm'],
  loading: loading.effects['menu/fetchMenu'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetchMenu',
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submitAddMenuForm',
          payload: values,
        });
      }
    });
  };
  render() {
    const { submitting, menu } = this.props;
    const { data } = menu;
    const items = [];
    items.push(
      <Select.Option value={0} className="item" key={0}>
        一级菜单
      </Select.Option>
    );
    if (data.length) {
      data.forEach(res => {
        items.push(
          <Select.Option value={res.id} className="item" key={res.id}>
            {res.menu_name}
          </Select.Option>
        );
      });
    }
    console.log(items);
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
            AUTOCOMPLETE="OFF"
          >
            <FormItem {...formItemLayout} label="菜单名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入菜单名',
                  },
                ],
              })(<Input placeholder="给菜单起个名字" />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<span>等级</span>}>
              {getFieldDecorator('level')(
                <Select style={{ width: 120 }}>
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<span>上等级id</span>}>
              {getFieldDecorator('parent_id')(
                <Select showSearch style={{ width: 200 }} searchPlaceholder="输入">
                  {items}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="菜单路由">
              {getFieldDecorator('path', {
                rules: [
                  {
                    required: true,
                    message: '请输入菜单路由',
                  },
                ],
              })(<Input placeholder="给菜单路由起个名字" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="图标">
              {getFieldDecorator('icon', {
                rules: [
                  {
                    required: true,
                    message: '请输入图标',
                  },
                ],
              })(
                <Select style={{ width: 120 }}>
                  <Option value="link">
                    <Icon type="link" />
                  </Option>
                  <Option value="lock">
                    <Icon type="lock" />
                  </Option>
                  <Option value="desktop">
                    <Icon type="desktop" />
                  </Option>
                  <Option value="edit">
                    <Icon type="edit" />
                  </Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              {/* <Button style={{ marginLeft: 8 }}>保存</Button> */}
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
