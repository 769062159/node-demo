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
      desc: '',
    },
    verifyList: [],
    verifyListPage: {},
  },

  effects: {
    *getProtocol({ payload }, { call, put }) {
      const response = yield call(getProtocol, payload);
      yield put({
        type: 'getProtocols',
        payload: response,
      });
    },
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
      const { remark, status, verify_id: id } = payload;
      const response = yield call(updateVerify, { remark, status, verify_id: id });
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
    *setDefaultProtocol({ payload, callback }, { call }) {
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
    getProtocols(state, { payload }) {
      const { data } = payload;
      const protocolForm = {
        desc: data.agreement,
        front: [{
          status: 'done',
          uploaded: 'done',
          response: { status: 'success', data: data.id_card_pic_front },
          name: data.id_card_pic_front,
          uid: data.id_card_pic_front,
          url: data.id_card_pic_front,
        }],
        back: [{
          status: 'done',
          uploaded: 'done',
          response: { status: 'success', data: data.id_card_pic_back },
          name: data.id_card_pic_back,
          uid: data.id_card_pic_back,
          url: data.id_card_pic_back,
        }],
        people: [{
          status: 'done',
          uploaded: 'done',
          response: { status: 'success', data: data.id_card_pic_hand },
          name: data.id_card_pic_hand,
          uid: data.id_card_pic_hand,
          url: data.id_card_pic_hand,
        }],
      };
      return {
        ...state,
        protocolForm,
      };
    },
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
