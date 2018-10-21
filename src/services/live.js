import request from '../utils/request';

// 所有直播间
export async function getLive(params) {
  return request('/merchant/live/list', {
    method: 'POST',
    body: params,
  });
}

// 直播创建
export async function addLive(params) {
  return request('/merchant/live/create', {
    method: 'POST',
    body: params,
  });
}

// 直播详情
export async function getLiveDetail(params) {
  return request('/merchant/live/detail', {
    method: 'POST',
    body: params,
  });
}

// 直播删除
export async function deleteLive(params) {
  return request('/merchant/live/delete', {
    method: 'POST',
    body: params,
  });
}

// 直播更新
export async function updateLive(params) {
  return request('/merchant/live/update', {
    method: 'POST',
    body: params,
  });
}

// 所有录播
export async function getVod(params) {
  return request('/merchant/vod/list', {
    method: 'POST',
    body: params,
  });
}

// 录播详情
export async function getVodDetail(params) {
  return request('/merchant/vod/video/detail', {
    method: 'POST',
    body: params,
  });
}

// 录播详情修改
export async function updateVodDetail(params) {
  return request('/merchant/vod/video/update', {
    method: 'POST',
    body: params,
  });
}

// 玩图token
export async function getWanTuToken(params) {
  return request('/merchant/wantu/token', {
    method: 'POST',
    body: params,
  });
}

// 视频列表
export async function getVideoList(params) {
  return request('/merchant/vod/videos', {
    method: 'POST',
    body: params,
  });
}

// 加视频
export async function addVideo(params) {
  return request('/merchant/vod/create', {
    method: 'POST',
    body: params,
  });
}

// 绑定解绑视频
export async function checkSwitch(params) {
  return request('/merchant/live/bind/vods', {
    method: 'POST',
    body: params,
  });
}

// 解绑录播视频
export async function unBindVod(params) {
  return request('/merchant/live/bind/vods', {
    method: 'POST',
    body: params,
  });
}

// 删除视频
export async function deleteVideo(params) {
  return request('/merchant/vod/video/delete', {
    method: 'POST',
    body: params,
  });
}

//  短视频列表
export async function smallVideoList(params) {
  return request('/merchant/video/list', {
    method: 'POST',
    body: params,
  });
}

//  短视频上下架
export async function modifyVideoStatus(params) {
  return request('/merchant/video/update/status', {
    method: 'POST',
    body: params,
  });
}

//  短视频上下架
export async function addSmallVideo(params) {
  return request('/merchant/video/create', {
    method: 'POST',
    body: params,
  });
}

//  直播间绑定商品
export async function bindLiveGood(params) {
  return request('/merchant/live/bind/goods', {
    method: 'POST',
    body: params,
  });
}

//  直播间绑定课程
export async function bindLiveCourse(params) {
  return request('/merchant/live/bind/course', {
    method: 'POST',
    body: params,
  });
}

//  直播间绑定短视频
export async function bindLiveVideo(params) {
  return request('/merchant/live/bind/video', {
    method: 'POST',
    body: params,
  });
}
