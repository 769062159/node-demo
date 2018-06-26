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
    '/front-users/front-user-list': {
      identity: 'common',
      component: dynamicWrapper(app, ['frontUser'], () =>
        import('../routes/FrontUsers/FrontUserList')
      ),
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
    // 首页 广告
    '/index/ads': {
      component: dynamicWrapper(app, ['indexs'], () => import('../routes/index/ads')),
    },
    // 直播
    '/live/list': {
      component: dynamicWrapper(app, ['live'], () => import('../routes/live/list')),
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
      component: dynamicWrapper(app, ['form'], () => import('../routes/Goods/StepForm')),
    },
    '/good/add-goods/info': {
      identity: 'common',
      // name: '分步表单（填写转账信息）',
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/StepForm/Step1')),
    },
    '/good/add-goods/confirm/:type': {
      identity: 'common',
      // name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/StepForm/Step2')),
    },
    '/good/add-goods/result': {
      identity: 'common',
      // name: '分步表单（完成）',
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/StepForm/Step3')),
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
    '/users/menu-add': {
      component: dynamicWrapper(app, ['menu'], () => import('../routes/Demo/DemoTwo')),
    },
    '/users/user-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Demo/DemoThree')),
    },
    '/users/menu-list': {
      component: dynamicWrapper(app, ['menu'], () => import('../routes/Demo/MenuList')),
    },
    '/user': {
      identity: 'common',
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
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
