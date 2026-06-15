/** 完整返回后端全部字段白名单 **/ 
export const FULL_RESPONSE_WHITE_LIST = ['/login','/9095/xzqh/getList','/file/upload']
/** 不需要token白名单 **/ 
export const NO_TOKEN_WHITE_LIST = ['/login']
/** 需要自动md5加密password白名单 **/ 
export const MD5_ENCRYPT_WHITE_LIST = []
/** 不需要开启loading白名单（下拉分页、实时查询接口不弹loading） **/
export const NO_LOADING_WHITE_LIST = []
/** 最大并发请求数量（浏览器同源限制6） **/ 
export const MAX_CONCURRENT_REQUESTS = 6
/** 请求不需要成功提示白名单 **/ 
export const NO_REQUEST_HINT = ['/user/list','/role/list','/file/upload']