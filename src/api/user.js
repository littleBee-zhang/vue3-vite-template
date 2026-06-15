import request from '@/utils/request'
// #### 用户管理
export const List = (data) => {
    return request({
        url: '/user/list',
        method: 'POST',
        data
    })
}
export const Detail = (data) => {
    return request({
        url: '/user/getById',
        method: 'POST',
        data
    })
}
export const Add = (data) => {
    return request({
        url: '/user/add',
        method: 'POST',
        data
    })
}
export const Delete = (data) => {
    return request({
        url: '/user/delete',
        method: 'POST',
        data
    })
}
export const Update = (data) => {
    return request({
        url: '/user/update',
        method: 'POST',
        data
    })
}