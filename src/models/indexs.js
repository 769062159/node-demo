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
    homeGoods: {}, // 首页跳转商品
  },

  effects: {
    *fetchHome(_, { call, put }) {
      const response = yield call(getHome);
      yield put({
        type: 'getHome',
        payload: response,
      });
    },
    *addHome({ payload }, { call, put }) {
      yield call(addHome, payload);
      const response = yield call(getHome);
      yield put({
        type: 'getHome',
        payload: response,
      });
    },
    *editHome({ payload }, { call, put }) {
      yield call(updateHome, payload);
      const response = yield call(getHome);
      yield put({
        type: 'getHome',
        payload: response,
      });
    },
    *deleteHome({ payload }, { call, put }) {
      yield call(deleteHome, payload);
      const response = yield call(getHome);
      yield put({
        type: 'getHome',
        payload: response,
      });
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
      if (response) {
        yield put({
          type: 'getAds',
          payload: response.data,
        });
      }
    },
    *addAds({ payload }, { call, put }) {
      yield call(addAds, payload);
      const response = yield call(getAds, { page: payload.pagination });
      if (response) {
        yield put({
          type: 'getAds',
          payload: response.data,
        });
      }
    },
    *editAds({ payload }, { call, put }) {
      yield call(updateAds, payload);
      const response = yield call(getAds, { page: payload.pagination });
      if (response) {
        yield put({
          type: 'getAds',
          payload: response.data,
        });
      }
    },
    *deleteAds({ payload }, { call, put }) {
      yield call(deleteAds, payload);
      const response = yield call(getAds, { page: payload.pagination });
      if (response) {
        yield put({
          type: 'getAds',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    editHomeMsgs(state, { payload }) {
      console.log(payload);
      const { data } = payload;
      data.xxx = data.cover;
      const imgArr = [];
      if (data.cover) {
        imgArr.push({
          status: 'done',
          response: { status: 'success' },
          name: data.title,
          uid: data.id,
          url: data.cover,
        });
      }
      const homeGoods = {};
      if (data.jump_type === 1) {
        homeGoods.label = data.remark;
        homeGoods.key = data.target_id;
      }
      return {
        ...state,
        homeForm: data,
        uploadHomeImg: imgArr,
        homeGoods,
      };
    },
    setHomeShops(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        homeGoods: payload.value,
      };
    },
    clearHomeMsgs(state) {
      return {
        ...state,
        homeForm: {}, // 直播间创建表单
        uploadHomeImg: [], // 直播封面
        homeGoods: [], // 直播商品
      };
    },
    getHome(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        homeList: data.list,
        homeListPage: {
          pageSize: data.page,
          total: data.total,
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
