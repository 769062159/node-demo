import request from '../utils/request';

// 订单列表
export async function getOrderList(params) {
  return request('/admin/order/list', {
    method: 'POST',
    body: params,
  });
}
