import {
  getAllGoods,
  editGoodType,
  getAllType,
  addGoodType,
  delGoodType,
  getAttrList,
  addGoodAttr,
  editGoodAttr,
} from '../services/goods';

export default {
  namespace: 'goods',

  state: {
    goodsList: {},
    goodType: [],
    goodAttr: [],
    goodsAttrPage: {},
  },

  effects: {
    *fetchGoods({ payload }, { call, put }) {
      const response = yield call(getAllGoods, payload);
      yield put({
        type: 'show',
        payload: response.data,
      });
    },
    *editGoodType({ payload }, { call, put }) {
      yield call(editGoodType, payload);
      const response = yield call(getAllType, payload);
      yield put({
        type: 'fetchType',
        payload: response.data,
      });
    },
    *getAllType({ payload }, { call, put }) {
      const response = yield call(getAllType, payload);
      yield put({
        type: 'fetchType',
        payload: response.data,
      });
    },
    *addGoodType({ payload }, { call, put }) {
      yield call(addGoodType, payload);
      const response = yield call(getAllType, payload);
      yield put({
        type: 'fetchType',
        payload: response.data,
      });
    },
    *delGoodType({ payload }, { call, put }) {
      yield call(delGoodType, payload);
      const response = yield call(getAllType, payload);
      yield put({
        type: 'fetchType',
        payload: response.data,
      });
    },
    *getAllAttr({ payload }, { call, put }) {
      const response = yield call(getAttrList, payload) || {};
      if (response) {
        yield put({
          type: 'fetchAttr',
          payload: response.data,
        });
      }
    },
    *addGoodAttr({ payload }, { call, put }) {
      yield call(addGoodAttr, payload);
      const response = yield call(getAttrList, payload);
      yield put({
        type: 'fetchAttr',
        payload: response.data,
      });
    },
    *editGoodAttr({ payload }, { call, put }) {
      yield call(editGoodAttr, payload);
      const response = yield call(getAttrList, payload);
      yield put({
        type: 'fetchAttr',
        payload: response.data,
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      // state.menuList = payload;
      return {
        ...state,
        goodsList: payload,
      };
    },
    fetchType(state, { payload }) {
      payload = payload.map(res => {
        if (res.has_category.length) {
          res.children = res.has_category;
        }
        return res;
      });
      // state.menuList = payload;
      return {
        ...state,
        goodType: payload,
      };
    },
    fetchAttr(state, { payload }) {
      // state.menuList = payload;
      const { list, total, page } = payload;
      return {
        ...state,
        goodAttr: list,
        goodsAttrPage: {
          pageSize: page,
          total,
        },
      };
    },
  },
};
