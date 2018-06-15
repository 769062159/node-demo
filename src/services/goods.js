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

// 属性增加
export async function addGoodAttr(params) {
  return request('/goods/attr/create', {
    method: 'POST',
    body: params,
  });
}

// 属性列表
export async function getAttrList(params) {
  return request('/goods/attr/lists', {
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