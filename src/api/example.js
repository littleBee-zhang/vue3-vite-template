import request from '@/utils/request'
/** 使用案例 **/ 
// GET
export function getList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

// POST
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// POST + 自定义 headers
export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    headers: {
      'client-type': 'PC'
    },
    data
  })
}