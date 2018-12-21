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

/**
 * 设置用户协议
 * user-verify
 * string id_card_pic_front
 * string id_card_pic_back
 * string id_card_pic_hand
 * string agreement 富文本
 * */
export async function setProtocol(params) {
  return request('/merchant/verify/set/agreement', {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取用户协议
 * */
export async function getProtocol(params) {
  return request('/merchant/verify/get/agreement', {
    method: 'POST',
    body: params,
  });
}

/**
 * 协议设置
 * */
export async function setMerchantAgr(params) {
  return request('/merchant/agreement/index', {
    method: 'POST',
    body: params,
  });
}

/**
 * 协议获取
 * */
export async function getMerchantAgr(params) {
  return request(`/merchant/agreement/get`, {
    method: 'POST',
    body: params,
  });
}
