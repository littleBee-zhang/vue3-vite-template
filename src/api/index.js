import request from '@/utils/request'
// 开源接口 获取省市区地址
export const getList = (params = { maxLevel:3 ,code :''}) => {
  return request({
    url: '/9095/xzqh/getList',
    method: 'get',
    params
  })
}