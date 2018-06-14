import { getAllGoods, getRoleMenu, setRoleMenu, deleteMenu } from '../services/api';

export default {
  namespace: 'goods',

  state: {
    goodsList: {},
  },

  effects: {
    *fetchGoods({ payload }, { call, put }) {
      const response = yield call(getAllGoods, payload);
      yield put({
        type: 'show',
        payload: response.data,
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
        goodsList: payload,
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
