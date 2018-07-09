import {
  getWarehouseList,
  addWarehouse,
  updateWarehouse,
  delWarehouse,
} from '../services/logistics.js';

export default {
  namespace: 'logistics',

  state: {
    warehouseList: [], // 仓库列表
    warehouseListPage: {}, // 仓库列表页脚
  },

  effects: {
    *fetchWarehouseList({ payload }, { call, put }) {
      const response = yield call(getWarehouseList, { ...payload });
      yield put({
        type: 'getWarehouseLists',
        payload: response,
      });
    },
    *addWarehouse({ payload }, { call, put }) {
      yield call(addWarehouse, { ...payload });
      const response = yield call(getWarehouseList, { ...payload });
      yield put({
        type: 'getWarehouseLists',
        payload: response,
      });
    },
    *updateWarehouse({ payload }, { call, put }) {
      yield call(updateWarehouse, { ...payload });
      const response = yield call(getWarehouseList, { ...payload });
      yield put({
        type: 'getWarehouseLists',
        payload: response,
      });
    },
    *delWarehouse({ payload }, { call, put }) {
      yield call(delWarehouse, { ...payload });
      const response = yield call(getWarehouseList, { ...payload });
      yield put({
        type: 'getWarehouseLists',
        payload: response,
      });
    },
  },

  reducers: {
    getWarehouseLists(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        warehouseList: data.list,
        warehouseListPage: {
          pageSize: data.page,
          total: data.total,
        },
      };
    },
  },
};
