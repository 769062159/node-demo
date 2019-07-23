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
    programDetail: {
      config_jump_account: 0,
    },
    wxOpen: '',
    binComponentUrl: '',
  },

  effects: {
    *saveProgram({ payload, callback }, { call }) {
      const response = yield call(updateProgram, payload);
      if (response && response.code === 200) {
        callback();
      }
    },
    *updateProgramss({ value, callback, key, id }, { call, put }) {
      const payload = {};
      payload[key] = value;
      payload.account_id = id;
      const response = yield call(updateProgram, payload);
      if (response && response.code === 200) {
        callback();
        yield put({
          type: 'updateKeyProgram',
          payload: {
            key,
            value,
          },
        });
      }
    },
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
    *fetchProgramList({ payload, callback }, { call, put }) {
      const response = yield call(getProgramList, { ...payload });
      if (response && response.code === 200 && callback) {
        callback();
      }
      yield put({
        type: 'getProgramList',
        payload: response,
      });
    },
    *addProgram({ payload, callback }, { call, put }) {
      yield call(addProgram, { ...payload });
      if (callback) callback();
      // const response = yield call(getProgramList);
      // yield put({
      //   type: 'getProgramList',
      //   payload: response,
      // });
    },
    *delProgram({ payload }, { call, put }) {
      yield call(deleteProgram, { ...payload });
      if (callback) callback();
      // const response = yield call(getProgramList);
      // yield put({
      //   type: 'getProgramList',
      //   payload: response,
      // });
    },
    *getProgramDetail({ payload, callback }, { call, put }) {
      const response = yield call(getProgramDetail, { ...payload });
      yield put({
        type: 'setProgramDetail',
        payload: response,
      });
      if (response && response.code === 200) {
        if (callback) callback();
        const authorizationUrl = yield call(getAuthorizationUrl, { ...payload });
        yield put({
          type: 'setAuthorizationUrl',
          payload: authorizationUrl,
        });
      }
    },
    *editProgramDetail({ payload, callback }, { call, put }) {
      yield call(editProgramDetail, { ...payload });
      if (callback) callback();
      // const response = yield call(getProgramDetail, { ...payload });
      // yield put({
      //   type: 'setProgramDetail',
      //   payload: response,
      // });
    },
    *getAuthorizationUrl({ payload, callback }, { call }) {
      const response = yield call(getAuthorizationUrl, { ...payload });
      if (response && response.code === 200 && callback) callback(response.data.authorization_url, response.data.bin_component_url);
      // yield put({
      //   type: 'setAuthorizationUrl',
      //   payload: response,
      // });
    },
  },

  reducers: {
    updateKeyProgram(state, { payload }) {
      const { programDetail } = state;
      programDetail[payload.key] = payload.value;
      return {
        ...state,
        programDetail,
      };
    },
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
        /*if (hasPublicArr.length > 5) {
          hasPublic = true;
        }
        if (data.length - hasPublicArr.length > 5) {
          hasApplets = true;
        }*/
      }
      return {
        ...state,
        programList: data,
        hasApplets,
        hasPublic,
      };
    },
    setAuthorizationUrl(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        authorizationUrl: data.authorization_url,
        binComponentUrl: data.bin_component_url
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
