import {
  getVideoLiveConfig,
  updateStatusConfig,
  checkLiveRoom,
  updatePopularity,
  removeVideoLive,
  addVideoLive,
} from '../services/config';

export default {
  namespace: 'videoLiveConfig',

  state : {
    id: 0,
    status: 0,
    popularity: 1,
    liveMap: [],
    tmpLive: {
      has_user: {},
    },
  },

  effects : {
    *initVideoLiveConfig(_, { call, put}) {
      const ret = yield call(getVideoLiveConfig);
      if (ret && ret.code === 200) {
        yield put({
          type:'videoLiveConfigReducer',
          payload: ret.data,
        });
      }
    },
    *changeStatusConfig({ payload, callback }, { call, put }) {
      const ret = yield call(updateStatusConfig, payload);
      if (ret && ret.code === 200 ) {
        callback();
        yield put({
          type: 'changeStatusReduce',
          payload: ret.data,
        });
      }
    },
    *checkUserLiveRoom({ payload, callback }, { call, put }) {
      const ret = yield call(checkLiveRoom, payload);
      if (ret && ret.code === 200) {
        yield put({
          type: 'checkLiveRoomReducer',
          payload: ret.data,
        });
        callback(ret.code, 'success');
      } else if (ret && ret.code === 417) {
        callback(ret.code, ret.message);
      }
    },
    *updatePopularityNum({ payload, callback }, { call, put }) {
      const ret = yield call(updatePopularity, payload);
      if (ret && ret.code === 200) {
        callback();
        yield put({
          type: 'updatePopularityReducer',
          payload: ret.data,
        });
      }
    },
    *removeVideoLive({ payload, callback }, { call, put }) {
      const ret = yield call(removeVideoLive, payload);
      if (ret && ret.code === 200) {
        callback();
        yield put({
          type: 'removeVideoRoomReducer',
          payload: ret.data,
        });
      }
    },
    *addVideoLive({ payload, callback }, { call, put }) {
      const ret = yield call(addVideoLive, payload);
      if (ret && ret.code === 200 ) {
        callback();
        yield put({
          type: 'addVideoRoomReducer',
          payload: ret.data,
        });
      }
    },
  },

  reducers : {
    videoLiveConfigReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeStatusReduce(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      }
    },
    checkLiveRoomReducer(state, { payload }) {
      const tmpLive = payload;
      return {
        ...state,
        tmpLive,
      }
    },
    updatePopularityReducer(state, { payload }) {
      return {
        ...state,
        popularity: payload.num,
      }
    },
    removeVideoRoomReducer(state, { payload }) {
      const liveMap = state.liveMap.filter((liveItem) => {
        return liveItem.user_id !== payload.userId;
      });
      return {
        ...state,
        liveMap,
      }
    },
    addVideoRoomReducer(state, { payload }) {
      const liveMap = [...state.liveMap, payload];
      return {
        ...state,
        liveMap,
      };
    },
  },
};
