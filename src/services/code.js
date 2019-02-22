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