import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import {
  // Row,
  // Col,
  Table,
  message,
  Upload,
  Modal,
  Card,
  Form,
  Input,
  Tag,
  //   Select,
  Icon,
  Button,
  InputNumber,
  // Dropdown,
  // Menu,
  // InputNumber,
  // DatePicker,
  // Badge,
  Divider,
} from 'antd';
// import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const { confirm } = Modal;
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
// const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// const statusMap = ['processing', 'processing', 'error'];
// const goodsStatus = ['上架', '未上架', '下架'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
@Form.create()
export default class GoodsType extends PureComponent {
  state = {
    expandForm: false,
    dataIndex: {},
    formVisible: false,
    // selectedRows: [],
    formValues: {},
    previewVisible: false,
    previewImage: '',
    fileList: [],
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    // selectOption: 0,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/getAllType',
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

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    console.log(99);
    console.log(params);
    dispatch({
      type: 'goods/getAllType',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    console.log(999);
    dispatch({
      type: 'goods/getAllType',
      payload: {},
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  // handleMenuClick = e => {
  //   const { dispatch } = this.props;
  //   const { selectedRows } = this.state;

  //   if (!selectedRows) return;

  //   switch (e.key) {
  //     case 'remove':
  //       dispatch({
  //         type: 'rule/remove',
  //         payload: {
  //           no: selectedRows.map(row => row.no).join(','),
  //         },
  //         callback: () => {
  //           this.setState({
  //             selectedRows: [],
  //           });
  //         },
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // handleSelectRows = rows => {
  //   this.setState({
  //     selectedRows: rows,
  //   });
  // };

  // handleSearch = e => {
  //   e.preventDefault();

  //   const { dispatch, form } = this.props;

  //   form.validateFields((err, fieldsValue) => {
  //     if (err) return;

  //     const values = {
  //       ...fieldsValue,
  //       updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
  //     };

  //     this.setState({
  //       formValues: values,
  //     });
  //     console.log(9999);
  //     dispatch({
  //       type: 'goods/getAllType',
  //       payload: values,
  //     });
  //   });
  // };

  // 删除商品
  deleteDataMsg = id => {
    event.preventDefault();
    const that = this;
    confirm({
      content: '你确定删除这个吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        dispatch({
          type: 'goods/delGoodType',
          payload: {
            class_id: id,
          },
        });
        // that.setState({
        //   dataSource: DelDataSource,
        // });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 修改信息
  editDataMsg = (id, e) => {
    e.preventDefault();
    this.setState({
      dataIndex: id,
    });
    this.showModal();
  };
  // 新增modal显示
  showModal = () => {
    this.setState({
      formVisible: true,
    });
    this.renderForm();
  };
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      formVisible: false,
      dataIndex: {},
      fileList: [],
    });
  };
  // 新增修改提交
  handleSubmit = (type, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          ...values,
        };
        if (this.state.fileList.length) {
          data.image = this.state.fileList[0].url;
        } else {
          message.error('请上传图片');
          return false;
        }
        const { dispatch } = this.props;
        const { dataIndex } = this.state;
        console.log(type);
        if (type) {
          data.class_id = dataIndex.class_id;
          dispatch({
            type: 'goods/editGoodType',
            payload: data,
          });
          message.success('修改成功');
        } else {
          dispatch({
            type: 'goods/addGoodType',
            payload: data,
          });
          message.success('添加成功');
        }
        this.handAddleCancel();
      }
    });
  };
  // 选择option
  //   selectOption = value => {
  //     console.log(value);
  //     this.setState({
  //       selectOption: value,
  //     });
  //   };
  // 上传图片
  handleCancel = () => this.setState({ previewVisible: false });
  removeImg = () => {
    const { dataIndex } = this.state;
    dataIndex.class_img_url = '';
    this.setState({ dataIndex });
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    // const { response } = fileList;
    fileList = fileList.map(item => {
      if (item.status === 'done') {
        const img = {};
        img.status = 'done';
        img.response = { status: 'success' };
        img.name = item.name;
        img.uid = item.uid;
        img.url = item.response.data;
        return img;
      }
      return item;
    });
    this.setState({ fileList });
  };
  renderAdvancedForm() {
    const { loading } = this.props;
    const { header, fileList, previewImage, previewVisible } = this.state;
    // 上传icon
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    // 上传图片参数
    const payload = {
      type: 2,
    };
    const { getFieldDecorator } = this.props.form;
    // const selectItem = [];
    // selectItem.push(
    //   <Option key={9999} value={0}>
    //     顶级分类
    //   </Option>
    // );
    // datas.forEach(res => {
    //   selectItem.push(
    //     <Option key={res.class_id} value={res.class_id}>
    //       {res.class_name}
    //     </Option>
    //   );
    // });
    // 上传图片dom
    const uploadItem = (
      <div className="clearfix">
        <Upload
          action="http://hlsj.test.seastart.cn/admin/upload"
          headers={header}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          data={payload}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this, 0)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem label="分类名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入分类名称',
              },
            ],
          })(<Input placeholder="给分类起个名字" />)}
        </FormItem>
        <FormItem
          label="排序"
          {...formItemLayout}
          extra={<Tag color="blue">排序数值越大，类别排得越前面</Tag>}
        >
          {getFieldDecorator('sort', {
            rules: [
              {
                required: true,
                message: '请输入排序',
              },
            ],
          })(<InputNumber placeholder="排序" min={0} />)}
        </FormItem>
        {/* <FormItem label="上级分类">
          {getFieldDecorator('parent_id', {})(
            <Select style={{ width: 120 }} onChange={this.selectOption}>
              {selectItem}
            </Select>
          )}
        </FormItem> */}
        {/* {selectOption ? uploadItem : null} */}
        <FormItem
          {...formItemLayout}
          label="图片"
          extra={<Tag color="blue">建议尺寸80px*80px</Tag>}
        >
          {uploadItem}
        </FormItem>
        <FormItem style={{ marginTop: 32 }} {...formSubmitLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
  renderSimpleForm() {
    const { loading } = this.props;
    const { header, dataIndex, fileList, previewVisible } = this.state;
    let { previewImage } = this.state;
    const className = dataIndex.class_name;
    // const classParentId = dataIndex.class_parent_id || 0;
    if (dataIndex.class_img_url) {
      const img = {
        uid: -1,
        status: 'done',
      };
      img.name = `${dataIndex.class_name}.png`;
      img.url = dataIndex.class_img_url;
      previewImage = img.url;
      fileList[0] = img;
    }
    // 上传icon
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    // 上传图片参数
    const payload = {
      type: 2,
    };
    const { getFieldDecorator } = this.props.form;
    // const selectItem = [];
    // if (dataIndex.class_level === 1) {
    //   selectItem.push(
    //     <Option key={999} value={0}>
    //       顶级分类
    //     </Option>
    //   );
    // } else {
    //   datas.forEach(res => {
    //     selectItem.push(
    //       <Option key={res.class_id} value={res.class_id}>
    //         {res.class_name}
    //       </Option>
    //     );
    //   });
    // }
    // 上传图片dom
    const uploadItem = (
      <div className="clearfix">
        <Upload
          action="http://hlsj.test.seastart.cn/admin/upload"
          headers={header}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          data={payload}
          onRemove={this.removeImg}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
    return (
      <Form
        onSubmit={this.handleSubmit.bind(this, 1)}
        hideRequiredMark
        style={{ marginTop: 8 }}
        autoComplete="OFF"
      >
        <FormItem label="分类名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: className,
            rules: [
              {
                required: true,
                message: '请输入分类名称',
              },
            ],
          })(<Input placeholder="给分类起个名字" />)}
        </FormItem>
        <FormItem
          label="排序"
          {...formItemLayout}
          extra={<Tag color="blue">排序数值越大，类别排得越前面</Tag>}
        >
          {getFieldDecorator('sort', {
            initialValue: dataIndex.sort,
            rules: [
              {
                required: true,
                message: '请输入排序',
              },
            ],
          })(<InputNumber placeholder="排序" min={0} />)}
        </FormItem>
        {/* <FormItem label="上级分类">
          {getFieldDecorator('parent_id', {
            initialValue: classParentId,
            rules: [
              {
                required: true,
                message: '请输入分类名称',
              },
            ],
          })(
            <Select style={{ width: 120 }} onChange={this.selectOption}>
              {selectItem}
            </Select>
          )}
        </FormItem> */}
        {/* {dataIndex.class_level !== 1 ? uploadItem : null} */}
        <FormItem
          {...formItemLayout}
          label="图片"
          extra={<Tag color="blue">建议尺寸80px*80px</Tag>}
        >
          {uploadItem}
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
    const { dataIndex } = this.state;
    const length = Object.keys(dataIndex).length;
    return length ? this.renderSimpleForm() : this.renderAdvancedForm();
  }
  render() {
    const { goods: { goodType: datas }, loading } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { formVisible } = this.state;
    const progressColumns = [
      {
        title: '分类名',
        dataIndex: 'class_name',
        key: 'class_name',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        // render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '图标',
        dataIndex: 'class_img_url',
        render: val => (val ? <img src={val} style={{ width: 80 }} alt="图片" /> : null),
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        // render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            <a onClick={this.editDataMsg.bind(this, record)}>修改</a>
            <Divider type="vertical" />
            <a onClick={this.deleteDataMsg.bind(this, record.class_id)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.showModal.bind(this)}>
                新建
              </Button>
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )} */}
            </div>
            <Table
              // onChange={this.handleTableChange}
              dataSource={datas}
              rowKey={record => record.class_id}
              loading={loading}
              columns={progressColumns}
              pagination={false}
            />
            {/* <StandardTable
              rowKey={record => record.class_id}
              // scroll={{ x: 1500 }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            /> */}
          </div>
        </Card>
        <Modal
          title="分类"
          visible={formVisible}
          destroyOnClose="true"
          onCancel={this.handAddleCancel.bind(this)}
          footer=""
        >
          {this.renderForm()}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
