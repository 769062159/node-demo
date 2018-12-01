import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, InputNumber, Button, Radio, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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

@connect(({ finance, loading }) => ({
  finance,
  loading: loading.models.finance,
}))
@Form.create()
export default class Withdraw extends PureComponent {
  state = {
  };
  componentDidMount() {
      const { dispatch } = this.props;
      dispatch({
        type: 'finance/getWithdrawConfig',
      });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const { dispatch } = this.props;
          dispatch({
            type: 'finance/setWithdrawConfig',
            payload: values,
            callback: () => {
                message.success('设置成功');
            },
          });
        }
      });
  }

  render() {
    const { loading, finance: { withdrawConfig } } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
            autoComplete="OFF"
            className={styles.extraTag}
          >
            <FormItem {...formItemLayout} label="提现方式">
              {getFieldDecorator('withdraw_type', {
                initialValue: withdrawConfig.withdraw_type || 1,
                rules: [
                    {
                        required: true,
                        message: '请输入提现方式',
                    },
                ],
              })(
                <RadioGroup>
                  <Radio value={1}>微信提现</Radio>
                  <Radio value={0}>银行卡提现</Radio>
                  <Radio value={2}>两者都可以</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="每月提现金额不超过" extra="元">
              {getFieldDecorator('withdraw_limit', {
                initialValue: withdrawConfig.withdraw_limit,
                rules: [
                    {
                        required: true,
                        message: '请输入每月提现金额不超过',
                    },
                ],
              })(<InputNumber placeholder="请输入每月提现金额不超过" style={{ width: 300 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="个税起征点" extra='元'>
              {getFieldDecorator('withdraw_tax', {
                initialValue: withdrawConfig.withdraw_tax,
                rules: [
                    {
                        required: true,
                        message: '请输入个税起征点',
                    },
                ],
              })(<InputNumber placeholder="请输入个税起征点" style={{ width: 300 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="税率" extra='%'>
              {getFieldDecorator('withdraw_tax_proportion', {
                initialValue: withdrawConfig.withdraw_tax_proportion || 0,
                rules: [
                    {
                        required: true,
                        message: '请输入税率',
                    },
                ],
              })(<InputNumber max={100} min={0} formatter={value => `${parseInt(value, 10)}`} placeholder="请输入税率" style={{ width: 300 }} />)}
            </FormItem>
            <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}