import { ref, watch } from 'vue'

export default function useSelect(props, emit) {
    const selectedValue = ref(props.modelValue || (props.multiple ? [] : ''))
    const optionsList = ref([...props.labelList, ...props.options || []])
    const loading = ref(false)

    // 远程搜索
    const remoteMethod = (query) => {
        if (query === '') {
            loading.value = true
            setTimeout(() => {
                loading.value = false
                optionsList.value = [...props.labelList, ...props.options]
            }, 200)
        } else {
            loading.value = true
            setTimeout(() => {
                loading.value = false
                optionsList.value = [...props.labelList, ...(props?.options || [])].filter((item) => {
                    const label = item[props.labelKey]?.toString().toLowerCase() || ''
                    return label.includes(query.toLowerCase())
                })
            }, 200)
        }
    }

    // 监听 options 变化
    watch(() => props.options, (newVal) => {
        optionsList.value = [...props.labelList, ...(newVal || [])]
        if (selectedValue.value) {
            remoteMethod('')
        }
    }, { immediate: true })

    // 监听外部 v-model 变化
    watch(() => props.modelValue, (newVal) => {
        selectedValue.value = newVal
    }, { immediate: true })

    // 内部变化同步外部
    watch(selectedValue, (newVal) => {
        emit('update:modelValue', newVal)
    })

    // 监听 key 重置
    watch(() => props.key, () => {
        optionsList.value = [...props.labelList, ...(props?.options || [])]
        selectedValue.value = props.modelValue
    }, { immediate: true })

    return {
        selectedValue,
        optionsList,
        loading,
        remoteMethod
    }
}