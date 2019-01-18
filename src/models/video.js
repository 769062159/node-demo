import { getMember, updateMember, addMember, videoList, getReasons, updateVideo } from '../services/video';

export default {
  namespace: 'video',

  state: {
    memberList: [],
    memberListPage: {},
    videoList: [],
    videoListPage: {},
    reasonList: [],
  },

  effects: {
    *passOrTurnVideo({ payload, callback, refresh }, { call, put }) {
      const res = yield call(updateVideo, payload);
      if (res && res.code === 200) {
        callback();
        const response = yield call(videoList, refresh);
        yield put({
          type: 'getVideoLists',
          payload: response,
          status: payload.status,
          current: refresh.page,
        });
      }
    },
    *getReasons({ payload }, { call, put }) {
      const res = yield call(getReasons, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'getReasonss',
          payload: res,
        });
      }
    },
    *getVideoList({ payload }, { call, put }) {
      const res = yield call(videoList, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'getVideoLists',
          payload: res,
          status: payload.status,
          current: payload.page,
        });
      }
    },
    *createMember({ payload, callback, refresh }, { call, put }) {
      const res = yield call(addMember, payload);
      if (res && res.code === 200) {
        callback();
        const response = yield call(getMember, refresh);
        yield put({
          type: 'getMenbers',
          payload: response,
          current: payload.page,
        });
      }
    },
    *getMember({ payload }, { call, put }) {
      const response = yield call(getMember, payload);
      yield put({
        type: 'getMenbers',
        payload: response,
        current: payload.page,
      });
    },
    *cancelOrPosition({ payload, callback }, { call, put }) {
      const res = yield call(updateMember, payload);
      if (res && res.code === 200) {
        callback();
        yield put({
          type: 'updateMember',
          payload,
        });
      }
    },
  },

  reducers: {
    getReasonss(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        reasonList: data,
      };
    },
    getVideoLists(state, { payload, status, current }) {
      const { data } = payload;
      const { total, page } = data;
      let { list } = data;
      if (list) {
        list = list.map(res => {
          if (status === 1 || status === 2) {
            if (!res.audit_time && !res.backend_audit_time) {
              res.pending = 0; // 未审核
            } else if (res.backend_audit_time) {
              res.pending = 2; // 二审过了
              res.has_auditor_user = res.has_auditor_user || {};
            } else if (res.audit_time) {
              res.has_auditor_user = res.has_auditor_user || {};
              res.pending = 1; // 一审过了
            }
          }
          res.has_user = res.has_user || {};
          res.nickname = res.has_user.nickname;
          res.fakeid = res.has_user.fake_id;
          res.avatar = res.has_user.avatar;
          res.mobile = res.has_user.mobile;
          delete res.has_user
          return res;
        })
      }
      return {
        ...state,
        videoList: list,
        videoListPage: {
          pageSize: page,
          total,
          current,
        },
      };
    },
    updateMember(state, { payload }) {
      let { memberList } = state;
      const { user_id: id, status } = payload;
      memberList = memberList.map(res => {
        if (res.fakeid === id) {
          res.status = status;
        }
        // res.fakeid === id && res.status = status;
        return res;
      });
      return {
        ...state,
        memberList,
      }
    },
    getMenbers(state, { payload, current }) {
      const { data } = payload;
      const { total, page } = data;
      let { list } = data;
      if (list) {
        list = list.map(res => {
          res.has_user = res.has_user || {};
          res.nickname = res.has_user.nickname;
          res.fakeid = res.has_user.fake_id;
          res.avatar = res.has_user.avatar;
          res.mobile = res.has_user.mobile;
          delete res.has_user
          return res;
        })
      }
      return {
        ...state,
        memberList: list,
        memberListPage: {
          pageSize: page,
          total,
          current,
        },
      };
    },
  },
};
