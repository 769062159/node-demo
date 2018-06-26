import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '账户未登陆或者登陆过期。',
  401: '登陆过期',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录。',
  405: '获取登陆信息失败，请重新登陆',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}
const apiurl = 'http://hlsj.test.seastart.cn';
// const apiurl = "";

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  const newUrl = apiurl + url;
  const failTime = localStorage.getItem('failTime');
  let token = localStorage.getItem('token');
  // console.log(token);
  // console.log(failTime);
  if (url !== '/admin/login' && failTime < new Date().getTime()) {
    let nowToken = await fetch(`${apiurl}/admin/updatetoken`, {
      method: 'post',
      headers: {
        mode: 'no-cors',
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
    });
    nowToken = nowToken.json();
    await nowToken.then(res => {
      if (res.code === 200) {
        const { token: nowTokens } = res.data;
        token = nowTokens;
        localStorage.setItem('token', token);
        localStorage.setItem('failTime', res.data.expired_time * 1000);
      } else if (res.code === 400 || res.code === 404 || res.code === 405) {
        localStorage.setItem('token', '');
        const { dispatch } = store;
        dispatch(routerRedux.push('/user/login'));
      }
    });
  }

  // const defaultOptions = {
  //   credentials: 'include',
  // };
  const newOptions = { ...options };
  newOptions.headers = {
    Accept: 'application/json',
    mode: 'no-cors',
    Authorization: `Bearer ${token}`,
    // 'Authorization': '',
    // 'JOKE': 'seastartmall!',
    // 'Device': 'xcx',
    // 'AppID': 'wxbfd3fb865c4ae400',
    // 'content-type': 'application/x-www-form-urlencoded',
  };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        mode: 'no-cors',
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        // Authorization: `Bearer ${token}`,
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        mode: 'no-cors',
        Accept: 'application/json',
        // Authorization: `Bearer ${token}`,
        ...newOptions.headers,
      };
    }
  }
  return fetch(newUrl, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const status = e.name;
      const { dispatch } = store;
      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      if (status === 405) {
        dispatch(routerRedux.push('/user/login'));
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}
