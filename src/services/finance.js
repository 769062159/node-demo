import request from '../utils/request';

// 账户列表
export async function getAccountList(params) {
  return request('/admin/account/lists', {
    method: 'POST',
    body: params,
  });
}

// 账户详情
export async function getAccountDetail(params) {
  return request('/admin/account/detail', {
    method: 'POST',
    body: params,
  });
}

// 提现列表
export async function getWithdrawList(params) {
    return request('/admin/withdraw/list', {
      method: 'POST',
      body: params,
    });
}

// 同意/拒绝提现
export async function updateWithdraw(params) {
    return request('/admin/withdraw/update', {
      method: 'POST',
      body: params,
    });
}


