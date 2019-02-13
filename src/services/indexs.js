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

// 活动页列表
export async function getActiveList(params) {
  return request('/merchant/landpage/list', {
    method: 'POST',
    body: params,
  });
}

// 删除活动页
export async function delActive(params) {
  return request('/merchant/landpage/delete', {
    method: 'POST',
    body: params,
  });
}

// 设置活动页
export async function setActivePage(params) {
  return request('/merchant/landpage/set', {
    method: 'POST',
    body: params,
  });
}

// 活动页详情
export async function activeDetail(params) {
  return request('/merchant/landpage/get', {
    method: 'POST',
    body: params,
  });
}

// 修改活动页详情
export async function editActiveDetail(params) {
  return request('/merchant/landpage/update', {
    method: 'POST',
    body: params,
  });
}

// 轮播图需要显示的小程序
export async function bindBanner(params) {
  return request('/merchant/index/bind', {
    method: 'POST',
    body: params,
  });
}

// 获取小程序列表
export async function getBanner(params) {
  return request('/merchant/index/wechat-accounts', {
    method: 'POST',
    body: params,
  });
}