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
  return request('/merchant/code-config/unlock-code/goods/set', {
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

//获取升级码变动记录
export async function getUpgradeChangeList(params) {
  return request('/merchant/code-config/upgrade-code/record/paginate', {
    method: 'POST',
    body:params
  });
}

//获取解锁码变动记录
export async function getUnlockChangeList(params) {
  return request('/merchant/code-config/unlock-code/record/paginate', {
    method: 'POST',
    body:params
  });
}

//手动为用户创建升级码
export async function createUpgradeCode(params) {
  return request('/merchant/code-config/upgrade-code/recharge', {
    method: 'POST',
    body:params
  });
}

//手动为用户创建解锁码
export async function createUnlockCode(params) {
  return request('/merchant/code-config/unlock-code/recharge', {
    method: 'POST',
    body:params
  });
}
