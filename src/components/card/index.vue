<template>
  <el-card :style="{
    'min-height': minHeight,
    'max-height': maxHeight,
    'width': width
  }">
    <!-- <template #default></template> -->
    <slot />
  </el-card>
</template>

<script setup>
import models from './models'

// Props配置
const props = defineProps({
  // maxHeight: {
  //   type: [Number, String],
  //   default: null
  // },
  maxHeight: {
    type: [Number, String],
    default: '100%'
  },
  minHeight: {
    type: [Number, String],
    default: '400px'
  },
  width: {
    type: [Number, String],
    default: '100%'
  }
})

</script>

<style scoped lang="scss">
@use './index.module.scss'
</style>