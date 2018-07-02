import { getOrderList } from '../services/order';

export default {
  namespace: 'order',

  state: {
    orderList: [], // table列表
    orderListPage: {}, // table 页脚
  },

  effects: {
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
