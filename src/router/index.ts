import { createRouter, type RouteRecordRaw } from 'vue-router'
import { flatMultiLevelRoutes, history } from './helper'
import routeSettings from '@/config/route'

const Layouts = () => import('@/layouts/index.vue')

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      title: '403',
      hidden: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      title: '404',
      hidden: true
    },
    alias: '/:pathMatch(.*)*'
  },
  /*{
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      hidden: true
    }
  },*/
  {
    path: '/',
    component: Layouts,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: '首页',
          svgIcon: 'dashboard',
          affix: true
        }
      }
    ]
  },
  {
    path: '/lcd',
    component: Layouts,
    redirect: '/lcd/config',
    name: 'LCD',
    meta: {
      title: '低代码',
      elIcon: 'Grid'
    },
    children: [
      {
        path: 'config',
        component: () => import('@/views/lcd/config/index.vue'),
        name: 'LcdConfig',
        meta: {
          title: '拉取配置',
          keepAlive: true,
          elIcon: 'Grid'
        }
      },
      {
        path: 'record',
        component: () => import('@/views/lcd/record/index.vue'),
        name: 'LcdRecord',
        meta: {
          title: '拉取记录',
          keepAlive: true,
          elIcon: 'Grid'
        }
      }
    ]
  },
  {
    path: '/link',
    meta: {
      title: '外链',
      svgIcon: 'link'
    },
    children: [
      {
        path: 'http://con-files.youcash.com:8090/pages/viewpage.action?pageId=33477703',
        component: () => {},
        name: 'Link1',
        meta: {
          title: '低代码文档',
          svgIcon: 'link'
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*', // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: '/404',
    name: 'ErrorPage',
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
