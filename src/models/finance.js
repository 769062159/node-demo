import {
  getAccountList,
  getAccountDetail,
  getWithdrawList,
  updateWithdraw,
  getRefundList,
  editRefundStatus,
  editRefundMoney,
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
  },

  effects: {
    *updateRefundStatus({ payload }, { call, put }) {
      yield call(editRefundStatus, payload);
      const response = yield call(getRefundList, payload);
      yield put({
        type: 'getRefundList',
        payload: response,
      });
    },
    *updateRefundMoney({ payload }, { call, put }) {
      yield call(editRefundMoney, payload);
      const response = yield call(getRefundList, payload);
      yield put({
        type: 'getRefundList',
        payload: response,
      });
    },
    *fetchAccountList({ payload }, { call, put }) {
      const response = yield call(getAccountList, payload);
      yield put({
        type: 'getAccountList',
        payload: response,
      });
    },
    *fetchRefundList({ payload }, { call, put }) {
      const response = yield call(getRefundList, payload);
      yield put({
        type: 'getRefundList',
        payload: response,
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
      });
    },
    *updateWithdraw({ payload }, { call, put }) {
      yield call(updateWithdraw, payload);
      const response = yield call(getWithdrawList, { page: payload.page });
      yield put({
        type: 'getWithdraw',
        payload: response,
      });
    },
  },

  reducers: {
    getRefundList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        refundList: data.list,
        refundListPage: {
          pageSize: data.page,
          total: data.total,
        },
      };
    },
    getWithdraw(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        withdrawList: data.list,
        withdrawListPage: {
          pageSize: data.page,
          total: data.total,
        },
      };
    },
    getAccountList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        accountList: data.list,
        accountListPage: {
          pageSize: data.page,
          total: data.total,
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
