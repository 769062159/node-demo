import { queryRule } from '../services/api';

export default {
  namespace: 'protocol',

  state: {
    data: {
      list: [],
      pagination: {},
      protocolForm: {
        yyy: [],
        xxx: [],
      },
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
        protocolForm.xxx = protocolForm.xxx || [];
        protocolForm.yyy = protocolForm.yyy || [];
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
