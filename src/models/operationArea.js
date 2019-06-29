import * as api from '../services/operation';

export default {
  namespace: 'operationArea',
  state: {
    area: {
      list: [],
      page: 1,
      pagesize: 10,
      total: 10,
      key: '',
    },
    // 大区管理的对话框
    areaDialogShow: false,
    // 所有省份
    allProvinces: [],
  },
  effects: {
    // 分页获取大区
    *doGetAreaList({ payload }, { call, put }) {
      const params = {
        page: payload.page,
        pagesize: payload.pagesize,
        key: payload.key,
      };
      const response = yield call(api.getAreaList, params);
      yield put({
        type: 'setAreaObj',
        payload: {
          list: response.data.list,
          total: response.data.count,
          params,
        },
      });
    },
    // 创建大区
    *doCreateArea({ payload }, { call, put }) {
      yield call(api.createArea, { ...payload.data });
      yield put({
        type: 'setAreaDialogShow',
        payload: false,
      });
      yield put({
        type: 'doGetAreaList',
        payload: payload.searchParams,
      });
    },
    // 更新大区
    *doUpdateArea({ payload }, { call, put }) {
      yield call(api.updateArea, { ...payload.data });
      yield put({
        type: 'setAreaDialogShow',
        payload: false,
      });
      yield put({
        type: 'doGetAreaList',
        payload: payload.searchParams,
      });
    },
    // 删除大区
    *doDelArea({ payload }, { call, put }) {
      yield call(api.delArea, { ...payload.data });
      yield put({
        type: 'doGetAreaList',
        payload: payload.searchParams,
      });
    },
    // 所有省份
    *doGetAllProvinces(_, { call, put }) {
      const response = yield call(api.getAllProvinces);
      yield put({
        type: 'setAllProvinces',
        payload: response.data.list || [],
      });
    },
  },
  reducers: {
    setAreaObj(state, { payload }) {
      return {
        ...state,
        area: {
          ...state.area,
          list: payload.list,
          total: payload.total,
          ...payload.params,
        },
      };
    },
    setAreaDialogShow(state, { payload }) {
      return {
        ...state,
        areaDialogShow: payload,
      };
    },
    setAllProvinces(state, { payload }) {
      return {
        ...state,
        allProvinces: payload,
      };
    },
    setPositionDialogShow(state, { payload }) {
      return {
        ...state,
        areaDialogShow: payload,
      };
    },
  },
};
