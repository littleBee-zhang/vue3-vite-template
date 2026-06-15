/**
 * 数据脱敏工具
 */

// 1. 姓名脱敏：只留第一个字，其余*
export function desensitizeName(name) {
    if (!name) return ''
    // 单字不脱敏，多字首字保留
    return name.length === 1 ? name : name[0] + '*'.repeat(name.length - 1)
}

// 2. 手机号脱敏：138****1234
export function desensitizePhone(phone) {
    if (!phone || phone.length !== 11) return phone
    return phone.slice(0, 3) + '****' + phone.slice(7)
}

// 3. 身份证脱敏：前6 + **** + 后4
export function desensitizeIdCard(idCard) {
    if (!idCard) return idCard
    const len = idCard.length
    // 18位 / 15位兼容
    if (len === 18) {
        return idCard.slice(0, 6) + '********' + idCard.slice(14)
    } else if (len === 15) {
        return idCard.slice(0, 6) + '*****' + idCard.slice(11)
    }
    return idCard
}

// 4. 车牌号脱敏：京A****12
export function desensitizeCarNo(carNo) {
    if (!carNo || carNo.length < 5) return carNo
    // 保留前2位、最后2位，中间星号
    const start = carNo.slice(0, 2)
    const end = carNo.slice(-2)
    const starCount = carNo.length - 4
    return start + '*'.repeat(starCount) + end
}

// 统一入口方法，一键识别类型脱敏
export const desensitize = (value, type) => {
    switch (type) {
        case 'name':
            return desensitizeName(value)
        case 'phone':
            return desensitizePhone(value)
        case 'idCard':
            return desensitizeIdCard(value)
        case 'carNo':
            return desensitizeCarNo(value)
        default:
            return value
    }
}