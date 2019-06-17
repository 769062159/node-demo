import * as api from '../services/operation';

export default {
  namespace: 'operationPosition',
  state: {
    position: {
      list: [],
      page: 1,
      pagesize: 10,
      total: 10,
      key: '',
    },
    // 职位管理的对话框
    positionDialogShow: false,
  },
  effects: {
    // 分页获取职位
    *doGetPositionList({ payload }, { call, put }) {
      const params = {
        page: payload.page,
        pagesize: payload.pagesize,
        key: payload.key,
      };
      const response = yield call(api.getPositionList, params);
      yield put({
        type: 'setPositionObj',
        payload: {
          list: response.data.list,
          total: response.data.count,
          params,
        },
      });
    },
    // 创建职位
    *doCreatePosition({ payload }, { call, put }) {
      yield call(api.createPosition, { ...payload.data });
      yield put({
        type: 'setPositionDialogShow',
        payload: false,
      });
      yield put({
        type: 'doGetPositionList',
        payload: payload.searchParams,
      });
    },
    // 更新职位
    *doUpdatePosition({ payload }, { call, put }) {
      yield call(api.updatePosition, { ...payload.data });
      yield put({
        type: 'setPositionDialogShow',
        payload: false,
      });
      yield put({
        type: 'doGetPositionList',
        payload: payload.searchParams,
      });
    },
    // 删除职位
    *doDelPosition({ payload }, { call, put }) {
      yield call(api.delPosition, { ...payload.data });
      yield put({
        type: 'doGetPositionList',
        payload: payload.searchParams,
      });
    },
  },
  reducers: {
    setPositionObj(state, { payload }) {
      return {
        ...state,
        position: {
          ...state.position,
          list: payload.list,
          total: payload.total,
          ...payload.params,
        },
      };
    },
    setPositionDialogShow(state, { payload }) {
      return {
        ...state,
        positionDialogShow: payload,
      };
    },
  },
};
