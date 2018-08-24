import request from '../utils/request';

// 订单列表
export async function getOrderList(params) {
  return request('/merchant/order/list', {
    method: 'POST',
    body: params,
  });
}

// 快递列表
export async function getExpressList() {
  return request('/merchant/order/express/list', {
    method: 'POST',
  });
}

// 发货
export async function shipshop(params) {
  return request('/merchant/order/deliver', {
    method: 'POST',
    body: params,
  });
}

// 修改发货
export async function editShip(params) {
  return request('/merchant/order/deliver/update', {
    method: 'POST',
    body: params,
  });
}

// 修改发货地址
export async function editAdress(params) {
  return request('/merchant/order/address/update', {
    method: 'POST',
    body: params,
  });
}

// 团购列表
export async function getGroupList(params) {
  return request('/merchant/order/group/list', {
    method: 'POST',
    body: params,
  });
}
