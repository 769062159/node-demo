import { getStatistics } from '../services/statistics';

export default {
  namespace: 'statistics',

  state: {
    statistics: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
        const response = yield call(getStatistics, payload);
        yield put({
            type: 'getStatistics',
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
  },
}