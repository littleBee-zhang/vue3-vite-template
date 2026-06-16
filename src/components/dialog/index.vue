<template>
  <div>
    <!-- 打开按钮：支持插槽 或 默认按钮 -->
    <slot name="openButton" :open="handleOpen">
      <el-button v-bind="openButtonProps" @click="handleOpen">
        {{ openText }}
      </el-button>
    </slot>

    <!-- 弹窗 -->
    <el-dialog ref="dialogRef" append-to-body v-model="visible" :title="title" :width="dialogWidth" :class="className"
      :style="style" destroy-on-close @close="handleCancel" @closed="afterClose" z-index="ZIndex">
      <slot />

      <template #footer v-if="!customFooter">
        <div class="dialog-footer">
          <el-button v-if="cancelText" v-bind="cancelButtonProps" @click="handleCancel">
            {{ cancelText }}
          </el-button>
          <el-button v-if="okText" type="primary" v-bind="okButtonProps" @click="handleOk">
            {{ okText }}
          </el-button>
        </div>
      </template>

      <template #footer v-else>
        <component :is="customFooter(close)" />
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import models from './models.js'

// 必须留在 vue
const props = defineProps({
  className: { type: String, default: '' },
  style: { type: Object, default: () => ({}) },
  title: { type: String, default: '标题' },
  openText: { type: String, default: '打开' },
  openButtonProps: { type: Object, default: () => ({ link: true, type: 'primary' }) },
  onOpen: { type: Function, default: () => { } },
  okText: { type: String, default: '确定' },
  okButtonProps: { type: Object, default: () => ({}) },
  onOk: { type: Function, default: () => { } },
  cancelText: { type: String, default: '取消' },
  cancelButtonProps: { type: Object, default: () => ({}) },
  onCancel: { type: Function, default: () => { } },
  afterClose: { type: Function, default: () => { } },
  footer: { type: [Function, Object, String] },
  width: { type: [String, Number], default: 'medium' },
  ZIndex: { type: Number, default: 9999 }
})

const emit = defineEmits(['ok', 'cancel', 'open'])
const dialogRef = ref(null)

// 逻辑全部抽离
const {
  visible,
  close,
  dialogWidth,
  customFooter,
  handleOpen,
  handleOk,
  handleCancel
} = models(props, emit)

// 暴露方法
defineExpose({ open: handleOpen, close, visible })
</script>
<!-- <script setup>
import { ref, computed } from 'vue'
import { ElButton, ElDialog } from 'element-plus'

const props = defineProps({
  className: { type: String, default: '' },
  style: { type: Object, default: () => ({}) },
  title: { type: String, default: '标题' },
  openText: { type: String, default: '打开' },
  openButtonProps: { type: Object, default: () => ({ link: true, type: 'primary' }) },
  onOpen: { type: Function, default: () => { } },
  okText: { type: String, default: '确定' },
  okButtonProps: { type: Object, default: () => ({}) },
  onOk: { type: Function, default: () => { } },
  cancelText: { type: String, default: '取消' },
  cancelButtonProps: { type: Object, default: () => ({}) },
  onCancel: { type: Function, default: () => { } },
  afterClose: { type: Function, default: () => { } },
  footer: { type: [Function, Object, String] },
  width: { type: [String, Number], default: 'medium' },
  ZIndex: { type: Number, default: 9999 }
})

const emit = defineEmits(['ok', 'cancel', 'open'])

const dialogRef = ref(null)
const visible = ref(false)
const close = () => (visible.value = false)

const dialogWidth = computed(() => {
  const map = { small: '480px', medium: '680px', large: '880px' }
  return map[props.width] || props.width
})

const customFooter = computed(() => {
  if (typeof props.footer === 'function') return props.footer
  return null
})

const handleOpen = () => {
  emit('open')
  props.onOpen()
  visible.value = true
}

const handleOk = async () => {
  // 把关闭方法传给父组件
  await props.onOk(close)
  emit('ok')
}

const handleCancel = () => {
  props.onCancel()
  close()
  emit('cancel')
}
// 暴露实例
defineExpose({ open: handleOpen, close, visible })
</script> -->

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>