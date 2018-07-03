import {
  updateAds,
  deleteAds,
  addAds,
  getAds,
  getHome,
  addHome,
  deleteHome,
  updateHome,
} from '../services/indexs';

export default {
  namespace: 'indexs',

  state: {
    adsList: [], // table列表
    homeList: [], // 首页列表
    adsListPage: {}, // table 页脚
    homeForm: {}, // 首页表单
    uploadHomeImg: [], // 首页封面
    homeListPage: {}, // 首页封面页脚
  },

  effects: {
    *fetchHome(_, { call, put }) {
      const response = yield call(getHome);
      if (response.code === 200) {
        yield put({
          type: 'getHome',
          payload: response.data,
        });
      }
    },
    *addHome({ payload }, { call, put }) {
      yield call(addHome, payload);
      const response = yield call(getHome);
      if (response.code === 200) {
        yield put({
          type: 'getHome',
          payload: response.data,
        });
      }
    },
    *editHome({ payload }, { call, put }) {
      yield call(updateHome, payload);
      const response = yield call(getHome);
      if (response.code === 200) {
        yield put({
          type: 'getHome',
          payload: response.data,
        });
      }
    },
    *deleteHome({ payload }, { call, put }) {
      yield call(deleteHome, payload);
      const response = yield call(getHome);
      if (response.code === 200) {
        yield put({
          type: 'getHome',
          payload: response.data,
        });
      }
    },
    *setHomeImg({ payload }, { put }) {
      yield put({
        type: 'setHomeImgs',
        payload,
      });
    },
    *changeFormVal({ payload }, { put }) {
      yield put({
        type: 'changeFormVals',
        payload,
      });
    },
    *fetchAds({ payload }, { call, put }) {
      const response = yield call(getAds, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getAds',
          payload: response.data,
        });
      }
    },
    *addAds({ payload }, { call, put }) {
      yield call(addAds, payload);
      const response = yield call(getAds, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getAds',
          payload: response.data,
        });
      }
    },
    *editAds({ payload }, { call, put }) {
      yield call(updateAds, payload);
      const response = yield call(getAds, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getAds',
          payload: response.data,
        });
      }
    },
    *deleteAds({ payload }, { call, put }) {
      yield call(deleteAds, payload);
      const response = yield call(getAds, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getAds',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    getHome(state, { payload }) {
      return {
        ...state,
        homeList: payload.list,
        homeListPage: {
          pageSize: payload.page,
          total: payload.total,
        },
      };
    },
    setHomeImgs(state, { payload }) {
      return {
        ...state,
        uploadHomeImg: payload.fileList,
      };
    },
    changeFormVals(state, { payload }) {
      let { homeForm } = state;
      homeForm = {
        ...homeForm,
        ...payload.obj,
      };
      return {
        ...state,
        homeForm,
      };
    },
    getAds(state, { payload }) {
      return {
        ...state,
        adsList: payload.list,
        adsListPage: {
          pageSize: payload.page,
          total: payload.total,
        },
      };
    },
  },
};
