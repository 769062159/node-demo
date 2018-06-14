import { getAllMenu, getRoleMenu, setRoleMenu, deleteMenu } from '../services/api';

export default {
  namespace: 'menu',

  state: {
    data: [],
    RoleMenu: [],
  },

  effects: {
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
    *delMenu({ payload }, { call }) {
      yield call(deleteMenu, payload);
      // const responses = yield call(getRoleMenu, payload);
      // yield put({
      //   type: 'RoleMenu',
      //   payload: responses.data,
      // });
    },
  },

  reducers: {
    show(state, { payload }) {
      // state.menuList = payload;
      return {
        ...state,
        ...payload,
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
