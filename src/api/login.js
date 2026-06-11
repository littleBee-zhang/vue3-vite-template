import request from '@/utils/request'

// 登录
export const Login = (data = {}) => {
    return request({
        url: '/login',
        method: 'post',
        data
    })
};
export const Logout = (data = {}) => {
    return request({
        url: '/logout',
        method: 'post',
        data
    })
}; 