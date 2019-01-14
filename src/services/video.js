import request from '../utils/request';

// 更新审核员任职
export async function updateMember(params) {
  return request('/merchant/auditor/update', {
    method: 'POST',
    body: params,
  });
}

// 审核员列表
export async function getMember(params) {
  return request('/merchant/auditor/list', {
    method: 'POST',
    body: params,
  });
}

// 添加审核员列表
export async function addMember(params) {
  return request('/merchant/auditor/create', {
    method: 'POST',
    body: params,
  });
}

// 小视频列表
// page_number 一页的数量
// page 页数
// status 0 待审核 1 审核通过 2 审核未通过
export async function videoList(params) {
  return request('/merchant/auditor/video/list', {
    method: 'POST',
    body: params,
  });
}