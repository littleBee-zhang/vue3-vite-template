<template>
    <!-- 图表容器，宽高由父组件控制或传参 -->
    <div ref="chartBox" class="echart-container" :style="containerStyle"></div>
</template>
<script setup>
import { ref, computed } from 'vue'
import models from './models'

// 👇 必须留在 vue
const props = defineProps({
    option: { type: Object, required: true },
    width: { type: String, default: '100%' },
    height: { type: String, default: '400px' },
    notMerge: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

// 容器
const chartBox = ref(null)

// 调用 hook
const { containerStyle } = models(props, emit, chartBox)
</script>
<!-- <script setup>
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
// 引入3D扩展
import 'echarts-gl'
// 接收父组件参数
const props = defineProps({
    // 核心配置项 外部传入
    option: {
        type: Object,
        required: true
    },
    // 容器宽度
    width: {
        type: String,
        default: '100%'
    },
    // 容器高度
    height: {
        type: String,
        default: '400px'
    },
    // 是否清空原有配置更新
    notMerge: {
        type: Boolean,
        default: false
    }
})

// 抛出事件
const emit = defineEmits(['click'])

// 容器dom
const chartBox = ref(null)
// echarts实例
let chartInstance = null

// 计算容器样式
const containerStyle = computed(() => ({
    width: props.width,
    height: props.height
}))

// 初始化渲染图表
const renderChart = async () => {
    await nextTick()
    if (!chartBox.value) return

    // 实例不存在则初始化
    if (!chartInstance) {
        chartInstance = echarts.init(chartBox.value)
        // 绑定点击事件向外抛出
        chartInstance.on('click', (params) => {
            emit('click', params)
        })
        // 窗口自适应防抖
        window.addEventListener('resize', handleResize)
    }

    // 更新配置
    chartInstance.setOption(props.option, props.notMerge)
}

// 窗口大小变化重绘
const handleResize = () => {
    if (chartInstance) {
        chartInstance.resize()
    }
}

// 深度监听option变化，自动刷新图表
watch(
    () => props.option,
    () => {
        renderChart()
    },
    { deep: true }
)

// 页面挂载渲染
onMounted(() => {
    renderChart()
})

// 组件销毁 释放实例 清除监听 防止内存泄漏
onUnmounted(() => {
    if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
    }
    window.removeEventListener('resize', handleResize)
})
</script> -->

<style scoped>
.echart-container {
    width: 100%;
}
</style>