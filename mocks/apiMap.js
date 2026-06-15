import { login, logout} from './login'
import { success, Delete, Update, Add } from './success'
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
    'POST /logout': logout,
    'POST /menu/list': menuList,
    'POST /role-menu/add': Add,
    'POST /role-menu/getByRoleId': roleMenuGetByRoleId,
    'POST /oper-log/list': operLogList,
    'POST /file/upload': fileUpload,
    // #### 字典管理
    'POST /dict/list': dictList,
    'POST /dict/getById': dictGetById,
    'POST /dict/add': Add,
    'POST /dict/delete': Delete,
    'POST /dict/update': Update,
    // #### 用户管理
    'POST /user/list': userList,
    'POST /user/getById': userGetById,
    'POST /user/add': Add,
    'POST /user/delete': Delete,
    'POST /user/update': Update,
    // #### 角色管理
    'POST /role/list': roleList,
    'POST /role/getRoleById': roleGetRoleById,
    'POST /role/add': Add,
    'POST /role/delete': Delete,
    'POST /role/update': Update,
    // #### 部门管理
    'POST /dept/list': deptList,
    'POST /dept/getById': deptGetById,
    'POST /dept/add': Add,
    'POST /dept/delete': Delete,
    'POST /dept/update': Update,
}

export default mockApiMap