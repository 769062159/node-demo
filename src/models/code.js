import { getConfigCode, saveCodeConfig, getCodeLog, getUserCode, getUserDetail, getCodeList } from '../services/code';

export default {
  namespace: 'code',

  state: {
    codeConfig: {
      xxx: [],
    },
    codeLog: {
      list: [],
      pagination: {},
    },
    userCode: {
      list: [],
      pagination: {},
    },
    codeDetail: {},
    merchant: {
      list: [],
      pagination: {},
    },
    group: {
      list: [],
      pagination: {},
    },
    wealth: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *getCodeList({ payload }, { call, put }) {
      const response = yield call(getCodeList, payload);
      yield put({
        type: 'getCodeLists',
        payload: response,
        types: payload.type,
        page: payload.page,
        pageSize: payload.page_number,
      });
    },
    *getUserDetail({ payload }, { call, put }) {
      const response = yield call(getUserDetail, payload);
      yield put({
        type: 'getUserDetails',
        payload: response,
      });
    },
    *getUserCode({ payload }, { call, put }) {
      const response = yield call(getUserCode, payload);
      yield put({
        type: 'getUserCodes',
        payload: response,
        page: payload.page,
        pageSize: payload.page_number,
      });
    },
    *getCodeLog({ payload }, { call, put }) {
      const response = yield call(getCodeLog, payload);
      yield put({
        type: 'getCodeLogs',
        payload: response,
        page: payload.page,
        pageSize: payload.page_number,
      });
    },
    *fetchCode({ payload }, { call, put }) {
      const response = yield call(getConfigCode, payload);
      yield put({
        type: 'fetchCodes',
        payload: response,
      });
    },
    *saveCodeConfig({ payload, callback }, { call }) {
      const res = yield call(saveCodeConfig, payload);
      if (res && res.code === 200) {
        callback();
      }
    },
  },

  reducers: {
    clearDetail(state) {
      return {
        ...state,
        codeDetail: {},
        merchant: {
          list: [],
          pagination: {},
        },
        group: {
          list: [],
          pagination: {},
        },
        wealth: {
          list: [],
          pagination: {},
        },
      };
    },
    getCodeLists(state, { payload, page, pageSize, types }) {
      let { data } = payload;
      let { merchant, group, wealth } = state;
      const list = data.list.map(res => {
        res.user = res.has_the_user || res.has_origin_user || res.has_transfer_user;
        return res;
      })
      data = {
        list,
        pagination: {
          current: page,
          total: data.total,
          pageSize,
        },
      };
      switch (types) {
        case 1:
          merchant = data;
          break;
        case 2:
          group = data;
          break;
        case 3:
          wealth = data;
          break;
        default:
          break;
      }
      return {
        ...state,
        merchant,
        group,
        wealth,
      };
    },
    getUserDetails(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        codeDetail: data,
      };
    },
    getUserCodes(state, { payload, page, pageSize }) {
      let { data } = payload;
      data = {
        list: data.list,
        pagination: {
          current: page,
          total: data.total,
          pageSize,
        },
      };
      return {
        ...state,
        userCode: data,
      };
    },
    getCodeLogs(state, { payload, page, pageSize }) {
      let { data } = payload;
      data = {
        list: data.list,
        pagination: {
          current: page,
          total: data.total,
          pageSize,
        },
      };
      return {
        ...state,
        codeLog: data,
      };
    },
    fetchCodes(state, { payload }) {
      const { data } = payload;
      if (data.share_pic) {
        data.xxx = [{
          url: data.share_pic,
          status: 'done',
          uploaded: 'done',
          response: { status: 'success', data: data.share_pic },
          name: data.share_pic,
          uid: data.share_pic,
        }];
      } else {
        data.xxx = [];
      }
      data.rules = data.rule;
      data.descs = data.desc;
      return {
        ...state,
        codeConfig: data,
      };
    },
    changeFormVal(state, { payload }) {
      let { codeConfig } = state;
      codeConfig = {
        ...codeConfig,
        ...payload.obj,
      };
      return {
        ...state,
        codeConfig,
      };
    },
  },
};
