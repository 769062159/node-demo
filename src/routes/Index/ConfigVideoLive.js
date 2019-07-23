import React, { PureComponent } from 'react';
import { connect } from 'dva';

import {
  Col,
  Row,
  Card,
  Modal,
  Icon,
  Radio,
  Input,
  Avatar,
  Button,
  message,
  InputNumber,
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const RadioGroup = Radio.Group;
const Search = Input.Search;
const Meta = Card.Meta;
const confirm = Modal.confirm;

// 最大及最小人气范围
const maxPopularity = 10;
const minPopularity = 1;

// 最大指定直播间数量
const maxAppointLength = 10;

// 随机方式
const popularityStatus = 0;
const appointStatus = 1;

// 提示消息
const noticeMessage = {
  success: '更新成功',
  invalidUserId: '请输入合法用户ID',
  invalidPopularity: '人气人数不在合法范围内',
  unexpectedError: '未找到该直播间',
  deleteSuccess: '删除成功',
  defaultSuccess: '成功生成默认配置',
  maxAppointError: '直播间数量已达到上限',
};

@connect(({ videoLiveConfig }) => ({
  videoLiveConfig,
}))

export default class ConfigVideoLive extends PureComponent {

  state = {
    addLiveRoomVisible: false,
    addLiveRoomLoading: false,
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'videoLiveConfig/initVideoLiveConfig',
      callback: () => {
        this.createDefaultConfig();
      },
    });
  }

  onStatusChange = (e) => {
    this.props.dispatch({
      type: 'videoLiveConfig/changeStatusConfig',
      payload: {
        type: e.target.value,
      },
      callback: () => {
        message.success(noticeMessage.success);
      },
    });
  };

  createDefaultConfig() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: '该商户下暂无配置',
      content: `当前商户将在 ${secondsToGo} 秒后默认生成随机直播配置`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `当前商户将在 ${secondsToGo} 秒后默认生成随机直播配置`,
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      const { status, popularity } = this.props.videoLiveConfig;
      this.props.dispatch({
        type: 'videoLiveConfig/createDefault',
        payload: { type: status, popularity },
        callback: () => {
          message.success(noticeMessage.defaultSuccess);
        },
      });
      modal.destroy();
    }, secondsToGo * 1000);
  }

  handlePopularityChange(popularity) {
    if (popularity === "" || popularity === undefined) {
      return;
    } else if (popularity < minPopularity || popularity > maxPopularity) {
      message.warn(noticeMessage.invalidPopularity);
      return;
    }
    this.props.dispatch({
      type: 'videoLiveConfig/updatePopularityNum',
      payload: {popularity},
      callback: () => {
        message.success(noticeMessage.success);
      },
    });
  };

  searchUser = (userId) => {
    const { liveMap } = this.props.videoLiveConfig;
    if (liveMap.length === maxAppointLength) {
      message.warn(noticeMessage.maxAppointError);
      return;
    }
    userId = Number(userId)
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if (Number.isNaN(userId) || !reg.test(userId) || userId <= 0) {
      message.warn(noticeMessage.invalidUserId);
      return;
    }

    const live = liveMap.filter((liveItem) => {
      return liveItem.has_user.fake_id === userId
    }).shift();
    if (live !== undefined) {
      message.warn(`${live.has_user.nickname} 的直播间已存在`);
      this.setState({
        addLiveRoomVisible: false,
      });
      return;
    }
    this.props.dispatch({
      type: 'videoLiveConfig/checkUserLiveRoom',
      payload: { userId },
      callback: (code, msg) => {
        if (code === 200) {
          this.setState({
            addLiveRoomVisible: true,
          });
        } else {
          message.warn(msg);
        }
      },
    });
  };

  // 取消添加直播间
  handleAddCancel = () => {
    this.setState({
      addLiveRoomVisible: false,
    });
  };

  // 添加直播间
  handleAddOk = (id) => {
    this.setState({
      addLiveRoomLoading: true,
    });

    this.props.dispatch({
      'type': 'videoLiveConfig/addVideoLive',
      payload: {userId: id},
      callback: () => {
        this.setState({
          addLiveRoomLoading: false,
          addLiveRoomVisible: false,
        });
      },
    });
  };

  showDeleteConfirm(userId) {
    const live = this.props.videoLiveConfig.liveMap.filter((liveItem) => {
      return liveItem.user_id === userId;
    }).shift();
    if (!live) {
      message.warn(noticeMessage.unexpectedError);
      return;
    }

    confirm({
      title: `确定要删除 ${live.has_user.nickname} 的直播间？`,
      content: `${live.desc}`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.removeLive(userId);
      },
    });
  }

  removeLive(id) {
    this.props.dispatch({
      type: 'videoLiveConfig/removeVideoLive',
      payload: {userId: id},
      callback: () => {
        message.success(noticeMessage.deleteSuccess);
      },
    });
  }

  renderLiveRoomList() {
    const { liveMap } = this.props.videoLiveConfig;

    if (!liveMap.length) {
      return;
    }

    const liveList = [...liveMap.map((live,index) => (
      <Col span={5} key={index}>
        <Card
          bordered={false}
          cover={<img alt="直播间封面" src={live.cover} />}
          actions={[<Icon type="delete" onClick={() => this.showDeleteConfirm(live.user_id)} />]}
        >
          <Meta
            avatar={<Avatar src={live.has_user.avatar} />}
            title={live.has_user.nickname}
            description={live.desc}
          />
        </Card>
      </Col>
    ))];
    return (
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Row gutter={{ xs: 8, sm: 16, md: 24}}>
          {liveList}
        </Row>
      </div>
    );
  };


  renderAddLiveRoom() {
    const { tmpLive } = this.props.videoLiveConfig;

    return (
      <Modal
        visible={this.state.addLiveRoomVisible}
        title={tmpLive.title}
        onOk={() => this.handleAddOk(tmpLive.id)}
        onCancel={this.handleAddCancel}
        footer={[
          <Button key="back" onClick={this.handleAddCancel}>取消</Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.state.addLiveRoomLoading}
            onClick={() => this.handleAddOk(tmpLive.user_id)}
          >
            确认添加
          </Button>,
        ]}
      >
        <Card
          cover={<img alt="直播间封面" src={tmpLive.cover} />}
        >
          <Meta
            avatar={<Avatar src={tmpLive.has_user.avatar} />}
            title={tmpLive.has_user.nickname}
            description={tmpLive.desc}
          />
        </Card>,
      </Modal>
    );

  };

  renderFrame() {
    const { status, popularity } = this.props.videoLiveConfig;
    return (
      <PageHeaderLayout>
        <RadioGroup onChange={this.onStatusChange} value={status}>
          <Radio value={popularityStatus}>
            随机进入人气最高的前&nbsp;&nbsp;&nbsp;
            <InputNumber
              min={minPopularity}
              max={maxPopularity}
              value={popularity}
              disabled={!!status}
              onChange={this.handlePopularityChange.bind(this)}
            />
            &nbsp;&nbsp;名直播间&nbsp;&nbsp;(人数范围：{minPopularity} ~ {maxPopularity})
          </Radio><br /><br />
          <Radio value={appointStatus}>
            随机进入指定群主房间：&nbsp;&nbsp;&nbsp;
            <Search
              placeholder="ID"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              onSearch={this.searchUser}
              style={{ width: 300 }}
              disabled={!status}
            />&nbsp;&nbsp;(最大直播间数量：{maxAppointLength})<br />
          </Radio>
        </RadioGroup>
      </PageHeaderLayout>
    );
  };


  render() {
    return (
      <div>
        {this.renderAddLiveRoom()}
        {this.renderFrame()}
        {this.renderLiveRoomList()}
      </div>
    );
  }
}


