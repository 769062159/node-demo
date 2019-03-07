import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, InputNumber, Button, Radio, message, Tag, Switch } from 'antd';
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
          const { dispatch, finance: { withdrawConfig }  } = this.props;
          values.auto_withdraw_amount = values.auto_withdraw_amount || withdrawConfig.auto_withdraw_amount;
          values.auto_withdraw = values.auto_withdraw || 0;
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
  radioChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/chgForm',
      payload: {
        name: 'withdraw_type',
        value: e.target.value,
      },
    });
    // this.setState({
    //   radioValue: e.target.value,
    // });
  }
  autoReturn = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/chgForm',
      payload: {
        name: 'auto_withdraw',
        value: e,
      },
    });
    // this.setState({
    //   isAuto: e,
    // });
  }

  render() {
    const { loading, finance: { withdrawConfig } } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Tag
            color="blue"
            style={{ marginBottom: 20, width: '100%', whiteSpace: 'pre-wrap', height: 'auto' }}
          >
            由于发放佣金需要在微信商户平台开通企业付款到零钱这个功能才可以正常发放，所以请商户们需要提前开通此功能。此功能需要满足已入驻90日 ，有30天连续正常交易才可以去产品中心开通。详细请查看。<a style={{ color: 'red' }} href="https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_1" target="view_window">微信支付企业付款</a>
            <br />
            微信提现是直接到账的。
          </Tag>
          {
            process.env.API_ENV === 'dev' ? (
              <Tag className={styles.tip}>测试环境提现配置与正式环境共用</Tag>
            ) : null
          }
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
            autoComplete="OFF"
            className={styles.extraTag}
          >
            <FormItem {...formItemLayout} label="提现方式">
              {getFieldDecorator('withdraw_type', {
                initialValue: withdrawConfig.withdraw_type,
                rules: [
                    {
                        required: true,
                        message: '请输入提现方式',
                    },
                ],
              })(
                <RadioGroup onChange={this.radioChange}>
                  <Radio value={1}>微信提现</Radio>
                  <Radio value={0}>银行卡提现</Radio>
                  <Radio value={2}>两者都可以</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {
              withdrawConfig.withdraw_type === 1 ? (
                <FormItem {...formItemLayout} label="自动返现" >
                  {getFieldDecorator('auto_withdraw', {
                    valuePropName: 'checked',
                    initialValue: !!withdrawConfig.auto_withdraw,
                  })(<Switch onChange={this.autoReturn} />)}
                </FormItem>
              ) : null
            }
            {
              withdrawConfig.auto_withdraw && withdrawConfig.withdraw_type === 1 ? (
                <FormItem {...formItemLayout} label="自动提现上限">
                  {getFieldDecorator('auto_withdraw_amount', {
                    initialValue: withdrawConfig.auto_withdraw_amount,
                    rules: [
                        {
                            required: true,
                            message: '请输入自动提现上限',
                        },
                    ],
                  })(
                    <InputNumber  style={{ width: 300 }} max={20000} />
                  )}
                </FormItem>
              ) : null
            }
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
            <FormItem {...formItemLayout} label="起征点" extra='元'>
              {getFieldDecorator('withdraw_tax', {
                initialValue: withdrawConfig.withdraw_tax,
                rules: [
                    {
                        required: true,
                        message: '请输入起征点',
                    },
                ],
              })(<InputNumber placeholder="请输入个税起征点" style={{ width: 300 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手续费率" extra='%'>
              {getFieldDecorator('withdraw_tax_proportion', {
                initialValue: withdrawConfig.withdraw_tax_proportion || 0,
                getValueFromEvent(val) {
                    return val ? val : 0;
                },
                rules: [
                    {
                        required: true,
                        message: '请输入手续费率',
                    },
                ],
              })(<InputNumber max={100} min={0} formatter={value => `${parseInt(value || 0, 10)}`} placeholder="请输入税率" style={{ width: 300 }} />)}
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
