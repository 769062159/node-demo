import { message } from 'antd';
import { getOrderList, getExpressList, shipshop, editShip, editAdress, getGroupList, getGroupDetail, collectGoods } from '../services/order';

export default {
  namespace: 'order',

  state: {
    orderList: [], // table列表
    groupList: [], // table列表
    orderListPage: {}, // table 页脚
    groupListPage: {}, // table 页脚
    expressList: [], // 快递公司
    groupDetail: {
      has_check_user: {},
    },
    shop_store_id: '',
  },

  effects: {
    *collectGoods({ payload, values }, { call, put, select }) {
      const response = yield call(collectGoods, { order_pack_id: payload });
      if (response.code === 200) {
        const res = yield call(getOrderList, { ...payload });
        let id = '';
        id = yield select(state => state.user.currentUser.shop_store_id);
        yield put({
          type: 'getOrder',
          payload: res,
          id,
          page: values.page || 1,
        });
      }
    },
    *getGroupList({ payload }, { call, put, select }) {
      const response = yield call(getGroupList, { ...payload });
      const id = yield select(state => state.user.currentUser.shop_store_id);
      yield put({
        type: 'getGroup',
        payload: response,
        id,
      });
    },
    *editAddress({ payload }, { call, put }) {
      yield call(editAdress, { ...payload });
      message.success('修改成功');
      const response = yield call(getOrderList, { page: payload.page });
      yield put({
        type: 'getOrder',
        payload: response,
        page: payload.page,
      });
    },
    *editShipGood({ payload }, { call, put }) {
      yield call(editShip, { ...payload });
      message.success('修改成功');
      const response = yield call(getOrderList, { page: payload.page });
      yield put({
        type: 'getOrder',
        payload: response,
        page: payload.page,
      });
    },
    *shipGood({ payload }, { call, put }) {
      yield call(shipshop, { ...payload });
      message.success('发货成功');
      const response = yield call(getOrderList, { page: payload.page });
      yield put({
        type: 'getOrder',
        payload: response,
        page: payload.page,
      });
    },
    *fetchExpressList(_, { call, put }) {
      const response = yield call(getExpressList);
      yield put({
        type: 'getExpressLists',
        payload: response,
      });
    },
    *fetchOrder({ payload }, { call, put, select }) {
      const response = yield call(getOrderList, { ...payload });
      let id = '';
      id = yield select(state => state.user.currentUser.shop_store_id);
      yield put({
        type: 'getOrder',
        payload: response,
        id,
        page: payload.page,
      });
    },
    *getGroupDetail({ payload }, { call, put }) {
      const responses = yield call(getGroupDetail, payload);
      yield put({
        type: 'setGroupDetail',
        payload: responses.data,
      });
    },
  },

  reducers: {
    setGroupDetail(state, { payload }) {
      payload.userList = payload.has_group.has_group_user;
      payload.groupStatus = payload.has_group.status;
      if (payload.order_status === 0) {
        payload.stepStatus = 0;
      } else if (payload.order_status === 2 && payload.groupStatus !== 1) {
        payload.stepStatus = 1;
      } else if (payload.order_status === 2 && payload.groupStatus === 1) {
        payload.stepStatus = 2;
      } else {
        payload.stepStatus = 3;
      }
      if (payload.sale_channel) {
        payload.shopMobile = payload.has_group.has_group_user[0].has_store.mobile;
      }
      delete payload.has_group.has_group_user;
      return {
        ...state,
        groupDetail: payload,
      }
    },
    getExpressLists(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        expressList: data,
      };
    },
    getGroup(state, { payload, id }) {
      const { data } = payload;
      const { list } = data;
      list.forEach(res => {
        res.has_order_pack.forEach(ele => {
          if (ele.shop_store_id === id) {
            ele.isBtn = true;
          } else {
            ele.isBtn = false;
          }
          ele.order_amount = res.order_amount;
          ele.get_store_name = res.get_store_name;
          ele.has_check_user = res.has_check_user;
          ele.store_name = res.store_name;
          ele.groupStatus = res.has_group.status;
          ele.hasUser = res.has_user;
          // let price = 0;
          // ele.has_order_goods.forEach(gg => {
          //   price = (price * 100 + gg.has_order_goods_sku.price * 100) / 100;
          // });
          // ele.total_price = price;
        });
      });
      return {
        ...state,
        groupList: list,
        groupListPage: {
          pageSize: data.page,
          total: data.total,
        },
      };
    },
    getOrder(state, { payload, id, page }) {
      const { data } = payload;
      const { list } = data;
      list.forEach(res => {
        res.has_order_pack.forEach(ele => {
          if (ele.shop_store_id === id) {
            ele.isBtn = true;
          } else {
            ele.isBtn = false;
          }
          let price = 0;
          ele.has_order_goods.forEach(gg => {
            price = (price * 100 + gg.has_order_goods_sku.price * 100) / 100;
          });
          ele.hasUser = res.has_user;
          ele.total_price = price;
        });
      });
      return {
        ...state,
        orderList: list,
        orderListPage: {
          pageSize: data.page,
          total: data.total,
          current: page,
        },
      };
    },
  },
};
