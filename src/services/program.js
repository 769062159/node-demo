import request from '../utils/request';

// 创建小程序
export async function addProgram(params) {
  return request('/wx/wechataccount/create', {
    method: 'POST',
    body: params,
  });
}

// 小程序列表
export async function getProgramList(params) {
  return request('/wx/wechataccount/list', {
    method: 'POST',
    body: params
  });
}

// 获取授权地址
export async function getAuthorizationUrl(params) {
  return request('/wx/authorization/url', {
    method: 'POST',
    body: params,
  });
}

//  删除小程序
export async function deleteProgram(params) {
  return request('/wx/wechataccount/delete', {
    method: 'POST',
    body: params,
  });
}

//  小程序账号详情
export async function getProgramDetail(params) {
  return request('/wx/wechataccount/detail', {
    method: 'POST',
    body: params,
  });
}

//  修改小程序账号详情
export async function editProgramDetail(params) {
  return request('/wx/wechataccount/update', {
    method: 'POST',
    body: params,
  });
}

//  查看小程序绑定的开放平台
export async function getWxOpen(params) {
  return request('/wx/open/get', {
    method: 'POST',
    body: params,
  });
}

//  绑定小程序到开放平台
export async function bindWxOpen(params) {
  return request('/wx/open/bind', {
    method: 'POST',
    body: params,
  });
}

//  解除绑定小程序到开放平台
export async function unbindWxOpen(params) {
  return request('/wx/open/unbind', {
    method: 'POST',
    body: params,
  });
}

//  修改小程序
export async function updateProgram(params) {
  return request('/wx/wechataccount/update', {
    method: 'POST',
    body: params,
  });
}
