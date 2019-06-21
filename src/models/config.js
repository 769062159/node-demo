import { getConfig, addConfig, getCardConfig, saveCardConfig, getVideoGoodsConfigList, createVideoGoodsConfig, deleteVideoGoodsConfig, getVideoGoodsConfigPower, setVideoGoodsConfigPower } from '../services/config';

export default {
  namespace: 'config',

  state: {
    list: [],
    videoGoodsList: [],
    videoGoodsPower: 0,
    config: {
      mobile: '',
      operate_mobile: '',
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
    *cardConfig({ payload }, { call, put }) {
      const response = yield call(getCardConfig, payload);
      yield put({
        type: 'getCardConfig',
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
    *saveCardConfig({ payload, callback }, { call, put }) {
      const res = yield call(saveCardConfig, payload);
      if (res && res.code === 200) {
        callback();
        const response = yield call(getCardConfig, payload);
        yield put({
          type: 'getCardConfig',
          payload: response,
        });
      }
    },

    *videoGoodsConfig({ payload }, { call, put }) {
      const response = yield call(getVideoGoodsConfigList, payload);
      yield put({
        type: 'getVideoGoodsConfig',
        payload: response,
      });
    },

    *videoGoodsConfigPower({ payload }, { call, put }) {
      const response = yield call(getVideoGoodsConfigPower, payload);
      yield put({
        type: 'getVideoGoodsPower',
        payload: response,
      });
    },
    *setVideoGoodsConfigPower({ payload, callback }, { call, put }) {
      const res = yield call(setVideoGoodsConfigPower, payload);
      if (res && res.code === 200) {
        callback();
        const response = yield call(getVideoGoodsConfigPower, payload);
        yield put({
          type: 'getVideoGoodsPower',
          payload: response,
        });
      }
    },

    *createVideoGoodsConfig({ payload, callback }, { call, put }) {
      const res = yield call(createVideoGoodsConfig, payload);
      if (res && res.code === 200) {
        callback();
        const response = yield call(getVideoGoodsConfigList, payload);
        yield put({
          type: 'getVideoGoodsConfig',
          payload: response,
        });
      }
    },

    *deleteVideoGoodsConfig({ payload, callback }, { call, put }) {
      const res = yield call(deleteVideoGoodsConfig, payload);
      if (res && res.code === 200) {
        callback();
        const response = yield call(getVideoGoodsConfigList, payload);
        yield put({
          type: 'getVideoGoodsConfig',
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
    getCardConfig(state, { payload }) {
      const { data } = payload;
      data.user_ids =  data.user_ids;
      return {
        ...state,
        config: data,
      };
    },

    getVideoGoodsConfig(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        videoGoodsList: data.list,
      };
    },
    getVideoGoodsPower(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        videoGoodsPower: data.power,
      };
    },
  },
};
