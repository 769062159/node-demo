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
    // 中心管理审核对话框
    reviewCenterDialogShow: false,
    allPositions: [],

    // 保存总裁、合伙人、运营中心loading
    saveOperateLoading: false,
    // 代理区域
    regionTree: [],
    // 场地Loading
    placesLoading: false,
    places: [],
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
      if (payload.position_type) {
        params.position_type = payload.position_type;
      }
      if (payload.contact_status) {
        params.contact_status = payload.contact_status;
      }
      const response = yield call(api.getCenterList, params);
      yield put({
        type: 'setCenterObj',
        payload: {
          list: response.data.list,
          total: response.data.count,
          params: {
            page: payload.page,
            pagesize: payload.pagesize,
            key: payload.key,
            status: payload.status,
            position_type: payload.position_type,
            contact_status: payload.contact_status,
          },
        },
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

    // 获取区域
    *doGetRegionList({ payload }, { call, put }) {
      if (payload.regionRef) {
        payload.regionRef.loading = true;
        yield put({
          type: 'setRegionTree',
          payload: payload.regionTree,
        });
      }

      const response = yield call(api.getRegions, payload.params);

      if (response.code !== 200) {
        if (payload.regionRef) {
          payload.regionRef.loading = false;
          yield put({
            type: 'setRegionTree',
            payload: payload.regionTree,
          });
        }
        return;
      }
      const list = response.data.list.map((item) => ({
        label: item.name,
        value: item.id,
        level: item.level,
        isLeaf: payload.isLeaf,
      }));
      if (payload.params.type === 1) {
        yield put({
          type: 'setRegionTree',
          payload: list,
        });
      } else {
        payload.regionRef.loading = false;
        payload.regionRef.children = list;
        yield put({
          type: 'setRegionTree',
          payload: payload.regionTree,
        });
      }
      payload.callback();
    },
    // 新建运营中心
    *doAddCenter({ payload }, { call, put }) {
      yield put({
        type: 'setSaveOperateLoading',
        payload: true,
      });

      const response = yield call(api.createCenter, payload.params);

      yield put({
        type: 'setSaveOperateLoading',
        payload: false,
      });

      if (response.code !== 200) {
        return;
      }

      payload.callback();
    },
    // 更新运营中心
    *doUpdateCenter({ payload }, { call, put }) {
      yield put({
        type: 'setSaveOperateLoading',
        payload: true,
      });
      const response = yield call(api.updateCenter, payload.params);
      yield put({
        type: 'setSaveOperateLoading',
        payload: false,
      });
      if (response.code !== 200) {
        return;
      }

      payload.callback();
    },
    // 通过场地名搜索场地
    *doSearchLecturerPlace({ payload }, { call, put }) {
      yield put({
        type: 'setPlacesLoading',
        payload: true,
      });

      yield put({
        type: 'setPlaces',
        payload: [],
      });

      const response = yield call(api.searchLecturerPlace, payload.params);

      yield put({
        type: 'setPlacesLoading',
        payload: false,
      });

      if (response.code !== 200) {
        return;
      }

      const list = response.data.map((item) => ({
        text: item.name,
        value: item.id,
        id: item.id,
        name: item.name,
      }));

      yield put({
        type: 'setPlaces',
        payload: list,
      });

      payload.callback();

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
    setReviewCenterDialogShow(state, { payload }) {
      return {
        ...state,
        reviewCenterDialogShow: payload,
      };
    },
    setRegionTree(state, { payload }) {
      return {
        ...state,
        regionTree: [...payload],
      }
    },
    setSaveOperateLoading(state, { payload }) {
      return {
        ...state,
        saveOperateLoading: payload,
      };
    },
    setPlacesLoading(state, { payload }) {
      return {
        ...state,
        placesLoading: payload,
      };
    },
    setPlaces(state, { payload }) {
      return {
        ...state,
        places: [...payload],
      };
    },
  },
};
