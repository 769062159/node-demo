// import { routerRedux } from 'dva/router';
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
    UserListPage: {},
    RoleList: [],
    currentUser: {},
    GroupList: [],
    GroupRoleList: [], // 联表用
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
      yield put({
        type: 'getGroup',
        payload: response.data,
      });
    },
    *getJoinGroup({ payload }, { call, put }) {
      const response = yield call(getGroupList, payload);
      yield put({
        type: 'joinGroup',
        payload: response.data,
      });
    },
    *delDep({ payload }, { call }) {
      // 删除部门或者角色
      yield call(delDep, payload);
    },
    *addDep({ payload }, { call }) {
      // 删除部门或者角色
      yield call(addDep, payload);
    },
    *addUser({ payload }, { call }) {
      yield call(addUser, payload);
      // console.log(response.data);
      // yield put({
      //   type: 'addDep',
      //   payload: response.data,
      // });
    },
    *delUser({ payload }, { call, put }) {
      yield call(deleteUser, payload);
      const response = yield call(getUserList, payload);
      yield put({
        type: 'getUserList',
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
      yield put({
        type: 'getRole',
        payload: response.data,
      });
    },
    *getJoinRole({ payload }, { call, put }) {
      const response = yield call(getRoleList, payload);
      yield put({
        type: 'getRoleJoin',
        payload: response.data,
        param: payload.parent_id[0],
      });
    },
    *fetchCurrent(_, { call, put }) {
      // const response = yield call(queryCurrent);
      // yield put({
      //   type: 'saveCurrentUser',
      //   payload: response,
      // });
      const response = yield call(queryCurrent);
      if (response) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    getUserList(state, { payload }) {
      const { list, page, total } = payload;
      return {
        ...state,
        UserList: list,
        UserListPage: {
          pageSize: page,
          total,
        },
      };
    },
    getGroup(state, { payload }) {
      return {
        ...state,
        GroupList: payload,
      };
    },
    joinGroup(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        GroupRoleList: list,
      };
    },
    getRole(state, { payload }) {
      return {
        ...state,
        RoleList: payload,
      };
    },
    getRoleJoin(state, { payload, param }) {
      state.GroupRoleList = state.GroupRoleList.map(res => {
        if (res.id === param) {
          res.children = payload.list;
        }
        return res;
      });
      return {
        ...state,
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
