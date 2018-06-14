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
  Select,
  Icon,
  Button,
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
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// const statusMap = ['processing', 'processing', 'error'];
// const goodsStatus = ['上架', '未上架', '下架'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];
const isTrue = ['是', '否'];

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    addUserVisible: false,
    // selectedRows: [],
    formValues: {},
    previewVisible: false,
    previewImage: '',
    fileList: [],
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
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
  deleteGoods = id => {
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
            id,
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
  // 新增modal显示
  showModal = () => {
    this.setState({
      addUserVisible: true,
    });
  };
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      addUserVisible: false,
    });
  };
  // 新增提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      // const { depRole } = this.state;
      // if (depRole.length !== 2) {
      //   message.error('请选择部门角色');
      // }
      if (!err) {
        const data = {
          ...values,
        };
        if (values.parent_id) {
          if (this.state.fileList.length) {
            data.image = this.state.fileList[0].url;
          } else {
            message.error('二级分类请上传图片');
            return false;
          }
        }
        const { dispatch } = this.props;
        dispatch({
          type: 'goods/addGoodType',
          payload: data,
        });
        message.success('添加成功');
        this.handAddleCancel();
      }
    });
  };
  // 选择option
  selectOption = () => {
    console.log(1);
  };
  // 上传图片
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    console.log(file);
    this.setState({
      previewImage: file.data || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    // const { response } = fileList;
    fileList = fileList.map(item => {
      console.log(item);
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
    console.log(fileList);
    this.setState({ fileList });
  };
  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { goods: { goodType: datas }, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    // 上传icon
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { addUserVisible, header, fileList, previewVisible, previewImage } = this.state;
    const selectItem = [];
    datas.forEach(res => {
      selectItem.push(
        <Option key={res.class_id} value={res.class_id}>
          {res.class_name}
        </Option>
      );
    });
    const progressColumns = [
      {
        title: '分类名',
        dataIndex: 'class_name',
        key: 'class_name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        // render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '显示',
        dataIndex: 'is_show',
        render: val => <span>{isTrue[val]}</span>,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 150,
        render: record => (
          <Fragment>
            <a href="">配置</a>
            <Divider type="vertical" />
            <a onClick={this.deleteGoods.bind(this, record.class_id)}>删除</a>
          </Fragment>
        ),
      },
    ];

    // const menu = (
    //   <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
    //     <Menu.Item key="remove">删除</Menu.Item>
    //     <Menu.Item key="approval">批量审批</Menu.Item>
    //   </Menu>
    // );
    // 上传图片参数
    const payload = {
      type: 2,
    };
    console.log(fileList);
    return (
      <PageHeaderLayout title="商品分类">
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
              onChange={this.handleTableChange}
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
          title="Title"
          visible={addUserVisible}
          onCancel={this.handAddleCancel.bind(this)}
          footer=""
        >
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem label="分类名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入分类名称',
                  },
                ],
              })(<Input placeholder="给分类起个名字" />)}
            </FormItem>
            <FormItem label="上级分类">
              {getFieldDecorator('parent_id', {})(
                <Select style={{ width: 120 }} onChange={this.selectOption}>
                  {selectItem}
                </Select>
              )}
            </FormItem>
            {/* <FormItem
              // {...formItemLayout}
              label="上传图片"
              // extra=""
            >
              {getFieldDecorator('upload', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload
                  name="logo"
                  data={payload}
                  action="http://hlsj.test.seastart.cn/admin/img/upload"
                  // fileList={fileList}
                  // onPreview={this.handlePreview}
                  // onChange={this.handleChange}
                  headers={header}
                  listType="picture"
                >
                  <Button>
                    <Icon type="upload" /> Click to upload
                  </Button>
                </Upload>
              )}
            </FormItem> */}
            <div className="clearfix">
              <Upload
                action="http://hlsj.test.seastart.cn/admin/img/upload"
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
            <FormItem tyle={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
