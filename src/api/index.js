import request from '@/utils/request'
// 开源接口 获取省市区地址
export const getList = (params = { maxLevel:3 ,code :''}) => {
  return request({
    url: '/9095/xzqh/getList',
    method: 'get',
    params
  })
}

// #### 系统
// const Logout = async (data = {}) => await fetch.Http('/logout', { data }); // 登出
// const menuList = async (data = {}) => await fetch.Http('/menu/list', { data }); // 菜单列表
// const roleMenuAdd = async (data = {}) => await fetch.Http('/role-menu/add', { data }); // 添加权限配置
// const roleMenugetById = async (data = {}) => await fetch.Http('/role-menu/getByRoleId', { data }); // 查询角色权限
// const operLogList = async (data = {}) => await fetch.Http('/oper-log/list', { data }); // 日志列表
// const fileUpload = async (data = {}) => await fetch.Http('/file/upload', { data }); // 文件上传
// // #### 字典管理
// const dictList = async (data = {}) => await fetch.Http('/dict/list', { data }); // 列表
// const dictGetById = async (data = {}) => await fetch.Http('/dict/getById', { data }); // 详情
// const dictAdd = async (data = {}) => await fetch.Http('/dict/add', { data }); // 添加
// const dictDelete = async (data = {}) => await fetch.Http('/dict/delete', { data }); // 删除
// const dictUpdate = async (data = {}) => await fetch.Http('/dict/update', { data }); // 修改

// // #### 角色管理
// const roleList = async (data = {}) => await fetch.Http('/role/list', { data }); // 列表
// const roleGetById = async (data = {}) => await fetch.Http('/role/getRoleById', { data }); // 详情
// const roleAdd = async (data = {}) => await fetch.Http('/role/add', { data }); // 添加
// const roleDelete = async (data = {}) => await fetch.Http('/role/delete', { data }); // 删除
// const roleUpdate = async (data = {}) => await fetch.Http('/role/update', { data }); // 修改
// // #### 部门管理
// const deptList = async (data = {}) => await fetch.Http('/dept/list', { data }); // 列表
// const deptGetById = async (data = {}) => await fetch.Http('/dept/getById', { data }); // 详情
// const deptAdd = async (data = {}) => await fetch.Http('/dept/add', { data }); // 添加
// const deptDelete = async (data = {}) => await fetch.Http('/dept/delete', { data }); // 删除
// const deptUpdate = async (data = {}) => await fetch.Http('/dept/update', { data }); // 修改
