import { message } from 'antd';
import { getAllMenu, getRoleMenu, setRoleMenu, deleteMenu, addMenu } from '../services/api';

export default {
  namespace: 'menu',

  state: {
    data: [],
    RoleMenu: [],
    routerForm: {}, // 路由表单的内容
    checkPowerArr: [], // 选中
    checkPowerObj: {}, // 选中对象有半选的
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
        payload: response,
      });
    },
    *setRoleMenu({ payload }, { call }) {
      yield call(setRoleMenu, payload);
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
    selectPowerTree(state, { payload }) {
      return {
        ...state,
        checkPowerArr: payload.checkedKeys,
        checkPowerObj: payload.e,
      };
    },
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
      const { data } = payload;
      const checkPowerArr = [];
      if (data.length) {
        data.forEach(res => {
          res.children.forEach(ele => {
            if (ele.permission) {
              checkPowerArr.push(ele.id);
            }
          });
        });
      }
      return {
        ...state,
        RoleMenu: data,
        checkPowerArr,
      };
    },
  },
};
