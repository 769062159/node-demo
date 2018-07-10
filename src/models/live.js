import { routerRedux } from 'dva/router';
import { updateLive, deleteLive, addLive, getLive, getLiveDetail } from '../services/live';
import { getAllGoods } from '../services/goods';

export default {
  namespace: 'live',

  state: {
    liveList: [], // table列表
    liveListPage: {}, // table 页脚
    liveForm: {}, // 直播间创建表单
    uploadLiveImg: [], // 直播封面
    shareImg: [], // 直播分享
    liveGoods: [], // 直播商品
    goodsList: [], // 左table表
    goodsListPage: {}, // 页脚
  },

  effects: {
    *fetchLiveGoods({ payload }, { call, put }) {
      const response = yield call(getAllGoods, payload);
      yield put({
        type: 'getLiveGoods',
        payload: response,
      });
    },
    *fetchLiveDetail({ payload }, { call, put }) {
      const response = yield call(getLiveDetail, payload);
      yield put({
        type: 'editLiveMsgs',
        payload: response,
      });
      // 子table请求
      const good = yield call(getAllGoods, payload);
      yield put({
        type: 'getLiveGoods',
        payload: good,
      });
    },
    *clearLiveMsg(_, { put }) {
      yield put({
        type: 'clearLiveMsgs',
      });
    },
    *editLiveMsg({ payload }, { put }) {
      yield put({
        type: 'editLiveMsgs',
        payload,
      });
    },
    *setLiveShop({ payload }, { put }) {
      yield put({
        type: 'setLiveShops',
        payload,
      });
    },
    *setLiveImg({ payload }, { put }) {
      yield put({
        type: 'setLiveImgs',
        payload,
      });
    },
    *changeFormVal({ payload }, { put }) {
      yield put({
        type: 'changeFormVals',
        payload,
      });
    },
    *fetchLive({ payload }, { call, put }) {
      const response = yield call(getLive, { page: payload.pagination });
      yield put({
        type: 'getLive',
        payload: response,
      });
    },
    *addLive({ payload }, { call, put }) {
      yield call(addLive, payload);
      const response = yield call(getLive, { page: payload.pagination });
      yield put({
        type: 'getLive',
        payload: response,
      });
    },
    *editLive({ payload }, { call, put }) {
      const data = yield call(updateLive, payload);
      if (data.code === 200) {
        localStorage.setItem('liveUrl', data.data.rtmp_push);
        yield put(routerRedux.push('/live/edit-live/result'));
      }
      const response = yield call(getLive, { page: payload.pagination });
      yield put({
        type: 'getLive',
        payload: response,
      });
    },
    *deleteLive({ payload }, { call, put }) {
      yield call(deleteLive, payload);
      const response = yield call(getLive, { page: payload.pagination });
      yield put({
        type: 'getLive',
        payload: response,
      });
    },
  },

  reducers: {
    deleteLiveGood(state, { payload }) {
      let { liveGoods } = state;
      const { goodsList } = state;
      const { goods_id: id } = payload.goods;
      liveGoods = liveGoods.filter(res => {
        return res.goods_id !== id;
      });
      goodsList.forEach(res => {
        if (res.goods_id === id) {
          res.disabled = 0;
        }
      });
      return {
        ...state,
        liveGoods,
        goodsList,
      };
    },
    selectLiveGood(state, { payload }) {
      const { liveGoods, goodsList } = state;
      const { goods } = payload;
      if (typeof goods === 'object') {
        goodsList.forEach(res => {
          if (res === goods) {
            res.disabled = 1;
          }
        });
        liveGoods.push(goods);
      } else {
        goods.forEach(ele => {
          goodsList.forEach(res => {
            if (res.goods_id === goods.goods_id) {
              res.disabled = 1;
            }
          });
          liveGoods.push(ele);
        });
      }
      return {
        ...state,
        liveGoods,
        goodsList,
      };
    },
    getLiveGoods(state, { payload }) {
      const { data } = payload;
      const { liveGoods } = state;
      let cacheArr = {};
      data.list.forEach(v => {
        cacheArr[v.goods_id] = v;
      });
      liveGoods.forEach(v => {
        if (cacheArr[v.goods_id]) {
          cacheArr[v.goods_id].disabled = 1;
        }
      });
      cacheArr = null;
      return {
        ...state,
        goodsList: data.list,
        goodsListPage: {
          pageSize: data.page,
          total: data.total,
        },
      };
    },
    clearLiveMsgs(state) {
      return {
        ...state,
        liveForm: {}, // 直播间创建表单
        uploadLiveImg: [], // 直播封面
        liveGoods: [], // 直播商品
      };
    },
    editLiveMsgs(state, { payload }) {
      console.log(payload);
      const { data } = payload;
      data.xxx = data.cover;
      data.yyy = data.share_cover;
      const imgArr = [];
      const ShareArr = [];
      if (data.cover) {
        imgArr.push({
          status: 'done',
          response: { status: 'success' },
          name: data.title,
          uid: data.id,
          url: data.cover,
        });
      }
      if (data.share_cover) {
        ShareArr.push({
          status: 'done',
          response: { status: 'success' },
          name: data.title,
          uid: data.id,
          url: data.share_cover,
        });
      }
      data.goods.forEach(res => {
        res.disabled = 1;
      });
      const liveGoods = data.goods;
      //   if (data.goods_ids) {
      //     const arrId = data.goods_ids.split(',');
      //     const arrName = data.goods_names.split(',');
      //     arrId.forEach((res, index) => {
      //       liveGoods.push({
      //         key: res,
      //         label: arrName[index],
      //       });
      //     });
      //   }
      return {
        ...state,
        liveForm: data,
        uploadLiveImg: imgArr,
        shareImg: ShareArr,
        liveGoods,
      };
    },
    setLiveShops(state, { payload }) {
      return {
        ...state,
        liveGoods: payload.value,
      };
    },
    setLiveImgs(state, { payload }) {
      return {
        ...state,
        uploadLiveImg: payload.fileList,
      };
    },
    setShareImgs(state, { payload }) {
      return {
        ...state,
        shareImg: payload.fileList,
      };
    },
    changeFormVals(state, { payload }) {
      let { liveForm } = state;
      liveForm = {
        ...liveForm,
        ...payload.obj,
      };
      return {
        ...state,
        liveForm,
      };
    },
    getLive(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        liveList: data.list,
        liveListPage: {
          pageSize: data.page,
          total: data.total,
        },
      };
    },
  },
};
