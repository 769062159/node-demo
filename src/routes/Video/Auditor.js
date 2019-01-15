import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, message, Modal, Button, Row, Col, Input, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Style.less';

const { confirm } = Modal;

@connect(({ video, loading }) => ({
    video,
    loading: loading.models.video,
}))
export default class Auditor extends Component {
    state = {
        page: 1,
        addVisibility: false,
        useId: '',
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const {  page } = this.state;
        dispatch({
          type: 'video/getMember',
          payload: {
            page,
          },
        });
    }

    openOrCloseModal = () => {
        const { addVisibility } = this.state;
        this.setState({
            addVisibility: !addVisibility,
        });
    }

    handleTableChange = (pagination) => {
        const { current } = pagination;
        this.setState({
          page: current,
        });
        const { dispatch } = this.props;
        dispatch({
          type: 'video/getMember',
          payload: {
            page: current,
          },
        });
    }

    addMember = () => {
        const { useId, page } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'video/createMember',
            payload: {
                user_id: useId,
            },
            callback: () => {
                message.success('设置成功');
                this.setState({
                    useId: '',
                })
            },
            refresh: {
                page,
            },
        });
    }

    handleUserId = (e) => {
        this.setState({
            useId: e.target.value,
        })
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
        const { video: { memberList, memberListPage }, loading } = this.props;
        const { addVisibility, useId } = this.state;
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
                render: val => (`通过：${val}`),
            },
            {
                title: '出错率',
                dataIndex: 'audit_pass_num',
                key: 'audit_pass_num',
                render: (val, record) => {
                    const num = (val && record.audit_backend_reject_num) ? `${((record.audit_backend_reject_num) / val * 100).toFixed(2)}%` : '0%';
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
            <Card bordered={false}>
              <Button type="primary" style={{ marginBottom: 20 }} onClick={this.openOrCloseModal}>新增</Button>
              <Table
                onChange={this.handleTableChange}  // 换页
                //   className="components-table-demo-nested"
                // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                dataSource={memberList}
                rowKey={record => record.id}
                loading={loading}
                columns={progressColumns}
                pagination={memberListPage}
              />
            </Card>
            <Modal visible={addVisibility} onOk={this.addMember} onCancel={this.openOrCloseModal} destroyOnClose="true">
              <Row>
                <Col span={4}>
                  用户id：
                </Col>
                <Col span={4}>
                  <Input style={{ width: 300 }} defaultValue={useId} onChange={this.handleUserId} />
                </Col>
              </Row>
            </Modal>
          </PageHeaderLayout>
        )
    }
}