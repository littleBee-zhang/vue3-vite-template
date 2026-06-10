import { computed } from 'vue'

export default function models(props) {
    // 统一转数组
    const imgArr = computed(() => {
        return Array.isArray(props.src) ? props.src : [props.src]
    })

    // 容器样式
    const wrapStyle = computed(() => ({
        display: 'flex',
        gap: props.gap,
        flexWrap: 'wrap',
        alignItems: 'center'
    }))

    // 图片样式
    const imgStyle = computed(() => ({
        width: props.width,
        height: props.height,
        borderRadius: props.radius
    }))

    return {
        imgArr,
        wrapStyle,
        imgStyle
    }
}