import request from '../utils/request';

// 分页获取大区列表 page, pagesize, key
export function getAreaList(qs) {
  return request('/merchant/operate/area/paginate', {
    method: 'GET',
    qs,
  });
}

// 删除大区 id
export function delArea(body) {
  return request('/merchant/operate/area/delete', {
    method: 'POST',
    body,
  });
}

// 修改大区信息 id, name, provinces[]
export function updateArea(body) {
  return request('/merchant/operate/area/update', {
    method: 'POST',
    body,
  });
}

// 创建大区 name, provinces
export function createArea(body) {
  return request('/merchant/operate/area/create', {
    method: 'POST',
    body,
  });
}

// 分页获取职位列表 page, pagesize, key
export function getPositionList(qs) {
  return request('/merchant/operate/position/paginate', {
    method: 'GET',
    qs,
  });
}

// 删除职位 id
export function delPosition(body) {
  return request('/merchant/operate/position/delete', {
    method: 'POST',
    body,
  });
}

// 修改职位信息 id, name, provinces[]
export function updatePosition(body) {
  return request('/merchant/operate/position/update', {
    method: 'POST',
    body,
  });
}

// 创建职位 name, provinces
export function createPosition(body) {
  return request('/merchant/operate/position/create', {
    method: 'POST',
    body,
  });
}

// 获取省份列表
export function getAllProvinces() {
  return request('/merchant/operate/region/list', {
    method: 'GET',
  });
}

// 获取所有职位
export function getAllPositions() {
  return request('/merchant/operate/position/list', {
    method: 'GET',
  });
}

// 获取运营中心列表 page, pagesize, key, status
export function getCenterList(qs) {
  return request('/merchant/operate/paginate', {
    method: 'GET',
    qs,
  });
}

// 审核同意中心申请 id, mark, position_id
export function acceptCenterApplication(body) {
  return request('/merchant/operate/accept', {
    method: 'POST',
    body,
  });
}

// 审核驳回中心申请 id, mark
export function refuseCenterApplication(body) {
  return request('/merchant/operate/refuse', {
    method: 'POST',
    body,
  });
}

// 获取地域信息
export function getRegions(qs) {
  return request('/merchant/operate/recommend/region/list', {
    method: 'GET',
    qs,
  });
}

// 设置已代理区域
export function updateAlreadyProxyAreas(body) {
  return request('/merchant/operate/recommend/already/set', {
    method: 'POST',
    body,
  });
}

// 设置可代理区域
export function updateProxyableAreas(body) {
  return request('/merchant/operate/recommend/freeze/set', {
    method: 'POST',
    body,
  });
}

// 已代理区域列表
export function getAlreadyProxyAreas(qs) {
  return request('/merchant/operate/recommend/already/list', {
    method: 'GET',
    qs,
  });
}

// 可代理区域列表
export function getProxyableAreas(qs) {
  return request('/merchant/operate/recommend/freeze/list', {
    method: 'GET',
    qs,
  });
}
