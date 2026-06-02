// ====================== 白名单 ======================
/** 完整返回后端全部字段白名单 **/ 
export const FULL_RESPONSE_WHITE_LIST = ['/user/info', '/system/config', '/login/getCode']
/** 不需要token白名单 **/ 
export const NO_TOKEN_WHITE_LIST = ['/user/login', '/user/register', '/login/getCode']
/** 需要自动md5加密password白名单 **/ 
export const MD5_ENCRYPT_WHITE_LIST = ['/user/login', '/user/register', '/user/resetPwd']
/** 不需要开启loading白名单（下拉分页、实时查询接口不弹loading） **/
export const NO_LOADING_WHITE_LIST = ['/dict/list', '/option/get']
/** 最大并发请求数量（浏览器同源限制6） **/ 
export const MAX_CONCURRENT_REQUESTS = 6