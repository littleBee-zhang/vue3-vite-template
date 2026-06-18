import axios from 'axios'
import md5 from 'md5'
import { ElLoading, ElMessage } from 'element-plus'
import { BASE_URL } from '@/constant/address.js'
import {
  FULL_RESPONSE_WHITE_LIST,
  NO_TOKEN_WHITE_LIST,
  MD5_ENCRYPT_WHITE_LIST,
  NO_LOADING_WHITE_LIST,
  MAX_CONCURRENT_REQUESTS,
  NO_REQUEST_HINT
} from './whitelist'
import { addSign } from './sign'
//========= 请求管理变量 =========
const pendingRequests = new Map() //存储正在进行的请求（去重、取消）
let activeRequests = 0 //当前活跃请求数
let loadingInstance = null
let loadingCount = 0 //loading计数器，多个请求共用一个loading，全部结束才关闭
let loadingTimer = null // 超时定时器
//生成唯一请求标识（method+url+参数）
const getRequestKey = (config) => {
  const { url, method, params, data } = config
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

//移除并取消重复请求
const removePendingRequest = (config) => {
  const key = getRequestKey(config)
  if (pendingRequests.has(key)) {
    const cancel = pendingRequests.get(key)
    pendingRequests.delete(key)
  }
}

//========= 创建axios实例 =========
const service = axios.create({
  baseURL: import.meta.env.DEV ? '' : BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

//========= 请求拦截器 =========
service.interceptors.request.use(
  async (config) => {
    //1.取消重复请求
    removePendingRequest(config)

    //2.并发排队限流，超出最大并发则等待
    while (activeRequests >= MAX_CONCURRENT_REQUESTS) {
      await new Promise(resolve => setTimeout(resolve, 80))
    }

    //3.AbortController 挂载取消函数
    const controller = new AbortController()
    config.signal = controller.signal
    const reqKey = getRequestKey(config)
    pendingRequests.set(reqKey, controller.abort)
    activeRequests++

    //4.全局loading处理：不在免loading白名单则打开
    if (!NO_LOADING_WHITE_LIST.includes(config.url)) {
      loadingCount++
      if (!loadingInstance) {
        loadingInstance = ElLoading.service({
          lock: true,
          text: '请求加载中...',
          background: 'rgba(0,0,0,0.1)'
        })
      }
      // 增加：超时10秒强制关闭loading，防止卡死
      if (loadingTimer) clearTimeout(loadingTimer)
      loadingTimer = setTimeout(() => {
        closeLoading()
        console.warn('请求超时，已自动关闭加载')
      }, 10000) // 10秒超时
    }
    // ====================== 核心：合并 headers（不替换）======================
    // 外部传入的 headers → 合并到默认里（外部优先）
    if (config.headers) {
      config.headers = {
        ...service.defaults.headers.common, // 默认基础头
        ...service.defaults.headers.post,
        ...config.headers,
      }
    }
    //5.token携带逻辑
    if (!NO_TOKEN_WHITE_LIST.includes(config.url)) {
      const token = sessionStorage.getItem('token')
      if (token) config.headers['X-Access-Token'] = `${token}`
    }
    // ====================== 上传文件处理 ======================
    if (config.isUploadFile) {
      // 上传文件：使用 FormData 格式
      config.headers['Content-Type'] = 'multipart/form-data'
      // 如果 data 不是 FormData，自动转换成 FormData
      if (!(config.data instanceof FormData)) {
        const formData = new FormData()
        Object.keys(config.data).forEach(key => {
          formData.append(key, config.data[key])
        })
        config.data = formData
      }
    }

    //6.自动md5加密密码字段 （暂时没有完善）
    if (MD5_ENCRYPT_WHITE_LIST.includes(config.url) && config.data) {
      // 签名
      addSign(config)
      if (config.data.password) config.data.password = md5(config.data.password)
      if (config.data.oldPassword) config.data.oldPassword = md5(config.data.oldPassword)
      if (config.data.newPassword) config.data.newPassword = md5(config.data.newPassword)
    }

    return config
  },
  (err) => Promise.reject(err)
)

//========= 响应拦截器 =========
const closeLoading = () => {
  loadingCount--
  if (loadingCount <= 0 && loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
    loadingCount = 0
  }
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    loadingTimer = null
  }
}

service.interceptors.response.use(
  (response) => {
    //清理请求队列
    const key = getRequestKey(response.config)
    pendingRequests.delete(key)
    activeRequests = Math.max(0, activeRequests - 1)
    //关闭loading
    closeLoading()

    const res = response.data
    const url = response.config.url
    //白名单接口完整返回原始数据
    if (FULL_RESPONSE_WHITE_LIST.includes(url)) return res
    //常规接口校验code
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(res)
    } else {
      
      if (!NO_REQUEST_HINT.includes(url)) ElMessage.success(res?.message || '请求成功')
    }
    // return res.data
    return res?.data
  },
  (error) => {
    //异常也要清理队列+关闭loading
    if (error.config) {
      const key = getRequestKey(error.config)
      pendingRequests.delete(key)
      activeRequests = Math.max(0, activeRequests - 1)
      closeLoading()
    }
    //取消的请求不报错提示
    if (error.message === '取消重复请求') return Promise.reject(error)
    //401登录过期
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      sessionStorage.removeItem('token')
      // window.location.href = '/login'
    } else {
      ElMessage.error(error.message || '网络异常')
    }
    return Promise.reject(error)
  }
)

// // 暴露全局方法：路由切换取消全部请求
// service.cancelAllRequest = () => {
//   for (const cancel of pendingRequests.values()) cancel('页面跳转，取消所有请求')
//   pendingRequests.clear()
//   activeRequests = 0
//   loadingCount = 0
//   if (loadingInstance) {
//     loadingInstance.close()
//     loadingInstance = null
//   }
// }
// 
function cancelAllRequest() {
  for (const cancel of pendingRequests.values()) {
    try {
      cancel('页面跳转，取消请求');
    } catch (e) {
      // console.warn('单个请求取消异常', e);
    }
  }
  pendingRequests.clear();
  activeRequests = 0;
  loadingCount = 0;
  if (loadingInstance) {
    loadingInstance.close();
    loadingInstance = null;
  }
}
// 改造：不再依赖this，直接操作外部变量，任意方式调用都不会报错
// service.cancelAllRequest = () => {
//   pendingCancelSources.forEach(item => {
//     item.cancel('路由跳转，取消未完成请求')
//   })
//   pendingCancelSources = []
// }
// 强制绑定this指向axios实例service
service.cancelAllRequest = cancelAllRequest.bind(service);
export default service