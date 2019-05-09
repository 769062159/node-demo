import React, { PureComponent } from 'react';
import { connect } from 'dva';

import {
  Icon,
  Radio,
  Input,
  message,
  InputNumber,
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const RadioGroup = Radio.Group;
const Search = Input.Search;

// 最大及最小人气范围
const maxPopularity = 10;
const minPopularity = 1;

const warningMessage = {
  invalidUserId: '请输入合法用户ID',
};

@connect(({ videoLiveConfig }) => ({
  videoLiveConfig,
}))

export default class ConfigVideoLive extends PureComponent {

  componentDidMount() {
    this.props.dispatch({
      type: 'videoLiveConfig/initVideoLiveConfig',
    });
  }

  onStatusChange = (e) => {
    this.props.dispatch({
      type: 'videoLiveConfig/changeStatusConfig',
      payload: {
        type: e.target.value,
      },
      callback: () => {
        message.success("更新成功");
      },
    });
  };

  // handlePopularityChange(popularity) {
  //
  // };

  searchUser = (userId) => {
    userId = Number(userId)
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if (Number.isNaN(userId) || !reg.test(userId)) {
      message.warn(warningMessage.invalidUserId);
      return;
    }
    console.log(userId);
    this.props.dispatch({
      type: 'videoLiveConfig/checkUserLiveRoom',
      payload: { userId },
      callback: (msg) => {
        message.warn(msg);
      },
    });
  }

  render() {
    // console.log(this.state.status, this.state.popularity, this.state.liveMap );
    const { status, popularity } = this.props.videoLiveConfig;
    return (
      <PageHeaderLayout>
        <RadioGroup onChange={this.onStatusChange} value={status}>
          <Radio value={0}>
            随机进入人气最高的前&nbsp;&nbsp;&nbsp;
            <InputNumber
              min={minPopularity}
              max={maxPopularity}
              value={popularity}
              disabled={!!status}
              onChange={this.handlePopularityChange.bind(this)}
            />
            &nbsp;&nbsp;&nbsp;名直播间
          </Radio><br /><br />
          <Radio value={1}>
            随机进入指定群主房间：&nbsp;&nbsp;&nbsp;
            <Search
              placeholder="ID"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              onSearch={this.searchUser}
              style={{ width: 300 }}
              disabled={!status}
            /><br />
          </Radio>
        </RadioGroup>
      </PageHeaderLayout>
    );
  }
}


