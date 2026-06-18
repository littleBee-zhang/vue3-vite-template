/**
 * 路由
 * @param {String} path 地址
 * @param {String function} component 项目组件地址
 * @param {String} menuName 名称
 * @param {String} icon 图标
 * @param {String} svgName icon为SvgIcon 将会采用阿里图标
 * @param {boolean} hidden 是全屏显示
 * @param {boolean} hidden 是全屏显示
 * @param {boolean} hidden 是全屏显示
 * @param {Array} children 子组件
 */
export const menuRoutes = [
  {
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    menuName: '首页',
    icon: 'HomeFilled',
    hidden: false,
  },
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    menuName: 'Dashboard',
    icon: 'HomeFilled',
    hidden: false,
  },
  // {
  //   path: '/system',
  //   menuName:'系统管理',
  //   icon: 'Menu',
  //   hidden:false,
  //   children: [
  //     {
  //       path: '/system/menu',
  //       component: () => import('@/views/system/menu/index.vue'),
  //       menuName: '菜单管理' ,
  //       icon: 'SvgIcon',
  //       svgName:'jiaoseguanli',
  //       hidden:false,
  //     },
  //     {
  //       path: '/system/user',
  //       component: () => import('@/views/system/user/index.vue'),
  //       menuName: '用户管理' ,
  //       icon: 'User',
  //       hidden:false,
  //     },
  //     {
  //       path: '/system/role',
  //       component: () => import('@/views/system/role/index.vue'),
  //       menuName: '角色管理' ,
  //       icon: 'SvgIcon',
  //       svgName:'jiaoseguanli',
  //       hidden:false,
  //     },
  //   ],
  // },
  // {
  //   path: '/former',
  //   component: () => import('@/views/former/index.vue'),
  //   menuName:'Former',
  //   icon: 'HomeFilled',
  //   hidden:false,
  // },
  // {
  //   path: '/demo',
  //   component: () => import('@/views/former/demo.vue'),
  //   menuName:'DEMO',
  //   icon: 'HomeFilled',
  //   hidden:false,
  // },
]
export const menuRoutesList = [
  {
    path: '/home',
    // component: () => import('@/views/home/index.vue'),
    component: 'home/index',
    menuName: '首页',
    icon: 'HomeFilled',
    hidden: false,
  },
  {
    path: 'system',
    menuName: '系统管理',
    icon: 'Menu',
    hidden: false,
    children: [
      {
        path: '/system/menu',
        component: () => import('@/views/system/menu/index.vue'),
        menuName: '菜单管理',
        icon: 'SvgIcon',
        svgName: 'menu1',
        hidden: false,
      },
      {
        path: '/system/user',
        component: () => import('@/views/system/user/index.vue'),
        menuName: '用户管理',
        icon: 'SvgIcon',
        svgName: 'renyuanxinxi',
        hidden: false,
      },
      {
        path: '/system/role',
        component: () => import('@/views/system/role/index.vue'),
        menuName: '角色管理',
        icon: 'SvgIcon',
        svgName: 'jiaoseguanli1',
        hidden: false,
      },
    ],
  },
  {
    path: '/former',
    component: () => import('@/views/former/index.vue'),
    menuName: 'Former',
    icon: 'SvgIcon',
    svgName: 'formfill',
    hidden: false,
  },
  {
    path: '/demo',
    component: () => import('@/views/former/demo.vue'),
    menuName: 'DEMO',
    icon: 'HomeFilled',
    hidden: false,
  },
]