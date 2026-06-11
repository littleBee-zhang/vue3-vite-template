import login from './login'
import success from './success'
import menuList from './menu/list'
import roleMenuGetByRoleId from './role-menu/getByRoleId'
import operLogList from './oper-log/list'
import fileUpload from './file/upload'
import dictList from './dict/list'
import dictGetById from './dict/getById'
import userList from './user/list'
import userGetById from './user/getById'
import roleList from './role/list'
import roleGetRoleById from './role/getRoleById'
import deptList from './dept/list'
import deptGetById from './dept/getById'

// 键：接口方法+地址 | 值：mock返回处理函数
const mockApiMap = {
    // #### 系统
    'POST /login': login,
    'POST /logout': success,
    'POST /menu/list': menuList,
    'POST /role-menu/add': success,
    'POST /role-menu/getByRoleId': roleMenuGetByRoleId,
    'POST /oper-log/list': operLogList,
    'POST /file/upload': fileUpload,
    // #### 字典管理
    'POST /dict/list': dictList,
    'POST /dict/getById': dictGetById,
    'POST /dict/add': success,
    'POST /dict/delete': success,
    'POST /dict/update': success,
    // #### 用户管理
    'POST /user/list': userList,
    'POST /user/getById': userGetById,
    'POST /user/add': success,
    'POST /user/delete': success,
    'POST /user/update': success,
    // #### 角色管理
    'POST /role/list': roleList,
    'POST /role/getRoleById': roleGetRoleById,
    'POST /role/add': success,
    'POST /role/delete': success,
    'POST /role/update': success,
    // #### 部门管理
    'POST /dept/list': deptList,
    'POST /dept/getById': deptGetById,
    'POST /dept/add': success,
    'POST /dept/delete': success,
    'POST /dept/update': success,
}

export default mockApiMap