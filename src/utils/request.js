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
  if (!((response.status >= 501 && response.status <= 505) || (response.status >= 400 && response.status <= 403) || (response.status >= 405 && response.status <= 406))) {
    response.json().then(res => {
      notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: res.data,
        duration: 10,
      });
    })
  }
  const errortext = codeMessage[response.status] || response.statusText;
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

const { apiurl } = process.env[process.env.API_ENV];
// const apiurl = 'http://dev.shiqun.api.iyov.io'; // 测试接口
// const apiurl = 'http://shiqun.api.iyov.io'; // 正式接口
const wxapiurl = 'http://wechat.shiqun.iyov.io';
// const apiurl = "";

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  let newUrl = '';
  if (url.indexOf('/wx/') === 0 ) {
    newUrl = wxapiurl + url;
  } else {
    newUrl = apiurl + url;
  }
  const failTime = localStorage.getItem('failTime');
  let token = localStorage.getItem('token');
  // console.log(token);
  // console.log(failTime);
  const nowDate = new Date().getTime() - 60 * 60 * 1000;
  if (url !== '/merchant/login' && failTime < nowDate) {
    let nowToken = await fetch(`${apiurl}/merchant/updatetoken`, {
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
      } else if (res.code === 400) {
        localStorage.setItem('token', '');
        const { dispatch } = store;
        dispatch(routerRedux.push('/user/login'));
      }
    });
  }

  // const defaultOptions = {
  //   credentials: 'include',
  // };
  if (options.body instanceof Object) {
    const { body } = options;
    for(const [key, value] of Object.entries(body)){
      if (typeof value === 'string') {
        body[key] = value.trim();
      }
    }
    options.body = body;
  }
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
      const data = response.json();
      return data;
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
      if (( status > 500 && status <= 505 ) || ( status >= 400 && status < 404 ) || ( status > 404 && status < 407 )) {
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
      if (status >= 404 && status < 417) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}
