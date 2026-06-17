import Layout from '@/layout/Index.vue'

export const dynamicRouteToVueRoute = (routeList) => {
  const res = []

  // 安全判断：没有菜单直接返回空数组
  if (!routeList || !Array.isArray(routeList) || routeList.length === 0) {
    return res
  }
  routeList.forEach((item) => {
    const route = {
      path: item.path,
      name: item.menuName,
      component: item.component === 'layout/Index' ? Layout : item?.component,
      meta: { title: item.menuName, name: item.menuName, icon: item.icon, hidden: !!item.hidden, svgName: item?.svgName },
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
export const mergeMenu = (defaultMenus, dynamicMenus = []) => {
  return [...defaultMenus, ...dynamicMenus]
}