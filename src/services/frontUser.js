import request from '../utils/request';

// 所有前台用户
export async function getFrontUserList(params) {
  return request('/admin/member/list', {
    method: 'POST',
    body: params,
  });
}
