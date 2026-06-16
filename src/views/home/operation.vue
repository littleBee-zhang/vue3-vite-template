<template>
  <!--  -->
  <Dialog :title="title" :openButtonProps="openButtonProps" :openText="openText" @open="() => {
    console.log(props?.row, '打开弹窗之前');
  }" :on-ok="(close) => {
    close()
  }">
    弹窗内容
  </Dialog>
</template>

<script setup>
// Props配置
const props = defineProps({
  row: {
    type: Object,
    default: {}
  },
  minHeight: {
    type: [Number, String],
    default: '200px'
  },
  title: { type: String, default: '标题' },
  openText: { type: String, default: '编辑' },
  openButtonProps: { type: Object, default: () => ({}) },
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

<style scoped lang="scss"></style>