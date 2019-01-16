import {
  getProgramList,
  addProgram,
  getAuthorizationUrl,
  deleteProgram,
  getProgramDetail,
  editProgramDetail,
  getWxOpen,
  updateProgram,
} from '../services/program';

export default {
  namespace: 'program',

  state: {
    hasPublic: true,
    hasApplets: true,
    programList: [],
    authorizationUrl: '',
    programDetail: {},
    wxOpen: '',
  },

  effects: {
    *updateProgram({ payload, callback }, { call, put }) {
      const response = yield call(updateProgram, { ...payload });
      if (response && response.code === 200) {
        callback();
        yield put({
          type: 'updatePrograms',
          payload: {
            id: payload.account_id,
            is_show_live: payload.is_show_live,
            payType: payload.pay_type,
          },
        });
      }
    },
    *getWxOpen({ payload }, { call, put }) {
      const response = yield call(getWxOpen, { ...payload });
      yield put({
        type: 'getWxOpens',
        payload: response,
      });
    },
    *fetchProgramList(_, { call, put }) {
      const response = yield call(getProgramList);
      yield put({
        type: 'getProgramList',
        payload: response,
      });
    },
    *addProgram({ payload }, { call, put }) {
      yield call(addProgram, { ...payload });
      const response = yield call(getProgramList);
      yield put({
        type: 'getProgramList',
        payload: response,
      });
    },
    *delProgram({ payload }, { call, put }) {
      yield call(deleteProgram, { ...payload });
      const response = yield call(getProgramList);
      yield put({
        type: 'getProgramList',
        payload: response,
      });
    },
    *getProgramDetail({ payload }, { call, put }) {
      const response = yield call(getProgramDetail, { ...payload });
      yield put({
        type: 'setProgramDetail',
        payload: response,
      });
      if (response && response.code === 200) {
        const authorizationUrl = yield call(getAuthorizationUrl, { ...payload });
        yield put({
          type: 'setAuthorizationUrl',
          authorizationUrl,
        });
      }
    },
    *editProgramDetail({ payload }, { call, put }) {
      yield call(editProgramDetail, { ...payload });
      const response = yield call(getProgramDetail, { ...payload });
      yield put({
        type: 'setProgramDetail',
        payload: response,
      });
    },
    *getAuthorizationUrl({ payload, callback }, { call }) {
      const response = yield call(getAuthorizationUrl, { ...payload });
      if (response && response.code === 200 && callback) callback(response.data.authorization_url);
      // yield put({
      //   type: 'setAuthorizationUrl',
      //   payload: response,
      // });
    },
  },

  reducers: {
    updatePrograms(state, { payload }) {
      const { programDetail } = state;
      if (payload.payType) {
        programDetail.pay_type = payload.payType;
      } else {
        programDetail.is_show_live = payload.is_show_live;
      }
      return {
        ...state,
        programDetail,
      };
    },
    getWxOpens(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        wxOpen: data,
      };
    },
    getProgramList(state, { payload }) {
      const { data } = payload;
      let hasApplets = false;
      let hasPublic = false;
      if (data) {
        const hasPublicArr = data.filter(element => element.type);
        if (hasPublicArr.length > 5) {
          hasPublic = true;
        }
        if (data.length - hasPublicArr.length > 5) {
          hasApplets = true;
        }
      }
      return {
        ...state,
        programList: data,
        hasApplets,
        hasPublic,
      };
    },
    setAuthorizationUrl(state, { authorizationUrl }) {
      if (process.env.API_ENV === 'test') {
        const { data: { authorization_url: url } } = authorizationUrl;
        return {
          ...state,
          authorizationUrl: url,
        };
      } else {
        const { data: { authorization_url: url } } = authorizationUrl;
        return {
          ...state,
          authorizationUrl: url,
        };
      }
    },
    setProgramDetail(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        programDetail: data,
      };
    },
  },
};
