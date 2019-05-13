import request from '../utils/request';

// 获取授权码配置
export async function getConfigCode(params) {
  return request('/merchant/config/authorcode', {
    method: 'POST',
    body: params,
  });
}

// 授权码的配置保存
export async function saveCodeConfig(params) {
  return request('/merchant/config/authorcode/save', {
    method: 'POST',
    body: params,
  });
}

// 授权码支付日志
export async function getCodeLog(params) {
  return request('/merchant/authorcode/pay/logs', {
    method: 'POST',
    body: params,
  });
}

// 用户授权码列表
export async function getUserCode(params) {
  return request('/merchant/authorcode/user/list', {
    method: 'POST',
    body: params,
  });
}

// 用户授权详情
export async function getUserDetail(params) {
  return request('/merchant/authorcode/user/detail', {
    method: 'POST',
    body: params,
  });
}

// 用户授权码详情列表盟主 1 群主 2 店主 3
export async function getCodeList(params) {
  return request('/merchant/authorcode/type/list', {
    method: 'POST',
    body: params,
  });
}