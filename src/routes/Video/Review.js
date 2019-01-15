import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, message, Modal, Divider, Row, Col, Select } from 'antd';
import moment from 'moment';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Style.less';

const { confirm } = Modal;
const { Option } = Select;

@connect(({ video, loading }) => ({
    video,
    loading: loading.models.video,
}))
export default class Review extends Component {
    state = {
        videoUrl: '',
        page: 1,
        videoId: '',
        reasonVisibility: false,
        reason: '',
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
        dispatch({
            type: 'video/getReasons',
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

    openReason = (id) => {
        this.setState({
            videoId: id,
            reasonVisibility: true,
        })
    }

    openOrCloseReason = () => {
        this.setState({
            reasonVisibility: !this.state.reasonVisibility,
            reason: '',
        })
    }

    refund = () => {
        const { videoId, page, reason } = this.state;
        if (!reason) {
            message.error('请输入理由');
            return false;
        }
        const { dispatch } = this.props;
        dispatch({
          type: 'video/passOrTurnVideo',
          payload: {
            status: 2,
            video_id: videoId,
            reason,
          },
          callback: () => {
              this.setState({
                reasonVisibility: false,
                reason: '',
              })
              message.success('设置成功');
          },
          refresh: {
              page,
              status: 0,
          },
        });
    }

    passOrTurnVideo = (fakeid, status) => {
        event.preventDefault();
        const { page } = this.state;
        const { dispatch } = this.props;
        confirm({
            content: `你确定通过这个视频吗？`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'video/passOrTurnVideo',
                    payload: {
                        video_id: fakeid,
                        status,
                    },
                    callback: () => {
                        message.success('设置成功');
                    },
                    refresh: {
                        page,
                        status: 0,
                    },
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    hanleRefund = (e) => {
        this.setState({
            reason: e,
        })
    }

    openVideo = (videoUrl) => {
        this.setState({
            videoUrl,
        })
    }

    handleCancelVideo = () => {
        this.setState({
            videoUrl: '',
        })
    }

    render() {
        const { video: { videoList, videoListPage, reasonList }, loading } = this.props;
        const reasonListArr = [];
        if (reasonList.length) {
            reasonList.forEach((res, index) => {
                reasonListArr.push(
                  <Option value={index} key={index}>
                    {res}
                  </Option>
                );
              });
        }
        const { reasonVisibility, videoUrl } = this.state;
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
                    <a onClick={this.passOrTurnVideo.bind(this, record.id, 1)}>通过</a>
                    <Divider type="vertical" />
                    <a onClick={this.openReason.bind(this, record.id)}>驳回</a>
                    <Divider type="vertical" />
                    <a onClick={this.openVideo.bind(this, record.video_url)}>播放</a>
                  </Fragment>
                ),
            },
        ];
        const autoplay = true;
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
            <Modal visible={reasonVisibility} onOk={this.refund} onCancel={this.openOrCloseReason} destroyOnClose="true">
              <Row>
                <Col span={4}>
                  原因：
                </Col>
                <Col span={4}>
                  <Select placeholder="请选择" style={{ width: 200 }} onChange={this.hanleRefund}>
                    {reasonListArr}
                  </Select>
                </Col>
              </Row>
            </Modal>
            <div className={styles.modalItem} style={{display:(videoUrl) ? "block":"none"}}>
              <img className={styles.closeItem} src='/img/close.png' onClick={this.handleCancelVideo} alt="关闭" />
              <Player
                autoPlay={autoplay}
                playsInline
                src={videoUrl}
              />
            </div>
          </PageHeaderLayout>
        )
    }
}