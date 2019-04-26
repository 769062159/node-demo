import request from '../utils/request';

// 商户门店创建
export async function getStatistics(params) {
  return request('/merchant/analysis/statistics', {
    method: 'POST',
    body: params,
  });
}
// 商户门店创建
export async function getDayStatistics(params) {
  return request('/merchant/analysis/statistics/day', {
    method: 'POST',
    body: params,
  });
}