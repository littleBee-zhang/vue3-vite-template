import md5 from 'md5'
// 从环境变量获取密钥（避免硬编码）
const SIGNATURE_SECRET = import.meta.env.VITE_SIGNATURE_SECRET
// ==================== 【核心】生成签名 ====================
export const generateSign = (params, secret) => {
  // 1. 过滤空值
  const validParams = {}
  for (const key in params) {
    const val = params[key]
    if (val !== null && val !== undefined && val !== '' && typeof val !== 'object') {
      validParams[key] = val
    }
  }

  // 2. 按 key 字典序排序
  const sortedKeys = Object.keys(validParams).sort()

  // 3. 拼接字符串
  let signStr = sortedKeys.map((key) => `${key}=${validParams[key]}`).join('&')

  // 4. 拼接密钥
  signStr += '&key=' + secret

  // 5. MD5 加密并大写
  return md5(signStr).toUpperCase()
}

// ==================== 给请求添加签名 ====================
export const addSign = (config) => {
  if (!SIGN_WHITE_LIST.includes(config.url)) return

  const params = { ...config.params, ...config.data }
  const timestamp = Date.now().toString()
//   const nonce = Math.random().toString(36).slice(2, 10)

  const signData = { ...params, timestamp, nonce }
  const sign = generateSign(signData, SIGNATURE_SECRET)

  config.headers['X-timestamp'] = timestamp
//   config.headers['nonce'] = nonce
  config.headers['X-sign'] = sign
}