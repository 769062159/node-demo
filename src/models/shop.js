import { addShop, getShopList, delShop, updateShop, getShopDetail } from '../services/shop';

export default {
  namespace: 'shop',

  state: {
    shopList: [],
    shopListPage: {},
    shopDetail: {},
  },

  effects: {
    *fetchShopDetail({ payload, callback }, { call, put }) {
      const response = yield call(getShopDetail, payload);
      yield put({
        type: 'getShopDetail',
        payload: response.data,
      });
      if (response) {
        callback();
      }
    },
    *fetchShop({ payload }, { call, put }) {
      const response = yield call(getShopList, payload);
      yield put({
        type: 'getShop',
        payload: response.data,
      });
    },
    *addShop({ payload, callback }, { call }) {
      const response = yield call(addShop, payload);
      if (response) {
        callback();
      }
    },
    *updateShop({ payload, callback }, { call }) {
      const response = yield call(updateShop, payload);
      if (response) {
        callback();
      }
    },
    *delShop({ payload }, { call, put }) {
      yield call(delShop, payload);
      const responses = yield call(getShopList, {page: payload.page});
      yield put({
        type: 'getShop',
        payload: responses.data,
      });
    },
  },

  reducers: {
    clearAddress(state) {
      return {
        ...state,
        shopDetail: {},
      }
    },
    setPropsAddress(state, { payload }) {
      const { shopDetail } = state;
      shopDetail.propsAddress = payload.propsAddress;
      return {
        ...state,
        shopDetail,
      }
    },
    getShopDetail(state, { payload }) {
      // const { list, page, total } = payload;
      if (payload) {
        payload.propsAddress = payload.province_name + payload.city_name + payload.region_name + payload.address;
      }
      return {
        ...state,
        shopDetail: payload || {},
      }
    },
    getShop(state, { payload }) {
      const { list, page, total } = payload;
      return {
        ...state,
        shopList: list,
        shopListPage: {
          pageSize: page,
          total,
        },
      };
    },
  },
};
