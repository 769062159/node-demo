import {
  getFrontUserList,
  getUserRankList,
  addUserRank,
  updateUserRank,
  delUserRank,
} from '../services/frontUser.js';

export default {
  namespace: 'frontUser',

  state: {
    frontUserList: [], // table列表
    frontUserListPage: {}, // table 页脚
    userRankList: [], // 用户等级列表
  },

  effects: {
    *fetchUserRankList({ payload }, { call, put }) {
      const response = yield call(getUserRankList, { ...payload });
      yield put({
        type: 'getUserRankLists',
        payload: response.data,
      });
    },
    *addUserRank({ payload }, { call, put }) {
      yield call(addUserRank, { ...payload });
      const response = yield call(getUserRankList, { ...payload });
      yield put({
        type: 'getUserRankLists',
        payload: response.data,
      });
    },
    *updateUserRank({ payload }, { call, put }) {
      yield call(updateUserRank, { ...payload });
      const response = yield call(getUserRankList, { ...payload });
      yield put({
        type: 'getUserRankLists',
        payload: response.data,
      });
    },
    *delUserRank({ payload }, { call, put }) {
      yield call(delUserRank, { ...payload });
      const response = yield call(getUserRankList, { ...payload });
      yield put({
        type: 'getUserRankLists',
        payload: response.data,
      });
    },
    *fetchFrontUserList({ payload }, { call, put }) {
      const response = yield call(getFrontUserList, { ...payload });
      if (response.code === 200) {
        yield put({
          type: 'getFrontUserList',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    getUserRankLists(state, { payload }) {
      return {
        ...state,
        userRankList: payload.list,
      };
    },
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
