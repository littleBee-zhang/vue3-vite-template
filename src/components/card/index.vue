<template>
  <el-card 
    :style="{
        'min-height': minHeight,
        'max-height': maxHeight,
        'width':width
    }"
  >
    <!-- <template #default></template> -->
    <slot />
  </el-card>
</template>

<script setup>
import { ref, computed, watch, h } from 'vue'

// Props配置
const props = defineProps({
  maxHeight: {
    type: [Number, String],
    default: null
  },
  maxHeight: {
    type: [Number, String],
    default: '480px'
  },
  minHeight: {
    type: [Number, String],
    default: '200px'
  },
  width:{
    type: [Number, String],
    default: '100%'
  }
})

// 自定义事件
const emit = defineEmits([
  'update:currentPage',
  'update:pageSize',
  'selection-change',
  'sort-change',
  'page-change',
  'size-change'
])

</script>

<style scoped lang="scss">
</style>