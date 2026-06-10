<template>
    <span class="number-roll">{{ formatter(displayValue) }}</span>
</template>
<script setup>
import { ref } from 'vue'
import useNumberRoll from './useNumberRoll.js'

// 必须留在 .vue 里
const props = defineProps({
    target: { type: Number, required: true },
    duration: { type: Number, default: 2000 },
    start: { type: Boolean, default: true },
    formatter: { type: Function, default: (val) => val.toLocaleString() },
    easing: { type: String, default: 'easeOut', validator: (v) => ['linear', 'easeOut', 'easeInOut'].includes(v) }
})

const emit = defineEmits(['finished'])

// 调用 hook
const { displayValue } = useNumberRoll(props, emit)
</script>
<!-- <script setup>
import { ref, watch, onMounted } from 'vue'

// 入参定义
const props = defineProps({
    target: { type: Number, required: true },
    duration: { type: Number, default: 2000 },
    start: { type: Boolean, default: true },
    formatter: { type: Function, default: (val) => val.toLocaleString() },
    easing: { type: String, default: 'easeOut', validator: (v) => ['linear', 'easeOut', 'easeInOut'].includes(v) }
})

// 事件抛出
const emit = defineEmits(['finished'])

// 响应式变量
const displayValue = ref(0)
const animating = ref(false)

// 缓动函数集合
const easingFns = {
    linear: (t) => t,
    easeOut: (t) => 1 - Math.pow(1 - t, 3),
    easeInOut: (t) => t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(2 * t - 2, 2) / 2
}

// 启动动画核心方法
const animate = () => {
    if (animating.value) return
    animating.value = true
    const startVal = displayValue.value
    const startTime = performance.now()
    const easeFn = easingFns[props.easing]

    const step = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / props.duration, 1)
        const eased = easeFn(progress)
        displayValue.value = Math.floor(startVal + (props.target - startVal) * eased)

        if (progress < 1) {
            requestAnimationFrame(step)
        } else {
            displayValue.value = props.target
            animating.value = false
            emit('finished')
        }
    }
    requestAnimationFrame(step)
}

// 监听目标值变化，自动重跑动画
watch(() => props.target, () => {
    if (props.start) animate()
}, { immediate: true })

// 挂载时自动执行动画
onMounted(() => {
    if (props.start) animate()
})
</script> -->

<style lang="scss" scoped>
@use './index.module.scss';
</style>