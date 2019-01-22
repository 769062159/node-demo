import { getConfig, addConfig } from '../services/config';

export default {
  namespace: 'config',

  state: {
    list: [],
    config: {
      mobile: '',
      video_audio: 0,
    },
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
    setting(state, { payload }) {
      const { config } = state;
      config[payload.key] = payload.value;
      return {
        ...state,
        config,
      };
    },
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
      return {
        ...state,
        config: data,
      };
    },
  },
};
