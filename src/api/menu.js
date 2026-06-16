import request from '@/utils/request'

import { menuRoutes, menuRoutesList } from '@/router/defaultRoutes'
export const getMenu = () => {
    return menuRoutesList
    // return request({
    //     url: '/menu/list',
    //     method: 'POST'
    // })
}