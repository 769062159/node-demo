import { routerRedux } from 'dva/router';
import moment from 'moment';
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
  getBrand,
  addBrand,
  deleteBrand,
  updateBrand,
  addGood,
} from '../services/goods';
import { uploadImg } from '../services/api';

const arrayCombination = (dyadicArray, type) => {
  if (dyadicArray.length > 1) {
    const _dyadicArray = [];
    dyadicArray.forEach(item => {
      _dyadicArray.push(item);
    });
    const arr1 = _dyadicArray.shift();
    const arr2 = _dyadicArray.shift();
    const tempArr = [];
    arr1.forEach(item => {
      arr2.forEach(_item => {
        if (type) {
          tempArr.push(`${item}|${_item}`);
        } else {
          tempArr.push(`${item}${_item}`);
        }
      });
    });
    _dyadicArray.unshift(tempArr);
    return arrayCombination(_dyadicArray, type);
  } else {
    return dyadicArray[0];
  }
};
// 将数据组合成列表，利用递归的特性
const toGet = (arr, attrArr, AttrArrMap) => {
  const dyadicArray = [];
  const dyadicArrayId = [];
  attrArr.forEach(res => {
    if (res.checked && res.checkArr.length) {
      dyadicArray.push(res.checkArr);
      const arr = new Map();
      res.has_many_attr.forEach(ele => {
        arr.set(ele.value, ele.id);
      });
      const arrs = [];
      res.checkArr.forEach(ele => {
        arrs.push(arr.get(ele));
      });
      dyadicArrayId.push(arrs);
    }
  });
  if (!dyadicArray.length) {
    return arr;
  }
  const arrTableId = arrayCombination(dyadicArrayId, 1);
  const arrTable = arrayCombination(dyadicArray);
  arrTable.forEach((res, index) => {
    const arrId = arrTableId[index].toString().split('|');
    const param = [];
    arrId.forEach(ele => {
      param.push(AttrArrMap.get(Number(ele)));
    });
    arr.push({
      sku_goods_name: res,
      goods_sku_attr: param,
      profit: [],
      price: 0,
      store_nums: 0,
      goods_sku_sn: '',
      img: '',
      fileList: [],
    });
  });
  return arr;
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
    AttrArrMap: new Map(), // 用来对比的map
    typePartial: '0', // 分佣类型
    totalPrice: 0, // 总价
    levelPartial: [], // 分佣等级
    levelPartialSon: [], // 传给子的分佣等级
    brandList: [], // 品牌列表
    brandListPage: {}, // 品牌页脚
    goodsPlace: [], // 商品地址
    goodsDetail: {},
  },

  effects: {
    *getGoodsDetail({ payload }, { call }) {
      // 添加初始化
      const response = yield call(initGoodAttr, { ...payload });
      console.log(response);
    },
    *addShop({ payload }, { call, put }) {
      const response = yield call(addGood, { ...payload });
      if (response.code === 200) {
        yield put(routerRedux.push('/goods/add-goods/result'));
      }
      // if (response.code === 200) {

      // }
    },
    *changeTotalPrice({ payload }, { put }) {
      yield put({
        type: 'changeTotalPrices',
        payload,
      });
    },
    *setLevelPartial({ payload }, { put }) {
      yield put({
        type: 'setLevelPartials',
        payload,
      });
    },
    *changeTypePartial({ payload }, { put }) {
      yield put({
        type: 'changeTypePartials',
        payload,
      });
    },
    *fetchBrand({ payload }, { call, put }) {
      const response = yield call(getBrand, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getBrands',
          payload: response.data,
        });
      }
    },
    *addBrand({ payload }, { call, put }) {
      yield call(addBrand, payload);
      const response = yield call(getBrand, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getBrands',
          payload: response.data,
        });
      }
    },
    *editBrand({ payload }, { call, put }) {
      yield call(updateBrand, payload);
      const response = yield call(getBrand, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getBrands',
          payload: response.data,
        });
      }
    },
    *deleteBrand({ payload }, { call, put }) {
      yield call(deleteBrand, payload);
      const response = yield call(getBrand, { page: payload.pagination });
      if (response.code === 200) {
        yield put({
          type: 'getBrands',
          payload: response.data,
        });
      }
    },
    *uploadImg({ payload }, { call }) {
      yield call(uploadImg, payload);
    },
    *clearAttrTabe(_, { put }) {
      yield put({
        type: 'clearAttrTabes',
      });
    },
    *initGoodAttr({ payload }, { call, put }) {
      // 添加初始化
      const response = yield call(initGoodAttr, {
        goods_id: payload.goods_id,
      });
      if (response.code === 200) {
        const goodsClass = response.data.goods_class;
        const goodsBrand = response.data.goods_brand; // 商品品牌
        const goodsPlace = response.data.goods_place; // 商品品牌
        const goodsDetail = response.data.goods; // 商品品牌
        let type = '';
        let typeSon = '';
        if (payload.type) {
          type = Number(payload.type);
          typeSon = Number(payload.typeSon);
        } else if (payload.goods_id) {
          type = Number(goodsDetail.class_id);
          typeSon = Number(goodsDetail.category_id);
        }
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
        const AttrArrMap = new Map();
        selectType[0].has_many_attr_class.forEach(ele => {
          const AttrArr = [];
          ele.has_many_attr.forEach(res => {
            if (res.status === 0) {
              AttrArr.push(res.value);
              AttrArrMap.set(res.id, {
                attr_class_id: res.attr_class_id,
                attr_id: res.id,
                attr_class_name: ele.name,
                attr_name: res.value,
              });
            }
          });
          ele.AttrArr = AttrArr;
          ele.checked = false;
          ele.checkArr = [];
        });
        yield put({
          type: 'init',
          payload: {
            typeName,
            initGoodsAttr: selectType[0].has_many_attr_class,
            AttrArrMap,
            brandList: goodsBrand,
            goodsPlace, // 品牌地址
            goodsDetail, // 商品详情
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
    changeTotalPrices(state, { payload }) {
      return {
        ...state,
        totalPrice: payload.e,
      };
    },
    setLevelPartials(state, { payload }) {
      const { levelPartial, typePartial, totalPrice, levelPartialSon } = state;
      levelPartial[payload.index] = payload.value;
      if (typePartial === '1') {
        levelPartialSon[payload.index] = payload.value;
      } else {
        levelPartialSon[payload.index] = Number((totalPrice * payload.value / 100).toFixed(2));
      }
      return {
        ...state,
        levelPartial,
        levelPartialSon,
      };
    },
    changeTypePartials(state, { payload }) {
      return {
        ...state,
        typePartial: payload.e,
      };
    },
    getBrands(state, { payload }) {
      return {
        ...state,
        brandList: payload.list,
        brandListPage: {
          pageSize: payload.page,
          total: payload.total,
        },
      };
    },
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
      const { initGoodsAttr, AttrArrMap } = state;
      const arr = [];
      initGoodsAttr[payload.index].checkArr = payload.checkedList;
      const attrData = initGoodsAttr.filter(res => {
        return res.checked;
      });
      toGet(arr, attrData, AttrArrMap);
      return {
        ...state,
        initGoodsAttr,
        attrTable: arr,
      };
    },
    checkeds(state, { payload }) {
      const { initGoodsAttr, AttrArrMap } = state;
      const arr = [];
      initGoodsAttr[payload.index].checked = !initGoodsAttr[payload.index].checked;
      const attrData = initGoodsAttr.filter(res => {
        return res.checked;
      });
      toGet(arr, attrData, AttrArrMap);
      return {
        ...state,
        initGoodsAttr,
        attrTable: arr,
      };
    },
    init(state, { payload }) {
      let { typePartial } = state;
      const levelPartial = [];
      let levelPartialSon = [];
      let totalPrice = 0;
      const { goodsDetail } = payload;
      if (goodsDetail.goods_id) {
        typePartial = goodsDetail.has_shop_goods_profit[0].profit_type.toString();
        totalPrice = goodsDetail.sell_goods_price;
        goodsDetail.has_shop_goods_profit.forEach(res => {
          levelPartial.push(res.profit_value);
        });
        if (typePartial === '0') {
          levelPartial.forEach(res => {
            levelPartialSon.push((res * totalPrice / 100).toFixed(2));
          });
        } else {
          levelPartialSon = levelPartial;
        }
        goodsDetail.goods_shelves_time = moment(goodsDetail.goods_shelves_time * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        );
      }
      payload.goodsDetail = goodsDetail;
      return {
        ...state,
        ...payload,
        typePartial,
        levelPartial,
        levelPartialSon,
        totalPrice,
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
