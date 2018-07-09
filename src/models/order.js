import { message } from 'antd';
import { getOrderList, getExpressList, shipshop, editShip, editAdress } from '../services/order';

export default {
  namespace: 'order',

  state: {
    orderList: [], // table列表
    orderListPage: {}, // table 页脚
    expressList: [], // 快递公司
  },

  effects: {
    *editAddress({ payload }, { call, put }) {
      yield call(editAdress, { ...payload });
      message.success('修改成功');
      const response = yield call(getOrderList, { page: payload.page });
      yield put({
        type: 'getOrder',
        payload: response,
      });
    },
    *editShipGood({ payload }, { call, put }) {
      yield call(editShip, { ...payload });
      message.success('修改成功');
      const response = yield call(getOrderList, { page: payload.page });
      yield put({
        type: 'getOrder',
        payload: response,
      });
    },
    *shipGood({ payload }, { call, put }) {
      yield call(shipshop, { ...payload });
      message.success('发货成功');
      const response = yield call(getOrderList, { page: payload.page });
      yield put({
        type: 'getOrder',
        payload: response,
      });
    },
    *fetchExpressList(_, { call, put }) {
      const response = yield call(getExpressList);
      yield put({
        type: 'getExpressLists',
        payload: response,
      });
    },
    *fetchOrder({ payload }, { call, put }) {
      const response = yield call(getOrderList, { ...payload });
      yield put({
        type: 'getOrder',
        payload: response.data,
      });
    },
  },

  reducers: {
    getExpressLists(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        expressList: data,
      };
    },
    getOrder(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        orderList: data.list,
        orderListPage: {
          pageSize: data.page,
          total: data.total,
        },
      };
    },
  },
};
