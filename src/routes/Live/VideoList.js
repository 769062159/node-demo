import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
// import copy from 'copy-to-clipboard';
import { routerRedux } from 'dva/router';
import {
  Table,
  message,
  Modal,
  Card,
  Form,
  Button,
  Divider,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
// import LiveGoodTable from '../../components/LiveGoodTable';

const { confirm } = Modal;


const vodType = ['' ,'录播地址', '上传视频', '腾讯视频'];


@connect(({ live, goods, loading }) => ({
  live,
  goods,
  loading: loading.models.live,
}))
@Form.create()
export default class Vod extends PureComponent {
  state = {
    pagination: 1,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'live/fetchVideo',
      payload: {
        pagination,
      },
    });
  }
  
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
        const { pagination } = that.state;
        dispatch({
          type: 'live/deleteVideo',
          payload: {
            id,
            pagination,
          },
          callback: () => {
            message.success('删除成功！');
          },
        });
      },
      onCancel() {
      },
    });
  };
  // 新增修改提交
  handleSubmit = () => {
    const { dispatch, live: { liveForm, uploadLiveImg, liveGoods } } = this.props;
    if (!uploadLiveImg.length) {
      message.error('请上传封面');
      return;
    }
    const { pagination } = this.state;
    const arrId = [];
    const arrName = [];
    liveGoods.forEach(res => {
      arrId.push(res.key);
      arrName.push(res.label);
    });
    liveForm.goods_ids = arrId;
    liveForm.goods_names = arrName;
    liveForm.pagination = pagination;
    liveForm.cover = uploadLiveImg[0].url;
    if (liveForm.id) {
      liveForm.live_id = liveForm.id;
      dispatch({
        type: 'live/editLive',
        payload: liveForm,
      });
      message.success('修改成功');
    } else {
      dispatch({
        type: 'live/addLive',
        payload: liveForm,
      });
      message.success('添加成功');
    }
    this.handAddleCancel();
  };
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      pagination: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'live/fetchVideo',
      payload: {
        pagination: current,
      },
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
  goPath = () => {
    const { dispatch } = this.props;
    const url = `/live/add-Video/confirm`;
    dispatch(routerRedux.push(url));
  };
  
  render() {
    const {
      live: { videoList: datas, videoListPage },
      loading,
    } = this.props;
    // const { getFieldDecorator } = this.props.form;
    const { pagination } = this.state;
    videoListPage.current = pagination;
    const progressColumns = [
      {
        title: '录播标题',
        dataIndex: 'title',
        key: 'title',
      },
      //   {
      //     title: '直播简介',
      //     dataIndex: 'desc',
      //     key: 'desc',
      //   },
      {
        title: '录播封面',
        dataIndex: 'cover',
        render: val => (val ? <img src={val} style={{ width: '80px' }} alt="图片" /> : null),
      },
      {
        title: '录播类型',
        dataIndex: 'type',
        render: val => vodType[val],
      },
      {
        title: '录播地址',
        dataIndex: 'url',
        width: 280,
      },
      // {
      //   title: '更新时间',
      //   dataIndex: 'updated_at',
      //   render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      // },
      {
        title: '操作',
        width: 100,
        render: (text, record) => (
          <Fragment>
            <a href={`#/live/edit-vod/confirm/${record.id}`}>修改</a>
            <Divider type="vertical" />
            <a onClick={this.deleteDataMsg.bind(this, record.id)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={this.goPath.bind(this)}>
              新建
            </Button>
          </div>
          <div className={styles.tableList}>
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
              pagination={videoListPage}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
