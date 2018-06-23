import {
  getAllGoods,
  editGoodType,
  getAllType,
  addGoodType,
  delGoodType,
  getAttrList,
  addGoodAttr,
  editGoodAttr,
  initGoodAttr,
} from '../services/goods';

// 将数据组合成列表，利用递归的特性
const toGet = (arr, obj, currentIndex, attrArr, map) => {
  const maxLength = attrArr.length;
  if (currentIndex >= maxLength) {
    return;
  }
  // const AttrArrMap = new Map();
  // attrArr.forEach(res => {
  //   for (const [key, value] of res.AttrArrMap) {
  //     AttrArrMap.set(key, value);
  //   }
  // })
  attrArr[currentIndex].checkArr.forEach(item => {
    // 在组合到最后一个之前，不停的往模板对象上添加属性
    // obj[attrArr[currentIndex].name] = item;
    obj[attrArr[currentIndex].id] = item;
    const key = attrArr[currentIndex].name + item;
    const value = attrArr[currentIndex].AttrArrMap.get(key);
    map.set(attrArr[currentIndex].id, value);
    if (currentIndex === maxLength - 1) {
      // 组合到最后一个后，创建一个新的对象，然后放置入列表中
      const result = Object.assign({}, obj);
      result.price = '0';
      result.count = '1';
      result.AttrArrMap = map;
      arr.push(result);
    } else {
      toGet(arr, obj, currentIndex + 1, attrArr, map);
    }
  });
};

export default {
  namespace: 'goods',

  state: {
    goodsList: {},
    goodType: [],
    goodAttr: [],
    goodsAttrPage: {},
    initGoodsAttr: [], // 初始化的商品分类数组
    typeName: '', // 选中的商品分类
    attrTable: [], // 属性table
    tableHeader: {}, // table头部
  },

  effects: {
    *clearAttrTabe(_, { put }) {
      yield put({
        type: 'clearAttrTabes',
      });
    },
    *initGoodAttr({ payload }, { call, put }) {
      const response = yield call(initGoodAttr);
      if (response.code === 200) {
        const goodsClass = response.data.goods_class;
        const type = Number(payload.type);
        const typeSon = Number(payload.typeSon);
        const selectType = goodsClass.filter(res => {
          return res.class_id === type;
        });
        let typeName = `${selectType[0].class_name}`;
        for (const item of selectType[0].has_category) {
          if (item.class_id === typeSon) {
            typeName += ` >> ${item.class_name}`;
            break;
          }
        }
        const tableHeader = {};
        selectType[0].ha_many_attr_class.forEach(ele => {
          tableHeader[ele.id] = ele.name;
          const AttrArr = [];
          const AttrArrMap = new Map();
          ele.has_many_attr.forEach(res => {
            if (res.status === 0) {
              AttrArr.push(res.value);
              AttrArrMap.set(ele.name + res.value, {
                attr_class_id: res.attr_class_id,
                attr_id: res.id,
                attr_class_name: ele.name,
              });
            }
          });
          ele.AttrArr = AttrArr;
          ele.AttrArrMap = AttrArrMap;
          ele.checked = false;
          ele.checkArr = [];
        });
        yield put({
          type: 'init',
          payload: {
            typeName,
            initGoodsAttr: selectType[0].ha_many_attr_class,
            tableHeader,
          },
        });
      }
    },
    *checked({ payload }, { put }) {
      yield put({
        type: 'checkeds',
        payload,
      });
    },
    *checkedList({ payload }, { put }) {
      yield put({
        type: 'checkedLists',
        payload,
      });
    },
    *checkedPar({ payload }, { put }) {
      yield put({
        type: 'checkedPars',
        payload,
      });
    },
    *fetchGoods({ payload }, { call, put }) {
      const response = yield call(getAllGoods, payload);
      yield put({
        type: 'show',
        payload: response.data,
      });
    },
    *editGoodType({ payload }, { call, put }) {
      yield call(editGoodType, payload);
      const response = yield call(getAllType, payload);
      yield put({
        type: 'fetchType',
        payload: response.data,
      });
    },
    *getAllType({ payload }, { call, put }) {
      const response = yield call(getAllType, payload);
      yield put({
        type: 'fetchType',
        payload: response.data,
      });
    },
    *addGoodType({ payload }, { call, put }) {
      yield call(addGoodType, payload);
      const response = yield call(getAllType, payload);
      yield put({
        type: 'fetchType',
        payload: response.data,
      });
    },
    *delGoodType({ payload }, { call, put }) {
      yield call(delGoodType, payload);
      const response = yield call(getAllType, payload);
      yield put({
        type: 'fetchType',
        payload: response.data,
      });
    },
    *getAllAttr({ payload }, { call, put }) {
      const response = yield call(getAttrList, payload) || {};
      if (response) {
        yield put({
          type: 'fetchAttr',
          payload: response.data,
        });
      }
    },
    *addGoodAttr({ payload }, { call, put }) {
      yield call(addGoodAttr, payload);
      const response = yield call(getAttrList);
      yield put({
        type: 'fetchAttr',
        payload: response.data,
      });
    },
    *setAttrTabe({ payload }, { put }) {
      yield put({
        type: 'setAttrTabes',
        payload,
      });
    },
    *editGoodAttr({ payload }, { call, put }) {
      yield call(editGoodAttr, payload);
      const response = yield call(getAttrList, payload);
      yield put({
        type: 'fetchAttr',
        payload: response.data,
      });
    },
  },

  reducers: {
    clearAttrTabes(state) {
      const arr = [];
      return {
        ...state,
        attrTable: arr,
      };
    },
    setAttrTabes(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    checkedPars(state, { payload }) {
      const { initGoodsAttr } = state;
      const data = initGoodsAttr[payload.index];
      if (data.checked) {
        data.checkArr = [];
      } else {
        data.checkArr = data.AttrArr;
      }
      data.checked = !data.checked;
      return {
        ...state,
        initGoodsAttr,
      };
    },
    checkedLists(state, { payload }) {
      const { initGoodsAttr } = state;
      const arr = [];
      initGoodsAttr[payload.index].checkArr = payload.checkedList;
      const attrData = initGoodsAttr.filter(res => {
        return res.checked;
      });
      toGet(arr, {}, 0, attrData, new Map());
      return {
        ...state,
        initGoodsAttr,
        attrTable: arr,
      };
    },
    checkeds(state, { payload }) {
      const { initGoodsAttr } = state;
      initGoodsAttr[payload.index].checked = !initGoodsAttr[payload.index].checked;
      return {
        ...state,
        initGoodsAttr,
      };
    },
    init(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    show(state, { payload }) {
      // state.menuList = payload;
      return {
        ...state,
        goodsList: payload,
      };
    },
    fetchType(state, { payload }) {
      payload = payload.map(res => {
        if (res.has_category.length) {
          res.children = res.has_category;
        }
        return res;
      });
      // state.menuList = payload;
      return {
        ...state,
        goodType: payload,
      };
    },
    fetchAttr(state, { payload }) {
      // state.menuList = payload;
      const { list, total, page } = payload;
      return {
        ...state,
        goodAttr: list,
        goodsAttrPage: {
          pageSize: page,
          total,
        },
      };
    },
  },
};
