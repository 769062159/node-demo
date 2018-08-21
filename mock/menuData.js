export const menuData = [
  /**
   * @description 动态menu以及伪动态router
   * 		使用identity来控制权限，如果为common就是公用权限，不写则是没有权限=>403页面
   * */
  {
    name: '用户管理',
    icon: 'user',
    path: 'front-users',
    children: [
      {
        name: '用户等级',
        path: 'rank',
      },
      {
        name: '用户列表',
        path: 'front-user-list',
      },
    ],
  },
  // {
  //   name: '系统用户',
  //   icon: 'setting',
  //   path: 'users',
  //   children: [
  //     {
  //       name: '部门角色',
  //       path: 'group',
  //     },
  //     {
  //       name: '管理员',
  //       path: 'user-list',
  //     },
  //   ],
  // },
  // {
  //   name: '路由配置',
  //   icon: 'tool',
  //   path: 'router',
  //   children: [
  //     {
  //       name: '路由列表',
  //       path: 'menu-list',
  //     },
  //   ],
  // },
  {
    name: '商品',
    icon: 'shopgood',
    path: 'good',
    children: [
      {
        name: '商品分类',
        path: 'good-type',
      },
      {
        name: '商品属性',
        path: 'good-attr',
      },
      {
        name: '商品店铺',
        path: 'good-brand',
      },
      {
        name: '商品添加',
        path: 'add-goods',
      },
      {
        name: '商品列表',
        path: 'good-list',
      },
      // {
      //   name: '商品修改',
      //   path: 'edit-goods',
      // },
    ],
  },
  {
    name: '物流',
    icon: 'logistics',
    path: 'logistics',
    children: [
      {
        name: '运费模版',
        path: 'freight',
      },
      {
        name: '仓库',
        path: 'warehouse',
      },
    ],
  },
  {
    name: '首页',
    icon: 'home',
    path: 'market',
    children: [
      {
        name: '轮播图',
        path: 'carousel',
      },
      {
        name: '直播特卖背景',
        path: 'background',
      },
      {
        name: '直播特卖',
        path: 'live-sale',
      },
      {
        name: '热卖商品',
        path: 'hot-sale',
      },
      //   {
      //     name: '广告',
      //     path: 'ads',
      //   },
    ],
  },
  {
    name: '财务',
    icon: 'finance',
    path: 'finance',
    children: [
      {
        name: '佣金',
        path: 'account',
      },
      {
        name: '提现',
        path: 'withdraw',
      },
    ],
  },
  {
    name: '售后服务',
    icon: 'shouhou',
    path: 'saled',
    children: [
      {
        name: '退款审核',
        path: 'refund',
      },
    ],
  },
  {
    name: '订单',
    icon: 'profile',
    path: 'order',
    children: [
      {
        name: '订单列表',
        path: 'list',
      },
    ],
  },
  {
    name: '直播',
    icon: 'video-camera',
    path: 'live',
    children: [
      {
        name: '直播列表',
        path: 'list',
      },
    ],
  },
  {
    name: '门店',
    icon: 'shop',
    path: 'shop',
    children: [
      {
        name: '新建门店',
        path: 'add-store',
      },
      {
        name: '门店列表',
        path: 'store',
      },
    ],
  },
  {
    name: '小程序',
    icon: 'program',
    path: 'my-program',
    children: [
      {
        name: '我的小程序',
        path: 'my',
      },
    ],
  },
  // {
  //   name: 'dashboard',
  //   icon: 'dashboard',
  //   path: 'dashboard',
  //   children: [
  //     {
  //       name: '分析页',
  //       path: 'analysis',
  //     },
  //     {
  //       name: '监控页',
  //       path: 'monitor',
  //     },
  //     {
  //       name: '工作台',
  //       path: 'workplace',
  //     },
  //   ],
  // },
  // {
  //   name: '表单页',
  //   icon: 'form',
  //   path: 'form',
  //   children: [
  //     {
  //       name: '基础表单',
  //       path: 'basic-form',
  //     },
  //     {
  //       name: '分步表单',
  //       path: 'step-form',
  //     },
  //     {
  //       name: '高级表单',
  //       //      authority: 'admin',
  //       path: 'advanced-form',
  //     },
  //   ],
  // },
  // {
  //   name: '列表页',
  //   icon: 'table',
  //   path: 'list',
  //   children: [
  //     {
  //       name: '查询表格',
  //       path: 'table-list',
  //     },
  //     {
  //       name: '标准列表',
  //       path: 'basic-list',
  //     },
  //     {
  //       name: '卡片列表',
  //       path: 'card-list',
  //     },
  //     {
  //       name: '搜索列表',
  //       path: 'search',
  //       children: [
  //         {
  //           name: '搜索列表（文章）',
  //           path: 'articles',
  //         },
  //         {
  //           name: '搜索列表（项目）',
  //           path: 'projects',
  //         },
  //         {
  //           name: '搜索列表（应用）',
  //           path: 'applications',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: '详情页',
  //   icon: 'profile',
  //   path: 'profile',
  //   children: [
  //     {
  //       name: '基础详情页',
  //       path: 'basic',
  //     },
  //     {
  //       name: '高级详情页',
  //       path: 'advanced',
  //       //      authority: 'user',
  //     },
  //   ],
  // },
  // {
  //   name: '结果页',
  //   icon: 'check-circle-o',
  //   path: 'result',
  //   children: [
  //     {
  //       name: '成功',
  //       path: 'success',
  //     },
  //     {
  //       name: '失败',
  //       path: 'fail',
  //     },
  //   ],
  // },
  // {
  //   name: '异常页',
  //   icon: 'warning',
  //   path: 'exception',
  //   children: [
  //     {
  //       name: '403',
  //       path: '403',
  //     },
  //     {
  //       name: '404',
  //       path: '404',
  //     },
  //     {
  //       name: '500',
  //       path: '500',
  //     },
  //     {
  //       name: '触发异常',
  //       path: 'trigger',
  //       hideInMenu: true,
  //     },
  //   ],
  // },
  // {
  //   name: '账户',
  //   icon: 'user',
  //   path: 'user',
  //   //  authority: 'guest',
  //   children: [
  //     {
  //       name: '登录',
  //       path: 'login',
  //     },
  //     {
  //       name: '注册',
  //       path: 'register',
  //     },
  //     {
  //       name: '注册结果',
  //       path: 'register-result',
  //     },
  //   ],
  // },
];
