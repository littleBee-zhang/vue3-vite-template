<template>
  <svg class="svg-icon" :style="{ fontSize: size + 'px', color, width, height }">
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>
<script setup>
import models from './models';
const props = defineProps({
  name: { type: String, default: '' },
  size: { type: [Number, String], default: 18 },
  color: { type: String, default: '' },
  width: { type: [Number, String], default: '1em' },
  height: { type: [Number, String], default: '1em' }
})
</script>
<style scoped lang="scss">
@use './index.module.scss';
</style>