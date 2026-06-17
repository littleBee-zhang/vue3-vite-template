import { createRouter, createWebHistory } from 'vue-router'
import { dynamicRouteToVueRoute } from './dynamicRouter'
import { menuRoutes } from './defaultRoutes'
import { getMenu } from '@/api/menu'
import request from '@/utils/request'
import Layout from '@/layout/Index.vue'
import { mergeUniqueMenuByPath } from './treemenu'
import store from '@/store'

// 全局变量 顶层定义
const addedRouteNames = new Set()
let isDynamicRouteAdded = false

const baseRoutes = [
  {
    path: '/',
    name: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    name: 'layout',
    redirect: '/home',
    children: []
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: baseRoutes,
})

// 递归添加树形路由
const addTreeDynamicRoutes = (routeList, parentName = 'layout') => {
  routeList.forEach(route => {
    if (addedRouteNames.has(route.name)) return
    addedRouteNames.add(route.name)
    router.addRoute(parentName, route)
    if (route.children?.length) {
      addTreeDynamicRoutes(route.children, route.name)
    }
  })
}

// 规范路由守卫：禁止setTimeout包裹next，所有分支同步next
router.beforeEach(async (to, from, next) => {
  // 捕获取消请求异常
  try {
    request.cancelAllRequest()
  } catch (e) {
    console.warn('取消请求异常忽略', e)
  }

  // 分支1：去往登录页直接放行
  if (to.path === '/login') {
    next()
    return
  }

  const token = sessionStorage.getItem('token')
  // 分支2：无token跳转登录
  if (!token) {
    isDynamicRouteAdded = false
    addedRouteNames.clear()
    store.dispatch('menu/clearMenu')
    next('/login')
    return
  }

  // 分支3：路由已加载完成，直接放行
  if (isDynamicRouteAdded) {
    next()
    return
  }
  // 获取是否已加载菜单
  const isLoaded = store.state.menu?.loadStatus

  if (isLoaded) return next()
  // 分支4：首次加载菜单&动态路由
  try {
    const res = await getMenu()
    const backendMenus = res || []
    const mergedMenus = mergeUniqueMenuByPath(menuRoutes, backendMenus)

    store.dispatch('menu/setMenu', mergedMenus)
    const dynamicRoutes = dynamicRouteToVueRoute(mergedMenus)
    addTreeDynamicRoutes(dynamicRoutes)

    // 动态路由注册完成后再注册404兜底路由
    router.addRoute({
      path: '/404',
      name:'404',
      component: () => import('@/views/error/index.vue'),
      meta: { hidden: true }
    })
    // 通配所有未匹配路径，跳转404
    router.addRoute({
      path: '/:pathMatch(.*)*',
      redirect: '/404',
      meta: { hidden: true }
    })

    isDynamicRouteAdded = true
    store.dispatch('menu/setLoadStatus', true)

    // 关键修复：不用setTimeout嵌套next，采用replace模式重定向
    next({ ...to, replace: true })
  } catch (err) {
    console.error('菜单加载失败', err)
    sessionStorage.removeItem('token')
    isDynamicRouteAdded = false
    addedRouteNames.clear()
    store.dispatch('menu/clearMenu')
    next('/login')
  }
})

// 退出登录重置缓存
export function resetRouteCache() {
  isDynamicRouteAdded = false
  addedRouteNames.clear()
  store.dispatch('menu/clearMenu')
}

export default router