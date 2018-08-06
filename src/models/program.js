import {
  getProgramList,
  addProgram,
  getAuthorizationUrl,
  deleteProgram,
  getProgramDetail,
  editProgramDetail,
} from '../services/program';

export default {
  namespace: 'program',

  state: {
    programList: [],
    authorizationUrl: '',
    programDetail: {},
  },

  effects: {
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
      if (response && response.code === 200 && !response.data.appid) {
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
    getProgramList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        programList: data,
      };
    },
    setAuthorizationUrl(state, { authorizationUrl }) {
      const { data: { authorization_url: url } } = authorizationUrl;
      return {
        ...state,
        authorizationUrl: url,
      };
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
