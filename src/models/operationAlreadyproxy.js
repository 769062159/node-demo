import * as api from '../services/operation';
import { message } from 'antd';

export default {
  namespace: 'operationAlreadyproxy',
  state: {
    // 区域信息
    regionTree: [],
    // 商户选择的地域（已代理区域、可代理区域）
    userChosen: [],
  },
  effects: {
    // 区域信息
    // payload: { data, regionTree, regionRef }
    *doGetRegionList({ payload }, { call, put }) {
      const result = yield call(api.getRegions, payload.data);
      if (result.code >= 400) {
        message.error(result.message);
        return;
      }
      result.data.list = result.data.list.map((item) => {
        const data = {
          ...item,
          key: `${item.id}-${item.level}`,
          title: item.name,
        };
        if (data.level === 4) {
          data.children = [];
        }
        return data;
      })
      if (payload.data.type === 1) {
        yield put({
          type: 'setRegionList',
          payload: result.data.list,
        });
      } else {
        payload.regionRef.children = result.data.list || [];
        yield put({
          type: 'setRegionList',
          payload: payload.regionTree,
        });
      }
      payload.callback();
    },
    // 获取已代理区域列表
    *doGetAlreadyProxyRegions(_, { call, put }) {
      const result = yield call(api.getAlreadyProxyAreas);

      if (result.code >= 400) {
        message.error(result.message);
        return;
      }


      yield put({
        type: 'setUserChosen',
        payload: result.data.list,
      });
    },
    // 设置已代理区域
    *doSetAlreadyProxyRegions({ payload }, { call, put }) {
      const result = yield call(api.updateAlreadyProxyAreas, {
        list: payload.params,
      });
      if (result.code >= 400) {
        message.error(result.message);
      }
      yield put({
        type: 'setUserChosen',
        payload: payload.userChosen,
      });
    },
  },
  reducers: {
    setRegionList(state, { payload }) {
      return {
        ...state,
        regionTree: [...payload],
      };
    },
    setUserChosen(state, { payload }) {
      return {
        ...state,
        userChosen: payload.map((item) => ({
          ...item,
          key: `${item.id}-${item.level}`,
          title: item.name,
        })),
      };
    },
  },
};
