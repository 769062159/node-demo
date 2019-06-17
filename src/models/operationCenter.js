import * as api from '../services/operation';

export default {
  namespace: 'operationCenter',
  state: {
    center: {
      list: [],
      page: 1,
      pagesize: 10,
      total: 0,
      key: '',
      status: '',
    },
    // 中心管理编辑对话框
    centerFormDialogShow: false,
    // 中心管理审核对话框
    reviewCenterDialogShow: false,
    allPositions: [],
  },
  effects: {
    // 分页获取中心
    *doGetCenterList({ payload }, { call, put }) {
      const params = {
        page: payload.page,
        pagesize: payload.pagesize,
        key: payload.key,
      };
      if (payload.status) {
        params.status = payload.status;
      }
      const response = yield call(api.getCenterList, params);
      yield put({
        type: 'setCenterObj',
        payload: {
          list: response.data.list,
          total: response.data.count,
          params,
        },
      });
    },
    // 创建中心
    *doCreateCenter({ payload }, { call, put }) {
      yield call(api.createCenter, { ...payload.data });
      yield put({
        type: 'setCenterFormDialogShow',
        payload: false,
      });
      yield put({
        type: 'doGetCenterList',
        payload: payload.searchParams,
      });
    },
    // 更新中心
    *doUpdateCenter({ payload }, { call, put }) {
      yield call(api.updateCenter, { ...payload.data });
      yield put({
        type: 'setCenterFormDialogShow',
        payload: false,
      });
      yield put({
        type: 'doGetCenterList',
        payload: payload.searchParams,
      });
    },
    // 审核同意
    *doAcceptCenterApplication({ payload }, { call, put }) {
      yield call(api.acceptCenterApplication, { ...payload.data });
      yield put({
        type: 'setReviewCenterDialogShow',
        payload: false,
      });
      yield put({
        type: 'doGetCenterList',
        payload: payload.searchParams,
      });
    },
    // 审核驳回
    *doRefuseCenterApplication({ payload }, { call, put }) {
      yield call(api.refuseCenterApplication, { ...payload.data });
      yield put({
        type: 'setReviewCenterDialogShow',
        payload: false,
      });
      yield put({
        type: 'doGetCenterList',
        payload: payload.searchParams,
      });
    },
    // 所有职位
    *doGetAllPositions(_, { call, put }) {
      const response = yield call(api.getAllPositions);
      yield put({
        type: 'setAllPositions',
        payload: response.data.list || [],
      });
    },
  },
  reducers: {
    setCenterObj(state, { payload }) {
      return {
        ...state,
        center: {
          ...state.center,
          list: payload.list,
          total: payload.total,
          ...payload.params,
        },
      };
    },
    setAllPositions(state, { payload }) {
      return {
        ...state,
        allPositions: payload,
      };
    },
    setCenterFormDialogShow(state, { payload }) {
      return {
        ...state,
        centerFormDialogShow: payload,
      };
    },
    setReviewCenterDialogShow(state, { payload }) {
      return {
        ...state,
        reviewCenterDialogShow: payload,
      };
    },
  },
};
