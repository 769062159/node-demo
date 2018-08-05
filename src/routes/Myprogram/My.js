import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Form, Button, Modal, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Style.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formSubmitLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 24 },
    sm: { span: 20, offset: 4 },
  },
};

@connect(({ program, loading }) => ({
  program,
  loading: loading.models.program,
}))
@Form.create()
export default class My extends PureComponent {
  state = {
    formVisible: false,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'program/fetchProgramList',
    });
  }
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      formVisible: false,
    });
  };
  // 新增提交&&修改
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'program/addProgram',
          payload: values,
        });
        this.handAddleCancel();
      }
    });
  };
  // 新增modal显示
  showModal = () => {
    this.setState({
      formVisible: true,
    });
  };
  jumpTo = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/my-program/setting/${id}`));
  };
  deleteProgram = id => {
    console.log(id);
    const that = this;
    confirm({
      content: '你确定删除这个吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        dispatch({
          type: 'program/delProgram',
          payload: {
            account_id: id,
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  render() {
    const { loading, form, program: { programList } } = this.props;
    const { formVisible } = this.state;
    const { getFieldDecorator } = form;
    const CardItem = [];
    programList.forEach(res => {
      CardItem.push(
        <div key={res.id} className={styles.CardProgram}>
          <div className={styles.card} onClick={this.jumpTo.bind(this, res.id)}>
            <span className={`${styles.released} ${styles.unrel}`}>未发布</span>
            <img src="/img/xiaochengxu.jpg" alt="小程序" />
            <p>
              <span>{res.name}</span>
              <span>创建时间 {moment(res.create_time * 1000).format('YYYY-MM-DD')}</span>
            </p>
          </div>
          <div className={styles.rightBtn} onClick={this.deleteProgram.bind(this, res.id)}>
            <Button type="primary" className={styles.deleteBtn}>
              删除
            </Button>
          </div>
        </div>
      );
    });
    return (
      <PageHeaderLayout>
        <Row className={styles.rightBox}>
          <span className={styles.word}>一键创建小程序</span>
          <Button type="primary" loading={loading} onClick={this.showModal.bind(this)}>
            +创建小程序
          </Button>
        </Row>
        <div className={styles.CardProgramList}>{CardItem}</div>
        <Modal
          title="小程序"
          visible={formVisible}
          onCancel={this.handAddleCancel.bind(this)}
          destroyOnClose="true"
          footer=""
        >
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
            autoComplete="OFF"
          >
            <FormItem label="小程序名字" {...formItemLayout}>
              {getFieldDecorator('name', {
                // initialValue: editData.goods_class_id,
                rules: [
                  {
                    required: true,
                    message: '请输入小程序名字',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
              <Button type="primary" htmlType="submit" loading={loading}>
                立即新增
              </Button>
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
