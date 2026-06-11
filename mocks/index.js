import Mock from 'mockjs'
import mockApiMap from './apiMap'

// 模拟网络延迟
Mock.setup({
  timeout: '200-600'
})

// 循环批量注册所有接口
Object.entries(mockApiMap).forEach(([key, mockHandler]) => {
  // 拆分 POST /login → method + url
  const [method, url] = key.split(' ')
  // Mock.mock(接口地址, 请求方式, 处理函数/模板)
  Mock.mock(url, method.toLowerCase(), mockHandler)
})