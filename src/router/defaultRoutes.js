/**
 * 是自定义的，用于侧边栏菜单显示文字
 * 
 * 
 * 
 * **/ 
export const menuRoutes = [
  {
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    menuName:'首页',
    icon: 'HomeFilled',
    hidden:false,
  },
  {
    path: '/former',
    component: () => import('@/views/former/index.vue'),
    menuName:'Former',
    icon: 'HomeFilled',
    hidden:false,
  },
  {
    path: '/system',
    menuName:'系统管理',
    icon: 'Menu',
    hidden:false,
    children: [
      {
        path: '/system/user',
        component: () => import('@/views/user/index.vue'),
        menuName: '用户管理' ,
        icon: 'User',
        hidden:false,
      },
      {
        path: '/system/role',
        component: () => import('@/views/user/role.vue'),
        menuName: '角色管理' ,
        icon: 'SvgIcon',
        svgName:'jiaoseguanli',
        hidden:false,
      },
    ],
  },
]