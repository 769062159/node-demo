import request from '../utils/request';

// 所有广告
export async function getAds() {
  return request('/admin/ads/list', {
    method: 'get',
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
