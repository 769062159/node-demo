import request from '../utils/request';

// 所有商品
export async function getAllGoods(params) {
  return request('/merchant/goods/list', {
    method: 'POST',
    body: params,
  });
}

// 商品分类修改
export async function editGoodType(params) {
  return request('/merchant/goods/class/update', {
    method: 'POST',
    body: params,
  });
}

// 所有商品分类
export async function getAllType(params) {
  return request('/merchant/goods/class/lists', {
    method: 'POST',
    body: params,
  });
}

// 创建商品分类
export async function addGoodType(params) {
  return request('/merchant/goods/class/create', {
    method: 'POST',
    body: params,
  });
}

// 分类删除
export async function delGoodType(params) {
  return request('/merchant/goods/class/delete', {
    method: 'POST',
    body: params,
  });
}

// 属性增加 修改 删除  后台合并了
export async function addGoodAttr(params) {
  return request('/merchant/goods/attr/create', {
    method: 'POST',
    body: params,
  });
}

// 属性列表
export async function getAttrList(params) {
  return request('/merchant/goods/attr/lists', {
    method: 'POST',
    body: params,
  });
}

// 属性修改
export async function editGoodAttr(params) {
  return request('/goods/attr/update', {
    method: 'POST',
    body: params,
  });
}

// 初始化商品数据
export async function initGoodAttr(params) {
  return request('/merchant/goods/init', {
    method: 'POST',
    body: params,
  });
}

// 初始化商品数据
export async function addGood(params) {
  return request('/merchant/goods/create', {
    method: 'POST',
    body: params,
  });
}

// 品牌列表
export async function getBrand(params) {
  return request('/merchant/goods/brand/lists', {
    method: 'POST',
    body: params,
  });
}

// 品牌创建
export async function addBrand(params) {
  return request('/merchant/goods/brand/create', {
    method: 'POST',
    body: params,
  });
}

// 品牌删除
export async function deleteBrand(params) {
  return request('/merchant/goods/brand/delete', {
    method: 'POST',
    body: params,
  });
}

// 品牌更新
export async function updateBrand(params) {
  return request('/merchant/goods/brand/update', {
    method: 'POST',
    body: params,
  });
}

// 品牌更新
export async function getBrandDetail(params) {
  return request('/merchant/goods/brand/detail', {
    method: 'POST',
    body: params,
  });
}

// 创建运费模版
export async function addFreight(params) {
  return request('/merchant/goods/freight/create', {
    method: 'POST',
    body: params,
  });
}

// 删除运费模版
export async function delFreight(params) {
  return request('/merchant/goods/freight/delete', {
    method: 'POST',
    body: params,
  });
}

// 运费模版列表
export async function getFreightList(params) {
  return request('/merchant/goods/freight/list', {
    method: 'POST',
    body: params,
  });
}

// 更新运费模版
export async function updateFreight(params) {
  return request('/merchant/goods/freight/update', {
    method: 'POST',
    body: params,
  });
}

// 上架或者下架
export async function obtainedGood(params) {
  return request('/merchant/goods/batch/update', {
    method: 'POST',
    body: params,
  });
}
