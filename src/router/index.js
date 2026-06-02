import { createRouter, createWebHistory } from 'vue-router'
import request from '@/utils/request'

const router = createRouter({
  history: createWebHistory(),
//   routes: [...]
})

//切换页面取消当前页面所有pending请求
router.beforeEach((to, from, next) => {
  request.cancelAllRequest()
  next()
})

export default router