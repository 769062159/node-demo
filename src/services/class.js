import request from '../utils/request';

// 添加课程
export async function addClass(params) {
  return request('/merchant/course/create', {
    method: 'POST',
    body: params,
  });
}

// 课程列表
export async function classList(params) {
  return request('/merchant/course/list', {
    method: 'POST',
    body: params,
  });
}

// 单个课程
export async function searchClass(params) {
  return request('/merchant/course/detail', {
    method: 'POST',
    body: params,
  });
}

// 修改课程
export async function updateClass(params) {
  return request('/merchant/course/update', {
    method: 'POST',
    body: params,
  });
}

// 删除课程
export async function deleteClass(params) {
  return request('/merchant/course/delete', {
    method: 'POST',
    body: params,
  });
}

// 获取上传视频列表
export async function getUpload(params) {
  return request('/merchant/video/alimage-list', {
    method: 'POST',
    body: params,
  });
}

// 设置上传视频封面
export async function setUploadImg(params) {
  return request('/merchant/video/snap-shot', {
    method: 'POST',
    body: params,
  });
}