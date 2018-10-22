import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import debounce from 'lodash/debounce';
import moment from 'moment';
// import copy from 'copy-to-clipboard';
import { routerRedux } from 'dva/router';
import {
  Table,
  message,
  Modal,
  Card,
  Form,
  Row,
  Col,
  Input,
  Button,
  Divider,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';


const { confirm } = Modal;
const FormItem = Form.Item;



@connect(({ live, goods, loading }) => ({
  live,
  goods,
  loading: loading.models.live,
}))
@Form.create()
export default class Live extends PureComponent {
  state = {
    videoUrl: '',
    page: 1,
    formValues: {},
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'live/fetchSmallVideo',
      payload: {
        page,
      },
    });
  }
  
  // 上下架商品
  modifyStatus = (id, type) => {
    event.preventDefault();
    let name;
    if (!type) {
      name = '下架';
    } else {
      name = '上架';
    }
    const that = this;
    confirm({
      content: `你确定${name}这个吗？`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        const { page } = that.state;
        dispatch({
          type: 'live/modifyStatus',
          payload: {
            status: type,
            video_id: id,
          },
          page,
          callback: () => {
            message.success(`${name}成功！`);
          },
        });
      },
      onCancel() {
      },
    });
  };
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
        const { page } = that.state;
        dispatch({
          type: 'live/deleteLive',
          payload: {
            live_id: id,
            page,
          },
        });
        message.success('删除成功！');
      },
      onCancel() {
      },
    });
  };
  // 修改信息
  editDataMsg = (data, e) => {
    e.preventDefault();
    this.showModal();
    const { dispatch } = this.props;
    dispatch({
      type: 'live/editLiveMsg',
      payload: {
        data,
      },
    });
  };
  // 新增modal显示
  // showModal = () => {
  //   this.setState({
  //     liveVisible: true,
  //   });
  // };
  // 新增取消
  // handAddleCancel = () => {
  //   this.setState({
  //     liveVisible: false,
  //   });
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'live/clearLiveMsg',
  //   });
  // };
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      page: current,
    });
    const { formValues } = this.state;
    const { dispatch } = this.props;
    const data = {
      ...formValues,
      page: current,
    }
    dispatch({
      type: 'live/fetchSmallVideo',
      payload: data,
    });
  };

  // 修改表单值
  changeFormVal = val => {
    const { dispatch } = this.props;
    const obj = {};
    for (const key of Object.keys(val)) {
      obj[key] = val[key].value;
    }
    dispatch({
      type: 'live/changeFormVal',
      payload: {
        obj,
      },
    });
  };
  openVideo = (videoUrl) => {
    this.setState({
      videoUrl,
    })
  }
  goPath = () => {
    const { dispatch } = this.props;
    const url = `/community/small-video-add`;
    dispatch(routerRedux.push(url));
  };
  handleCancelVideo = () => {
    this.setState({
      videoUrl: '',
    })
  }
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      page: 1,
    });
    dispatch({
      type: 'live/fetchSmallVideo',
      payload: {},
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
        page,
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'live/fetchSmallVideo',
        payload: values,
      });
    });
  };
  // 放大图片
  // handlePreviewImg = file => {
  //   this.setState({
  //     previewImage: file.url || file.thumbUrl,
  //     previewVisible: true,
  //   });
  // };
  // 关闭放大图片
  // handleCancelImg = () => this.setState({ previewVisible: false });
  // 上传图片
  handleChangeImg = data => {
    if (!data.file.status) {
      return;
    }
    let { fileList } = data;
    fileList = fileList.map(item => {
      if (item.status === 'done' && item.uploaded !== 'done') {
        const img = {};
        img.status = 'done';
        img.uploaded = 'done';
        img.response = { status: 'success' };
        img.name = item.name;
        img.uid = item.uid;
        img.url = item.response.data;
        return img;
      }
      return item;
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'live/setLiveImg',
      payload: {
        fileList,
      },
    });
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" autoComplete="OFF">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="小视频名称">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="主播id">
              {getFieldDecorator('user_id')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
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
  renderForm() {
    return this.renderSimpleForm();
  }
  render() {
    const {
      live: { smallVideoList: datas, smallVideoListPage },
      loading,
    } = this.props;
    const { videoUrl } = this.state;
    // const { getFieldDecorator } = this.props.form;
    // const { liveVisible, header, previewVisible, previewImage, fetching, value, data } = this.state;
    const progressColumns = [
      {
        title: '视频封面',
        dataIndex: 'cover',
        render: val => (val ? <img src={val} style={{ width: '80px' }} alt="图片" /> : null),
      },
      {
        title: '视频名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '用户id',
        dataIndex: 'user_id',
        key: 'user_id',
      },
      {
        title: '上传时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            {
              record.status === 1 ? (
                <a onClick={this.modifyStatus.bind(this, record.id, 0)}>下架</a>
              ) : (
                <a onClick={this.modifyStatus.bind(this, record.id, 1)}>上架</a>
              )
            }
            <Divider type="vertical" />
            <a onClick={this.openVideo.bind(this, record.video_url)}>播放</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            {/* <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.goPath.bind(this)}>
                新建
              </Button>
            </div> */}
            <Table
              dataSource={datas}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
              pagination={smallVideoListPage}
              onChange={this.handleTableChange}
            />
          </div>
          <div className={styles.modalItem} style={{display:(videoUrl) ? "block":"none"}}>
            <img className={styles.closeItem} src='/img/close.png' onClick={this.handleCancelVideo} alt="关闭" />
            <video className={styles.videoItems} src={videoUrl} controls><track kind="captions" /></video>
          </div>
          {/* <Modal visible={videoUrl} footer={null} width={300} bodyStyle={{ textAlign: 'center' }} onCancel={this.handleCancelVideo}>
            <video className={styles.videoItems} src={videoUrl} controls><track kind="captions" /></video>
          </Modal> */}
        </Card>
      </PageHeaderLayout>
    );
  }
}
