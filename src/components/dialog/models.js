import { computed, ref } from 'vue'

export default function useDialog(props, emit) {
    const visible = ref(false)
    const close = () => (visible.value = false)

    // 宽度映射
    const dialogWidth = computed(() => {
        const map = { small: '480px', medium: '680px', large: '880px' }
        return map[props.width] || props.width
    })

    // 自定义底部
    const customFooter = computed(() => {
        if (typeof props.footer === 'function') return props.footer
        return null
    })

    // 打开
    const handleOpen = () => {
        emit('open')
        props.onOpen()
        visible.value = true
    }

    // 确定
    const handleOk = async () => {
        await props.onOk(close)
        emit('ok')
    }

    // 取消
    const handleCancel = () => {
        props.onCancel()
        close()
        emit('cancel')
    }

    return {
        visible,
        close,
        dialogWidth,
        customFooter,
        handleOpen,
        handleOk,
        handleCancel
    }
}