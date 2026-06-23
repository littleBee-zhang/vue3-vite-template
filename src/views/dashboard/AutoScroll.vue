<template>
    <div ref="scrollWrapRef" class="auto-scroll-wrap" @mouseenter="pauseScroll" @mouseleave="startScroll">
        <slot />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
    step: { type: [Number, String], default: 1 },
    interval: { type: [Number, String], default: 30 },
    resetInterval: { type: [Number, String], default: 30 * 60 * 1000 },
    autoStart: { type: Boolean, default: true }
})
const scrollWrapRef = ref(null)
let rafId = null
let isRunning = false
let resetTimer = null
let lastTime = 0

// 彻底停止所有动画+定时
const pauseScroll = () => {
    isRunning = false
    if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
    }
    if (resetTimer) {
        clearInterval(resetTimer)
        resetTimer = null
    }
}

// 滚动主循环
const scrollLoop = (timestamp) => {
    if (!isRunning || !scrollWrapRef.value) return

    // 间隔节流控制速度
    if (timestamp - lastTime < props.interval) {
        rafId = requestAnimationFrame(scrollLoop)
        return
    }
    lastTime = timestamp

    const wrap = scrollWrapRef.value
    // 消除浮点精度误差
    const scrollTop = Math.round(wrap.scrollTop * 100) / 100
    const maxScroll = wrap.scrollHeight - wrap.clientHeight

    if (scrollTop >= maxScroll - 0.3) {
        wrap.scrollTop = 0
    } else {
        wrap.scrollTop += props.step
    }

    rafId = requestAnimationFrame(scrollLoop)
}

// 启动滚动（防重复启动）
const startScroll = () => {
    if (isRunning) return
    pauseScroll()
    isRunning = true
    lastTime = performance.now()
    rafId = requestAnimationFrame(scrollLoop)

    // 定时自动重置兜底，防止长期运行卡死
    if (props.resetInterval > 0) {
        resetTimer = setInterval(() => {
            if (scrollWrapRef.value && isRunning) {
                scrollWrapRef.value.scrollTop = 0
            }
        }, props.resetInterval)
    }
}

onMounted(() => {
    nextTick(() => {
        // 延迟等待内容完全渲染，避免初始scrollHeight获取错误
        setTimeout(() => {
            if (props.autoStart) startScroll()
        }, 100)
    })
})

// 组件销毁强制清理所有资源，防内存泄漏
onUnmounted(() => {
    pauseScroll()
})

// 外部修改autoStart响应启停
watch(() => props.autoStart, (val) => {
    val ? startScroll() : pauseScroll()
})
</script>

<style scoped>
.auto-scroll-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>