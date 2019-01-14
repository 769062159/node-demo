import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, message, Modal, Divider } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Style.less';

const { confirm } = Modal;

@connect(({ video, loading }) => ({
    video,
    loading: loading.models.video,
}))
export default class Review extends Component {
    state = {
        page: 1,
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const {  page } = this.state;
        dispatch({
          type: 'video/getVideoList',
          payload: {
            status: 0,
            page,
          },
        });
    }

    handleTableChange = (pagination) => {
        const { current } = pagination;
        this.setState({
          page: current,
        });
        const { dispatch } = this.props;
        dispatch({
          type: 'video/getVideoList',
          payload: {
            status: 0,
            page: current,
          },
        });
    }

    cancelOrPosition = (fakeid, status) => {
        event.preventDefault();
        const { dispatch } = this.props;
        confirm({
            content: '你确定修改这个吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'video/cancelOrPosition',
                    payload: {
                        user_id: fakeid,
                        status,
                    },
                    callback: () => {
                        message.success('设置成功');
                    },
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {
        const { video: { videoList, videoListPage }, loading } = this.props;
        const progressColumns = [
            {
                title: '视频封面',
                dataIndex: 'cover',
                key: 'cover',
                render: val => (<img src={val} width={80} alt="视频封面" />),
            },
            {
                title: '视频名称',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: '会员',
                dataIndex: 'user_nickname',
                key: 'user_nickname',
                render: (val, record) => {
                    return (
                      <div className={styles.userInfo}>
                        <img src={record.avatar} alt="头像" />
                        <div className={styles.userMsg}>
                          <span>昵称：{val}</span>
                          <span>id：{record.fakeid}</span>
                        </div>
                      </div>
                    );
                },
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render: val => (moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')),
            },
            {
                title: '操作',
                dataIndex: 'do',
                key: 'do',
                render: (val, record) => (
                  <Fragment>
                      11
                    {/* <a onClick={this.passOrTurnVideo.bind(this, record)}>通过</a>
                    <Divider type="vertical" />
                    <a onClick={this.passOrTurnVideo.bind(this, record)}>驳回</a>
                    <Divider type="vertical" />
                    <a onClick={this.openVideo.bind(this, record.video_url)}>播放</a> */}
                  </Fragment>
                ),
            },
        ];
        return (
          <PageHeaderLayout>
            <Table
              onChange={this.handleTableChange}  // 换页
            //   className="components-table-demo-nested"
              // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
              dataSource={videoList}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
              pagination={videoListPage}
            />
          </PageHeaderLayout>
        )
    }
}