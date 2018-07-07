import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Select } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

// const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const Option = Select.Option;

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
@Form.create()
class AddGoodStep1 extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/getAllType',
    });
  }
  render() {
    console.log(this.props);
    const { form, dispatch, goods: { goodType: datas } } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          console.log(values);
          dispatch(routerRedux.push(`/good/add-goods/confirm/${values.type}`));
          //   if (values.type.length === 2) {
          //     dispatch(routerRedux.push(`/good/add-goods/confirm/${values.type}`));
          //   } else {
          //     message.error('请选择正确的分类！');
          //   }
          // dispatch({
          //   type: 'form/saveStepFormData',
          //   payload: values,
          // });
        }
      });
    };
    const selectItem = [];
    datas.forEach(res => {
      selectItem.push(
        <Option key={res.class_id} value={res.class_id}>
          {res.class_name}
        </Option>
      );
    });
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark autoComplete="OFF">
          <Form.Item {...formItemLayout} label="商品分类">
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择商品分类' }],
            })(
              //   <Cascader
              //     options={datas}
              //     changeOnSelect
              //     filedNames={{ label: 'class_name', value: 'class_id', children: 'has_category' }}
              //   />
              <Select style={{ width: 120 }}>{selectItem}</Select>
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

export default connect(({ form }) => ({
  data: form.step,
}))(AddGoodStep1);
