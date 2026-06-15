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
// #### 角色管理
export const roleList = (data) => {
    return request({
        url: '/role/list',
        method: 'POST',
        data
    })
}
export const roleDetail = (data) => {
    return request({
        url: '/role/getById',
        method: 'POST',
        data
    })
}
export const roleAdd = (data) => {
    return request({
        url: '/role/add',
        method: 'POST',
        data
    })
}
export const roleDelete = (data) => {
    return request({
        url: '/role/delete',
        method: 'POST',
        data
    })
}
export const roleUpdate = (data) => {
    return request({
        url: '/role/update',
        method: 'POST',
        data
    })
}
// #### 菜单管理
export const menuList = (data) => {
    return request({
        url: '/menu/list',
        method: 'POST',
        data
    })
}
export const menuDetail = (data) => {
    return request({
        url: '/menu/getById',
        method: 'POST',
        data
    })
}
export const menuAdd = (data) => {
    return request({
        url: '/menu/add',
        method: 'POST',
        data
    })
}
export const menuDelete = (data) => {
    return request({
        url: '/menu/delete',
        method: 'POST',
        data
    })
}
export const menuUpdate = (data) => {
    return request({
        url: '/menu/update',
        method: 'POST',
        data
    })
}