import request from '../utils/request';

// 所有广告
export async function getAds(params) {
  return request('/admin/ads/list', {
    method: 'POST',
    body: params,
  });
}

// 广告创建
export async function addAds(params) {
  return request('/admin/ads/create', {
    method: 'POST',
    body: params,
  });
}

// 广告删除
export async function deleteAds(params) {
  return request('/admin/ads/delete', {
    method: 'POST',
    body: params,
  });
}

// 广告更新
export async function updateAds(params) {
  return request('/admin/ads/update', {
    method: 'POST',
    body: params,
  });
}

// 所有首页
export async function getHome(params) {
  return request('/admin/index/list', {
    method: 'POST',
    body: params,
  });
}

// 首页创建
export async function addHome(params) {
  return request('/admin/index/create', {
    method: 'POST',
    body: params,
  });
}

// 首页删除
export async function deleteHome(params) {
  return request('/admin/index/delete', {
    method: 'POST',
    body: params,
  });
}

// 首页更新
export async function updateHome(params) {
  return request('/admin/index/update', {
    method: 'POST',
    body: params,
  });
}
