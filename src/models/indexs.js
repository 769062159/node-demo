import {
  updateAds,
  deleteAds,
  addAds,
  getAds,
  getHome,
  addHome,
  deleteHome,
  updateHome,
  homeDetail,
} from '../services/indexs';
import { getAllGoods } from '../services/goods';
import { getLive } from '../services/live';

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
    homeVod: {}, // 首页调录播
    GoodList: [], // 热卖商品列表
    GoodListPage: [], // 热卖商品列表页脚
    LiveList: [], // 直播列表
    LiveListPage: [], // 直播列表页脚
    LiveKey: '',
    GoodKey: '',
    remark: '', // 用于记录livekey和goodkey对应的名字
  },

  effects: {
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(homeDetail, payload);
      yield put({
        type: 'fetchDetails',
        payload: response,
      });
    },
    *fetchGoodList({ payload }, { call, put }) {
      const response = yield call(getAllGoods, payload);
      yield put({
        type: 'getGoodList',
        payload: response,
      });
    },
    *fetchLiveList({ payload }, { call, put }) {
      const response = yield call(getLive, payload);
      yield put({
        type: 'getLiveList',
        payload: response,
      });
    },
    *fetchHome({ payload }, { call, put }) {
      const response = yield call(getHome, payload);
      yield put({
        type: 'getHome',
        payload: response,
      });
    },
    *addHome({ payload }, { call, put }) {
      yield call(addHome, payload);
      const response = yield call(getHome, { page: payload.page, type: payload.type });
      yield put({
        type: 'getHome',
        payload: response,
      });
    },
    *editHome({ payload }, { call, put }) {
      yield call(updateHome, payload);
      const response = yield call(getHome, { page: payload.page, type: payload.type });
      yield put({
        type: 'getHome',
        payload: response,
      });
    },
    *deleteHome({ payload }, { call, put }) {
      yield call(deleteHome, payload);
      const response = yield call(getHome, { page: payload.page, type: payload.type });
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
    clearTable(state) {
      return {
        ...state,
        LiveKey: '',
        GoodKey: '',
        remark: '',
      };
    },
    fetchDetails(state, { payload }) {
      const { data } = payload;
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
      const LiveKey = [];
      const GoodKey = [];
      let remark = '';
      if (data.jump_type === 1) {
        GoodKey.push(data.target_id);
        remark = data.target_name;
      } else if (data.jump_type === 4) {
        LiveKey.push(data.target_id);
        remark = data.target_name;
      }
      return {
        ...state,
        homeForm: data,
        uploadHomeImg: imgArr,
        LiveKey,
        GoodKey,
        remark,
      };
    },
    selectGood(state, { payload }) {
      const { data } = payload;
      const GoodKey = [];
      GoodKey.push(data.goods_id);
      const remark = data.goods_name;
      return {
        ...state,
        GoodKey,
        remark,
      };
    },
    selectLive(state, { payload }) {
      const { data } = payload;
      const LiveKey = [];
      LiveKey.push(data.stv_live_id);
      const remark = data.title;
      return {
        ...state,
        LiveKey,
        remark,
      };
    },
    getLiveList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        LiveList: data.list,
        LiveListPage: {
          pageSize: data.page,
          total: data.total,
        },
      };
    },
    getGoodList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        GoodList: data.list,
        GoodListPage: {
          pageSize: data.page,
          total: data.total,
        },
      };
    },
    editHomeMsgs(state, { payload }) {
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
      const homeVod = {};
      if (data.jump_type === 1) {
        homeGoods.label = data.remark;
        homeGoods.key = data.target_id;
      } else if (data.jump_type === 4) {
        homeLive.label = data.remark;
        homeLive.key = data.live_id;
        homeGoods.label = data.target_name;
        homeGoods.key = data.target_id;
      } else if (data.jump_type === 5) {
        homeVod.label = data.remark;
        homeVod.key = data.vod_id;
        homeGoods.label = data.target_name;
        homeGoods.key = data.target_id;
      }
      return {
        ...state,
        homeForm: data,
        uploadHomeImg: imgArr,
        homeGoods,
        homeLive,
        homeVod,
      };
    },
    setHomeShops(state, { payload }) {
      return {
        ...state,
        homeGoods: payload.value,
      };
    },
    setHomeLive(state, { payload }) {
      return {
        ...state,
        homeLive: payload.value,
      };
    },
    setHomeVod(state, { payload }) {
      return {
        ...state,
        homeVod: payload.value,
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
