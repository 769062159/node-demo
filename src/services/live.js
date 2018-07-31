import request from '../utils/request';

// 所有直播间
export async function getLive(params) {
  return request('/merchant/live/list', {
    method: 'POST',
    body: params,
  });
}

// 直播创建
export async function addLive(params) {
  return request('/merchant/live/create', {
    method: 'POST',
    body: params,
  });
}

// 直播详情
export async function getLiveDetail(params) {
  return request('/merchant/live/detail', {
    method: 'POST',
    body: params,
  });
}

// 直播删除
export async function deleteLive(params) {
  return request('/merchant/live/delete', {
    method: 'POST',
    body: params,
  });
}

// 直播更新
export async function updateLive(params) {
  return request('/merchant/live/update', {
    method: 'POST',
    body: params,
  });
}

// 所有录播
export async function getVod(params) {
  return request('/merchant/vod/list', {
    method: 'POST',
    body: params,
  });
}

// 录播详情
export async function getVodDetail(params) {
  return request('/merchant/vod/detail', {
    method: 'POST',
    body: params,
  });
}

// 录播详情修改
export async function updateVodDetail(params) {
  return request('/merchant/vod/update', {
    method: 'POST',
    body: params,
  });
}
