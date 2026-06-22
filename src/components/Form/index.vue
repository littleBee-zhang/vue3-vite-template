<template>
  <!-- <el-form ref="formRef" :model="formData" :rules="formRules" v-bind="formProps" :class="className" :style="style" -->
  <el-form ref="formRef" :model="formData" :rules="formRules" v-bind="formProps" :class="className" :style="style"
    :label-width="`${labelCol}px`" :label-position="labelPosition" @submit.prevent="handleConfirm"
    @fields-change="handleFieldsChange" @values-change="handleValuesChange">
    <el-row :gutter="gutter">
      <template v-for="(item, index) in currentDataSource" :key="index">
        <el-col v-if="!shouldHide(item)" :span="item?.span || colSpan"
          :style="shouldDisplayNone(item) ? { display: 'none' } : {}">
          <!-- <el-form-item v-if="item?.key" :label="item?.label" :prop="item?.key" :rules="buildRules(item)" -->
          <el-form-item v-if="item?.key" :label="item?.label" :key="item.key" :prop="item?.key"
            v-bind="item?.props || {}">
            <component :is="resolveView(item)" v-model="formData[item?.key]" v-bind="buildViewProps(item)"
              :placeholder="buildPlaceholder(item)" :clearable="item?.allowClear"
              :style="{ width: item?.width || '100%' }"
              @input="item?.onlyEntryNumber ? handleOnlyNumber(item.key, $event) : null" />
            <!-- <component :is="resolveView(item)" v-model="formData[item?.key]" v-bind="buildViewProps(item)"
              :placeholder="buildPlaceholder(item)" :clearable="item?.allowClear"
              :style="{ width: item?.width || '100%' }" v-if="!item?.onlyEntryNumber" />

            <component :is="resolveView(item)" v-model="formData[item?.key]" v-bind="buildViewProps(item)"
              :placeholder="buildPlaceholder(item)" :style="{ width: item?.width || '100%' }"
              :clearable="item?.allowClear" @input="handleOnlyNumber(item?.key, $event)" v-if="item?.onlyEntryNumber" /> -->
          </el-form-item>

          <el-form-item v-else-if="item?.view === 'Button'" v-bind="item?.props || {}">
            <el-button v-bind="{ ...{ size: 'small' }, ...(item?.buttonProps || {}) }"
              :type="item?.buttonType || 'primary'" @click.stop="handleChangeBtn(item)">
              {{ item?.label || '按钮' }}
            </el-button>
          </el-form-item>
        </el-col>
      </template>

      <!-- 操作按钮：支持自定义插槽，无插槽则显示默认 -->
      <el-col :span="BtnSpan ? 24 : colSpan">
        <div class="former-actions">
          <el-space :size="16" :align="btnAlign">
            <!-- 插槽：自定义按钮 -->
            <slot name="actions" :confirm="handleConfirm" :reset="handleReset" />

            <!-- 无自定义插槽 → 显示默认按钮 -->
            <template v-if="!$slots.actions">
              <el-button v-if="resetText" v-bind="resetProps" @click="handleReset">
                {{ resetText }}
              </el-button>
              <el-button v-if="submitText" type="primary" v-bind="submitProps" @click="handleConfirm">
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
import { ref, reactive, computed, watch, provide } from 'vue'
import models from './models.js'
import regulars from './regulars.js'
import elements from './elements.js'
import { SelectTextList } from './placeholder.js'
const aformRulesOne = {
  "phone": [
    { "required": true, "message": "请输入手机号", "trigger": ["blur", "change"] },
    { "trigger": ["blur", "change", "input"], "pattern": /^1[3-9]\d{9}$/, "message": "请输入正确11位手机号码", }
  ],
}

const props = defineProps({
  formProps: { type: Object, default: () => ({}) },
  form: { type: Object, default: undefined },
  dataSource: { type: [Array, Function], default: () => [] },
  labelCol: { type: Number, default: 60 },
  wrapperCol: { type: Number, default: 16 },
  gutter: { type: Number, default: 8 },
  column: { type: Number, default: 3 },
  onFieldsChange: { type: Function, default: () => { } },
  onValuesChange: { type: Function, default: () => { } },
  onSubmit: { type: Function, default: () => { } },
  onConfirm: { type: Function, default: () => { } },
  submitText: { type: String, default: '确定' },
  resetText: { type: String, default: '重置' },
  submitProps: { type: Object, default: () => { } },
  onReset: { type: Function, default: () => { } },
  btnAlign: { type: String, default: 'center' },
  labelPosition: { type: String, default: 'right' },
  resetProps: { type: Object, default: () => { } },
  renderActions: { type: [Function, null], default: null },
  className: { type: String, default: '' },
  style: { type: Object, default: () => { } },
  BtnSpan: { type: Boolean, default: false }
})

const emit = defineEmits([
  'fields-change',
  'values-change',
  'submit',
  'reset',
  'confirm',
])

const formRef = ref(null)
const formData = reactive({ ...(props?.form || {}) })

const {
  colSpan,
  currentDataSource,
  formRules,
  buildRules,
  resolveView,
  buildViewProps,
  handleChangeBtn,
  buildPlaceholder,
  shouldHide,
  shouldDisplayNone,
  handleOnlyNumber,
  handleFieldsChange,
  handleValuesChange,
  handleConfirm,
  handleReset,
  // 
  setFormValue,
  innerForm
} = models(props, emit, formRef, formData, regulars, elements, SelectTextList)


provide('resolveView', resolveView)

defineExpose({
  form: formRef,
  formData,
  formRules,
  validate: () => formRef.value?.validate(),
  confirm: handleConfirm,
  reset: handleReset,
  resetForm: () => formRef.value?.resetFields(),
  setFormValue
})
</script>
<style lang="scss" scoped>
@use './index.module.scss';
</style>