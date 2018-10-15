import request from '../utils/request';

// 删除视频
export async function deleteVideo(params) {
  return request('/merchant/vod/video/delete', {
    method: 'POST',
    body: params,
  });
}
