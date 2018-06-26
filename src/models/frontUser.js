import { getFrontUserList } from '../services/frontUser.js';

export default {
  namespace: 'frontUser',

  state: {
    frontUserList: [], // table列表
    frontUserListPage: {}, // table 页脚
  },

  effects: {
    *fetchFrontUserList({ payload }, { call, put }) {
      const response = yield call(getFrontUserList, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getFrontUserList',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    getFrontUserList(state, { payload }) {
      return {
        ...state,
        frontUserList: payload.list,
        frontUserListPage: {
          pageSize: payload.page,
          total: payload.total,
        },
      };
    },
  },
};
