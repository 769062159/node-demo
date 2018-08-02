import request from '../utils/request';

// 创建小程序
export async function addProgram(params) {
  return request('/wx/wechataccount/create', {
    method: 'POST',
    body: params,
  });
}

// 小程序列表
export async function getProgramList() {
  return request('/wx/wechataccount/list', {
    method: 'POST',
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
