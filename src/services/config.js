import request from '../utils/request';

// 系统配置
export async function getConfig(params) {
  return request('/merchant/config/index', {
    method: 'POST',
    body: params,
  });
}

// 系统配置保存
export async function addConfig(params) {
  return request('/merchant/config/save', {
    method: 'POST',
    body: params,
  });
}

// 名片配置
export async function getCardConfig(params) {
  return request('/merchant/config/card/get', {
    method: 'POST',
    body: params,
  });
}
// 名片配置保存
export async function saveCardConfig(params) {
  return request('/merchant/config/card/save', {
    method: 'POST',
    body: params,
  });
}
