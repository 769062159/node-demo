import { getConfig, addConfig } from '../services/config';

export default {
  namespace: 'config',

  state: {
    list: [],
    config: {
      mobile: '',
      video_audio: false,
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
    *addConfig({ payload, callback }, { call, put }) {
      const res = yield call(addConfig, payload);
      if (res && res.code === 200) {
        callback();
        const response = yield call(getConfig, payload);
        yield put({
          type: 'getConfig',
          payload: response,
        });
      }
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
      data.video_audio =  Boolean(data.video_audio);
      data.personal_verify =  Boolean(data.personal_verify);
      return {
        ...state,
        config: data,
      };
    },
  },
};
