import dayjs from 'dayjs'

/**
 * 【终极版】日期格式化（超强容错 + 全场景支持）
 * @param {any} date 时间：时间戳/字符串/Date
 * @param {string} format 格式化模版 YYYY-MM-DD HH:mm:ss
 * @returns {string} 格式化后的值 / 空字符串
 */
export const FormatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  // 空值判断
  if (!date || date === '' || date === 0 || date === '0') {
    return ''
  }

  try {
    const day = dayjs(date)
    // 无效日期直接返回空
    if (!day.isValid()) {
      return ''
    }
    return day.format(format)
  } catch (error) {
    console.error('日期格式化异常：', error)
    return ''
  }
}

/**
 * 格式化：年月日
 */
export const formatDateYmd = (date) => {
  return formatDate(date, 'YYYY-MM-DD')
}

/**
 * 格式化：年月日 时分秒
 */
export const formatDateYmdHms = (date) => {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化：年月
 */
export const formatDateYm = (date) => {
  return formatDate(date, 'YYYY-MM')
}

/**
 * 格式化：时分秒
 */
export const formatDateHms = (date) => {
  return formatDate(date, 'HH:mm:ss')
}

/**
 * 转换为 13位时间戳
 */
export const toTimestamp = (date) => {
  if (!date) return null
  try {
    const time = dayjs(date).valueOf()
    return isNaN(time) ? null : time
  } catch {
    return null
  }
}

/**
 * 获取相对时间（xx分钟前）
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''
  try {
    const relativeTime = require('dayjs/plugin/relativeTime')
    dayjs.extend(relativeTime)
    return dayjs(date).fromNow()
  } catch {
    return ''
  }
}

export default FormatDate