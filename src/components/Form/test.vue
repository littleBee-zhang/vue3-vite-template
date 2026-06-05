<template>
  <el-form
    ref="formRef"
    :model="formData"
    v-bind="formProps"
    :class="className"
    :style="style"
    :label-width="`${labelCol}px`"
    :label-position="labelPosition"
    @submit.prevent="handleConfirm"
    @fields-change="handleFieldsChange"
    @values-change="handleValuesChange"
  >
    <el-row :gutter="gutter">
      <template v-for="(item, index) in currentDataSource" :key="index">
        <el-col
          v-if="!shouldHide(item)"
          :span="item?.span || colSpan"
          :style="shouldDisplayNone(item) ? { display: 'none' } : {}"
        >
          <el-form-item
            v-if="item.key"
            :label="item.label"
            :prop="item.key"
            :rules="buildRules(item)"
            v-bind="item?.props || {}"
          >
            <component
              :is="resolveView(item)"
              v-model="formData[item.key]"
              v-bind="buildViewProps(item)"
              :placeholder="buildPlaceholder(item)"
              :clearable="item?.allowClear"
              :style="{ width: item.width || '100%' }"
              v-if="!item.onlyEntryNumber"
            />

            <component
              :is="resolveView(item)"
              v-model="formData[item.key]"
              v-bind="buildViewProps(item)"
              :placeholder="buildPlaceholder(item)"
              :style="{ width: item.width || '100%' }"
              :clearable="item?.allowClear"
              @input="handleOnlyNumber(item.key, $event)"
              v-if="item.onlyEntryNumber"
            />
          </el-form-item>

          <el-form-item v-else-if="item.view === 'Button'" v-bind="item?.props || {}">
            <el-button
              v-bind="{ ...{ size: 'small' }, ...(item?.buttonProps || {}) }"
              :type="item.buttonType || 'primary'"
              @click.stop="handleChangeBtn(item)"
            >
              {{ item.label || '按钮' }}
            </el-button>
          </el-form-item>
        </el-col>
      </template>

      <!-- 操作按钮：支持自定义插槽，无插槽则显示默认 -->
      <el-col :span="BtnSpan ? 24 : (item?.span || colSpan)">
        <div class="former-actions">
          <el-space size="16" :align="btnAlign">
            <!-- 插槽：自定义按钮 -->
            <slot name="actions" :confirm="handleConfirm" :reset="handleReset" />

            <!-- 无自定义插槽 → 显示默认按钮 -->
            <template v-if="!$slots.actions">
              <el-button v-if="resetText" v-bind="resetProps" @click="handleReset">
                {{ resetText }}
              </el-button>
              <el-button
                v-if="submitText"
                type="primary"
                v-bind="submitProps"
                @click="handleConfirm"
              >
                {{ submitText }}
              </el-button>
            </template>
          </el-space>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed, watch, provide, h } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElButton, ElSpace } from 'element-plus'
import regulars from './regulars.js'
import elements from './elements.js'
import { SelectTextList } from './placeholder.js'

const props = defineProps({
  formProps: { type: Object, default: () => ({}) },
  form: { type: Object, default: undefined },
  dataSource: { type: [Array, Function], default: () => [] },
  labelCol: { type: Number, default: 60 },
  wrapperCol: { type: Number, default: 16 },
  gutter: { type: Number, default: 8 },
  column: { type: Number, default: 3 },
  onFieldsChange: { type: Function, default: () => {} },
  onValuesChange: { type: Function, default: () => {} },
  onSubmit: { type: Function, default: () => {} },
  onConfirm: { type: Function, default: () => {} },
  submitText: { type: String, default: '确定' },
  resetText: { type: String, default: '重置' },
  submitProps: { type: Object, default: () => {} },
  onReset: { type: Function, default: () => {} },
  btnAlign: { type: String, default: 'center' },
  labelPosition: { type: String, default: 'right' },
  resetProps: { type: Object, default: () => {} },
  renderActions: { type: [Function, null], default: null },
  className: { type: String, default: '' },
  style: { type: Object, default: () => {} },
  BtnSpan:{type: Boolean, default: false}
})

const emit = defineEmits([
  'fields-change',
  'values-change',
  'submit',
  'reset',
  'confirm',
])

const formRef = ref(null)
const formData = reactive({ ...(props.form || {}) })

const colSpan = computed(() => 24 / (props.column || 3))

const currentDataSource = computed(() => {
  const type = Object.prototype.toString.call(props.dataSource)
  if (type === '[object Function]') return props.dataSource(formData)
  if (type === '[object Array]') return props.dataSource
  return []
})

watch(
  () => formData,
  (val) => {
    emit('values-change', { ...val }, { ...val })
    props.onValuesChange({ ...val }, { ...val })
  },
  { deep: true }
)

const buildRules = (item) => {
  const rules = []
  if (item.required) {
    rules.push({
      required: true,
      message: item.requiredMsg || `请${SelectTextList.includes(item.view) ? '选择' : '输入'}${item.label}`,
      trigger: 'blur',
    })
  }
  if (item.rules?.length) {
    item.rules.forEach(rule => {
      rules.push({ ...regulars[rule.type] || {}, ...rule })
    })
  }
  return rules
}

const resolveView = (item) => {
  if (!item.view) return 'ElInput'
  if (typeof item.view === 'string') return elements[item.view] || item.view
  return item.view
}

provide('resolveView', resolveView)

const buildViewProps = (item) => ({
  ...item.viewProps || {},
  allowClear: item.allowClear,
})

const handleChangeBtn = async (item) => {
  try {
    if (item.onClick) {
      await formRef.value?.validate()
      await item.onClick(formData)
    }
    if (item.onReset) handleReset()
  } catch (e) { console.error(e) }
}

const buildPlaceholder = (item) =>
  item.placeholder || `ceshi`
  // item.placeholder || `${SelectTextList.includes(item.view) ? '请选择' : '请输入'}${item.label || ''}`

const shouldHide = (item) => typeof item.visible === 'boolean' && !item.visible
const shouldDisplayNone = (item) => typeof item.hide === 'boolean' && item.hide

const handleOnlyNumber = (key, e) => {
  if (e.target) e.target.value = e.target.value.replace(/[^\d.]/g, '')
}

const handleFieldsChange = (...args) => {
  emit('fields-change', ...args)
  props.onFieldsChange(...args)
}

// 确认提交（带校验）
const handleConfirm = async () => {
  try {
    await formRef.value.validate()
    const values = { ...formData }
    emit('confirm', values)
    props.onConfirm(values)
    emit('submit', values)
    props.onSubmit(values)
    return values
  } catch (err) {
    console.warn('表单校验失败', err)
    return false
  }
}

// 重置
const handleReset = () => {
  const res = props.onReset(formData)
  if (res !== false) {
    formRef.value?.resetFields()
    Object.keys(formData).forEach(k => delete formData[k])
  }
  emit('reset', {})
}

// 暴露实例
defineExpose({
  form: formRef,
  formData,
  validate: () => formRef.value?.validate(),
  confirm: handleConfirm,
  reset: handleReset,
})
</script>

<style lang="scss" scoped>
.former-actions {
  margin-top: 16px;
  text-align: center;
}
</style>