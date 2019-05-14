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
  setAuthorCode,
  setRemark,
  getCodeNum,
  getRecord,
} from '../services/frontUser.js';
import { updateMember, addMember } from '../services/video';

export default {
  namespace: 'frontUser',

  state: {
    levelRecord: {
      list: [],
    }, // 设置等级记录
    superiorRecord: {
      list: [],
    }, // 修改上级记录
    versionRecord: {
      list: [],
    }, // 设置版本记录
    codeRecord: {
      list: [],
    }, // 设置授权码记录
    commissionRecord: {
      list: [],
    }, // 佣金记录
    frontUserList: [], // table列表
    frontUserListPage: {}, // table 页脚
    userRankList: [], // 用户等级列表
    getDefaultList: [], // 默认用户列表
    codeForm: {
      is_commission: 1,
      trade_type: 1,
    }, // code表单
  },

  effects: {
    *getRecord({ payload }, { call, put }) {
      const res = yield call(getRecord, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'getRecords',
          payload: res,
          types: payload.type,
          page: payload.page,
          pageSize: payload.page_number,
        });
      }
    },
    *getCodeNum({ payload, callback }, { call }) {
      const res = yield call(getCodeNum, payload);
      if (res && res.code === 200) {
        callback(res.data);
      }
    },
    *setAuthorCode({ payload, callback }, { call }) {
      const res = yield call(setAuthorCode, payload);
      if (res && res.code === 200) {
        callback();
      }
    },
    *setRemark({ payload, callback }, { call }) {
      const res = yield call(setRemark, payload);
      if (res && res.code === 200) {
        callback();
      }
    },
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
    *updateUpLevel({ payload, callback }, { call, put }) {
      const res = yield call(updateUpLevel, { ...payload });
      if (res && res.code === 200) {
        callback();
        const response = yield call(getFrontUserList, { page: payload.page });
        yield put({
          type: 'getFrontUserList',
          payload: response,
        });
      }
    },
    *updateMemberLevel({ payload, callback }, { call, put }) {
      const res = yield call(updateMemberLevel, { ...payload });
      if (res && res.code === 200) {
        callback();
        const response = yield call(getFrontUserList, { page: payload.page });
        yield put({
          type: 'getFrontUserList',
          payload: response,
        });
      }
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
    getRecords(state, { payload, types, pageSize, page }) {
      let { levelRecord, superiorRecord, versionRecord, codeRecord, commissionRecord } = state;
      let { data } = payload;
      types = Number(types);
      data = {
        list: data.list,
        pagination: {
          current: page,
          total: data.total,
          pageSize,
        },
      };
      switch (types) {
        case 1:
          levelRecord = data;
          break;
        case 2:
        superiorRecord = data;
          break;
        case 3:
        versionRecord = data;
          break;
        case 4:
        codeRecord = data;
          break;
        case 5:
        commissionRecord = data;
          break;
        default:
          break;
      }
      return {
        ...state,
        levelRecord,
        superiorRecord,
        versionRecord,
        commissionRecord,
        codeRecord,
      };
    },
    changeFormVals(state, { payload }) {
      let { codeForm } = state;
      codeForm = {
        ...codeForm,
        ...payload.obj,
      };
      return {
        ...state,
        codeForm,
      };
    },
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
