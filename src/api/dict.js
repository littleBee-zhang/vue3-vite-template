import request from '@/utils/request'
export const getDict = (params) => {
    // return []
    return request({
        url: '/dict/list',
        method: 'POST'
    })
}