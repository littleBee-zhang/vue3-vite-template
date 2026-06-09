<template>
    <div class="img-preview-box" :style="wrapStyle">
        <!-- 统一转为数组渲染 -->
        <el-image v-for="(url, idx) in imgArr" :key="idx" :src="url" :preview-src-list="imgArr" :style="imgStyle"
            fit="cover" class="thumb-img" />
    </div>
</template>

<script setup>
import { computed } from 'vue'

// 入参
const props = defineProps({
    // 支持字符串单图 / 数组多图
    src: {
        type: [String, Array],
        required: true
    },
    width: {
        type: String,
        default: '100px'
    },
    height: {
        type: String,
        default: '100px'
    },
    radius: {
        type: String,
        default: '4px'
    },
    gap: {
        type: String,
        default: '8px'
    }
})

// 统一转换成数组格式
const imgArr = computed(() => {
    return Array.isArray(props.src) ? props.src : [props.src]
})

// 外层容器样式
const wrapStyle = computed(() => ({
    display: 'flex',
    gap: props.gap,
    flexWrap: 'wrap',
    alignItems: 'center'
}))

// 缩略图样式
const imgStyle = computed(() => ({
    width: props.width,
    height: props.height,
    borderRadius: props.radius
}))
</script>

<style scoped>
.thumb-img {
    cursor: pointer;
    transition: transform 0.2s;
}

.thumb-img:hover {
    transform: scale(1.04);
}
</style>