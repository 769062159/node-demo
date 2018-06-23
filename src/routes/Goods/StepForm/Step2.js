import React from 'react';
import { connect } from 'dva';
import { Form, Button, Checkbox } from 'antd';
import { routerRedux } from 'dva/router';
// import { digitUppercase } from '../../../utils/utils';
import EditTable from 'components/editTable';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const CheckboxGroup = Checkbox.Group;

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
@Form.create()
class Step2 extends React.PureComponent {
  state = {};
  componentWillMount() {
    let { type } = this.props.match.params;
    const { dispatch } = this.props;
    type = type.split(',');
    dispatch({
      type: 'goods/initGoodAttr',
      payload: {
        type: type[0],
        typeSon: type[1],
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/clearAttrTabe',
    });
  }
  // onChangeAttr = (index, checkedList) => {
  // const { goods: { initGoodsAttr }, dispatch } = this.props;
  // dispatch({
  //   type: 'goods/checkedList',
  //   payload: {
  //     checkedList,
  //     index,
  //   },
  // });
  //   if (checkedList.length === initGoodsAttr[index].AttrArr.length) {
  //     dispatch({
  //       type: 'goods/checked',
  //       payload: {
  //         index,
  //       },
  //     });
  //   } else if (initGoodsAttr[index].checked) {
  //     dispatch({
  //       type: 'goods/checked',
  //       payload: {
  //         index,
  //       },
  //     });
  //   }
  // }
  onCheckAllAttr = index => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/checked',
      payload: {
        index,
      },
    });
  };
  onChangeSon = (index, checkedList) => {
    // const arr = [];
    // if (initGoodsAttr.length) {
    //   const attrData = initGoodsAttr.filter(res => {
    //     return res.checked
    //   })
    //   this.toGet(arr, {}, 0, attrData);
    // }
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/checkedList',
      payload: {
        checkedList,
        index,
      },
    });
  };
  // onCellChange = () => {
  //   console.log(1);
  // }

  handleEmail = event => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/setAttrTabes',
      payload: {
        attrTable: event,
      },
    });
    // this.setState({
    //   formAttr: event,
    // })
  };
  render() {
    const {
      form,
      data,
      dispatch,
      submitting,
      goods: { typeName, initGoodsAttr, attrTable, tableHeader },
    } = this.props;
    const { validateFields } = form;
    // const { formAttr } = this.state;
    const onPrev = () => {
      dispatch(routerRedux.push('/good/step-form'));
    };
    const attrItem = [];
    const attrItemSon = [];
    initGoodsAttr.forEach((res, index) => {
      attrItem.push(
        <Checkbox onChange={this.onCheckAllAttr.bind(this, index)} key={res.id}>
          {res.name}
        </Checkbox>
      );
      attrItemSon.push(
        <div
          key={index}
          className={`${styles.borderList} ${res.checked ? '' : styles.borderHidden}`}
        >
          <span key={res.id + index} style={{ marginRight: 10 }}>
            {res.name}:
          </span>
          <CheckboxGroup
            rowKey={index => index}
            options={res.AttrArr}
            value={res.checkArr}
            onChange={this.onChangeSon.bind(this, index)}
          />
        </div>
      );
    });

    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/submitStepForm',
            payload: {
              ...data,
              ...values,
            },
          });
        }
      });
    };

    return (
      <Form layout="horizontal" className={styles.stepForm}>
        {typeName}
        <div className={styles.borderList}>
          <span>属性名：</span>
          {attrItem}
        </div>
        {attrItemSon}
        <EditTable
          attrTable={attrTable}
          tableHeader={tableHeader}
          rowKey={index => JSON.stringify(index)}
          handleEmail={this.handleEmail.bind(this)}
        />
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
}))(Step2);
