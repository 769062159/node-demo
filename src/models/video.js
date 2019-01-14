import { getMember, updateMember, addMember, videoList } from '../services/video';

export default {
  namespace: 'video',

  state: {
    memberList: [],
    memberListPage: {},
    videoList: [],
    videoListPage: {},
  },

  effects: {
    *getVideoList({ payload }, { call, put }) {
      const res = yield call(videoList, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'getVideoLists',
          payload: res,
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
        });
      }
    },
    *getMember({ payload }, { call, put }) {
      const response = yield call(getMember, payload);
      yield put({
        type: 'getMenbers',
        payload: response,
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
    getVideoLists(state, { payload }) {
      const { data } = payload;
      const { total, page, total_page: current } = data;
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
    getMenbers(state, { payload }) {
      const { data } = payload;
      const { total, page, total_page: current } = data;
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
