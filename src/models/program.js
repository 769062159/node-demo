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
    },
    *editProgramDetail({ payload }, { call, put }) {
      yield call(editProgramDetail, { ...payload });
      const response = yield call(getProgramDetail, { ...payload });
      yield put({
        type: 'setProgramDetail',
        payload: response,
      });
    },
    *getAuthorizationUrl({ payload }, { call, put }) {
      const response = yield call(getAuthorizationUrl, { ...payload });
      yield put({
        type: 'setAuthorizationUrl',
        payload: response,
      });
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
    setAuthorizationUrl(state, { payload }) {
      const { data: { authorization_url: url } } = payload;
      console.log(url);
      if (url) {
        // window.open(url, '_blank');
        const w = window.open('about:blank');
        w.location.href = url;
      }
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
