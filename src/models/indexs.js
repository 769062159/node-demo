import { updateAds, deleteAds, addAds, getAds } from '../services/indexs';

export default {
  namespace: 'indexs',

  state: {
    adsList: [], // table列表
    adsListPage: {}, // table 页脚
  },

  effects: {
    *fetchAds({ payload }, { call, put }) {
      const response = yield call(getAds, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getAds',
          payload: response.data,
        });
      }
    },
    *addAds({ payload }, { call, put }) {
      yield call(addAds, payload);
      const response = yield call(getAds, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getAds',
          payload: response.data,
        });
      }
    },
    *editAds({ payload }, { call, put }) {
      yield call(updateAds, payload);
      const response = yield call(getAds, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getAds',
          payload: response.data,
        });
      }
    },
    *deleteAds({ payload }, { call, put }) {
      yield call(deleteAds, payload);
      const response = yield call(getAds, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getAds',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    getAds(state, { payload }) {
      return {
        ...state,
        adsList: payload.list,
        adsListPage: {
          pageSize: payload.page,
          total: payload.total,
        },
      };
    },
  },
};
