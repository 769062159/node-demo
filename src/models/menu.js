import { message } from 'antd';
import { getAllMenu, getRoleMenu, setRoleMenu, deleteMenu, addMenu } from '../services/api';

export default {
  namespace: 'menu',

  state: {
    data: [],
    RoleMenu: [],
    routerForm: {}, // 路由表单的内容
  },

  effects: {
    *submitAddMenuForm({ payload }, { call, put }) {
      yield call(addMenu, payload);
      message.success('提交成功');
      const response = yield call(getAllMenu);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *changeFormVal({ payload }, { put }) {
      yield put({
        type: 'changeFormVals',
        payload,
      });
    },
    *fetchMenu(_, { call, put }) {
      const response = yield call(getAllMenu);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *fetchRoleMenu({ payload }, { call, put }) {
      const response = yield call(getRoleMenu, payload);
      yield put({
        type: 'RoleMenu',
        payload: response.data,
      });
    },
    *setRoleMenu({ payload }, { call }) {
      yield call(setRoleMenu, payload);
      // const responses = yield call(getRoleMenu, payload);
      // yield put({
      //   type: 'RoleMenu',
      //   payload: responses.data,
      // });
    },
    *delMenu({ payload }, { call, put }) {
      yield call(deleteMenu, payload);
      const response = yield call(getAllMenu);
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },

  reducers: {
    changeFormVals(state, { payload }) {
      let { routerForm } = state;
      routerForm = {
        ...routerForm,
        ...payload.obj,
      };
      return {
        ...state,
        routerForm,
      };
    },
    show(state, { payload }) {
      // state.menuList = payload;
      return {
        ...state,
        ...payload,
        routerForm: {},
      };
    },
    RoleMenu(state, { payload }) {
      // state.menuList = payload;
      return {
        ...state,
        RoleMenu: payload,
      };
    },
  },
};
