import {
  getCodeInfo,
  setUnlockCode , setUpgradeCode,
  getUnlockTypeList, getUpgradeTypeList,
  getUpgradeChangeList, getUnlockChangeList,
  createUpgradeCode,createUnlockCode
} from '../services/unlockorupgrade';
import {message} from 'antd'
export default {
  namespace: 'unlockorupgrade',

  state: {
    upgrade: [],
    unlock_goods:[],
    unlockTypeList:[],
    upgradeTypeList:[],
    upgradeChangeList:[],
    unlockChangeList:[]
  },
  effects: {
    *createUnlockCode({ payload }, { call, put }) {
      if(Object.keys({payload}).length !== 0){
        const response = yield call(createUnlockCode,{ ...payload });
        if(response && response.code===200){
          message.success('操作成功！')
          const response = yield call(getUnlockChangeList,{ });
          if(response && response.code===200){
            yield put({
              type: 'getUnlockChangedList',
              payload: response,
            });
          }
        }else{
          message.error(response.message)
        }
      }
    },
    *createUpgradeCode({ payload }, { call, put }) {
      if(Object.keys({payload}).length !== 0){
        const response = yield call(createUpgradeCode,{ ...payload });
        if(response && response.code===200){
          message.success('操作成功！')
          const response = yield call(getUpgradeChangeList,{ });
          if(response && response.code===200){
            yield put({
              type: 'getUpgradeChangedList',
              payload: response,
            });
          }
        }else{
          message.error(response.message)
        }
      }
    },
    *getUnlockChangeList({ payload }, { call, put }) {
      if(Object.keys({payload}).length !== 0){
        const response = yield call(getUnlockChangeList,{ ...payload });
        if(response && response.code===200){
          yield put({
            type: 'getUnlockChangedList',
            payload: response,
          });
        }
      }
    },
    *getUpgradeChangeList({ payload }, { call, put }) {
      if(Object.keys({payload}).length !== 0){
        const response = yield call(getUpgradeChangeList,{ ...payload });
        if(response && response.code===200){
          yield put({
            type: 'getUpgradeChangedList',
            payload: response,
          });
        }
      }
    },
    *unlockTypeList({ payload }, { call, put }) {
      const response = yield call(getUnlockTypeList,{ ...payload });
      if(response && response.code===200){
        yield put({
          type: 'unlockTypeListM',
          payload: response,
        });
      }
    },
    *upgradeTypeList({ payload }, { call, put }) {
      const response = yield call(getUpgradeTypeList,{ ...payload });
      if(response && response.code===200){
        yield put({
          type: 'upgradeTypeListM',
          payload: response,
        });
      }
    },
    *getCodeInfo({ payload }, { call, put }) {
      const response = yield call(getCodeInfo,{ ...payload });
      if(response && response.code===200){
        yield put({
          type: 'getCodeConfigInfo',
          payload: response,
        });
      }
    },
    *unlockRules({ payload }, { call, put }) {
      const response = yield call(setUnlockCode, payload);
      if(response&&response.code===200){
        const result = yield call(getCodeInfo,payload);
        if(result){
          yield put({
            type: 'getCodeConfigInfo',
            payload: result,
          });
          message.success('操作成功！')
        }
      }else{
        message.error('请求失败，请重试！')
      }
    },
    *upgradeRules({ payload }, { call, put }) {
      const response = yield call(setUpgradeCode, payload);
      if(response&&response.code===200){
        const result = yield call(getCodeInfo,payload);
        if(result){
          yield put({
            type: 'getCodeConfigInfo',
            payload: result,
          });
          message.success('操作成功！')
        }
      }else{
        message.error('请求失败，请重试！')
      }
    },
  },
  reducers: {
    getUnlockChangedList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        unlockChangeList: data.list,
      }
    },
    getUpgradeChangedList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        upgradeChangeList: data.list,
      }
    },
    getCodeConfigInfo(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        upgrade: data.upgrade,
        unlock:data.unlock,
        unlock_goods:data.unlock_goods
      }
    },
    unlockTypeListM(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        unlockTypeList: data,
      }
    },
    upgradeTypeListM(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        upgradeTypeList: data,
      }
    },

  },
}
