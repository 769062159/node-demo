import {
  getVideoLiveConfig,
  updateStatusConfig,
  checkLiveRoom,
} from '../services/config';

export default {
  namespace: 'videoLiveConfig',

  state : {
    id: 0,
    status: 0,
    popularity: 1,
    liveMap: [],
    tmpLive: {},
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
      if (ret && ret.code ==200) {
        callback();
        yield put({
          type: 'changeStatusReduce',
          payload: ret.data,
        });
      }
    },
    *checkUserLiveRoom({ payload, callback }, { call, put }) {
      const ret = yield call(checkLiveRoom, payload)
      if (ret && ret.code === 200) {
        yield put({
          type: 'checkLiveRoomReducer',
          payload: ret.data,
        });
      } else if (ret && ret.code === 417) {
        callback(ret.message);
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
      return {
        ...state,
        ...payload,
      }
    },
  },
};
