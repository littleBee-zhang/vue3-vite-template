export default function models(props, emit) {
    // 纯百分比均分，column=2 就是 50%
    const basePercent = `${100 / props.column}%`

    const formatValue = (val, item) => {
        if ([null, undefined, ''].includes(val)) return '-'
        if (item.type === 'status') return item.dict?.[val] ?? val
        if (item.type === 'date') return new Date(val).toLocaleString()
        if (item.type === 'money') return Number(val).toFixed(item.decimal || 2)
        return val
    }

    return {
        formatValue,
        basePercent,
    }
}