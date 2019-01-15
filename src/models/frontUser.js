import {
  getFrontUserList,
  getUserRankList,
  addUserRank,
  updateUserRank,
  delUserRank,
  updateUpLevel,
  updateMemberLevel,
  setDefaultId,
  getDefault,
  merchantSetting,
  updatePower,
  updateCommssion,
} from '../services/frontUser.js';
import { updateMember, addMember } from '../services/video';

export default {
  namespace: 'frontUser',

  state: {
    frontUserList: [], // table列表
    frontUserListPage: {}, // table 页脚
    userRankList: [], // 用户等级列表
    getDefaultList: [], // 默认用户列表
  },

  effects: {
    *createMember({ payload, callback }, { call, put }) {
      const res = yield call(addMember, payload);
      if (res && res.code === 200) {
        callback();
        yield put({
          type: 'updateMember',
          payload,
        });
      }
    },
    *cancelOrPosition({ payload, callback }, { call, put }) {
      const res = yield call(updateMember, payload);
      if (res && res.code === 200) {
        callback();
        yield put({
          type: 'updateMember',
          payload,
        });
      }
    },
    *updateCommssion({ payload, callback }, { call, put }) {
      const data = yield call(updateCommssion, { ...payload });
      if (data && data.code === 200) {
        callback();
        yield put({
          type: 'updateCommssions',
          payload,
        });
      }
    },
    *chgPower({ payload, callback }, { call }) {
      const data = yield call(updatePower, { ...payload });
      if (data && data.code === 200) {
        callback();
      }
    },
    *merchantSetting({ payload, callback }, { call, put }) {
      const data = yield call(merchantSetting, { ...payload });
      if (data && data.code === 200) {
        callback();
        yield put({
          type: 'merchantSettings',
          payload: {
            type: payload.type,
            member_id: payload.member_id,
          },
        });
      }
    },
    *getMerchantmobile({ callback }, { select }) {
      const mobile = yield select(state => state.user.currentUser.mobile);
      if (mobile) {
        callback(mobile);
      }
    },
    *setDefault({ payload, callback }, { call, put }) {
      const data = yield call(setDefaultId, { ...payload });
      if (data && data.code === 200) {
        callback();
        const response = yield call(getDefault);
        yield put({
          type: 'getDefaultLists',
          payload: response,
        });
      }
    },
    *getDefaultList(_, { call, put }) {
      const response = yield call(getDefault);
      yield put({
        type: 'getDefaultLists',
        payload: response,
      });
    },
    *fetchUserRankList({ payload }, { call, put }) {
      const response = yield call(getUserRankList, { ...payload });
      yield put({
        type: 'getUserRankLists',
        payload: response,
      });
    },
    *addUserRank({ payload }, { call, put }) {
      yield call(addUserRank, { ...payload });
      const response = yield call(getUserRankList, { ...payload });
      yield put({
        type: 'getUserRankLists',
        payload: response,
      });
    },
    *updateUserRank({ payload }, { call, put }) {
      yield call(updateUserRank, { ...payload });
      const response = yield call(getUserRankList, { ...payload });
      yield put({
        type: 'getUserRankLists',
        payload: response,
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
        payload: response,
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
    updateMember(state, { payload }) {
      const { user_id: id, status } = payload;
      let { frontUserList } = state;
      frontUserList = frontUserList.map(res => {
        if (res.id === id) {
          res.is_auditor = 1;
          res.auditor_status = status ? 1 : 0;
        }
        return res;
      })
      return {
        ...state,
        frontUserList,
      }
    },
    merchantSettings(state, { payload }) {
      let { frontUserList } = state;
      frontUserList = frontUserList.map(res => {
        if (res.id === payload.member_id) {
          res.has_account.permission = payload.type 
        }
        return res;
      })
      return {
        ...state,
        frontUserList,
      };
    },
    updateCommssions(state, { payload }) {
      let { frontUserList } = state;
      frontUserList = frontUserList.map(res => {
        if (res.id === payload.member_id) {
          res.has_account.account_total_income = payload.type ?  (Number(res.has_account.account_total_income) + Number(payload.money)) : (Number(res.has_account.account_total_income) - Number(payload.money));
          res.has_account.account_commission = payload.type ?  (Number(res.has_account.account_commission) + Number(payload.money)) : (Number(res.has_account.account_commission) - Number(payload.money));
        }
        return res;
      })
      return {
        ...state,
        frontUserList,
      };
    },
    getDefaultLists(state, { payload }) {
      let { data } = payload;
      if (data) {
        data = [data];
      } else {
        data = [];
      }
      return {
        ...state,
        getDefaultList: data,
      };
    },
    getUserRankLists(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        userRankList: data.list,
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
