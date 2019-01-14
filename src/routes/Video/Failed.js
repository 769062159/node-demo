import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, message, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Style.less';

const { confirm } = Modal;

@connect(({ video, loading }) => ({
    video,
    loading: loading.models.video,
}))
export default class Failed extends Component {
    state = {
        page: 1,
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const {  page } = this.state;
        dispatch({
          type: 'video/getVideoList',
          payload: {
            status: 2,
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
            status: 2,
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
                title: '会员',
                dataIndex: 'nickname',
                key: 'nickname',
                render: (val, record) => {
                    return (
                      <div className={styles.userInfo}>
                        <img src={record.avatar} alt="头像" />
                        <div className={styles.userMsg}>
                          <span>昵称：{val}</span>
                          <span>id：{record.fakeid}</span>
                          <span>手机号码：{record.mobile}</span>
                        </div>
                      </div>
                    );
                },
            },
            {
                title: '是否任职',
                dataIndex: 'status',
                key: 'status',
                render: val => val ? '是' : '否',
            },
            {
                title: '统计',
                dataIndex: 'audit_num',
                key: 'audit_num',
                render: (val, record) => (
                  <div>
                    <div>审核次数：{val}</div>
                    <div>通过：{record.audit_pass_num}</div>
                    <div>驳回：{record.audit_reject_num}</div>
                  </div>
                ),
            },
            {
                title: '二审结果',
                dataIndex: 'audit_backend_pass_num',
                key: 'audit_backend_pass_num',
            },
            {
                title: '出错率',
                dataIndex: 'audit_pass_num',
                key: 'audit_pass_num',
                render: (val, record) => {
                    const num = val ? `${((val - record.audit_backend_pass_num) / val).toFixed(4) * 100}%` : '0%';
                    return num;
                },
            },
            {
                title: '操作',
                dataIndex: 'do',
                key: 'do',
                render: (val, record) => (
                    record.status === 1 ? (
                      <a onClick={this.cancelOrPosition.bind(this, record.fakeid, 0)}>取消任职</a>
                    ) : (
                      <a onClick={this.cancelOrPosition.bind(this, record.fakeid, 1)}>任职</a>
                    )
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