import { query as queryUsers, queryCurrent } from '../services/user';
import {
  getRoleList,
  getGroupList,
  deleteUser,
  delDep,
  addDep,
  getUserList,
  addUser,
} from '../services/api';

export default {
  namespace: 'user',

  state: {
    list: [],
    UserList: [],
    RoleList: [],
    currentUser: {},
    GroupList: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchGroup({ payload }, { call, put }) {
      const response = yield call(getGroupList, payload);
      // const GroupList = { GroupList :response.data};
      // console.log(GroupList);
      yield put({
        type: 'getGroup',
        payload: response.data,
      });
    },
    *delDep({ payload }, { call }) {
      // 删除部门或者角色
      yield call(delDep, payload);
      // yield put({
      //   type: 'delDep',
      //   payload: response.data,
      // });
    },
    *addDep({ payload }, { call }) {
      // 删除部门或者角色
      yield call(addDep, payload);
      // console.log(response.data);
      // yield put({
      //   type: 'addDep',
      //   payload: response.data,
      // });
    },
    *addUser({ payload }, { call }) {
      // 删除部门或者角色
      yield call(addUser, payload);
      // console.log(response.data);
      // yield put({
      //   type: 'addDep',
      //   payload: response.data,
      // });
    },
    *delUser({ payload }, { call, put }) {
      const response = yield call(deleteUser, payload);
      yield put({
        type: 'deleteUser',
        payload: response.data,
      });
    },
    *fetchUser({ payload }, { call, put }) {
      const response = yield call(getUserList, payload);
      yield put({
        type: 'getUserList',
        payload: response.data,
      });
    },
    *fetchRole({ payload }, { call, put }) {
      const response = yield call(getRoleList, payload);
      // const GroupList = { GroupList :response.data};
      yield put({
        type: 'getRole',
        payload: response.data,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    getUserList(state, { payload }) {
      return {
        ...state,
        UserList: payload,
      };
    },
    getGroup(state, { payload }) {
      return {
        ...state,
        GroupList: payload,
      };
    },
    getRole(state, { payload }) {
      return {
        ...state,
        RoleList: payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
