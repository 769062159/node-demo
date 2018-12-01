import request from '../utils/request';

// 账户列表
export async function getAccountList(params) {
  return request('/merchant/account/lists', {
    method: 'POST',
    body: params,
  });
}

// 账户详情
export async function getAccountDetail(params) {
  return request('/merchant/account/detail', {
    method: 'POST',
    body: params,
  });
}

// 提现列表
export async function getWithdrawList(params) {
  return request('/merchant/withdraw/list', {
    method: 'POST',
    body: params,
  });
}

// 同意/拒绝提现
export async function updateWithdraw(params) {
  return request('/merchant/withdraw/update', {
    method: 'POST',
    body: params,
  });
}

// 提现列表
export async function getRefundList(params) {
  return request('/merchant/order/refund/list', {
    method: 'POST',
    body: params,
  });
}

// 修改提现状态
export async function editRefundStatus(params) {
  return request('/merchant/order/refund/update/status', {
    method: 'POST',
    body: params,
  });
}

// 修改退款金额
export async function editRefundMoney(params) {
  return request('/merchant/order/refund/update/money', {
    method: 'POST',
    body: params,
  });
}

// 设置提现配置
export async function setWithdrawConfig(params) {
  return request('/merchant/withdraw/config/set', {
    method: 'POST',
    body: params,
  });
}

// 获取提现配置
export async function getWithdrawConfig(params) {
  return request('/merchant/withdraw/config/get', {
    method: 'POST',
    body: params,
  });
}