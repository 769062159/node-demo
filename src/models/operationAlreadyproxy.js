import * as api from '../services/operation';
import { message } from 'antd';

export default {
  namespace: 'operationAlreadyproxy',
  state: {
    // 区域信息
    regionTree: [],
    // 运营中心列表
    centerLoading: false,
    centerList: [],
    centerObj: {
      page: 0,
      pageSize: 15,
      hasMore: true,
    },
    // 商户选择的区域（id-level）
    targetKeys: [],
  },
  effects: {
    // 运营中心列表
    *doGetCenterList({ payload }, { call, put }) {
      yield put({
        type: 'setCenterLoading',
        payload: true,
      });

      const response = yield call(api.getCenterListRegion, {
        ...(payload.params),
        status: 3,
      });
      yield put({
        type: 'setCenterLoading',
        payload: false,
      });
      if (response.code !== 200) return;

      const list = response.data.list.map((item) => {
        const ids = {
          '1': item.area.id,
          '2': item.province.id,
          '3': item.city.id,
          '4': item.county.id,
        }

        return {
          key: `${ids[item.type.key]}-${item.type.key}`,
          title: `${item.area.name}${item.province.name}${item.city.name}${item.county.name}`,
          id: ids[item.type.key],
          level: item.type.key,
        }
      });

      yield put({
        type: 'appendCenterList',
        payload: list,
      });
      yield put({
        type: 'setCenterObj',
        payload: {
          page: payload.params.page,
          pageSize: payload.params.pagesize,
          hasMore: list.length >= payload.params.pagesize,
        },
      });

      payload.callback();
    },
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
        type: 'setTargetKeys',
        payload: result.data.list.map(item => `${item.increment}-${item.level}`),
      });

    },
    // 设置已代理区域
    *doSetAlreadyProxyRegions({ payload }, { call, put }) {
      const result = yield call(api.updateAlreadyProxyAreas, {
        list: payload.params,
      });
      if (result.code >= 400) {
        return message.error(result.message);
      }

      message.success('保存成功');
    },
  },
  reducers: {
    setRegionList(state, { payload }) {
      return {
        ...state,
        regionTree: [...payload],
      };
    },
    setCenterLoading(state, { payload }) {
      return {
        ...state,
        centerLoading: payload,
      }
    },
    appendCenterList(state, { payload }) {
      return {
        ...state,
        centerList: state.centerList.concat(payload),
      }
    },
    setCenterObj(state, { payload }) {
      return {
        ...state,
        centerObj: {
          ...(state.centerObj),
          ...payload,
        },
      }
    },
    setTargetKeys(state, { payload }) {
      return {
        ...state,
        targetKeys: [...payload],
      };
    },
  },
};
