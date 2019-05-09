import request from '../utils/request';

// 系统配置
export async function getConfig(params) {
  return request('/merchant/config/index', {
    method: 'POST',
    body: params,
  });
}

// 系统配置保存
export async function addConfig(params) {
  return request('/merchant/config/save', {
    method: 'POST',
    body: params,
  });
}

// 名片配置
export async function getCardConfig(params) {
  return request('/merchant/config/card/get', {
    method: 'POST',
    body: params,
  });
}
// 名片配置保存
export async function saveCardConfig(params) {
  return request('/merchant/config/card/save', {
    method: 'POST',
    body: params,
  });
}

// 获取关联商品开关
export async function getVideoGoodsConfigPower(params) {
  return request('/merchant/config/video-goods/power/get', {
    method: 'POST',
    body: params,
  });
}
// 设置关联商品开关
export async function setVideoGoodsConfigPower(params) {
  return request('/merchant/config/video-goods/power/set', {
    method: 'POST',
    body: params,
  });
}

// 获取关联商品列表
export async function getVideoGoodsConfigList(params) {
  return request('/merchant/config/video-goods/list', {
    method: 'POST',
    body: params,
  });
}
// 添加关联商品列表
export async function createVideoGoodsConfig(params) {
  return request('/merchant/config/video-goods/add', {
    method: 'POST',
    body: params,
  });
}
// 删除关联商品列表
export async function deleteVideoGoodsConfig(params) {
  return request('/merchant/config/video-goods/remove', {
    method: 'POST',
    body: params,
  });
}

// 获取随机直播间配置
export async function getVideoLiveConfig() {
  return request('/merchant/config/video-live-config/get', {
    method: 'GET',
  });
}

// 更新随机方式
export async function updateStatusConfig(params) {
  return request('/merchant/config/video-live-config/updatetype', {
    method: 'POST',
    body: params,
  });
}

export async function checkLiveRoom(params) {
  return request('/merchant/config/video-live-config/checkliveroom', {
    method: 'POST',
    body: params,
  });
}



