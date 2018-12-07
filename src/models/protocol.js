import { queryRule } from '../services/api';

export default {
  namespace: 'protocol',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    protocolForm: {
      front: [],
      back: [],
      people: [],
      desc: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    changeFormVals(state, { payload }) {
      let { protocolForm } = state;
      const { obj } = payload;
      protocolForm = {
        ...protocolForm,
        ...obj,
      };
      protocolForm.front = protocolForm.front || [];
      protocolForm.back = protocolForm.back || [];
      protocolForm.people = protocolForm.people || [];
      protocolForm.desc = protocolForm.desc || [];
      return {
        ...state,
        protocolForm,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
