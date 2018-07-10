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
    homeLive: {}, // 首页调直播间
  },

  effects: {
    *fetchHome({ payload }, { call, put }) {
      const response = yield call(getHome, payload);
      yield put({
        type: 'getHome',
        payload: response,
      });
    },
    *addHome({ payload }, { call, put }) {
      yield call(addHome, payload);
      const response = yield call(getHome, { page: payload.page });
      yield put({
        type: 'getHome',
        payload: response,
      });
    },
    *editHome({ payload }, { call, put }) {
      yield call(updateHome, payload);
      const response = yield call(getHome, { page: payload.page });
      yield put({
        type: 'getHome',
        payload: response,
      });
    },
    *deleteHome({ payload }, { call, put }) {
      yield call(deleteHome, payload);
      const response = yield call(getHome, { page: payload.page });
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
      yield put({
        type: 'getAds',
        payload: response,
      });
    },
    *addAds({ payload }, { call, put }) {
      yield call(addAds, payload);
      const response = yield call(getAds, { page: payload.pagination });
      yield put({
        type: 'getAds',
        payload: response,
      });
    },
    *editAds({ payload }, { call, put }) {
      yield call(updateAds, payload);
      const response = yield call(getAds, { page: payload.pagination });
      yield put({
        type: 'getAds',
        payload: response,
      });
    },
    *deleteAds({ payload }, { call, put }) {
      yield call(deleteAds, payload);
      const response = yield call(getAds, { page: payload.pagination });
      yield put({
        type: 'getAds',
        payload: response,
      });
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
      const homeLive = {};
      if (data.jump_type === 1) {
        homeGoods.label = data.remark;
        homeGoods.key = data.target_id;
      } else if (data.jump_type === 4) {
        homeLive.label = data.target_name;
        homeLive.key = data.live_id;
        homeGoods.label = data.remark;
        homeGoods.key = data.target_id;
      }
      return {
        ...state,
        homeForm: data,
        uploadHomeImg: imgArr,
        homeGoods,
        homeLive,
      };
    },
    setHomeShops(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        homeGoods: payload.value,
      };
    },
    setHomeLive(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        homeLive: payload.value,
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
      const { data } = payload;
      return {
        ...state,
        adsList: data.list,
        adsListPage: {
          pageSize: data.page,
          total: data.total,
        },
      };
    },
  },
};
