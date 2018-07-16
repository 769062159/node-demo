import request from '../utils/request';

// 所有前台用户
export async function getFrontUserList(params) {
  return request('/admin/member/list', {
    method: 'POST',
    body: params,
  });
}

// 用户等级列表
export async function getUserRankList(params) {
  return request('/admin/member/levels', {
    method: 'POST',
    body: params,
  });
}

// 添加用户等级
export async function addUserRank(params) {
  return request('/admin/member/level/create', {
    method: 'POST',
    body: params,
  });
}

// 修改用户等级
export async function updateUserRank(params) {
  return request('/admin/member/level/update', {
    method: 'POST',
    body: params,
  });
}

// 删除用户等级
export async function delUserRank(params) {
  return request('/admin/member/level/delete', {
    method: 'POST',
    body: params,
  });
}

// 修改用户上级
export async function updateUpLevel(params) {
  return request('/admin/member/update/referee', {
    method: 'POST',
    body: params,
  });
}

// 修改用户等级
export async function updateMemberLevel(params) {
  return request('/admin/member/update/level', {
    method: 'POST',
    body: params,
  });
}
