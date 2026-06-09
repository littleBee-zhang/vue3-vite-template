import Layout from '@/layout/Index.vue'
// import defaultRoutes from './defaultRoutes'

// 你提供的原版函数（已修复安全判断）
export function dynamicRouteToVueRoute(routeList) {
  const res = []

  // 安全判断：没有菜单直接返回空数组
  if (!routeList || !Array.isArray(routeList) || routeList.length === 0) {
    return res
  }

  routeList.forEach((item) => {
    const route = {
      path: item.path,
      name: item.menuName,
      component: item.component === 'layout/Index'
        ? Layout: () => import(`@/views/` + item?.component + '.vue'),
      meta: {
        title: item.menuName,
        icon: item.icon,
        hidden: !!item.hidden,
        svgName: item?.svgName,
      },
      children: [],
    }

    // 递归子菜单
    if (item.children && item.children.length) {
      route.children = dynamicRouteToVueRoute(item.children)
    }

    res.push(route)
  })

  return res
}

// 合并菜单：默认 + 动态（动态优先）
export function mergeMenu(defaultMenus, dynamicMenus = []) {
  if (!dynamicMenus || dynamicMenus.length === 0) {
    return defaultMenus
  }

  const dynamicMap = new Map()
  dynamicMenus.forEach(m => dynamicMap.set(m.path, m))

  const result = [...dynamicMenus]
  defaultMenus.forEach(def => {
    if (!dynamicMap.has(def.path)) {
      result.push(def)
    }
  })

  return result.sort((a, b) => (a.sort || 99) - (b.sort || 99))
}