import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm, addMenu } from '../services/api';

export default {
  namespace: 'form',

  state: {
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
    },
    editor: '',
  },

  effects: {
    *addEditor({ payload }, { put }) {
      yield put({
        type: 'addEditors',
        payload,
      });
    },
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *submitAddMenuForm({ payload }, { call }) {
      yield call(addMenu, payload);
      message.success('提交成功');
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/form/step-form/result'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },

  reducers: {
    addEditors(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        editor: payload,
      };
    },
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
  },
};
