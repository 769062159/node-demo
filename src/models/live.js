import { updateLive, deleteLive, addLive, getLive } from '../services/live';

export default {
  namespace: 'live',

  state: {
    liveList: [], // table列表
    liveListPage: {}, // table 页脚
  },

  effects: {
    *fetchLive({ payload }, { call, put }) {
      const response = yield call(getLive, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getLive',
          payload: response.data,
        });
      }
    },
    *addLive({ payload }, { call, put }) {
      yield call(addLive, payload);
      const response = yield call(getLive, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getLive',
          payload: response.data,
        });
      }
    },
    *editLive({ payload }, { call, put }) {
      yield call(updateLive, payload);
      const response = yield call(getLive, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getLive',
          payload: response.data,
        });
      }
    },
    *deleteLive({ payload }, { call, put }) {
      yield call(deleteLive, payload);
      const response = yield call(getLive, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getLive',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    getLive(state, { payload }) {
      return {
        ...state,
        liveList: payload.list,
        liveListPage: {
          pageSize: payload.page,
          total: payload.total,
        },
      };
    },
  },
};
