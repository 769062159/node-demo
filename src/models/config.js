import { getConfig, addConfig } from '../services/config';

export default {
  namespace: 'config',

  state: {
    list: [],
  },

  effects: {
    *fetchConfig({ payload }, { call, put }) {
      const response = yield call(getConfig, payload);
      yield put({
        type: 'getConfig',
        payload: response,
      });
    },
    *addConfig({ payload }, { call, put }) {
      yield call(addConfig, payload);
      const response = yield call(getConfig, payload);
      yield put({
        type: 'getConfig',
        payload: response,
      });
    },
  },

  reducers: {
    setAdsBackground(state, { payload }) {
      const { fileList } = payload;
      return {
        ...state,
        list: fileList,
      };
    },
    clearBackground(state) {
      return {
        ...state,
        list: [],
      };
    },
    getConfig(state, { payload }) {
      const { data } = payload;
      const list = [];
      if (data.index_ad) {
        list.push({
          status: 'done',
          uploaded: 'done',
          response: { status: 'success' },
          name: data.index_ad,
          uid: data.index_ad,
          url: data.index_ad,
        });
      }
      return {
        ...state,
        list,
      };
    },
  },
};
