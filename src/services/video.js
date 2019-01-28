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

// 获取拒绝理由
export async function getReasons() {
  return request('/merchant/auditor/reject/reasons', {
    method: 'POST',
  });
}

// 更新视频
// video_id 视频id
// status  1 审核通过 2 审核拒绝
// reason 原因
export async function updateVideo(params) {
  return request('/merchant/auditor/video/update', {
    method: 'POST',
    body: params,
  });
}

// 更新视频点赞数
// video_id 视频id
// parise_num  点赞数
export async function addLike(params) {
  return request('/merchant/video/update', {
    method: 'POST',
    body: params,
  });
}
