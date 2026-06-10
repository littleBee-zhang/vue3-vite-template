import { watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'

export default function models(props, emit, chartBox) {
    // echarts 实例
    let chartInstance = null

    // 容器样式
    const containerStyle = computed(() => ({
        width: props.width,
        height: props.height
    }))

    // 初始化图表
    const renderChart = async () => {
        await nextTick()
        if (!chartBox.value) return

        if (!chartInstance) {
            chartInstance = echarts.init(chartBox.value)

            // 点击事件
            chartInstance.on('click', (params) => {
                emit('click', params)
            })

            // 监听窗口变化
            window.addEventListener('resize', handleResize)
        }

        // 更新配置
        chartInstance.setOption(props.option, props.notMerge)
    }

    // 窗口 resize
    const handleResize = () => {
        if (chartInstance) chartInstance.resize()
    }

    // 监听配置变化
    watch(
        () => props.option,
        () => renderChart(),
        { deep: true }
    )

    // 挂载
    onMounted(() => renderChart())

    // 销毁
    onUnmounted(() => {
        if (chartInstance) {
            chartInstance.dispose()
            chartInstance = null
        }
        window.removeEventListener('resize', handleResize)
    })

    return {
        containerStyle
    }
}