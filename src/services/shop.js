import request from '../utils/request';

// 商户门店创建
export async function addShop(params) {
  return request('/merchant/store/create', {
    method: 'POST',
    body: params,
  });
}

// 商户门店列表
export async function getShopList(params) {
  return request('/merchant/store/index', {
    method: 'POST',
    body: params,
  });
}

// 商户门店删除
export async function delShop(params) {
  return request('/merchant/store/delete', {
    method: 'POST',
    body: params,
  });
}

// 商户门店更新
export async function updateShop(params) {
  return request('/merchant/store/update', {
    method: 'POST',
    body: params,
  });
}

// 商户门店详情
export async function getShopDetail(params) {
  return request('/merchant/store/detail', {
    method: 'POST',
    body: params,
  });
}
