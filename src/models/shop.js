import { addShop, getShopList, delShop, updateShop, getShopDetail, getMemberLit, cancelMember, setMember, writeOff } from '../services/shop';

export default {
  namespace: 'shop',

  state: {
    shopLogo: [],
    shopList: [],
    shopListPage: {},
    selectedShop: [], // 选中的shop
    selectedMember: [], // 选中的核销员
    shopDetail: {},
    WriteOffList: [],
  },

  effects: {
    *setwriteOff({ payload, callback }, { call }){
      const res = yield call(writeOff, payload);
      if (res) {
        callback();
      }
    },
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
    *fetchMenber({ payload }, { call, put }) {
      const response = yield call(getMemberLit, payload);
      yield put({
        type: 'getMenber',
        payload: response.data,
      });
    },
    *setMember({ payload, callback }, { call, put }) {
      const res =yield call(setMember, payload);
      if (res) {
        callback();
        const response = yield call(getMemberLit, payload);
        yield put({
          type: 'getMenber',
          payload: response.data,
        });
      }
    },
    *cancelMenber({ payload, callback }, { call, put }) {
      const res = yield call(cancelMember, payload);
      if (res) {
        callback();
        const response = yield call(getMemberLit, payload);
        yield put({
          type: 'getMenber',
          payload: response.data,
        });
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
    setShopLogo(state, { payload }) {
      return {
        ...state,
        shopLogo: payload,
      }
    },
    clearTable(state) {
      return {
        ...state,
        selectedShop: [],
      }
    },
    selectMember(state, { payload }) {
      return {
        ...state,
        selectedMember: payload.data,
      }
    },
    selectShop(state, { payload }) {
      return {
        ...state,
        selectedShop: payload.data,
      }
    },
    clearAddress(state) {
      return {
        ...state,
        shopDetail: {},
        shopLogo: [],
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
      const shopLogo = []
      if (payload) {
        payload.propsAddress = payload.province_name + payload.city_name + payload.region_name + payload.address;
        if (payload.http_url) {
          const img = {};
          img.status = 'done';
          img.response = { status: 'success' };
          img.name = payload.id;
          img.uid = payload.id;
          img.url = payload.http_url;
          shopLogo.push(img);
        }
      }
      return {
        ...state,
        shopDetail: payload || {},
        shopLogo,
      }
    },
    getMenber(state, { payload }) {
      return {
        ...state,
        WriteOffList: payload,
      };
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
