import {
  getAccountList,
  getAccountDetail,
  getWithdrawList,
  updateWithdraw,
  getRefundList,
  editRefundStatus,
  editRefundMoney,
  setWithdrawConfig,
  getWithdrawConfig,
} from '../services/finance';

export default {
  namespace: 'finance',

  state: {
    accountList: [], // table列表
    accountListPage: {}, // table 页脚
    refundList: [], // table列表
    refundListPage: {}, // table 页脚
    detailMsg: {}, // 详情的个人信息
    detailList: [], // 详情列表
    detailListPage: [], // 详情列表页脚
    withdrawList: [], // table列表
    withdrawListPage: {}, // table 页脚
    withdrawConfig: {
      withdraw_tax_proportion: 0,
    },
  },

  effects: {
    *setWithdrawConfig({ payload, callback }, { call }) {
      const res = yield call(setWithdrawConfig, {...payload});
      if (res && res.code === 200) {
        callback();
      }
    },
    *getWithdrawConfig(_, { call, put }) {
      const res = yield call(getWithdrawConfig);
      yield put({
        type: 'getWithdrawConfigs',
        payload: res,
      });
    },
    *updateRefundStatus({ payload, search, callback }, { call, put }) {
      const res =  yield call(editRefundStatus, payload);
      if (res && res.code === 200) {
        callback();
        const response = yield call(getRefundList, search);
        yield put({
          type: 'getRefundList',
          payload: response,
          page: search.page,
        });
      }
    },
    *updateRefundMoney({ payload, search, callback }, { call, put }) {
      const res = yield call(editRefundMoney, payload);
      if (res && res.code === 200) {
        callback();
        const response = yield call(getRefundList, search);
        yield put({
          type: 'getRefundList',
          payload: response,
          page: search.page,
        });
      }
    },
    *fetchAccountList({ payload }, { call, put }) {
      const response = yield call(getAccountList, payload);
      yield put({
        type: 'getAccountList',
        payload: response,
        page: payload.page,
      });
    },
    *fetchRefundList({ payload }, { call, put }) {
      const response = yield call(getRefundList, payload);
      yield put({
        type: 'getRefundList',
        payload: response,
        page: payload.page,
      });
    },
    *fetchAccountDetail({ payload }, { call, put }) {
      const response = yield call(getAccountDetail, payload);
      yield put({
        type: 'getAccountDetail',
        payload: response,
      });
    },
    *fetchWithdraw({ payload }, { call, put }) {
      const response = yield call(getWithdrawList, payload);
      yield put({
        type: 'getWithdraw',
        payload: response,
        page: payload.page,
      });
    },
    *updateWithdraw({ payload, callback }, { call, put }) {
      const res =yield call(updateWithdraw, payload);
      if (res && res.code === 200) {
        callback();
      }
      const response = yield call(getWithdrawList, { page: payload.page });
      yield put({
        type: 'getWithdraw',
        payload: response,
        page: payload.page,
      });
    },
  },

  reducers: {
    getWithdrawConfigs(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        withdrawConfig: data,
      };
    },
    getRefundList(state, { payload, page }) {
      const { data } = payload;
      return {
        ...state,
        refundList: data.list,
        refundListPage: {
          pageSize: data.page,
          total: data.total,
          current: page,
        },
      };
    },
    getWithdraw(state, { payload, page }) {
      const { data } = payload;
      return {
        ...state,
        withdrawList: data.list,
        withdrawListPage: {
          pageSize: data.page,
          total: data.total,
          current: page || 1,
        },
      };
    },
    getAccountList(state, { payload, page }) {
      const { data } = payload;
      return {
        ...state,
        accountList: data.list,
        accountListPage: {
          pageSize: data.page,
          total: data.total,
          current: page || 1,
        },
      };
    },
    getAccountDetail(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        detailMsg: data.account,
        detailList: data.list,
        detailListPage: {
          pageSize: data.page,
          total: data.total,
        },
      };
    },
  },
};
