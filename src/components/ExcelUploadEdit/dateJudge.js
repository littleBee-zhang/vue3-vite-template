/**
 * 判断值是否为日期/时间类型
 * @param {any} value 单元格原始值
 * @param {object} [cell] xlsx原始单元格对象（可选，精准判断用）
 * @returns {boolean}
 */
export function isDateTimeValue(value, cell) {
    // XLSX原生日期标记优先级最高
    if (cell && cell.d === true) {
        return true
    }

    if (value === null || value === undefined || value === '') return false

    // 原生Date实例校验
    if (value instanceof Date) {
        return !isNaN(value.getTime())
    }

    // Excel日期数字区间 1 ~ 43834（1900~2100）
    if (typeof value === 'number') {
        return value >= 1 && value <= 43834
    }

    // 常见日期字符串正则
    const regList = [
        /^\d{4}-\d{1,2}-\d{1,2}$/,
        /^\d{4}\/\d{1,2}\/\d{1,2}$/,
        /^\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2}$/,
        /^\d{4}\/\d{1,2}\/\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2}$/,
        /^\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{1,2}$/
    ]
    const str = String(value).trim()
    return regList.some(reg => reg.test(str))
}

/**
 * 格式化Excel日期，兼容序列号/字符串/Date对象
 * @param {any} value
 * @param {object} cell
 * @returns {string|any}
 */
export function formatExcelDate(value, cell) {
    if (!isDateTimeValue(value, cell)) return value

    let dateObj = null
    if (cell?.d === true && cell.v instanceof Date) {
        dateObj = cell.v
    } else if (typeof value === 'number') {
        const excelBase = new Date(1899, 11, 30)
        dateObj = new Date(excelBase.getTime() + value * 24 * 3600 * 1000)
    } else {
        dateObj = new Date(value)
    }

    // 双重校验：必须是有效Date实例，防止 getFullYear 报错
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return value
    }

    const y = dateObj.getFullYear()
    const m = String(dateObj.getMonth() + 1).padStart(2, '0')
    const d = String(dateObj.getDate()).padStart(2, '0')
    const h = String(dateObj.getHours()).padStart(2, '0')
    const mi = String(dateObj.getMinutes()).padStart(2, '0')
    const s = String(dateObj.getSeconds()).padStart(2, '0')

    const hasTime = h !== '00' || mi !== '00' || s !== '00'
    return hasTime ? `${y}-${m}-${d} ${h}:${mi}:${s}` : `${y}-${m}-${d}`
}