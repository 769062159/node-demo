import { routerRedux } from 'dva/router';
import moment from 'moment';
import { deepCopy } from '../utils/utils';
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
  obtainedGood,
  deleteGood,
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
          tempArr.push(`${item}|,|${_item}`);
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
// const isContained = (arr1, arr2) => {
//   if (!(arr1 instanceof Array) || !(arr2 instanceof Array) || arr1.length < arr2.length) {
//     return false;
//   }
//   const aaStr = arr1.toString();
//   for (let i = 0; i < arr2.length; i++) {
//     if (aaStr.indexOf(arr2[i]) < 0) return false;
//   }
//   return true;
// };
// 将数据组合成列表，利用递归的特性
const toGet = (arr, attrArr, AttrArrMap, totalPrice, goodSN, weight, costPrice, groupPrice) => {
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
    const obj = {};
    arrId.forEach(ele => {
      param.push(AttrArrMap.get(Number(ele)));
    });
    const classIdArr = [];
    param.forEach(res => {
      classIdArr.push(res.attr_class_id);
      obj[`sku_class_name_${res.attr_class_id}`] = res.attr_class_name;
      obj[`sku_attr_name_${res.attr_class_id}`] = res.attr_name;
    });
    arr.push({
      id: arrId.join(','),
      sku_goods_name: res,
      goods_sku_attr: param,
      profit: [],
      price: totalPrice || 0,
      group_price: groupPrice || 0,
      cost_price: costPrice || 0,
      classIdArr,
      store_nums: 0,
      attrIdArr: arrId,
      weight: weight || 0,
      goods_sku_sn: goodSN,
      img: '',
      fileList: [],
      values: {},
      ...obj,
    });
  });
  return arr;
};

export default {
  namespace: 'goods',

  state: {
    skuInputArr: [], // 可填写sku 例子 [{key: '颜色'， val: ['红', '黄']}]
    goodsList: [],
    goodsListPage: {},
    goodsClass: [], // 商品分类
    selectGoodsList: [], // 直播间选中的商品列表
    goodType: [],
    goodAttr: [],
    goodsAttrPage: {},
    initGoodsAttr: [], // 初始化的商品分类数组
    typeName: '', // 选中的商品分类
    attrTable: [], // 属性table
    attrTableCacheArr: [], // 属性table缓存
    attrTableCache: {}, // 属性table缓存
    AttrArrMap: new Map(), // 用来对比的map
    typePartial: 0, // 分佣类型
    totalPrice: 0, // 总价
    levelPartial: [], // 分佣等级
    levelPartialSon: [], // 传给子的分佣等级
    brandList: [], // 品牌列表
    warehouseList: [], // 仓库列表
    brandListPage: {}, // 品牌页脚
    goodsPlace: [], // 商品地址
    systemType: {}, // 系统类型
    uploadGoodsImg: [], // 商品主体图片
    goodsDetail: {
    },
    freightList: [], // 运费模版列表
  },

  effects: {
    *deleteGood({ payload, refresh, callback }, { call, put }) {
      const response = yield call(deleteGood, { ...payload });
      if (response && response.code === 200) {
        callback();
        const responses = yield call(getAllGoods, {...refresh});
        yield put({
          type: 'show',
          payload: responses,
        });
      }
    },
    *obtainedGood({ payload, refresh, callback }, { call, put }) {
      const response = yield call(obtainedGood, { ...payload });
      if (response && response.code === 200) {
        callback();
        const responses = yield call(getAllGoods, {...refresh});
        yield put({
          type: 'show',
          payload: responses,
        });
      }
    },
    *fetchFreight({ payload }, { call, put }) {
      const response = yield call(getFreightList, { ...payload });
      yield put({
        type: 'fetchFreights',
        payload: response,
      });
    },
    *addFreight({ payload }, { call, put }) {
      yield call(addFreight, { ...payload });
      const response = yield call(getFreightList, { page: payload.pagination });
      yield put({
        type: 'fetchFreights',
        payload: response,
      });
    },
    *updateFreight({ payload }, { call, put }) {
      yield call(updateFreight, { ...payload });
      const response = yield call(getFreightList, { page: payload.pagination });
      yield put({
        type: 'fetchFreights',
        payload: response,
      });
    },
    *delFreight({ payload }, { call, put }) {
      yield call(delFreight, { ...payload });
      const response = yield call(getFreightList, { page: payload.pagination });
      yield put({
        type: 'fetchFreights',
        payload: response,
      });
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
      const response = yield call(getBrand, payload);
      yield put({
        type: 'getBrands',
        payload: response,
      });
    },
    *addBrand({ payload }, { call, put }) {
      yield call(addBrand, payload);
      const response = yield call(getBrand, { page: payload.pagination });
      yield put({
        type: 'getBrands',
        payload: response,
      });
    },
    *editBrand({ payload }, { call, put }) {
      yield call(updateBrand, payload);
      const response = yield call(getBrand, { page: payload.pagination });
      yield put({
        type: 'getBrands',
        payload: response,
      });
    },
    *deleteBrand({ payload }, { call, put }) {
      yield call(deleteBrand, payload);
      const response = yield call(getBrand, { page: payload.pagination });
      yield put({
        type: 'getBrands',
        payload: response,
      });
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
        const {
          data: {
            // goods_brand: goodsBrand,
            goods_place: goodsPlace,
            // warehouse: warehouseList,
            goods: goodsDetail,
            system_type: systemType,
            goods_class: goodsClass,
          },
        } = response;
        // const goodsBrand = response.data.goods_brand; // 商品品牌
        // const goodsPlace = response.data.goods_place; // 地址
        // const warehouseList = response.data.warehouse; // 仓库
        // const goodsDetail = response.data.goods; // 商品详情
        // const systemType = response.data.system_type; // 默认值
        // const goodType = response.data.goods_class; // 商品类别
        // let type = '';
        // if (payload.type) {
        //   type = Number(payload.type);
        // } else if (payload.goods_id) {
        //   type = Number(goodsDetail.category_id);
        // }
        // const selectType = goodsClass.filter(res => {
        //   return res.class_id === type;
        // });
        // const typeName = `${selectType[0].class_name}`;
        // const AttrArrMap = new Map();
        // const initGoodsAttr = selectType[0].has_many_attr_class;
        // initGoodsAttr.forEach(ele => {
        //   const AttrArr = [];
        //   ele.has_many_attr.forEach(res => {
        //     if (res.status === 0) {
        //       // 筛选调禁用掉的子属性
        //       AttrArr.push(res.value);
        //       AttrArrMap.set(res.id, {
        //         attr_class_id: res.attr_class_id,
        //         attr_id: res.id,
        //         attr_class_name: ele.name,
        //         attr_name: res.value,
        //       });
        //     }
        //   });
        //   ele.AttrArr = AttrArr;
        //   ele.checked = false;
        //   ele.checkArr = [];
        // });
        yield put({
          type: 'init',
          payload: {
            goodsClass,
            // typeName, // 分类名
            // initGoodsAttr,
            // AttrArrMap,
            // brandList: goodsBrand,
            // warehouseList,
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
    *fetchGoods({ payload, callback }, { call, put }) {
      const response = yield call(getAllGoods, payload);
      if (callback && response && response.code === 200) {
        const arr = [];
        response.data.list.forEach(res => {
          if (res.is_check_live) {
            arr.push(res.goods_id);
          }
        });
        callback(arr);
      }
      yield put({
        type: 'show',
        payload: response,
        page: payload.page,
      });
    },
    *editGoodType({ payload }, { call, put }) {
      yield call(editGoodType, payload);
      const response = yield call(getAllType, payload);
      yield put({
        type: 'fetchType',
        payload: response,
      });
    },
    *getAllType({ payload }, { call, put }) {
      const response = yield call(getAllType, payload);
      yield put({
        type: 'fetchType',
        payload: response,
      });
    },
    *addGoodType({ payload }, { call, put }) {
      yield call(addGoodType, payload);
      const response = yield call(getAllType, payload);
      yield put({
        type: 'fetchType',
        payload: response,
      });
    },
    *delGoodType({ payload }, { call, put }) {
      yield call(delGoodType, payload);
      const response = yield call(getAllType, payload);
      yield put({
        type: 'fetchType',
        payload: response,
      });
    },
    *getAllAttr({ payload }, { call, put }) {
      const response = yield call(getAttrList, payload) || {};
      yield put({
        type: 'fetchAttr',
        payload: response,
      });
    },
    *addGoodAttr({ payload }, { call, put }) {
      yield call(addGoodAttr, payload);
      const response = yield call(getAttrList);
      yield put({
        type: 'fetchAttr',
        payload: response,
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
        payload: response,
      });
    },
  },

  reducers: {
    initSku(state) {
      return {
        ...state,
        skuInputArr: [],
      }
    },
    deleteSku(state, { payload }) {
      const { inx, index } = payload;
      const { skuInputArr, goodsDetail } = state;
      let { attrTable, attrTableCacheArr } = state;
      if (typeof index === 'number') {
        const { val } = skuInputArr[inx];
        val.splice(index, 1);
        skuInputArr[inx].val = val;
      } else {
        skuInputArr.splice(inx, 1);
      }
      const arr = [];
      skuInputArr.forEach(res => {
        if (res.val && res.val.length) {
          arr.push(res.val);
        }
      });
      // const skuArr = arr.length ? arrayCombination(arr) : [];
      const skuArrs = arr.length ? arrayCombination(arr, 1) : [];
      attrTableCacheArr = deepCopy(attrTable);
      attrTable = skuArrs.map((res, index) => {
        const cache = attrTableCacheArr[index];
        const resSku = res.split('|,|').join('');
        if (cache) {
          return {
            ...cache,
            sku_goods_name: resSku,
            skuName: res,
          }
        }
        return {
          id: index,
          sku_goods_name: resSku,
          goods_sku_sn: '',
          skuName: res,
          price: goodsDetail.sell_goods_price || 0,
          group_price: goodsDetail.group_price || 0,
          cost_price: goodsDetail.cost_price || 0,
          fileList: [],
          store_nums: 0,
          weight: goodsDetail.weight || 0,
        }
      })
      // console.log(attrTable);
      // console.log(skuInputArr);
      return {
        ...state,
        skuInputArr,
        attrTable,
        attrTableCacheArr,
      };
    },
    addSpec(state) {
      const { skuInputArr } = state;
      skuInputArr.push({key: '', val: []});
      return {
        ...state,
        skuInputArr,
      };
    },
    addSpecSon(state, { payload }) {
      const { skuInputArr } = state;
      skuInputArr[payload].val.push('');
      return {
        ...state,
        skuInputArr,
      };
    },
    setSkuArrVal(state, { payload }) {
      const { skuInputArr, goodsDetail } = state;
      const { inx, index, val } = payload;
      let { attrTable, attrTableCacheArr } = state;
      if (typeof index === 'number') {
        skuInputArr[inx].val[index] = val;
      } else {
        skuInputArr[inx].key = val;
      }
      const arr = [];
      skuInputArr.forEach(res => {
        if (res.val && res.val.length) {
          arr.push(res.val);
        }
      });
      // const skuArr = arr.length ? arrayCombination(arr) : [];
      const skuArrs = arr.length ? arrayCombination(arr, 1) : [];
      attrTableCacheArr = deepCopy(attrTable);
      attrTable = skuArrs.map((res, index) => {
        const cache = attrTableCacheArr[index];
        const resSku = res.split('|,|').join('');
        if (cache) {
          return {
            ...cache,
            sku_goods_name: resSku,
            skuName: res,
          }
        }
        // console.log(goodsDetail.store_nums);
        // console.log(goodsDetail.goods_total_inventory);
        return {
          id: index,
          // sku: res,
          sku_goods_name: resSku,
          goods_sku_sn: '',
          skuName: skuArrs[index],
          price: goodsDetail.sell_goods_price || 0,
          group_price: goodsDetail.group_price || 0,
          cost_price: goodsDetail.cost_price || 0,
          fileList: [],
          store_nums: 0,
          weight: goodsDetail.weight || 0,
        }
      })
      return {
        ...state,
        skuInputArr,
        attrTable,
        attrTableCacheArr,
      };
    },
    fetchFreights(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        freightList: data,
      };
    },
    changeFormVals(state, { payload }) {
      let { goodsDetail } = state;
      const { obj } = payload;
      // if (obj.profit_type === 0 || obj.profit_type === 1) {
      //   if (levelPartial.length) {
      //     levelPartial = levelPartial.map(res => {
      //       goodsDetail[`level_${res.id}`] = 0;
      //       res.value = 0;
      //       return res;
      //     });
      //   }
      //   if (levelPartialSon.length) {
      //     levelPartialSon = levelPartialSon.map(res => {
      //       res.value = 0;
      //       return res;
      //     });
      //   }
      // }
      goodsDetail = {
        ...goodsDetail,
        ...obj,
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
      const { goodsDetail } = state;
      const { levelPartial, levelPartialSon } = state;
      const {
        profit_type: profitType,
        cost_price: costPrice,
        sell_goods_price: sellGoodsPrice,
      } = goodsDetail;
      const id = payload.index;
      const { value } = payload;
      const levelPartialArr = deepCopy(levelPartial);
      const levelPartialSonArr = deepCopy(levelPartialSon);
      levelPartialArr.forEach(res => {
        if (res.id === id) {
          res.value = value;
        }
      });
      if (profitType === 1) {
        levelPartialSonArr.forEach(res => {
          if (res.id === id) {
            res.value = value;
          }
        });
      } else {
        levelPartialSonArr.forEach(res => {
          if (res.id === id) {
            res.value = Number(
              (((sellGoodsPrice || 0) - (costPrice || 0)) * value / 100).toFixed(2)
            );
          }
        });
      }
      return {
        ...state,
        levelPartial: levelPartialArr,
        levelPartialSon: levelPartialSonArr,
      };
    },
    changeTypePartials(state, { payload }) {
      return {
        ...state,
        typePartial: payload.e,
      };
    },
    getBrands(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        brandList: data.list,
        brandListPage: {
          pageSize: data.page,
          total: data.total,
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
      const { initGoodsAttr, AttrArrMap, goodsDetail, attrTableCache } = state;
      let arr = [];
      initGoodsAttr[payload.index].checkArr = payload.checkedList;
      const attrData = initGoodsAttr.filter(res => {
        return res.checked;
      });
      toGet(
        arr,
        attrData,
        AttrArrMap,
        goodsDetail.sell_goods_price,
        goodsDetail.goods_sn,
        goodsDetail.weight,
        goodsDetail.cost_price,
        goodsDetail.group_price
      );
      arr = arr.map(res => {
        const arr = attrTableCache[res.id];
        return arr ? arr : res;
      });
      return {
        ...state,
        initGoodsAttr,
        attrTable: arr,
      };
    },
    checkeds(state, { payload }) {
      const { initGoodsAttr, AttrArrMap, goodsDetail, attrTableCache } = state;
      let arr = [];
      initGoodsAttr[payload.index].checked = !initGoodsAttr[payload.index].checked;
      const attrData = initGoodsAttr.filter(res => {
        return res.checked;
      });
      toGet(
        arr,
        attrData,
        AttrArrMap,
        goodsDetail.sell_goods_price,
        goodsDetail.goods_sn,
        goodsDetail.weight,
        goodsDetail.cost_price,
        goodsDetail.group_price
      );
      arr = arr.map(res => {
        const arr = attrTableCache[res.id];
        return arr ? arr : res;
      });
      return {
        ...state,
        initGoodsAttr,
        attrTable: arr,
      };
    },
    init(state, { payload }) {
      // 初始化
      const levelPartial = [];
      let levelPartialSon = [];
      let totalPrice = 0;
      const { systemType } = payload;
      let { goodsDetail } = payload;
      systemType.user_levels.forEach(res => {
        levelPartial.push({
          id: res.id,
          name: res.name,
          value: '',
        });
        levelPartialSon.push({
          id: res.id,
          name: res.name,
          value: '',
        });
      });
      let attrTable = [];
      const uploadGoodsImg = [];
      const skuInputArr = [];
      let typePartial = 0; // 分佣类型
      if (goodsDetail.goods_id) {
        goodsDetail.xxx = '1';
        goodsDetail.shipping_template_id = goodsDetail.goods_shipping_template_id;
        goodsDetail.has_shop_goods_attr_class.forEach(res => {
          const arr = [];
          const arrId = [];
          res.has_shop_goods_attr.forEach(ele => {
            arr.push(ele.value);
            arrId.push(ele.id);
          })
          skuInputArr.push({
            key: res.name,
            val: arr,
            id: arrId,
          })
        });
        const arrSkus = [];
        const arrSkuId = [];
        skuInputArr.forEach(res => {
          if (res.val && res.val.length) {
            arrSkus.push(res.val);
            arrSkuId.push(res.id);
          }
        });
        const skuArrs = arrSkus.length ? arrayCombination(arrSkus, 1) : [];
        const skuArrId = arrSkuId.length ? arrayCombination(arrSkuId, 1) : [];
        attrTable = skuArrs.map((res, index) => {
          const resSku = res.split('|,|').join('');
          return {
            id: index,
            sku_goods_name: resSku,
            goods_sku_sn: '',
            skuName: res,
            price: goodsDetail.sell_goods_price || 0,
            group_price: goodsDetail.group_price || 0,
            cost_price: goodsDetail.cost_price || 0,
            fileList: [],
            store_nums: 0,
            weight: goodsDetail.weight || 0,
          }
        })
        const skuComparedObj = {}; // 做对比
        goodsDetail.has_shop_goods_sku.forEach(res => {
          let str = '';
          res.has_shop_goods_sku_attr.forEach((ele, index) => {
            if (index) {
              str += `|,|${ele.attr_id}`;
            } else {
              str +=ele.attr_id;
            }
          });
          skuComparedObj[str] = res;
        });
        skuArrId.forEach((res, index) => {
          const skuCompared = skuComparedObj[res];
          attrTable[index].price = skuCompared.price;
          attrTable[index].group_price = skuCompared.group_price;
          attrTable[index].cost_price = skuCompared.cost_price;
          attrTable[index].store_nums = skuCompared.store_nums;
          attrTable[index].weight = skuCompared.weight;
          const img = skuCompared.has_shop_goods_img;
          if (img.length) {
            attrTable[index].fileList = [{
              img: img[0].http_url,
              url: img[0].http_url,
              status: 'done',
              uploaded: 'done',
              response: { status: 'success' },
              name: img[0].create_time,
              uid: img[0].create_time,
            }]
          }
        });
        // const arrId = new Set();
        // const arrSonId = new Set();
        // const goodSku = new Map(); // 用于做对比
        // payload.goodsDetail.has_shop_goods_sku.forEach(res => {
        //   const AttrIdSet = new Set();
        //   res.has_shop_goods_sku_attr.forEach(ele => {
        //     arrId.add(ele.attr_class_id);
        //     arrSonId.add(ele.attr_id);
        //     AttrIdSet.add(ele.attr_id);
        //   });
        //   const arrAttrId = [...AttrIdSet];
        //   goodSku.set(arrAttrId, res);
        // });
        // payload.initGoodsAttr.forEach(res => {
        //   if (arrId.has(res.id)) {
        //     res.checked = true;
        //   }
        //   res.has_many_attr.forEach(ele => {
        //     if (arrSonId.has(ele.id)) {
        //       res.checkArr.push(ele.value);
        //     }
        //   });
        // });
        // 分佣代码
        totalPrice = goodsDetail.sell_goods_price - goodsDetail.cost_price;
        // let cache = {};
        goodsDetail.has_shop_goods_profit.forEach(res => {
          if (res.status === 0) {
            goodsDetail[`level_${res.level}`] = res.profit_value;
            typePartial = res.profit_type;
            // cache[res.level] = res.profit_value;
            levelPartial.forEach(ele => {
              if (ele.id === res.level) {
                ele.value = res.profit_value;
              }
            });
          }
        });
        goodsDetail.profit_type = typePartial;
        levelPartialSon = deepCopy(levelPartial);
        if (typePartial === 0) {
          levelPartialSon = levelPartialSon.map(res => {
            res.value = (res.value * totalPrice / 100).toFixed(2);
            return res;
          });
        }
        // const attrData = payload.initGoodsAttr.filter(res => {
        //   return res.checked;
        // });
        // toGet(
        //   attrTable,
        //   attrData,
        //   payload.AttrArrMap,
        //   goodsDetail.sell_goods_price,
        //   goodsDetail.goods_sn,
        //   goodsDetail.weight,
        //   goodsDetail.cost_price,
        //   goodsDetail.group_price
        // );
        // if (attrTable.length) {
        //   attrTable.forEach(res => {
        //     for (const [key, value] of goodSku) {
        //       if (isContained(key, res.attrIdArr)) {
        //         res.goods_sku_sn = value.goods_sku_sn;
        //         res.price = value.price;
        //         res.cost_price = value.cost_price;
        //         res.group_price = value.group_price;
        //         res.weight = value.weight;
        //         res.store_nums = value.store_nums;
        //         let cacheArr = {};
        //         res.profit = deepCopy(levelPartialSon);
        //         // 两个数组匹配
        //         res.profit.forEach(v => {
        //           cacheArr[v.id] = v;
        //         });
        //         value.has_shop_goods_sku_profit.forEach(v => {
        //           if (cacheArr[v.level]) {
        //             cacheArr[v.level].value = v.profit_value;
        //           }
        //         });
        //         res.values = {};
        //         res.profit.forEach(ele => {
        //           res.values[ele.id] = ele.value;
        //         });
        //         cacheArr = null;
        //         const img = value.has_shop_goods_img[0];
        //         res.img = value.has_shop_goods_img.length ? img.http_url : '';
        //         res.sku_goods_name = value.sku_goods_name;
        //         res.flag = 1;
        //         // res.goods_sku_attr = deepCopy(value.has_shop_goods_sku_attr);
        //         // console.log(11)
        //         // console.log(res)
        //         // console.log(value)
        //         value.has_shop_goods_sku_attr.forEach(ele => {
        //           res[`sku_attr_name_${ele.attr_class_id}`] = ele.attr_value;
        //         });
        //         if (res.img) {
        //           res.fileList = [
        //             {
        //               img: img.http_url,
        //               url: img.http_url,
        //               status: 'done',
        //               uploaded: 'done',
        //               response: { status: 'success' },
        //               name: img.create_time,
        //               uid: img.create_time,
        //             },
        //           ];
        //         }
        //       }
        //     }
        //   });
        //   attrTable = attrTable.filter(res => {
        //     return res.flag;
        //   });
        // }
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
        goodsDetail.goods_shelves_time = moment(goodsDetail.goods_shelves_time * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        );
      }
      if (goodsDetail.upgrade_type) {
        const { has_freeze_commission: freezeData } = goodsDetail;
        goodsDetail = {
          ...goodsDetail,
          ...freezeData,
        }
      }
      goodsDetail.profit_type = goodsDetail.profit_type || 0;
      payload.goodsDetail = goodsDetail;
      return {
        ...state,
        ...payload,
        levelPartial,
        levelPartialSon,
        totalPrice,
        skuInputArr,
        uploadGoodsImg,
        attrTable,
        typePartial,
      };
    },
    show(state, { payload, page }) {
      // state.menuList = payload;
      const { data } = payload;
      return {
        ...state,
        goodsList: data.list,
        goodsListPage: {
          pageSize: data.page,
          current: page,
          total: data.total,
        },
      };
    },
    fetchType(state, { payload }) {
      let { data } = payload;
      data = data.map(res => {
        if (res.has_category.length) {
          res.children = res.has_category;
        }
        return res;
      });
      // state.menuList = payload;
      return {
        ...state,
        goodType: data,
      };
    },
    fetchAttr(state, { payload }) {
      // state.menuList = payload;
      const { data } = payload;
      const { list, total, page } = data;
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
