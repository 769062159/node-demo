import {
  getFrontUserList,
  getUserRankList,
  addUserRank,
  updateUserRank,
  delUserRank,
  updateUpLevel,
  updateMemberLevel,
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
    *updateUpLevel({ payload }, { call, put }) {
      yield call(updateUpLevel, { ...payload });
      const response = yield call(getFrontUserList, { page: payload.page });
      yield put({
        type: 'getFrontUserList',
        payload: response,
      });
    },
    *updateMemberLevel({ payload }, { call, put }) {
      yield call(updateMemberLevel, { ...payload });
      const response = yield call(getFrontUserList, { page: payload.page });
      yield put({
        type: 'getFrontUserList',
        payload: response,
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
      yield put({
        type: 'getFrontUserList',
        payload: response,
      });
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
      const { data } = payload;
      return {
        ...state,
        frontUserList: data.list,
        frontUserListPage: {
          pageSize: data.page,
          total: data.total,
        },
      };
    },
  },
};
