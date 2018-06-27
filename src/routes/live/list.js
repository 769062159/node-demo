import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import debounce from 'lodash/debounce'
import moment from 'moment';
import { Table, message, Upload, Modal, Card, Form, Input, Icon, Button, Divider, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import request from '../../utils/request';
// import querystring from 'querystring';
const Option = Select.Option;

const FormItem = Form.Item;
const { TextArea } = Input;
const { confirm } = Modal;
let timeout;
// let currentValue;
function fetchData(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  // currentValue = value;

  function fake() {
    request('/admin/goods/list', {
      method: 'POST',
      body: {
        goods_name: value,
        goods_status: 0,
      },
    }).then(res => {
      console.log(res.data.list);
      callback(res.data.list);
    })
    // const str = querystring.encode({
    //   code: 'utf-8',
    //   q: value,
    // });
    // jsonp(`https://suggest.taobao.com/sug?${str}`)
    //   .then(response => response.json())
    //   .then((d) => {
    //     if (currentValue === value) {
    //       const result = d.result;
    //       const data = [];
    //       result.forEach((r) => {
    //         data.push({
    //           value: r[0],
    //           text: r[0],
    //         });
    //       });
    //       callback(data);
    //     }
    //   });

    
  }

  timeout = setTimeout(fake, 300);
}
// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');
// const statusMap = ['processing', 'processing', 'error'];
// const goodsStatus = ['上架', '未上架', '下架'];
// const goodsTypeStatus = ['普通商品', '一元购', '秒杀', '众筹'];
// const payType = ['拍下减库存', '付款减库存'];

@connect(({ live, goods, loading }) => ({
  live,
  goods,
  loading: loading.models.live,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    pagination: 1,
    expandForm: false,
    editData: {},
    addUserVisible: false,
    previewVisible: false,
    previewImage: '',
    fileList: [],
    data: [],
    value: [],
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'live/fetchLive',
      payload: {
        pagination,
      },
    });
  }
  handleChanges = (value) => {
    this.setState({ value });
    fetchData(value, data => this.setState({ data }));
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

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
        const { pagination } = that.state;
        dispatch({
          type: 'live/deleteLive',
          payload: {
            ad_id: id,
            pagination,
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 修改信息
  editGoods = (data, e) => {
    e.preventDefault();
    this.setState({
      editData: data,
    });
    this.showModal();
  };
  // 新增modal显示
  showModal = () => {
    this.setState({
      addUserVisible: true,
    });
    this.renderForm();
  };
  // 新增取消
  handAddleCancel = () => {
    this.setState({
      addUserVisible: false,
      editData: {},
      fileList: [],
    });
  };
  // 新增修改提交
  handleSubmit = (type, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.fileList.length) {
          values.cover = this.state.fileList[0].url;
        } else {
          message.error('请上传直播封面');
          return false;
        }
        const { dispatch } = this.props;
        const { editData, pagination } = this.state;
        values.pagination = pagination;
        if (Object.keys(editData).length) {
          values.ad_id = editData.id;
          dispatch({
            type: 'live/editLive',
            payload: values,
          });
          message.success('修改成功');
        } else {
          dispatch({
            type: 'live/addLive',
            payload: values,
          });
          message.success('添加成功');
        }
        this.handAddleCancel();
      }
    });
  };
  // 上传图片
  handleCancel = () => this.setState({ previewVisible: false });
  removeImg = () => {
    const { editData } = this.state;
    editData.cover = '';
    this.setState({ editData });
  };
  // 放大图片
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      pagination: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchLive',
      payload: {
        pagination: current,
      },
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
  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  renderAddForm() {
    const { loading } = this.props;
    const { header, fileList, previewImage, previewVisible, data } = this.state;
    const options = data.map(d => <Option key={d.goods_id}>{d.goods_name}</Option>);
    // 上传icon
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    // 上传图片参数
    const payload = {
      type: 2,
    };
    const { getFieldDecorator } = this.props.form;
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
      <Form onSubmit={this.handleSubmit.bind(this, 0)} hideRequiredMark style={{ marginTop: 8 }}>
        <FormItem label="直播标题">
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入标题',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="直播简介">
          {getFieldDecorator('desc', {
            rules: [
              {
                required: true,
                message: '请输入简介',
              },
            ],
          })(<TextArea placeholder="请输入简介" autosize />)}
        </FormItem>
        {uploadItem}
        <Select
          mode="multiple"
          value={this.state.value}
          placeholder={this.props.placeholder}
          style={this.props.style}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onChange={this.handleChanges}
        >
          {options}
          {/* <Option key={2}>{3}</Option>
          <Option key={1}>{1}</Option>
          <Option key={4}>{5}</Option> */}
        </Select>
        <FormItem tyle={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
  renderEditForm() {
    const { loading } = this.props;
    const { header, editData, fileList, previewVisible } = this.state;
    let { previewImage } = this.state;
    const desc = editData.desc;
    if (editData.cover) {
      const img = {
        uid: -1,
        status: 'done',
      };
      img.name = `${editData.id}.png`;
      img.url = editData.cover;
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
      <Form onSubmit={this.handleSubmit.bind(this, 1)} hideRequiredMark style={{ marginTop: 8 }}>
        <FormItem label="直播标题">
          {getFieldDecorator('title', {
            initialValue: editData.title,
            rules: [
              {
                required: true,
                message: '请输入简介',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="直播简介">
          {getFieldDecorator('desc', {
            initialValue: desc,
            rules: [
              {
                required: true,
                message: '请输入直播简介',
              },
            ],
          })(<TextArea placeholder="请输入简介" autosize />)}
        </FormItem>
        {editData.cover !== 1 ? uploadItem : null}
        <FormItem tyle={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            修改
          </Button>
        </FormItem>
      </Form>
    );
  }
  // 渲染修改还是新增
  renderForm() {
    const { editData } = this.state;
    const length = Object.keys(editData).length;
    return length ? this.renderEditForm() : this.renderAddForm();
  }
  render() {
    const { live: { liveList: datas, liveListPage }, loading } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { addUserVisible } = this.state;
    const progressColumns = [
      {
        title: '直播标题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '直播简介',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '直播封面',
        dataIndex: 'cover',
        render: val => (val ? <img src={val} style={{width: '200px'}} alt="图片" /> : null),
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '修改时间',
        dataIndex: 'update_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            <a onClick={this.editGoods.bind(this, record)}>修改</a>
            <Divider type="vertical" />
            <a onClick={this.deleteGoods.bind(this, record.id)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="直播列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.showModal.bind(this)}>
                新建
              </Button>
            </div>
            <Table
              dataSource={datas}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
              pagination={liveListPage}
            />
          </div>
        </Card>
        <Modal
          title="Title"
          visible={addUserVisible}
          onCancel={this.handAddleCancel.bind(this)}
          footer=""
        >
          {this.renderForm()}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
