import request from '../utils/request';


// 仓库列表
export async function getWarehouseList(params) {
  return request('/admin/warehouse/lists', {
    method: 'POST',
    body: params,
  });
}

// 添加仓库
export async function addWarehouse(params) {
  return request('/admin/warehouse/create', {
    method: 'POST',
    body: params,
  });
}

// 修改仓库
export async function updateWarehouse(params) {
  return request('/admin/warehouse/update', {
    method: 'POST',
    body: params,
  });
}

// 删除仓库
export async function delWarehouse(params) {
  return request('/admin/warehouse/delete', {
    method: 'POST',
    body: params,
  });
}
