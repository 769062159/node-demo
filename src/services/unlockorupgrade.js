import request from '../utils/request';

// 获取升级码解锁码配置信息
export async function getCodeInfo() {
  return request('/merchant/code-config/get', {
    method: 'GET'
  });
}
// 设置/创建解锁码规则
export async function setUnlockCode(params) {
  return request('/merchant/code-config/unlock-code/set', {
    method: 'POST',
    body: params,
  });
}

// 设置/创建升级码规则
export async function setUpgradeCode(params) {
  return request('/merchant/code-config/upgrade-code/set', {
    method: 'POST',
    body: params,
  });
}

// 设置解锁码商品配置
export async function setUnlockGoods(params) {
  return request('/merchant/unlock-code/goods/set', {
    method: 'POST',
    body: params,
  });
}


//获取解锁码规则列表
export async function getUnlockTypeList() {
  return request('/merchant/code-config/unlock-code/type/list', {
    method: 'GET'
  });
}
//获取升级码规则列表
export async function getUpgradeTypeList() {
  return request('/merchant/code-config/upgrade-code/type/list', {
    method: 'GET'
  });
}
