import { queryRule } from '../services/api';
import { verifyList, updateVerify, setProtocol, getProtocol } from '../services/protocol';

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
    verifyList: [],
    verifyListPage: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *getVerifyList({ payload, callback }, { call, put }) {
      const response = yield call(verifyList, payload);
      if (callback && response && response.code === 200) {
        // const arr = [];
        // response.data.list.forEach(res => {
        //   if (res.is_check_live) {
        //     arr.push(res.id);
        //   }
        // })
        callback(response.data.list);
        // callback(arr);
      }
      yield put({
        type: 'getVerifyLists',
        payload: response,
        page: payload.page,
      })
    },
    *updateVerify({ payload, callback }, { call, put }) {
      const { remark, status, verify_id } = payload;
      const response = yield call(updateVerify, { remark, status, verify_id });
      if (callback && response && response.code === 200) {
        // const arr = [];
        // response.data.list.forEach(res => {
        //   if (res.is_check_live) {
        //     arr.push(res.id);
        //   }
        // })
        callback(response.data);
        // callback(arr);
        const res = yield call(verifyList, { page: payload.page });
        if (res && res.code === 200) {
          yield put({
            type: 'getVerifyLists',
            payload: res,
          })
        }
      }
    },
    *setDefaultProtocol({ payload, callback }, { call, put }) {
      console.log(payload, 111);
      const response = yield call(setProtocol, payload);
      if (callback && response && response.code === 200) {
        // const arr = [];
        // response.data.list.forEach(res => {
        //   if (res.is_check_live) {
        //     arr.push(res.id);
        //   }
        // })
        callback(response.data);
      }
    },
  },

  reducers: {
    getVerifyLists(state, { payload, page: current }) {
      const { data } = payload;
      const { list, total, page } = data;
      return {
        ...state,
        verifyList: list,
        verifyListPage: {
          pageSize: page,
          total,
          current,
        },
      };
    },
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
