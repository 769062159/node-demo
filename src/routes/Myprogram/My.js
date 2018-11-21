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

@connect(({ program, loading, user }) => ({
  program,
  user,
  loading: loading.models.program,
}))
@Form.create()
export default class My extends PureComponent {
  state = {
    programType: 0, // 0 是小程序 1是公众号
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
        const { programType } = this.state;
        values.type = programType;
        dispatch({
          type: 'program/addProgram',
          payload: values,
        });
        this.handAddleCancel();
      }
    });
  };
  // 新增modal显示
  showModal = (programType) => {
    this.setState({
      formVisible: true,
      programType,
    });
  };
  jumpTo = id => {
    // if (record.status === 1) {
    //   const { dispatch } = this.props;
    //   dispatch(routerRedux.push(`/my-program/setting/${record.id}`));
    // } else {
    //   message.error('请先绑定小程序');
    // }
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/my-program/setting/${id}`));
  };
  deleteProgram = id => {
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
      },
    });
  };
  render() {
    const { loading, form, program: { programList, hasPublic, hasApplets }, user: { currentUser: { id: currentUserId } } } = this.props;
    const { formVisible } = this.state;
    const { getFieldDecorator } = form;
    const CardItem = [];
    programList.forEach(res => {
      CardItem.push(
        <div key={res.id} className={styles.CardProgram}>
          <div className={styles.card} onClick={this.jumpTo.bind(this, res.id)}>
            {
              res.type === 0 ? (
                <span
                  className={`${styles.released} ${res.release_status ? styles.deno : styles.unrel}`}
                >
                  {res.release_status ? '已发布' : '未发布'}
                </span>
              ) : null
            }
            <img src="/img/xiaochengxu.jpg" alt="小程序" />
            <p>
              <span>{res.name}{ res.type ? '(公众号)' : '(小程序)' }</span>
              <span>创建时间 {moment(res.create_time * 1000).format('YYYY-MM-DD')}</span>
            </p>
          </div>
          {
            res.type === 0 ? (
              <div className={styles.rightBtn} onClick={this.deleteProgram.bind(this, res.id)}>
                {!res.release_status ? (
                  <Button
                    type="primary"
                    size="small"
                    className={styles.deleteBtn}
                    onClick={this.deleteProgram.bind(this, res.id)}
                  >
                    删除
                  </Button>
                ) : null}
              </div>
            ) : null
          }
        </div>
      );
    });
    return (
      <PageHeaderLayout>
        {!hasApplets ? (
          <Row className={styles.rightBox}>
            <span className={styles.word}>一键创建小程序</span>
            <Button type="primary" loading={loading} onClick={this.showModal.bind(this, 0)}>
              +创建小程序
            </Button>
          </Row>
        ) : null}
        {!hasPublic && currentUserId === 5 ? (
          <Row className={styles.rightBox}>
            <span className={styles.word}>一键创建公众号</span>
            <Button type="primary" loading={loading} onClick={this.showModal.bind(this, 1)}>
              +创建公众号
            </Button>
          </Row>
        ) : null}
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
