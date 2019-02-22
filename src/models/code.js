import { getConfigCode, saveCodeConfig, getCodeLog } from '../services/code';

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
  },

  effects: {
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
