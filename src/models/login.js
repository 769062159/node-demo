import { routerRedux } from 'dva/router';
import { fakeAccountLogin, fakeAccountLogout } from '../services/api';
import { setToken, setTokenExpired } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      payload.mobile = payload.user_name;
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response) {
        // console.log(response);
        const failTime = response.data.expired_time * 1000;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('failTime', failTime);
        // reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { call, put }) {
      try {
        const response = yield call(fakeAccountLogout, 'out');
        console.log(response);
        if (response) {
          localStorage.removeItem('token');
          // get location pathname
          // const urlParams = new URL(window.location.href);
          // const pathname = yield select(state => state.routing.location.pathname);
          // add the parameters in the url
          // urlParams.searchParams.set('redirect', pathname);
          // window.history.replaceState(null, 'login', urlParams.href);
        }
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const { data } = payload;
      if (data) {
        setToken(data.token);
      } else {
        setTokenExpired();
      }
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
