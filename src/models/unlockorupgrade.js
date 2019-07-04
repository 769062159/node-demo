import { getStatistics, getDayStatistics  } from '../services/unlockorupgrade';

export default {
  namespace: 'unlockorupgrade',

  state: {
    statistics: {},
    statistics_day: {}
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getStatistics, payload);
      yield put({
        type: 'getStatistics',
        payload: response,
      });
    },
    *day({ payload }, { call, put }) {
      const response = yield call(getDayStatistics, payload);
      yield put({
        type: 'getDayStatistics',
        payload: response,
      });
    },
  },
  reducers: {
    getStatistics(state, { payload }) {
      const { data } = payload;
      if (data) {
        data.today_order = data.today_normal_order_num + data.today_group_order_num;
        data.deliverys = data.delivery_group_order_num + data.delivery_normal_order_num;
      }
      return {
        ...state,
        statistics: data,
      }
    },
    getDayStatistics(state, { payload }) {
      const { data } = payload;
      if (data) {
        data.order = data.normal_order_num + data.group_order_num;
      }
      return {
        ...state,
        statistics_day: data,
      }
    },
  },
}
