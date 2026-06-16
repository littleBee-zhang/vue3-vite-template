import { createRouter, createWebHistory } from 'vue-router'
import { dynamicRouteToVueRoute, mergeMenu } from './dynamicRouter'
import defaultRoutes from './defaultRoutes'
import { getMenu } from '@/api/menu'
import request from '@/utils/request'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      meta: { hidden: true },
    },
    {
      path: '/dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      meta: { hidden: true },
    },
  ],
})

// 全局锁：只加载一次菜单
let isDynamicRouteAdded = false

router.beforeEach(async (to, from, next) => {
  request.cancelAllRequest()

  // ==========================
  // 1. 登录页 → 直接放行
  // ==========================
  if (to.path === '/login') {
    return next()
  }

  // ==========================
  // 2. 没登录 → 去登录
  // ==========================
  const token = sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }

  // ==========================
  // 3. 已经加载过动态路由 → 直接放行
  // ==========================
  if (isDynamicRouteAdded) {
    return next()
  }

  try {
    // ==========================
    // 4. 加载菜单（失败也不影响跳转）
    // ==========================
    const res = await getMenu().catch(() => ({ menus: [] }))
    const menus = res.menus || []

    // 合并默认菜单 + 动态菜单
    const mergedMenus = mergeMenu(defaultRoutes, menus)
    const routes = dynamicRouteToVueRoute(mergedMenus)

    // 添加路由
    routes.forEach((r) => {
      if (r.path && r.component) router.addRoute(r)
    })

    // 打开锁！！！（关键）
    isDynamicRouteAdded = true

    // 跳转
    next(to.fullPath)
  } catch (err) {
    console.error('菜单加载失败', err)
    isDynamicRouteAdded = true // 失败也打开锁，保证能跳转
    next(to.fullPath)
  }
})

export default router