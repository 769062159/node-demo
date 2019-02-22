import request from '../utils/request';

// 所有前台用户
export async function getFrontUserList(params) {
  return request('/merchant/member/list', {
    method: 'POST',
    body: params,
  });
}

// 用户等级列表
export async function getUserRankList(params) {
  return request('/merchant/member/levels', {
    method: 'POST',
    body: params,
  });
}

// 添加用户等级
export async function addUserRank(params) {
  return request('/merchant/member/level/create', {
    method: 'POST',
    body: params,
  });
}

// 修改用户等级
export async function updateUserRank(params) {
  return request('/merchant/member/level/update', {
    method: 'POST',
    body: params,
  });
}

// 删除用户等级
export async function delUserRank(params) {
  return request('/merchant/member/level/delete', {
    method: 'POST',
    body: params,
  });
}

// 修改用户上级
export async function updateUpLevel(params) {
  return request('/merchant/member/update/referee', {
    method: 'POST',
    body: params,
  });
}

// 修改用户等级
export async function updateMemberLevel(params) {
  return request('/merchant/member/update/level', {
    method: 'POST',
    body: params,
  });
}

// 设置默认用户
export async function setDefaultId(params) {
  return request('/merchant/member/set/default', {
    method: 'POST',
    body: params,
  });
}

// 获取默认用户
export async function getDefault(params) {
  return request('/merchant/member/get/default', {
    method: 'POST',
    body: params,
  });
}

// 商户设置
export async function merchantSetting(params) {
  return request('/merchant/member/set/shop', {
    method: 'POST',
    body: params,
  });
}

// 商户权限设置
export async function updatePower(params) {
  return request('/merchant/member/update/shop', {
    method: 'POST',
    body: params,
  });
}

// 更改佣金
export async function updateCommssion(params) {
  return request('/merchant/member/commission/update', {
    method: 'POST',
    body: params,
  });
}

// 设置授权码
export async function setAuthorCode(params) {
  return request('/merchant/member/author-code', {
    method: 'POST',
    body: params,
  });
}

// 获取授权码
export async function getCodeNum(params) {
  return request('/merchant/member/authorcode/index', {
    method: 'POST',
    body: params,
  });
}

// 获取记录
export async function getRecord(params) {
  return request('/merchant/member/operation/log/list', {
    method: 'POST',
    body: params,
  });
}