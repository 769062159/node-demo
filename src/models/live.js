import { updateLive, deleteLive, addLive, getLive } from '../services/live';

export default {
  namespace: 'live',

  state: {
    liveList: [], // table列表
    liveListPage: {}, // table 页脚
    liveForm: {}, // 直播间创建表单
    uploadLiveImg: [], // 直播封面
    liveGoods: [], // 直播商品
  },

  effects: {
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
      if (response.code === 200) {
        yield put({
          type: 'getLive',
          payload: response.data,
        });
      }
    },
    *addLive({ payload }, { call, put }) {
      yield call(addLive, payload);
      const response = yield call(getLive, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getLive',
          payload: response.data,
        });
      }
    },
    *editLive({ payload }, { call, put }) {
      yield call(updateLive, payload);
      const response = yield call(getLive, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getLive',
          payload: response.data,
        });
      }
    },
    *deleteLive({ payload }, { call, put }) {
      yield call(deleteLive, payload);
      const response = yield call(getLive, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getLive',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
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
      const liveGoods = [];
      if (data.goods_ids) {
        const arrId = data.goods_ids.split(',');
        const arrName = data.goods_names.split(',');
        arrId.forEach((res, index) => {
          liveGoods.push({
            key: res,
            label: arrName[index],
          });
        });
      }
      return {
        ...state,
        liveForm: data,
        uploadLiveImg: imgArr,
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
      return {
        ...state,
        liveList: payload.list,
        liveListPage: {
          pageSize: payload.page,
          total: payload.total,
        },
      };
    },
  },
};
