import { getAddressList } from '../services/api';

export default {
  namespace: 'address',

  state: {
    addressList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      console.log(payload);
      const { data } = yield call(getAddressList, payload);
      if (data.length && !payload.type) {
        data.forEach(element => {
          element.isLeaf = false;
        });
      }
      yield put({
        type: 'save',
        payload: {
          data,
          id: payload.parent_id,
        },
      });
    },
    *fetchAll({ payload }, { call, put }) {
      const { addressArr } = payload;
      const { data } = yield call(getAddressList, { parent_id: addressArr[0] });
      if (data.length) {
        data.forEach(res => {
          res.isLeaf = false;
        });
      }
      const { data: area } = yield call(getAddressList, { parent_id: addressArr[1] });
      yield put({
        type: 'save',
        payload: {
          data,
          id: addressArr[0],
        },
      });
      yield put({
        type: 'save',
        payload: {
          data: area,
          id: addressArr[1],
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      let { addressList } = state;
      const { id } = payload;
      if (id) {
        for (const val of addressList) {
          if (val.id === id) {
            val.children = payload.data;
            break;
          }
          if (val.children) {
            for (const vals of val.children) {
              if (vals.id === id) {
                vals.children = payload.data;
                break;
              }
            }
          }
        }
      } else {
        addressList = payload.data;
      }
      console.log(addressList);
      return {
        ...state,
        addressList,
      };
    },
  },
};
