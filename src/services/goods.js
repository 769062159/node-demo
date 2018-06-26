import request from '../utils/request';

// 所有商品
export async function getAllGoods(params) {
  return request('/admin/goods/list', {
    method: 'POST',
    body: params,
  });
}

// 商品分类修改
export async function editGoodType(params) {
  return request('/admin/goods/class/update', {
    method: 'POST',
    body: params,
  });
}

// 所有商品分类
export async function getAllType(params) {
  return request('/admin/goods/class/lists', {
    method: 'POST',
    body: params,
  });
}

// 创建商品分类
export async function addGoodType(params) {
  return request('/admin/goods/class/create', {
    method: 'POST',
    body: params,
  });
}

// 分类删除
export async function delGoodType(params) {
  return request('/admin/goods/class/delete', {
    method: 'POST',
    body: params,
  });
}

// 属性增加 修改 删除  后台合并了
export async function addGoodAttr(params) {
  return request('/admin/goods/attr/create', {
    method: 'POST',
    body: params,
  });
}

// 属性列表
export async function getAttrList(params) {
  return request('/admin/goods/attr/lists', {
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
  return request('/admin/goods/init', {
    method: 'POST',
    body: params,
  });
}

// 初始化商品数据
export async function addGood(params) {
  return request('/admin/goods/create', {
    method: 'POST',
    body: params,
  });
}

// 品牌列表
export async function getBrand(params) {
  return request('/admin/goods/brand/lists', {
    method: 'POST',
    body: params,
  });
}

// 品牌创建
export async function addBrand(params) {
  return request('/admin/goods/brand/create', {
    method: 'POST',
    body: params,
  });
}

// 品牌删除
export async function deleteBrand(params) {
  return request('/admin/goods/brand/delete', {
    method: 'POST',
    body: params,
  });
}

// 品牌更新
export async function updateBrand(params) {
  return request('/admin/goods/brand/update', {
    method: 'POST',
    body: params,
  });
}

// 品牌更新
export async function getBrandDetail(params) {
  return request('/admin/goods/brand/detail', {
    method: 'POST',
    body: params,
  });
}
