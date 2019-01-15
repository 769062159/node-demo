import { createElement } from 'react';
import dynamic from 'dva/dynamic';
// import pathToRegexp from 'path-to-regexp';

let routerConfigCache;
const { uploadUrl } = process.env[process.env.API_ENV];
/**
 * *
 * @description 通过自定义的module是否存在于命名空间，不存在就require让它存在于命名空间中
 * app._models就是所有的models  =>{effects, namespace, reducers, state, subscriptions}
 *
 */
const modelNotExisted = (app, model) => {
  return !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });
};

export const getRouterConfig = app => {
  const routerConfig = {
    '/': {
      identity: 'root',
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    // 统计
    '/statistics/analysis': {
      component: dynamicWrapper(app, ['statistics'], () =>
        import('../routes/Statistics/Analysis')
      ),
    },
    '/front-users/front-user-list': {
      identity: 'common',
      component: dynamicWrapper(app, ['frontUser'], () =>
        import('../routes/FrontUsers/FrontUserList')
      ),
    },
    '/front-users/rank': {
      identity: 'common',
      component: dynamicWrapper(app, ['frontUser'], () => import('../routes/FrontUsers/Rank')),
    },
    '/exception/403': {
      identity: 'common',
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      identity: 'common',
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      identity: 'common',
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      identity: 'common',
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    // 小视频
    '/video/auditor': {
      identity: 'common',
      component: dynamicWrapper(app, ['video'], () => import('../routes/Video/Auditor')),
    },
    '/video/failed': {
      identity: 'common',
      component: dynamicWrapper(app, ['video'], () => import('../routes/Video/Failed')),
    },
    '/video/pass': {
      identity: 'common',
      component: dynamicWrapper(app, ['video'], () => import('../routes/Video/Pass')),
    },
    '/video/review': {
      identity: 'common',
      component: dynamicWrapper(app, ['video'], () => import('../routes/Video/Review')),
    },
    // 门店
    '/shop/add-store': {
      identity: 'common',
      component: dynamicWrapper(app, ['shop'], () => import('../routes/Shop/AddStore')),
    },
    '/shop/write-off': {
      identity: 'common',
      component: dynamicWrapper(app, ['shop'], () => import('../routes/Shop/WriteOff')),
    },
    '/shop/edit-store/:id': {
      identity: 'common',
      component: dynamicWrapper(app, ['shop'], () => import('../routes/Shop/EditStore')),
    },
    '/shop/store': {
      identity: 'common',
      component: dynamicWrapper(app, ['shop'], () => import('../routes/Shop/Store')),
    },
    // 首页 广告 营销
    '/market/AddForm/:type': {
      component: dynamicWrapper(app, ['indexs'], () => import('../routes/Index/AddForm')),
    },
    '/market/EditForm/:id': {
      component: dynamicWrapper(app, ['indexs'], () => import('../routes/Index/EditForm')),
    },
    '/market/phone': {
      component: dynamicWrapper(app, ['config'], () => import('../routes/Index/Background')),
    },
    '/market/carousel': {
      component: dynamicWrapper(app, ['indexs'], () => import('../routes/Index/Carousel')),
    },
    '/market/active': {
      component: dynamicWrapper(app, ['indexs'], () => import('../routes/Index/Active')),
    },
    '/market/activ-add': {
      component: dynamicWrapper(app, ['indexs'], () => import('../routes/Index/ActiveAdd')),
    },
    '/market/hot-sale': {
      component: dynamicWrapper(app, ['indexs'], () => import('../routes/Index/HotSale')),
    },
    // 社群
    '/community/certification': {
      component: dynamicWrapper(app, ['protocol'], () => import('../routes/Community/Certification')),
    },
    '/community/contract': {
      component: dynamicWrapper(app, ['protocol'], () => import('../routes/Community/Contract')),
    },
    // '/community/small-video': {
    //   component: dynamicWrapper(app, ['live'], () => import('../routes/Community/SmallVideo')),
    // },
    '/community/small-video-add': {
      component: dynamicWrapper(app, ['live'], () => import('../routes/Community/SmallVideoAdd')),
    },
    '/community/class-add': {
      component: dynamicWrapper(app, ['classModel'], () => import('../routes/Community/ClassAdd')),
    },
    '/community/class-edit/:id': {
      component: dynamicWrapper(app, ['classModel'], () => import('../routes/Community/ClassEdit')),
    },
    '/community/class-list': {
      component: dynamicWrapper(app, ['classModel'], () => import('../routes/Community/List')),
    },
    '/community/community-list': {
      component: dynamicWrapper(app, ['live'], () => import('../routes/Community/CommunityList')),
    },
    '/community/edit-live': {
      identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Community/EditLive')),
    },
    '/community/edit-live/confirm/:id': {
      identity: 'common',
      component: dynamicWrapper(app, ['live'], () => import('../routes/Community/EditLive/Step2')),
    },
    '/community/edit-live/result': {
      identity: 'common',
      component: dynamicWrapper(app, ['live'], () => import('../routes/Community/EditLive/Step3')),
    },
    '/community/add-live': {
      identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Live/AddLive')),
    },
    '/community/add-live/confirm': {
      identity: 'common',
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/AddLive/Step2')),
    },
    '/community/add-live/result': {
      identity: 'common',
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/AddLive/Step3')),
    },
    // 直播
    '/live/small-video': {
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/SmallVideo')),
    },
    '/live/small-video-add': {
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/SmallVideoAdd')),
    },
    '/live/class-add': {
      component: dynamicWrapper(app, ['classModel'], () => import('../routes/Class/ClassAdd')),
    },
    '/live/class-edit/:id': {
      component: dynamicWrapper(app, ['classModel'], () => import('../routes/Class/ClassEdit')),
    },
    '/live/class-list': {
      component: dynamicWrapper(app, ['classModel'], () => import('../routes/Class/List')),
    },
    '/live/add-video': {
      identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Live/AddVod')),
    },
    '/live/add-video/confirm': {
      identity: 'common',
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/AddVod/Step2')),
    },
    '/live/add-video/result': {
      identity: 'common',
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/AddVod/Step3')),
    },
    '/live/edit-live': {
      identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Live/EditLive')),
    },
    '/live/edit-live/confirm/:id': {
      identity: 'common',
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/EditLive/Step2')),
    },
    '/live/edit-live/result': {
      identity: 'common',
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/EditLive/Step3')),
    },
    '/live/edit-vod': {
      identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Live/EditVod')),
    },
    '/live/edit-vod/confirm/:id': {
      identity: 'common',
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/EditVod/Step2')),
    },
    '/live/edit-vod/result': {
      identity: 'common',
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/EditVod/Step3')),
    },
    // 首页配置
    '/configuration/background': {
      component: dynamicWrapper(app, ['config'], () =>
        import('../routes/Configuration/Background')
      ),
    },
    // 财务
    '/finance/account': {
      component: dynamicWrapper(app, ['finance'], () => import('../routes/Finance/Account')),
    },
    '/finance/protocols': {
      component: dynamicWrapper(app, ['protocol'], () => import('../routes/Goods/Protocols')),
    },
    '/finance/withdraw': {
      component: dynamicWrapper(app, ['finance'], () => import('../routes/Finance/Withdraw')),
    },
    '/finance/withdraw-setting': {
      component: dynamicWrapper(app, ['finance'], () => import('../routes/Finance/Setting')),
    },
    '/finance/detail/:id': {
      component: dynamicWrapper(app, ['finance'], () => import('../routes/Finance/Detail')),
    },
    // 售后服务
    '/saled/refund': {
      component: dynamicWrapper(app, ['finance'], () => import('../routes/Finance/Refund')),
    },
    // 订单
    '/order/list': {
      component: dynamicWrapper(app, ['order', 'address'], () => import('../routes/Order/list')),
    },
    '/order/group-list': {
      component: dynamicWrapper(app, ['order', 'address'], () => import('../routes/Order/groupList')),
    },
    '/order/group-list-online': {
      component: dynamicWrapper(app, ['order', 'address'], () => import('../routes/Order/groupListOnline')),
    },
    '/order/order-detail/:id': {
      component: dynamicWrapper(app, ['order'], () => import('../routes/Order/OrderDetail')),
    },
    '/order/group-detail/:id': {
      component: dynamicWrapper(app, ['order'], () => import('../routes/Order/GroupDetail')),
    },
    // 物流
    '/logistics/freight': {
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Logistics/Freight')),
    },
    // '/logistics/warehouse': {
    //   component: dynamicWrapper(app, ['logistics', 'address'], () =>
    //     import('../routes/Logistics/Warehouse')
    //   ),
    // },
    // 商品
    '/good/good-list': {
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/GoodsList')),
    },
    '/good/protocol': {
      component: dynamicWrapper(app, ['protocol'], () => import('../routes/Goods/Protocol')),
    },
    '/good/protocols': {
      component: dynamicWrapper(app, ['protocol'], () => import('../routes/Goods/Protocolss')),
    },
    '/good/good-list-review': {
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/GoodsListReview')),
    },
    '/good/good-type': {
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/GoodsType')),
    },
    // '/good/good-attr': {
    //   component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/GoodsAttr')),
    // },
    // '/good/good-brand': {
    //   component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/GoodBrand')),
    // },
    '/good/add-goods': {
      identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Goods/AddGoods')),
    },
    // '/good/add-goods/info': {
    //   identity: 'common',
    //   component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/AddGoods/Step1')),
    // },
    '/good/add-goods/confirm': {
      identity: 'common',
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/AddGoods/Step2')),
    },
    '/good/add-goods/result': {
      identity: 'common',
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/AddGoods/Step3')),
    },
    '/good/edit-goods': {
      identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Goods/EditGoods')),
    },
    // '/good/edit-goods/info': {
    //   identity: 'common',
    //   // name: '分步表单（填写转账信息）',
    //   component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/EditGoods/Step1')),
    // },
    '/good/edit-goods/confirm/:id': {
      identity: 'common',
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/EditGoods/Step2')),
    },
    '/good/edit-goods/result': {
      identity: 'common',
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/EditGoods/Step3')),
    },
    // 用户相关信息
    // '/users/group': {
    //   component: dynamicWrapper(app, ['user'], () => import('../routes/Demo/Group')),
    // },
    // '/users/role/:id': {
    //   component: dynamicWrapper(app, ['user', 'menu'], () => import('../routes/Demo/Roles')),
    // },
    // '/users/user-list': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Demo/UserList')),
    // },
    // 路由配置
    // '/router/menu-list': {
    //   component: dynamicWrapper(app, ['menu'], () => import('../routes/Demo/MenuList')),
    // },
    // 我的小程序
    '/my-program/my': {
      component: dynamicWrapper(app, ['program'], () => import('../routes/Myprogram/My')),
    },
    '/my-program/setting/:id': {
      component: dynamicWrapper(app, ['program'], () => import('../routes/Myprogram/Setting')),
    },
    '/user': {
      identity: 'common',
      component: dynamicWrapper(app, ['frontUser'], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      identity: 'common',
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      identity: 'common',
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      identity: 'common',
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
  };

  const { _store } = app;
  _store.dispatch({
    type: 'global/saveRouterConfig',
    payload: routerConfig,
  });

  return routerConfig;
};

// wrapper of dynamic
function dynamicWrapper(app, models, component) {
  // () => require('module')
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      // 动态设置请求，循环发送请求，如果没有请求就发送
      if (modelNotExisted(app, model)) {
        app.model(require(`../models/${model}`).default);
      }
    });
    // props => { history, location, match, staticContext }
    return props => {
      if (!routerConfigCache) {
        routerConfigCache = getRouterConfig(app);
      }
      return createElement(component().default, {
        ...props,
        routerConfig: routerConfigCache,
        uploadUrl,
        // uploadUrl: 'http://api.store.314live.cn/merchant/upload', // 正式全局上传图片路径
        // uploadUrl: 'http://dev-api.store.314live.cn/merchant/upload', // 测试全局上传图片路径
        imgUrl: 'http://314live.image.alimmdn.com', // 测试图片前缀
        // imgUrl: 'http://314live.image.alimmdn.com/', // 测试
        uploadFile: 'http://wechat.store.314live.cn/wx/wechataccount/upload', // 证书上传
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}`)),
    // add routerData prop
    component: () => {
      if (!routerConfigCache) {
        routerConfigCache = getRouterConfig(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerConfig: routerConfigCache,
          });
      });
    },
  });
}
