import { message } from 'antd';
import { getOrderList, getExpressList, shipshop } from '../services/order';

export default {
  namespace: 'order',

  state: {
    orderList: [], // table列表
    orderListPage: {}, // table 页脚
    expressList: [], // 快递公司
  },

  effects: {
    *shipGood({ payload }, { call, put }) {
      yield call(shipshop, { ...payload });
      message.success('发货成功');
      const response = yield call(getOrderList, { ...payload });
      if (response.code === 200) {
        yield put({
          type: 'getOrder',
          payload: response.data,
        });
      }
    },
    *fetchExpressList(_, { call, put }) {
      const response = yield call(getExpressList);
      if (response.code === 200) {
        yield put({
          type: 'getExpressLists',
          payload: response.data,
        });
      }
    },
    *fetchOrder({ payload }, { call, put }) {
      const response = yield call(getOrderList, { ...payload });
      if (response.code === 200) {
        yield put({
          type: 'getOrder',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    getExpressLists(state, { payload }) {
      return {
        ...state,
        expressList: payload,
      };
    },
    getOrder(state, { payload }) {
      return {
        ...state,
        orderList: payload.list,
        orderListPage: {
          pageSize: payload.page,
          total: payload.total,
        },
      };
    },
  },
};
