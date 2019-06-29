import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, message, Modal, Divider, Row, Col, Select, Form, Button, Input, Card, InputNumber, Pagination } from 'antd';
import moment from 'moment';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Style.less';

const { confirm } = Modal;
const { Option } = Select;
const FormItem = Form.Item;

@connect(({ video, loading }) => ({
    video,
    loading: loading.models.video,
}))
@Form.create()
export default class Review extends Component {
    state = {
        videoUrl: '',
        page: 1,
        videoId: '',
        reasonVisibility: false,
        reason: '',
        formValues: {},
        likeId: '',
        likeNum: 0,
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const {  page } = this.state;
        dispatch({
          type: 'video/getVideoList',
          payload: {
            status: 1,
            page,
          },
        });
        dispatch({
            type: 'video/getReasons',
        });
    }

    handleTableChange = (page) => {
        // const { current } = pagination;
        console.log(page)
        this.setState({
          page: page,
        });
        const { formValues } = this.state;
        const { dispatch } = this.props;
        dispatch({
          type: 'video/getVideoList',
          payload: {
            ...formValues,
            status: 1,
            page: page,
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
        const { videoId, page, reason, formValues } = this.state;
        if (reason === '') {
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
            });
            message.success('设置成功');
          },
          refresh: {
              ...formValues,
              page,
              status: 1,
          },
        });
    }

    passOrTurnVideo = (fakeid, status) => {
        event.preventDefault();
        const { page, formValues } = this.state;
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
                        ...formValues,
                        page,
                        status: 1,
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

    addLike = (id) => {
      this.setState({
        likeId: id,
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
          type: 'video/getVideoList',
          payload: {
            page: 1,
            status: 1,
          },
        });
      };

    openVideo = (videoUrl) => {
        this.setState({
            videoUrl,
        })
    }
    chgLikenum = (e) => {
      this.setState({
        likeNum: e,
      })
    }

    handleCancelVideo = () => {
        this.setState({
            videoUrl: '',
        })
    }

    checkLike = () => {
      const { likeId, likeNum } = this.state;
      const { dispatch } = this.props;
      dispatch({
        type: 'video/addLike',
        payload: {
          video_id: likeId,
          parise_num: likeNum,
        },
        callback: () => {
          message.success('设置成功');
          this.setState({
            likeId: '',
            likeNum: 0,
          })
        },
      });
    }
    handleSearch = e => {
        if (e) {
          e.preventDefault()
        }
        this.setState({
          page: 1,
        })
        // const { pagination } = this.state;
        const { dispatch, form } = this.props;
    
        form.validateFields((err, fieldsValue) => {
          if (err) return;
    
          const values = {
            ...fieldsValue,
            page: 1,
            status: 1,
          };
    
            this.setState({
              formValues: values,
            });
          dispatch({
            type: 'video/getVideoList',
            payload: values,
          });
        });
      };
      CloseLike = () => {
        this.setState({
          likeId: '',
        })
      }
    
    renderAdvancedForm() {
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
                <FormItem label="用户id">
                  {getFieldDecorator('user_id')(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="昵称">
                  {getFieldDecorator('nickname')(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </span>
            </div>
          </Form>
        );
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
        const { reasonVisibility, videoUrl, likeId } = this.state;
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
                width: 300,
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
              title: '分享路径',
              dataIndex: 'id',
              render: (val, record) => `/pages/small-video/main?id=${val}&userId=${record.userId}&referee_id=`,
            },
            {
              title: '创建时间',
              dataIndex: 'create_time',
              key: 'create_time',
              render: (val) => (moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')),
            },
            {
                title: '审核时间',
                dataIndex: 'backend_audit_time',
                key: 'backend_audit_time',
                render: (val, record) => {
                    const time = Math.max(val, record.audit_time);
                    return (
                      time ? moment(time * 1000).format('YYYY-MM-DD HH:mm:ss') : null
                    );
                },
            },
            {
                title: '一审审核员',
                dataIndex: 'pending',
                key: 'pending',
                render: (val, record) => {
                    let dom = null;
                    if (val && record.has_auditor_user.fake_id) {
                        dom = (
                          <div className={styles.userInfo}>
                            <img src={record.has_auditor_user.avatar} alt="头像" />
                            <div className={styles.userMsg}>
                              <span>昵称：{record.has_auditor_user.nickname}</span>
                              <span>id：{record.has_auditor_user.fake_id}</span>
                            </div>
                          </div>
                        );
                    }
                    return dom;
                },
            },
            {
                title: '二审审核员',
                dataIndex: 'pendings',
                key: 'pendings',
                render: (val, record) => {
                    let dom = null;
                    val = record.pending;
                    if (val === 2) {
                        dom = (
                          <div>
                            后台
                          </div>
                        );
                    }
                    return dom;
                },
            },
            {
                title: '操作',
                dataIndex: 'do',
                fixed: 'right',
                width: 180,
                key: 'do',
                render: (val, record) => (
                  <Fragment>
                    {
                        record.pending === 0 || record.pending === 1 || record.pending === 3 ? (
                          <Fragment>
                            <a onClick={this.passOrTurnVideo.bind(this, record.id, 1)}>通过</a>
                            <Divider type="vertical" />
                          </Fragment>
                        ) : null
                    }
                    <a onClick={this.openReason.bind(this, record.id)}>驳回</a>
                    <Divider type="vertical" />
                    <a onClick={this.openVideo.bind(this, record.video_url)}>播放</a>
                    <Divider type="vertical" />
                    <a onClick={this.addLike.bind(this, record.id)}>增加点赞</a>
                  </Fragment>
                ),
            },
        ];
        const autoplay = true;
        console.log(videoListPage)
        return (
          <PageHeaderLayout>
            <Card bordered={false}>
              <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
              <Table
                // onChange={this.handleTableChange}  // 换页
                scroll={{ x: '170%' }}
                dataSource={videoList}
                rowKey={record => record.id}
                loading={loading}
                columns={progressColumns}
                pagination={false}
              />
              <Pagination
                showQuickJumper
                defaultCurrent={videoListPage.current}
                total={videoListPage.total}
                defaultPageSize={videoListPage.page_size}
                style={{
                  margin: '20px 0',
                  textAlign: 'right'
                }}
                onChange={this.handleTableChange} />
            </Card>
            <Modal visible={!!likeId} onOk={this.checkLike} onCancel={this.CloseLike} destroyOnClose="true">
              <Row>
                <Col span={4}>
                  点赞数：
                </Col>
                <Col span={16}>
                  <InputNumber onChange={this.chgLikenum} style={{ width: 300 }} />
                </Col>
              </Row>
            </Modal>
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