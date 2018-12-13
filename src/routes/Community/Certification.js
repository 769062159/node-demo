import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  message,
  Modal,
  // Dropdown,
  // Menu,
  // InputNumber,
  DatePicker,
  Badge,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';
import { timeFormat } from '../../utils/utils';

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
const { TextArea } = Input;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'success', 'error'];
// const statusMap = ['processing', 'processing', 'error'];
const goodsStatus = ['未审核', '通过', '拒绝'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];
// const isTrue = ['否', '是'];

@connect(({ protocol, loading }) => ({
  protocol,
  loading: loading.models.classModel,
}))
@Form.create()
export default class Certification extends PureComponent {
  state = {
    imgUrl: '',
    expandForm: false,
    editData: {},
    formVisible: false,
    formValues: {},
    minPrice: '',
    maxPrice: '',
    page: 1, // 页脚
    type: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'protocol/getVerifyList',
      payload: {},
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    // const params = {
    //   currentPage: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...formValues,
    //   ...filters,
    // };
    const params = {
      page_number: pagination.pageSize,
      ...formValues,
      ...filters,
      page: pagination.current,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'protocol/getVerifyList',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      minPrice: '',
      maxPrice: '',
    });
    dispatch({
      type: 'protocol/getVerifyList',
      payload: {},
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { page } = this.state;
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        page,
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'protocol/getVerifyList',
        payload: values,
      });
    });
  };

  // 新增取消
  handAddleCancel = () => {
    this.setState({
      formVisible: false,
      editData: {},
    });
  };

  showImg = (imgUrl) => {
    this.setState({
      imgUrl,
    });
  }

  // 修改信息
  editDataMsg = (data, type, e) => {
    e.preventDefault();
    this.setState({
      editData: data,
      type,
    });
    this.showModal();
  };
  // 新增modal显示
  showModal = () => {
    this.setState({
      formVisible: true,
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const { editData, page, type } = this.state;
        values.page = page;
        values.status = type;
        values.verify_id = editData.id;
        console.log(values);
        dispatch({
          type: 'protocol/updateVerify',
          payload: values,
          callback: () => {
            message.success('更新成功');
          },
        });
        this.handAddleCancel();
      }
    });
  };
  handImgCancel = () => {
    this.setState({
      imgUrl: '',
    })
  }
  // 渲染修改还是新增
  renderModalForm() {
    const { type } = this.state;
    return type === 1 ? this.renderAgree() : this.renderRefuse();
  }

  renderAgree() {
    const { loading } = this.props;
    // const { editData } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        {/* <Row>
          <Col span={5}>
           申请日期:
          </Col>
          <Col span={19}>
            {moment(editData.create_time*1000).format('YYYY-MM-DD HH:mm:ss')}
          </Col>
          <Col span={5}>
            申请金额:
          </Col>
          <Col span={19}>
            {editData.money}
          </Col>
          <Col span={5}>
            收款帐号:
          </Col>
          <Col span={19}>
            {editData.account_no}
          </Col>
          <Col span={5}>
            收款人:
          </Col>
          <Col span={19}>
            {editData.real_name}
          </Col>
        </Row> */}
        {/* <FormItem {...formItemLayout} style={{ marginBottom: 5 }} label="申请日期">
          {moment(editData.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 5 }} label="申请金额">
          {editData.money}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 5 }} label="收款帐号">
          {editData.account_no}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 5 }} label="收款人">
          {editData.real_name}
        </FormItem> */}
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('remark', {
            rules: [],
          })(<TextArea placeholder="请输入备注" autosize />)}
        </FormItem>
        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            同意
          </Button>
        </FormItem>
      </Form>
    );
  }
  renderRefuse() {
    const { loading } = this.props;
    // const { editData } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('remark', {
            rules: [],
          })(<TextArea placeholder="请输入备注" autosize />)}
        </FormItem>
        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            驳回
          </Button>
        </FormItem>
      </Form>
    );
  };


  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" autoComplete="OFF">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户id">
              {getFieldDecorator('user_id')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('goods_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">上架中</Option>
                  <Option value="1">未上架</Option>
                  <Option value="2">下架</Option>
                </Select>
              )}
            </FormItem>
          </Col> */}
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" autoComplete="OFF">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('goods_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('goods_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">上架中</Option>
                  <Option value="1">下架中</Option>
                  <Option value="2">审核中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('create_start')(
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime
                  placeholder="请输入创建日期"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="价格区间">
              <InputGroup compact>
                <Input
                  key={1}
                  value={this.state.minPrice}
                  style={{ width: 70, textAlign: 'center' }}
                  onChange={this.setMin}
                  placeholder="Min"
                />
                <Input
                  key={2}
                  style={{
                    width: 30,
                    borderLeft: 0,
                    pointerEvents: 'none',
                    backgroundColor: '#fff',
                  }}
                  placeholder="~"
                  disabled
                />
                <Input
                  key={3}
                  value={this.state.maxPrice}
                  style={{ width: 70, textAlign: 'center', borderLeft: 0 }}
                  onChange={this.setMax}
                  placeholder="Max"
                />
              </InputGroup>
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col> */}
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { protocol: { verifyList, verifyListPage }, loading } = this.props;
    const data = {
      list: verifyList,
      pagination: {
        ...verifyListPage,
      },
    };
    const { formVisible, imgUrl } = this.state;
     const columns = [
      {
        title: '会员',
        dataIndex: 'member',
        key: 'member',
        width: 300,
        render: (val, text) => (
          // <Row style={{ width: 500 }}>
          //   <Col span={4}>
          //     <img style={{ height: 80, width: 80 }} src={val} alt="头像" />
          //   </Col>
          //   <Col span={14} style={{ fontSize: 14 }}>
          //     <div>{text.nickname}</div>
          //     <div>Id:{text.id}</div>
          //     <div>等级:{text.account_level}</div>
          //     <div>上级:{text.referee && text.referee.nickname}</div>
          //   </Col>
          // </Row>
          <div className={styles.userBox}>
            <img style={{ height: 80, width: 80, marginRight: 10, float: 'left' }} src={text.has_user.avatar} alt="头像" />
            <div className={styles.userInfo}>
              <div>{text.has_user.nickname}</div>
              <div>Id:{text.has_user.fake_id}</div>
              <div>手机号码:{text.has_user.mobile}</div>
            </div>
          </div>
        ),
      },
      // {
      //   title: '课程价格',
      //   dataIndex: 'price',
      //   key: 'price',
      // },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        // render: (val) => {
        //   return val === 1 ? '单课' :`${val}集`;
        // },
      },
      {
        title: '身份证号',
        dataIndex: 'id_no',
        key: 'id_no',
      },
      {
        title: '身份证正面照',
        dataIndex: 'id_card_pic_front',
        key: 'id_card_pic_front',
        render: (val) => <img style={{ height: 80, width: 80 }} onClick={this.showImg.bind(this, val)} src={val} alt="身份证正面照" />,
      },
      {
        title: '身份证反面照',
        dataIndex: 'id_card_pic_back',
        key: 'id_card_pic_back',
        render: (val) => <img style={{ height: 80, width: 80 }} onClick={this.showImg.bind(this, val)} src={val} alt="身份证反面照" />,
      },
      {
        title: '手持身份证照',
        dataIndex: 'id_card_pic_hand',
        key: 'id_card_pic_hand',
        render: (val) => <img style={{ height: 80, width: 80 }} onClick={this.showImg.bind(this, val)} src={val} alt="手持身份证照" />,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        filters: [
          {
            text: goodsStatus[0],
            value: 0,
          },
          {
            text: goodsStatus[1],
            value: 1,
          },
          {
            text: goodsStatus[2],
            value: 2,
          },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={goodsStatus[val]} />;
        },
      },
      {
        title: '更新时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render(val) {
          return <span>{timeFormat(val)}</span>
        },
      },
      // {
      //   title: '剩余库存',
      //   dataIndex: 'goods_total_inventory',
      //   render: (val, record) => val - record.goods_total_sales,
      // },
      // {
      //   title: '商品上架时间',
      //   dataIndex: 'goods_shelves_time',
      //   sorter: true,
      //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      // },
      {
        title: '操作',
        fixed: 'right',
        width: 150,
        render: record =>
          record.status === 0 ? (
            <Fragment>
              <a onClick={this.editDataMsg.bind(this, record, 2)}>驳回</a>
              <Divider type="vertical" />
              <a onClick={this.editDataMsg.bind(this, record, 1)}>同意</a>
            </Fragment>
            ) : null,
      },
    ];

    // const menu = (
    //   <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
    //     <Menu.Item key="remove">删除</Menu.Item>
    //     <Menu.Item key="approval">批量审批</Menu.Item>
    //   </Menu>
    // );

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            {/* <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.goNew.bind(this)}>
                新建
              </Button>
            </div> */}
            <StandardTable
              rowKey={record => record.id}
              scroll={{ x: 1400 }}
              selectedRows={false}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <Modal
            title="认证"
            visible={formVisible}
            onCancel={this.handAddleCancel.bind(this)}
            footer=""
            destroyOnClose="true"
          >
            {this.renderModalForm()}
          </Modal>
          <Modal
            visible={imgUrl}
            onCancel={this.handImgCancel}
            footer=""
            destroyOnClose="true"
          >
            <img className={styles.certImg} src={imgUrl} alt="图片" />
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
