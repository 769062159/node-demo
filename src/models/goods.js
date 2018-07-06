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
  addFreight,
  delFreight,
  getFreightList,
  updateFreight,
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
// 判断一个数组是否包裹另一个数组 (number string一样的)
const isContained = (arr1, arr2) => {
  if (!(arr1 instanceof Array) || !(arr2 instanceof Array) || arr1.length < arr2.length) {
    return false;
  }
  const aaStr = arr1.toString();
  for (let i = 0; i < arr2.length; i++) {
    if (aaStr.indexOf(arr2[i]) < 0) return false;
  }
  return true;
};
// 将数据组合成列表，利用递归的特性
const toGet = (arr, attrArr, AttrArrMap, totalPrice, goodSN) => {
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
      price: totalPrice,
      store_nums: 0,
      attrIdArr: arrId,
      goods_sku_sn: goodSN,
      img: '',
      fileList: [],
    });
  });
  return arr;
};

export default {
  namespace: 'goods',

  state: {
    goodsList: [],
    goodsListPage: {},
    selectGoodsList: [], // 直播间选中的商品列表
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
    systemType: {}, // 系统类型
    uploadGoodsImg: [], // 商品主体图片
    goodsDetail: {},
    freightList: [], // 运费模版列表
  },

  effects: {
    *fetchFreight({ payload }, { call, put }) {
      const response = yield call(getFreightList, { ...payload });
      if (response) {
        yield put({
          type: 'fetchFreights',
          payload: response.data,
        });
      }
    },
    *addFreight({ payload }, { call, put }) {
      yield call(addFreight, { ...payload });
      const response = yield call(getFreightList, { ...payload });
      if (response) {
        yield put({
          type: 'fetchFreights',
          payload: response.data,
        });
      }
    },
    *updateFreight({ payload }, { call, put }) {
      yield call(updateFreight, { ...payload });
      const response = yield call(getFreightList, { ...payload });
      if (response) {
        yield put({
          type: 'fetchFreights',
          payload: response.data,
        });
      }
    },
    *delFreight({ payload }, { call, put }) {
      yield call(delFreight, { ...payload });
      const response = yield call(getFreightList, { ...payload });
      if (response) {
        yield put({
          type: 'fetchFreights',
          payload: response.data,
        });
      }
    },
    *changeFormVal({ payload }, { put }) {
      yield put({
        type: 'changeFormVals',
        payload,
      });
    },
    *setGoodsImg({ payload }, { put }) {
      yield put({
        type: 'setGoodsImgs',
        payload,
      });
    },
    *addShop({ payload }, { call, put }) {
      const response = yield call(addGood, { ...payload });
      if (response) {
        if (payload.goods_id) {
          yield put(routerRedux.push('/good/edit-goods/result'));
        } else {
          yield put(routerRedux.push('/good/add-goods/result'));
        }
      }
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
      if (response) {
        yield put({
          type: 'getBrands',
          payload: response.data,
        });
      }
    },
    *addBrand({ payload }, { call, put }) {
      yield call(addBrand, payload);
      const response = yield call(getBrand, { page: payload.pagination });
      if (response) {
        yield put({
          type: 'getBrands',
          payload: response.data,
        });
      }
    },
    *editBrand({ payload }, { call, put }) {
      yield call(updateBrand, payload);
      const response = yield call(getBrand, { page: payload.pagination });
      if (response) {
        yield put({
          type: 'getBrands',
          payload: response.data,
        });
      }
    },
    *deleteBrand({ payload }, { call, put }) {
      yield call(deleteBrand, payload);
      const response = yield call(getBrand, { page: payload.pagination });
      if (response) {
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
      if (response) {
        const goodsClass = response.data.goods_class;
        const goodsBrand = response.data.goods_brand; // 商品品牌
        const goodsPlace = response.data.goods_place; // 商品品牌
        const goodsDetail = response.data.goods; // 商品详情
        const systemType = response.data.system_type; // 商品详情
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
        console.log(selectType);
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
            systemType,
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
        payload: response,
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
    deleteLiveGood(state, { payload }) {
      let { selectGoodsList } = state;
      const { goodsList } = state;
      const { goods_id: id } = payload.goods;
      selectGoodsList = selectGoodsList.filter(res => {
        return res.goods_id !== id;
      });
      goodsList.push(payload.goods);
      return {
        ...state,
        selectGoodsList,
        goodsList,
      };
    },
    selectLiveGood(state, { payload }) {
      const { selectGoodsList } = state;
      let { goodsList } = state;
      const { goods_id: id } = payload.goods;
      goodsList = goodsList.filter(res => {
        return res.goods_id !== id;
      });
      selectGoodsList.push(payload.goods);
      return {
        ...state,
        selectGoodsList,
        goodsList,
      };
    },
    fetchFreights(state, { payload }) {
      return {
        ...state,
        freightList: payload,
      };
    },
    changeFormVals(state, { payload }) {
      let { goodsDetail } = state;
      goodsDetail = {
        ...goodsDetail,
        ...payload.obj,
      };
      return {
        ...state,
        goodsDetail,
      };
    },
    setGoodsImgs(state, { payload }) {
      return {
        ...state,
        uploadGoodsImg: payload.fileList,
      };
    },
    setLevelPartials(state, { payload }) {
      // const { typePartial, totalPrice, levelPartial, levelPartialSon } = state;
      const { goodsDetail, levelPartial, levelPartialSon } = state;
      const {
        profit_type: profitType,
        cost_price: costPrice,
        sell_goods_price: sellGoodsPrice,
      } = goodsDetail;
      levelPartial[payload.index] = payload.value;
      if (profitType === 1) {
        levelPartialSon[payload.index] = payload.value;
      } else {
        levelPartialSon[payload.index] = Number(
          (((sellGoodsPrice || 0) - (costPrice || 0)) * payload.value / 100).toFixed(2)
        );
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
        levelPartial: [],
        levelPartialSon: [],
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
      const { initGoodsAttr, AttrArrMap, goodsDetail } = state;
      const arr = [];
      initGoodsAttr[payload.index].checkArr = payload.checkedList;
      const attrData = initGoodsAttr.filter(res => {
        return res.checked;
      });
      toGet(arr, attrData, AttrArrMap, goodsDetail.sell_goods_price, goodsDetail.goods_sn);
      return {
        ...state,
        initGoodsAttr,
        attrTable: arr,
      };
    },
    checkeds(state, { payload }) {
      const { initGoodsAttr, AttrArrMap, goodsDetail } = state;
      const arr = [];
      // console.log(initGoodsAttr);
      initGoodsAttr[payload.index].checked = !initGoodsAttr[payload.index].checked;
      // console.log(initGoodsAttr);
      const attrData = initGoodsAttr.filter(res => {
        return res.checked;
      });
      toGet(arr, attrData, AttrArrMap, goodsDetail.sell_goods_price, goodsDetail.goods_sn);
      return {
        ...state,
        initGoodsAttr,
        attrTable: arr,
      };
    },
    init(state, { payload }) {
      // 初始化
      console.log(payload.initGoodsAttr);
      const levelPartial = [];
      let levelPartialSon = [];
      let totalPrice = 0;
      const { goodsDetail } = payload;
      const uploadGoodsImg = [];
      let arr = [];
      if (goodsDetail.goods_id) {
        const arrId = new Set();
        const arrSonId = new Set();
        const goodSku = new Map(); // 用于做对比
        payload.goodsDetail.has_shop_goods_sku.forEach(res => {
          const AttrIdSet = new Set();
          res.has_shop_goods_sku_attr.forEach(ele => {
            arrId.add(ele.attr_class_id);
            arrSonId.add(ele.attr_id);
            AttrIdSet.add(ele.attr_id);
          });
          const arrAttrId = [...AttrIdSet];
          goodSku.set(arrAttrId, res);
        });
        console.log(goodSku);
        payload.initGoodsAttr.forEach(res => {
          if (arrId.has(res.id)) {
            res.checked = true;
          }
          res.has_many_attr.forEach(ele => {
            if (arrSonId.has(ele.id)) {
              res.checkArr.push(ele.value);
            }
          });
        });
        const attrData = payload.initGoodsAttr.filter(res => {
          return res.checked;
        });
        toGet(
          arr,
          attrData,
          payload.AttrArrMap,
          goodsDetail.sell_goods_price,
          goodsDetail.goods_sn
        );
        if (arr.length) {
          arr.forEach(res => {
            for (const [key, value] of goodSku) {
              if (isContained(key, res.attrIdArr)) {
                res.goods_sku_sn = value.goods_sku_sn;
                res.price = value.price;
                res.store_nums = value.store_nums;
                res.profit = [];
                value.has_shop_goods_sku_profit.forEach(ele => {
                  res.profit.push(ele.price);
                });
                const img = value.has_shop_goods_img[0];
                res.img = img.http_url;
                res.sku_goods_name = value.sku_goods_name;
                res.flag = 1;
                if (img.http_url) {
                  res.fileList = [
                    {
                      img: img.http_url,
                      url: img.http_url,
                      status: 'done',
                      uploaded: 'done',
                      response: { status: 'success' },
                      name: img.create_time,
                      uid: img.create_time,
                    },
                  ];
                }
              }
            }
          });
          arr = arr.filter(res => {
            return res.flag;
          });
        }
        goodsDetail.has_shop_goods_img.forEach(res => {
          const img = {};
          img.status = 'done';
          img.uploaded = 'done';
          img.response = { status: 'success' };
          img.name = res.img_id;
          img.uid = res.img_id;
          img.url = res.http_url;
          uploadGoodsImg.push(img);
        });
        totalPrice = goodsDetail.sell_goods_price;
        let typePartial = 0;
        goodsDetail.has_shop_goods_profit.forEach(res => {
          if (res.status === 0) {
            goodsDetail[`level_${res.level - 1}`] = res.profit_value;
            typePartial = res.profit_type;
            levelPartial.push(res.profit_value);
          }
        });
        goodsDetail.profit_type = typePartial;
        if (typePartial === 0) {
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
      goodsDetail.profit_type = goodsDetail.profit_type || 0;
      console.log(goodsDetail);
      payload.goodsDetail = goodsDetail;
      return {
        ...state,
        ...payload,
        levelPartial,
        levelPartialSon,
        totalPrice,
        uploadGoodsImg,
        attrTable: arr,
      };
    },
    show(state, { payload }) {
      // state.menuList = payload;
      const { data } = payload;
      return {
        ...state,
        goodsList: data.list,
        goodsListPage: {
          pageSize: data.page,
          total: data.total,
        },
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
