import request from '../utils/request';

// 所有广告
export async function getAds(params) {
  return request('/merchant/ads/list', {
    method: 'POST',
    body: params,
  });
}

// 广告创建
export async function addAds(params) {
  return request('/merchant/ads/create', {
    method: 'POST',
    body: params,
  });
}

// 广告删除
export async function deleteAds(params) {
  return request('/merchant/ads/delete', {
    method: 'POST',
    body: params,
  });
}

// 广告更新
export async function updateAds(params) {
  return request('/merchant/ads/update', {
    method: 'POST',
    body: params,
  });
}

// 所有首页
export async function getHome(params) {
  return request('/merchant/index/list', {
    method: 'POST',
    body: params,
  });
}

// 首页创建
export async function addHome(params) {
  return request('/merchant/index/create', {
    method: 'POST',
    body: params,
  });
}

// 首页删除
export async function deleteHome(params) {
  return request('/merchant/index/delete', {
    method: 'POST',
    body: params,
  });
}

// 首页更新
export async function updateHome(params) {
  return request('/merchant/index/update', {
    method: 'POST',
    body: params,
  });
}

// 首页详情
export async function homeDetail(params) {
  return request('/merchant/index/detail', {
    method: 'POST',
    body: params,
  });
}
