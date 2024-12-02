import { Layout } from '@/utils/routerHelper';

const { t } = useI18n();
/**
 * redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
 hidden: true              当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)

 alwaysShow: true          当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
 只有一个时，会将那个子路由当做根路由显示在侧边栏，
 若你想不管路由下面的 children 声明的个数都显示你的根路由，
 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
 一直显示根路由(默认 false)

 title: 'title'            设置该路由在侧边栏和面包屑中展示的名字

 icon: 'svg-name'          设置该路由的图标

 noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)

 breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)

 affix: true               如果设置为true，则会一直固定在tag项中(默认 false)

 noTagsView: true          如果设置为true，则不会出现在tag中(默认 false)

 activeMenu: '/dashboard'  显示高亮的路由路径

 followAuth: '/dashboard'  跟随哪个路由进行权限过滤

 canTo: true               设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)
 }
 **/
const remainingRouter: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/homeIndex',
    name: 'Home',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/Home/base.vue'),
        name: 'Index',
        meta: {
          title: t('router.home'),
          icon: 'ep:home-filled',
          noCache: false,
          affix: true
        }
      },
      {
        path: 'checkVideo',
        component: () => import('@/views/checkVideo/index.vue'),
        name: 'CheckVideo',
        meta: {
          title: '实时视频',
          hidden: true
        }
      },
      {
        path: 'ly',
        component: () => import('@/views/layoutGenerator/index.vue'),
        name: 'LayoutGenerator',
        meta: {
          title: 'LayoutGenerator',
          hidden: true
        }
      },
      {
        path: 'DOPrediction',
        name: 'DOPrediction',
        component: () => import('@/views/agriculture/DOPrediction/index.vue'),
        meta: {
          hidden: true,
          title: '溶解氧预警与调控模型'
        }
      },
      {
        path: 'growthCycle',
        name: 'growthCycle',
        component: () => import('@/views/agriculture/categorymanagement/growthCycle.vue'),
        meta: {
          hidden: true,
          title: '生长周期'
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'UserInfo',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/Profile/Index.vue'),
        name: 'Profile',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:user',
          title: t('common.profile')
        }
      },
      {
        path: 'notify-message',
        component: () => import('@/views/system/notify/my/index.vue'),
        name: 'MyNotifyMessage',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:message',
          title: '我的站内信'
        }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    name: 'dict',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'type/data/:dictType',
        component: () => import('@/views/system/dict/data/index.vue'),
        name: 'SystemDictData',
        meta: {
          title: '字典数据',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/system/dict'
        }
      }
    ]
  },

  {
    path: '/codegen',
    component: Layout,
    name: 'CodegenEdit',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'edit',
        component: () => import('@/views/infra/codegen/EditTable.vue'),
        name: 'InfraCodegenEditTable',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '修改生成配置',
          activeMenu: 'infra/codegen/index'
        }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    name: 'JobL',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'job-log',
        component: () => import('@/views/infra/job/logger/index.vue'),
        name: 'InfraJobLog',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '调度日志',
          activeMenu: 'infra/job/index'
        }
      }
    ]
  },
  ...['/mingyue', '/shuangqiao', '/erdu', '/tianyin', '/taiyuan'].map((subItem) => ({
    path: subItem + '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: subItem,
    meta: { hidden: true }
  })),
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/three',
    component: () => import('@/views/three/index.vue'),
    name: 'Three',
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/page',
    component: () => import('@/views/page/index.vue'),
    name: 'Page',
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/inspurHome',
    component: () => import('@/views/portal/home/index.vue'),
    name: 'InspurHome',
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/sso',
    component: () => import('@/views/Login/components/SSOLogin.vue'),
    name: 'SSOLogin',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/social-login',
    component: () => import('@/views/Login/SocialLogin.vue'),
    name: 'SocialLogin',
    meta: {
      hidden: true,
      title: t('router.socialLogin'),
      noTagsView: true
    }
  },
  {
    path: '/403',
    component: () => import('@/views/Error/403.vue'),
    name: 'NoAccess',
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFound',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/500',
    component: () => import('@/views/Error/500.vue'),
    name: 'Error',
    meta: {
      hidden: true,
      title: '500',
      noTagsView: true
    }
  },
  {
    path: '/mobile-trace',
    name: 'MobileTrace',
    component: () => import('@/views/agriculture/tracetemplate/mobile.vue'),
    meta: { hidden: true }
  },
  {
    path: '/bigscreen',
    name: 'bigscreen',
    component: () => import('@/views/bigscreen/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreen2',
    name: 'bigscreen2',
    component: () => import('@/views/bigscreen2/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreen3',
    name: 'bigscreen3',
    component: () => import('@/views/bigscreen3/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreen4',
    name: 'bigscreen4',
    component: () => import('@/views/bigscreen4/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreen5',
    name: 'bigscreen5',
    component: () => import('@/views/bigscreen5/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreen6',
    name: 'bigscreen6',
    component: () => import('@/views/bigscreenYouyang/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenShuangQiao',
    name: 'bigscreenShuangQiao',
    component: () => import('@/views/bigscreenShuangQiao/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenYouyang',
    name: 'bigscreenYouyang',
    component: () => import('@/views/bigscreenYouyang/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreen7',
    name: 'bigscreen7',
    component: () => import('@/views/bigscreen7/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreen8',
    name: 'bigscreen8',
    component: () => import('@/views/bigscreen8/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreen9',
    name: 'bigscreen9',
    component: () => import('@/views/bigscreen9/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreen10',
    name: 'bigscreen10',
    component: () => import('@/views/bigscreen10/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenWF',
    name: 'bigscreenWF',
    component: () => import('@/views/bigscreenWenfeng/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenBB',
    name: 'bigscreenBB',
    component: () => import('@/views/bigscreenBaibu/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenMYJD',
    name: 'bigscreenMYJD',
    component: () => import('@/views/bigscreenMingYue1/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenMY',
    name: 'bigscreenTest',
    component: () => import('@/views/bigscreenTest/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenMYBase',
    name: 'bigscreenMYBase',
    component: () => import('@/views/bigscreenMingYueBase/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenMYBaseView',
    name: 'bigscreenMYBaseView',
    component: () => import('@/views/bigscreenMingYueBaseView/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenModel',
    name: 'bigscreenModel',
    component: () => import('@/views/bigscreenModel/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenTYBase',
    name: 'bigscreenTYBase',
    component: () => import('@/views/bigscreenTianYinBase/index.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/bigscreenTB',
    name: 'bigscreenTangBa',
    component: () => import('@/views/bigscreenTangBa/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenQJ',
    name: 'BigscreenQianJiang',
    component: () => import('@/views/bigscreenQianJiang/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenMYFX',
    name: 'bigscreenMYFX',
    component: () => import('@/views/bigscreenMingYue2/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenED',
    name: 'bigscreenED',
    component: () => import('@/views/bigscreenErDu/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenTY',
    name: 'bigscreenTY',
    component: () => import('@/views/bigscreenTaiYuan/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenTM',
    name: 'bigscreenTM',
    component: () => import('@/views/bigscreenTongMing/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenCZ',
    name: 'bigscreenCZ',
    component: () => import('@/views/bigscreenChaZhu/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenCZExtra',
    name: 'bigscreenCZExtra',
    component: () => import('@/views/bigscreenCZExtra/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenWY',
    name: 'bigscreenWY',
    component: () => import('@/views/bigscreenWangYan/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/home',
    name: 'HomePage',
    component: () => import('@/views/gateway/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/tiandiMap',
    name: 'tiandiMap',
    component: () => import('@/views/tiandiMap/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/homeIndex',
    name: 'HomePages',
    component: () => import('@/views/homePages/home.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/gateway',
    name: 'gateway',
    component: () => import('@/views/gateway/system.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/growthMonitoringModelDataCenter',
    name: 'growthMonitoringModelDataCenter',
    component: () => import('@/views/growthMonitoringModelDataCenter/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/bigscreenMYZH',
    name: 'bigscreenMYZH',
    component: () => import('@/views/bigscreenMingYue3/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/QRCode',
    component: () => import('@/views/kaizhou/qrCode/index.vue'),
    name: 'scanCode',
    meta: {
      hidden: true,
      title: '标识码',
      noTagsView: true
    }
  }
];

export default remainingRouter;
