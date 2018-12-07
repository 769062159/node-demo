import request from '../utils/request';

/**
 * 实名认证列表
 * string name
 * string user_id
 * number page
 * number page_number
 * */
export async function verifyList(params) {
  return request('/merchant/verify/list', {
    method: 'POST',
    body: params,
  });
}

/**
 * 修改用户认证情况
 * string verify_id
 * number status 1 通过 2 拒绝
 * string remark
 * */
export async function updateVerify(params) {
  return request('/merchant/verify/update', {
    method: 'POST',
    body: params,
  });
}
