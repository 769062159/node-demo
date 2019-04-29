export const menuData = [
  /**
   * @description 动态menu以及伪动态router
   * 		使用identity来控制权限，如果为common就是公用权限，不写则是没有权限=>403页面
   * */
  {
    name: '数据分析',
    icon: 'icon-shuju',
    path: 'statistics',
    children: [
      {
        name: '分析台',
        path: 'analysis',
      },
    ],
  },
  {
    name: '用户管理',
    icon: 'icon-iconset0203',
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
      {
        name: '操作记录',
        path: 'record',
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
    icon: 'icon-shangpin',
    path: 'good',
    children: [
      {
        name: '商品分类',
        path: 'good-type',
      },
      // {
      //   name: '商品属性',
      //   path: 'good-attr',
      // },
      // {
      //   name: '商品店铺',
      //   path: 'good-brand',
      // },
      {
        name: '商品添加',
        path: 'add-goods',
      },
      {
        name: '商品列表',
        path: 'good-list',
      },
      {
        name: '审核商品列表',
        path: 'good-list-review',
      },
      {
        name: '群主商品协议',
        path: 'protocol',
      },
      {
        name: '盟主商品协议',
        path: 'protocolss',
      },
      {
        name: '导师商品协议',
        path: 'protocols',
      },
    ],
  },
  {
    name: '物流',
    icon: 'icon-wuliu',
    path: 'logistics',
    children: [
      {
        name: '运费模版',
        path: 'freight',
      },
      // {
      //   name: '仓库',
      //   path: 'warehouse',
      // },
    ],
  },
  {
    name: '首页',
    icon: 'icon-shouye',
    path: 'market',
    children: [
      {
        name: '轮播图',
        path: 'carousel',
      },
      // {
      //   name: '直播特卖',
      //   path: 'live-sale',
      // },
      {
        name: '热卖商品',
        path: 'hot-sale',
      },
      {
        name: '活动页',
        path: 'active',
      },
    ],
  },
  {
    name: '财务',
    icon: 'icon-caiwu',
    path: 'finance',
    children: [
      {
        name: '佣金账户',
        path: 'account',
      },
      {
        name: '佣金明细',
        path: 'account-log',
      },
      {
        name: '提现',
        path: 'withdraw',
      },
      {
        name: '提现设置',
        path: 'withdraw-setting',
      },
      {
        name: '佣金说明',
        path: 'protocols',
      },
    ],
  },
  {
    name: '售后服务',
    icon: 'icon-tubiaolunkuo-',
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
    icon: 'icon-dingdan',
    path: 'order',
    children: [
      {
        name: '订单列表',
        path: 'list',
      },
      {
        name: '线下团购列表',
        path: 'group-list',
      },
      {
        name: '线上团购列表',
        path: 'group-list-online',
      },
    ],
  },
  {
    name: '社群',
    icon: 'icon-zhibo',
    path: 'community',
    children: [
      // {
      //   name: '视频列表',
      //   path: 'small-video',
      // },
      {
        name: '课程列表',
        path: 'class-list',
      },
      {
        name: '社群列表',
        path: 'community-list',
      },
      {
        name: '群主认证',
        path: 'certification',
      },
      {
        name: '认证模版及合同',
        path: 'contract',
      },
    ],
  },
  {
    name: '小视频',
    icon: 'icon-shipin',
    path: 'video',
    children: [
      {
        name: '审核员列表',
        path: 'auditor',
      },
      {
        name: '待审核视频列表',
        path: 'review',
      },
      {
        name: '通过视频列表',
        path: 'pass',
      },
      {
        name: '不合格视频列表',
        path: 'failed',
      },
    ],
  },
  {
    name: '我的',
    icon: 'icon-my-live',
    path: 'live',
    children: [
      {
        name: '视频编辑',
        path: 'small-video',
      },
      {
        name: '课程编辑',
        path: 'class-list',
      },
    ],
  },
  {
    name: '门店',
    icon: 'icon-mendian',
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
      {
        name: '核销员',
        path: 'write-off',
      },
    ],
  },
  {
    name: '小程序',
    icon: 'icon-xiaochengxu',
    path: 'my-program',
    children: [
      {
        name: '我的小程序',
        path: 'my',
      },
    ],
  },
  {
    name: '设置',
    icon: 'icon-shezhi',
    path: 'config',
    children: [
      {
        name: '基础设置',
        path: 'base',
      },
      {
        name: '名片配置',
        path: 'card',
      },
      {
        name: '关联商品配置',
        path: 'video-goods',
      },
    ],
  },
  {
    name: '授权码管理',
    icon: 'icon-ico',
    path: 'code',
    children: [
      {
        name: '用户收款码',
        path: 'user-code',
      },
      {
        name: '收款码',
        path: 'code',
      },
      {
        name: '收款码订单',
        path: 'order',
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
