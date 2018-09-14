import { createElement } from 'react';
import dynamic from 'dva/dynamic';
// import pathToRegexp from 'path-to-regexp';

let routerConfigCache;
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
    '/dashboard/analysis': {
      identity: 'common',
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/monitor': {
      identity: 'common',
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
      identity: 'common',
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
        import('../routes/Dashboard/Workplace')
      ),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
    },
    '/form/basic-form': {
      identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    },
    '/form/step-form': {
      identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    },
    '/form/step-form/info': {
      identity: 'common',
      // name: '分步表单（填写转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
      identity: 'common',
      // name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      identity: 'common',
      // name: '分步表单（完成）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
      identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    '/list/table-list': {
      identity: 'common',
      component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    },
    '/list/basic-list': {
      identity: 'common',
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/card-list': {
      identity: 'common',
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    },
    '/list/search': {
      identity: 'common',
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
      identity: 'common',
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
      identity: 'common',
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      identity: 'common',
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/profile/basic': {
      identity: 'common',
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    },
    '/profile/advanced': {
      identity: 'common',
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/AdvancedProfile')
      ),
    },
    '/result/success': {
      identity: 'common',
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      identity: 'common',
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
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
    '/market/background': {
      component: dynamicWrapper(app, ['config'], () => import('../routes/Index/Background')),
    },
    '/market/carousel': {
      component: dynamicWrapper(app, ['indexs'], () => import('../routes/Index/Carousel')),
    },
    '/market/live-sale': {
      component: dynamicWrapper(app, ['indexs'], () => import('../routes/Index/LiveSale')),
    },
    '/market/hot-sale': {
      component: dynamicWrapper(app, ['indexs'], () => import('../routes/Index/HotSale')),
    },
    // 直播
    '/live/list': {
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/list')),
    },
    '/live/vod': {
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/Vod')),
    },
    '/live/add-live': {
      identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Live/AddLive')),
    },
    '/live/add-live/confirm': {
      identity: 'common',
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/AddLive/Step2')),
    },
    '/live/add-live/result': {
      identity: 'common',
      component: dynamicWrapper(app, ['live'], () => import('../routes/Live/AddLive/Step3')),
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
    '/finance/withdraw': {
      component: dynamicWrapper(app, ['finance'], () => import('../routes/Finance/Withdraw')),
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
    '/logistics/warehouse': {
      component: dynamicWrapper(app, ['logistics', 'address'], () =>
        import('../routes/Logistics/Warehouse')
      ),
    },
    // 商品
    '/good/good-list': {
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/GoodsList')),
    },
    '/good/good-type': {
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/GoodsType')),
    },
    '/good/good-attr': {
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/GoodsAttr')),
    },
    '/good/good-brand': {
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/GoodBrand')),
    },
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
      // name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/EditGoods/Step2')),
    },
    '/good/edit-goods/result': {
      identity: 'common',
      // name: '分步表单（完成）',
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/EditGoods/Step3')),
    },
    // 用户相关信息
    '/users/group': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/Demo/Group')),
    },
    '/users/role/:id': {
      component: dynamicWrapper(app, ['user', 'menu'], () => import('../routes/Demo/Roles')),
    },
    '/users/user-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Demo/UserList')),
    },
    // 路由配置
    '/router/menu-list': {
      component: dynamicWrapper(app, ['menu'], () => import('../routes/Demo/MenuList')),
    },
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
        // uploadUrl: 'http://api.store.314live.cn/merchant/upload', // 正式全局上传图片路径
        uploadUrl: 'http://dev-api.store.314live.cn/merchant/upload', // 测试全局上传图片路径
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
