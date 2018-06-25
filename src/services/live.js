import request from '../utils/request';

// 所有直播间
export async function getLive(params) {
  return request('/admin/live/list', {
    method: 'POST',
    body: params,
  });
}

// 直播创建
export async function addLive(params) {
  return request('/admin/live/create', {
    method: 'POST',
    body: params,
  });
}

// 直播删除
export async function deleteLive(params) {
  return request('/admin/live/delete', {
    method: 'POST',
    body: params,
  });
}

// 直播更新
export async function updateLive(params) {
  return request('/admin/live/update', {
    method: 'POST',
    body: params,
  });
}
