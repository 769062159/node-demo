import request from '../utils/request';

// 订单列表
export async function getOrderList(params) {
  return request('/admin/order/list', {
    method: 'POST',
    body: params,
  });
}

// 快递列表
export async function getExpressList() {
    return request('/admin/order/express/list', {
      method: 'POST',
    });
}

// 发货
export async function shipshop(params) {
    return request('/admin/order/deliver', {
      method: 'POST',
      body: params,
    });
}
