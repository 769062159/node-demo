import { routerRedux } from 'dva/router';
import {
  updateLive,
  deleteLive,
  addLive,
  getLive,
  getLiveDetail,
  getVod,
  getVodDetail,
  updateVodDetail,
  getWanTuToken,
  getVideoList,
  addVideo,
  checkSwitch,
  deleteVideo,
} from '../services/live';
import { getAllGoods } from '../services/goods';
import { dedupe } from '../utils/utils';

export default {
  namespace: 'live',

  state: {
    videoList: [], // 视频列表
    videoListPage: {}, // 视频列表
    liveList: [], // table列表
    liveListPage: {}, // table 页脚
    liveForm: {}, // 直播间创建表单
    homeVod: {}, // 直播间选中的录播
    uploadLiveImg: [], // 直播封面
    shareImg: [], // 直播分享
    liveGoods: [], // 直播商品 右table表
    showLiveGoods: [], // 展示直播商品 右table表
    rightCurrent: 1, // 右页脚
    goodsList: [], // 左table表
    leftKeyArr: [], // 左侧table选中数组
    rightKeyArr: [], // 右侧table选中数组
    leftBatchArr: [], // 左侧批量
    rightBatchArr: [], // 右侧批量
    goodsListPage: {}, // 页脚
    vodList: [],
    vodListPage: {},
    token: '',
  },

  effects: {
    *deleteVideo({ payload, callback }, { call, put }) {
      const res = yield call(deleteVideo, { vod_id: payload.id });
      if (res.code !== 200) {
        return false;
      }
      callback();
      const response = yield call(getVideoList, { page: payload.pagination });
      if (response.code === 200) {
        response.data.list = response.data.list.map(res => {
          if (res.type === 1) {
            res.url = res.vod_url
          } else if (res.type === 2) {
            res.url = res.play_url;
          } else {
            res.url = res.tencent_url;
          }
          return res;
        })
      }
      yield put({
        type: 'getVideo',
        payload: response,
      });
    },
    *fetchCheckVideo({ payload }, { call, put }) {
      const response = yield call(getVideoList, { page: payload.pagination, page_number: 18, liveid: payload.liveid });
      if (response.code === 200) {
        response.data.list = response.data.list.map(res => {
          res.is_bind = res.is_bind ? true : false;
          return res;
        })
      }
      yield put({
        type: 'getVideo',
        payload: response,
        current: payload.pagination,
      });
    },
    *fetchVideo({ payload }, { call, put }) {
      const response = yield call(getVideoList, { page: payload.pagination });
      if (response.code === 200) {
        response.data.list = response.data.list.map(res => {
          if (res.type === 1) {
            res.url = res.vod_url
          } else if (res.type === 2) {
            res.url = res.play_url;
          } else {
            res.url = res.tencent_url;
          }
          return res;
        })
      }
      yield put({
        type: 'getVideo',
        payload: response,
      });
    },
    *fetchToken(_, { call, put }) {
      const response = yield call(getWanTuToken);
      yield put({
        type: 'fetchTokens',
        payload: response,
      });
    },
    *fetchAddGoods({ payload }, { call, put }) {
      // 添加时请求第一页
      const good = yield call(getAllGoods, payload);
      yield put({
        type: 'clearForm',
      });
      yield put({
        type: 'getLiveGoods',
        payload: {
          good,
          defaultCurrent: payload.page,
        },
      });
    },
    *fetchLiveGoods({ payload }, { call, put }) {
      // 换页
      const good = yield call(getAllGoods, payload);
      yield put({
        type: 'getLiveGoods',
        payload: {
          good,
          defaultCurrent: payload.page,
        },
      });
      yield put({
        type: 'clearLeftKey', // 换页清理未移动到右的数据
      });
    },
    *fetchLiveDetail({ payload }, { call, put }) {
      const response = yield call(getLiveDetail, payload);
      yield put({
        type: 'editLiveMsgss',
        payload: response,
      });
      // 子table请求
      const good = yield call(getAllGoods, payload);
      yield put({
        type: 'getLiveGoods',
        payload: {
          good,
          defaultCurrent: payload.page,
        },
      });
    },
    *fetchVodDetail({ payload }, { call, put }) {
      const response = yield call(getVodDetail, payload);
      yield put({
        type: 'editVodMsgs',
        payload: response,
      });
      // 子table请求
      const good = yield call(getAllGoods, payload);
      yield put({
        type: 'getLiveGoods',
        payload: {
          good,
          defaultCurrent: payload.page,
        },
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
    *fetchCheckVod({ payload }, { call, put }) {
      const response = yield call(getVod, { page: payload.pagination, 'per-page': 18, liveid: payload.liveid });
      if (response.code === 200) {
        response.data.models = response.data.models.map(res => {
          res.is_bind = res.is_bind ? true : false;
          return res;
        })
      }
      yield put({
        type: 'getVod',
        payload: response,
        current: payload.pagination,
      });
    },
    *checkSwitch({ payload, callback }, { call }) {
      const response = yield call(checkSwitch, { ...payload });
      if (response.code === 200) {
        callback();
      }
    },
    *fetchVod({ payload }, { call, put }) {
      const response = yield call(getVod, { page: payload.pagination });
      yield put({
        type: 'getVod',
        payload: response,
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
      const data = yield call(addLive, payload);
      if (data.code === 200) {
        localStorage.setItem('liveUrl', data.data.rtmp_push);
        yield put(routerRedux.push('/live/add-live/result'));
      }
      //   const response = yield call(getLive, { page: payload.pagination });
      //   yield put({
      //     type: 'getLive',
      //     payload: response,
      //   });
    },
    *editLive({ payload }, { call, put }) {
      const data = yield call(updateLive, payload);
      if (data && data.code === 200) {
        localStorage.setItem('liveUrl', data.data.rtmp_push);
        yield put(routerRedux.push('/live/edit-live/result'));
      }
      //   const response = yield call(getLive, { page: payload.pagination });
      //   yield put({
      //     type: 'getLive',
      //     payload: response,
      //   });
    },
    *editVod({ payload }, { call, put }) {
      const data = yield call(updateVodDetail, payload);
      if (data && data.code === 200) {
        // localStorage.setItem('liveUrl', data.data.rtmp_push);
        yield put(routerRedux.push('/live/edit-vod/result'));
      }
    },
    *addVod({ payload }, { call, put }) {
      const data = yield call(addVideo, payload);
      if (data && data.code === 200) {
        // localStorage.setItem('liveUrl', data.data.rtmp_push);
        yield put(routerRedux.push('/live/add-video/result'));
      }
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
    clearVod(state) {
      const liveForm = {};
      return {
        ...state,
        liveForm,
        shareImg: [],
        uploadLiveImg: [],
      }
    },
    setVodurl(state, { payload }) {
      const { url } = payload;
      const { liveForm } = state;
      liveForm.vod_url = url;
      liveForm.zz = url;
      return {
        ...state,
        liveForm,
      };
    },
    fetchTokens(state, { payload }) {
      const { data: { token } } = payload;
      return {
        ...state,
        token,
      };
    },
    setHomeVod(state, { payload }) {
      return {
        ...state,
        homeVod: payload.value,
      };
    },
    clearForm(state) {
      return {
        ...state,
        liveForm: {},
        shareImg: [],
        // liveGoods: [],
        uploadLiveImg: [],
      };
    },
    destroyPages(state) {
      // 页面销毁
      return {
        ...state,
        liveGoods: [], // 直播商品 右table表
        leftKeyArr: [], // 左侧table选中数组
        rightKeyArr: [], // 右侧table选中数组
        leftBatchArr: [], // 左侧批量
        rightBatchArr: [], // 右侧批量
      };
    },
    clearLeftKey(state) {
      const { leftKeyArr, leftBatchArr } = state;
      const set = new Set();
      leftBatchArr.forEach(res => {
        set.add(res.goods_id);
      });
      const arr = leftKeyArr.filter(res => {
        return !set.has(res);
      });
      return {
        ...state,
        leftKeyArr: arr,
        leftBatchArr: [],
      };
    },
    leftBatch(state) {
      const { leftBatchArr, leftKeyArr, goodsList, liveGoods } = state;
      let cacheArr = {};
      goodsList.forEach(v => {
        cacheArr[v.goods_id] = v;
      });
      leftBatchArr.forEach(v => {
        if (cacheArr[v.goods_id]) {
          cacheArr[v.goods_id].disabled = 1;
        }
        liveGoods.push(v);
        leftKeyArr.push(v.goods_id);
      });
      cacheArr = null;
      return {
        ...state,
        leftBatchArr: [],
        leftKeyArr,
        liveGoods,
      };
    },
    rightBatch(state) {
      const { rightKeyArr, goodsList } = state;
      let { liveGoods, leftKeyArr } = state;
      const set = new Set(rightKeyArr);
      liveGoods = liveGoods.filter(res => {
        return !set.has(res.goods_id);
      });
      leftKeyArr = leftKeyArr.filter(res => {
        return !set.has(res);
      });
      goodsList.forEach(res => {
        if (set.has(res.goods_id)) {
          res.disabled = 0;
        }
      });
      return {
        ...state,
        goodsList,
        leftKeyArr,
        rightKeyArr: [],
        liveGoods,
      };
    },
    leftSelectAction(state, { payload }) {
      const { selectList } = payload;
      const { goodsList } = state;
      const set = new Set(selectList);
      const leftBatchArr = [];
      goodsList.forEach(res => {
        if (set.has(res.goods_id) && res.disabled !== 1) {
          leftBatchArr.push(res);
        }
      });
      return {
        ...state,
        leftKeyArr: selectList,
        leftBatchArr,
      };
    },
    rightSelectAction(state, { payload }) {
      const { selectList } = payload;
      // const { liveGoods } = state;
      // const set = new Set(selectList);
      // const rightBatchArr = [];
      // console.log(liveGoods);
      // liveGoods.forEach(res => {
      //     if(set.has(res.goods_id)) {
      //         rightBatchArr.push(res);
      //     }
      // })
      return {
        ...state,
        rightKeyArr: selectList,
        //   rightBatchArr,
      };
    },
    deleteLiveGood(state, { payload }) {
      let { liveGoods, leftKeyArr } = state;
      const { goodsList } = state;
      const { goods_id: id } = payload.goods;
      liveGoods = liveGoods.filter(res => {
        return res.goods_id !== id;
      });
      leftKeyArr = leftKeyArr.filter(res => {
        return res !== id;
      });
      goodsList.forEach(res => {
        if (res.goods_id === id) {
          res.disabled = 0;
        }
      });
      return {
        ...state,
        liveGoods,
        leftKeyArr,
        goodsList,
      };
    },
    selectLiveGood(state, { payload }) {
      const { liveGoods, goodsList, leftKeyArr } = state;
      const { goods } = payload;
      goodsList.forEach(res => {
        if (res.goods_id === goods.goods_id) {
          res.disabled = 1;
        }
      });
      liveGoods.push(goods);
      leftKeyArr.push(goods.goods_id);
      // let cacheArr = {};
      // goodsList.forEach(v => {
      //   cacheArr[v.goods_id] = v;
      // });
      // goods.forEach(v => {
      //   if (cacheArr[v.goods_id]) {
      //     cacheArr[v.goods_id].disabled = 1;
      //   }
      //   liveGoods.push(v);
      // });
      // cacheArr = null;
      return {
        ...state,
        liveGoods,
        goodsList,
        leftKeyArr,
      };
    },
    getLiveGoods(state, { payload }) {
      const { good: { data }, defaultCurrent: current } = payload;
      const { liveGoods, leftKeyArr } = state;
      let cacheArr = {};
      data.list.forEach(v => {
        cacheArr[v.goods_id] = v;
      });
      liveGoods.forEach(v => {
        if (cacheArr[v.goods_id]) {
          leftKeyArr.push(v.goods_id);
          cacheArr[v.goods_id].disabled = 1;
        }
      });
      const arr = dedupe(leftKeyArr);
      cacheArr = null;
      return {
        ...state,
        goodsList: data.list,
        leftKeyArr: arr,
        goodsListPage: {
          pageSize: data.page,
          total: data.total,
          current,
        },
      };
    },
    getVodGoods(state, { payload }) {
      const { data } = payload;
      const { liveGoods, leftKeyArr } = state;
      let cacheArr = {};
      data.list.forEach(v => {
        cacheArr[v.goods_id] = v;
      });
      liveGoods.forEach(v => {
        if (cacheArr[v.goods_id]) {
          leftKeyArr.push(v.goods_id);
          cacheArr[v.goods_id].disabled = 1;
        }
      });
      const arr = dedupe(leftKeyArr);
      cacheArr = null;
      return {
        ...state,
        goodsList: data.list,
        leftKeyArr: arr,
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
        shareImg: [], // 直播商品
      };
    },
    editVodMsgs(state, { payload }) {
      const { data } = payload;
      data.xxx = data.cover;
      data.zz = data.vod_url;
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
      // data.goods.forEach(res => {
      //   res.disabled = 1;
      // });
      // const liveGoods = data.goods;
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
        // liveGoods,
      };
    },
    editLiveMsgss(state, { payload }) {
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
      const homeVod = {};
      if (data.play_type === 1) {
        homeVod.label = data.remark;
        homeVod.key = data.vod_id;
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
        homeVod,
        videoList: [], // 视频列表
        videoListPage: {}, // 视频列表
        liveList: [], // table列表
        liveListPage: {}, // table 页脚
      };
    },
    editLiveMsgs(state, { payload }) {
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
      const homeVod = {};
      if (data.play_type === 1) {
        homeVod.label = data.remark;
        homeVod.key = data.vod_id;
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
        homeVod,
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
      const { obj } = payload;
      obj.zz = obj.zz || liveForm.vod_url;
      liveForm = {
        ...liveForm,
        ...obj,
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
    getVideo(state, { payload, current }) {
      const { data } = payload;
      return {
        ...state,
        videoList: data.list,
        videoListPage: {
          pageSize: data.page,
          total: data.total,
          current,
        },
      };
    },
    getVod(state, { payload, current }) {
      const { data } = payload;
      return {
        ...state,
        vodList: data.models,
        vodListPage: {
          pageSize: data.page,
          total: data.total,
          current,
        },
      };
    },
  },
};
