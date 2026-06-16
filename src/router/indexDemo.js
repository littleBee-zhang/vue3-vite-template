import { createRouter, createWebHistory } from 'vue-router'
import { dynamicRouteToVueRoute, mergeMenu } from './dynamicRouter'
import { menuRoutes } from './defaultRoutes'
import { getMenu } from '@/api/menu'
import request from '@/utils/request'
import Layout from '@/layout/Index.vue'

// 基础路由 -- (menuRoutes-默认路由)
const baseRoutes = [
  { path: '/', redirect: '/home', },
  { path: '/login', component: () => import('@/views/login/index.vue'), meta: { hidden: true } },
  {
    path: '/', component: Layout, redirect: '/home',
    children: menuRoutes // 初始为空，登录后追加动态菜单
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes: baseRoutes,
})

let isDynamicRouteAdded = false

router.beforeEach(async (to, from, next) => {
  request.cancelAllRequest()

  // 登录页直接放行
  if (to.path === '/login') {
    return next()
  }
  const token = sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }

  // 已经添加过动态路由 → 不再重复添加 
  if (isDynamicRouteAdded) {
    return next()
  }

  try {
    // 获取后端菜单
    // const res = await getMenu()
    // console.log(res, 'res');

    // const menus = res.menus || []

    // 合并：默认菜单 + 动态菜单
    const mergedMenus = mergeMenu([], [])

    // 转成 vue 路由
    const dynamicRoutes = dynamicRouteToVueRoute(mergedMenus)

    // 批量添加动态路由
    dynamicRoutes.forEach(route => {
      router.addRoute(route)
    })

    isDynamicRouteAdded = true

    // 安全跳转，不会死循环
    next({ path: to.fullPath, replace: true })
  } catch (e) {
    next('/login')

  }
})

export default router