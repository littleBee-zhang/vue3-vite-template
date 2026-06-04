<template>
  <el-form
    ref="formRef"
    :model="formData"
    v-bind="formProps"
    :class="className"
    :style="style"
    :label-width="labelCol"
    :label-position="labelPosition"
    @submit.prevent="handleSubmit"
    @fields-change="handleFieldsChange"
    @values-change="handleValuesChange"
  >
    <el-row :gutter="gutter">
      <template v-for="(item, index) in currentDataSource" :key="index">
        <!-- 隐藏字段 -->
        <el-col
          v-if="!shouldHide(item)"
          :span="item?.span || colSpan"
          :style="shouldDisplayNone(item) ? {display:'none'} : {}"
        >
          <!-- 带key 普通表单项 -->
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
              :style="{width: item.width || '100%'}"
              v-if="!item.onlyEntryNumber"
            />
            <!-- 纯数字输入 -->
            <component
              :is="resolveView(item)"
              v-model="formData[item.key]"
              v-bind="buildViewProps(item)"
              :placeholder="buildPlaceholder(item)"
              @input="handleOnlyNumber(item.key, $event)"
              v-if="item.onlyEntryNumber"
            />
          </el-form-item>

          <!-- 无key按钮类型 -->
          <el-form-item v-else-if="item.view === 'Button'" v-bind="item?.props || {}">
            <el-button
              v-bind="{size:'small',...item?.buttonProps || {}}"
              :type="item.buttonType || 'primary'"
              @click.stop="handleChangeBtn(item)"
            >{{item.label || '按钮'}}</el-button>
          </el-form-item>
        </el-col>
      </template>
    </el-row>

    <!-- 操作按钮区域 -->
    <div class="former-actions">
      <el-space size="16" :align="btnAlign">
        <!-- 重置按钮 -->
        <el-button
          v-if="resetText"
          v-bind="resetProps"
          @click="handleReset"
        >{{resetText}}</el-button>
        <!-- 提交按钮 -->
        <el-button
          v-if="submitText"
          type="primary"
          v-bind="submitProps"
          @click="handleSubmit"
        >{{submitText}}</el-button>
        <!-- 自定义渲染按钮 -->
        <div v-if="typeof renderActions === 'function'" v-html="renderActions({ submit, reset })"></div>
      </el-space>
    </div>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed, watch, provide } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElButton, ElSpace } from 'element-plus'
import regulars from './regulars'
import elements from './elements'

// props定义
const props = defineProps({
  formProps: { type: Object, default: () => ({}) },
  form: { type: Object, default: undefined },
  dataSource: { type: Array, Function, default: () => [] },
  labelCol: { type: Number, default:8 },
  wrapperCol: { type: Number, default:16 },
  gutter: { type: Number, default:8 },
  column: { type: Number, default:3 },
  onFieldsChange: { type: Function, default: () => {} },
  onValuesChange: { type: Function, default: () => {} },
  onSubmit: { type: Function, default: () => {} },
  submitText: { type: String, default: '确定' },
  resetText: { type: String, default: '重置' },
  submitProps: { type: Object, default: () => {} },
  onReset: { type: Function, default: () => {} },
  btnAlign: { type: String, default: 'center' },
  labelPosition: { type: String, default:'right' },
  resetProps: { type: Object, default: () => {} },
  renderActions: { type: [Function, null], default: null },
  className: { type: String, default:'' },
  style: { type: Object, default: () => {} },
})

// emit定义
const emit = defineEmits([
  'fields-change',
  'values-change',
  'submit',
  'reset',
])

const formRef = ref(null)
const formData = reactive(props.form || {})
// 计算列跨度
const colSpan = computed(() => 24 / (props.column || 3))

// 数据源适配：支持函数/数组
const currentDataSource = computed(() => {
  const type = Object.prototype.toString.call(props.dataSource);
  if (type === '[object Function]') {
    return props.dataSource(formData);
  } else if (type === '[object Array]') {
    return props.dataSource;
  }
  return [];
})

// 监听表单值变化
watch(
  () => formData,
  (newVal) => {
    emit('values-change', newVal, {...newVal});
    props.onValuesChange(newVal, {...newVal});
  },
  { deep:true }
)

// 构建表单校验规则
const buildRules = (item) => {
  const rules = [];
  // 必填项规则
  if (item.required) {
    rules.push({
      required:true,
      message: item?.requiredMsg || `请${['Select','Picker','TreeSelect'].some(k=>k===item.view)?'选择':'输入'}${item.label}`,
      trigger: 'blur',
    })
  }
  // 自定义正则规则
  if (item.rules && Array.isArray(item.rules)) {
    item.rules.forEach(rule=>{
      rules.push({
        ...regulars[rule?.type] || {},
        ...rule,
      })
    })
  }
  return rules;
}

// 解析组件名称
const resolveView = (item) => {
  const props = {
    placeholder:
      item?.view === 'RangePicker'
        ? undefined
        : item?.placeholder || `${['Select','Picker','TreeSelect'].some(key=>key.includes(item.view))?'请选择':'请输入'}${item?.label || ''}`,
    allowClear: item?.allowClear,
    ...item?.viewProps || {},
  };
  const viewType = Object.prototype.toString.call(item.view);
  // 插槽场景
  const {prepend, append, prefix, suffix, default:defaultSlot, ...restProps} = props;
  if(viewType === '[object String]'){
    const Element = elements[item.view] || null;
    if(prepend||append||suffix||defaultSlot){
      return h(Element, restProps,{
        prepend: prepend?()=>prepend:null,
        append: append?()=>append:null,
        suffix: suffix?()=>suffix:null,
        default: defaultSlot?()=>defaultSlot:null,
        prefix: prefix?()=>prefix:null,
      })
    }else if(viewType === '[object Object]' || viewType === '[object Function]'){
      return h(item.view,{
        ...restProps,
        prepend: prepend?()=>prepend:null,
        append: append?()=>append:null,
        suffix: suffix?()=>suffix:null,
        default: defaultSlot?()=>defaultSlot:null,
        prefix: prefix?()=>prefix:null,
      })
    }
    return null;
  }
  return null;
}

// 注入组件渲染方法
provide('resolveView', resolveView)

// 构建组件属性
const buildViewProps = (item) => {
  return {
    ...item?.viewProps || {},
    allowClear: item?.allowClear,
    placeholder:
      item.view === 'RangePicker'
        ? undefined
        : item?.placeholder || `${['Select','Picker','TimeSelect'].some(k => k === item.view) ? '请选择' : '请输入'}${item?.label || ''}`,
  };
};

// 按钮自定义事件
const handleChangeBtn = async (params) => {
  try {
    if(params.onClick){
      await formRef.value?.validate();
      const result = await params.onClick(formData)
      if(result === false) return
    }
    if(params.onReset){
      const result = props.onReset(formData);
      if(result){
        formRef.value?.resetFields();
        Object.keys(formData).forEach(key=>{
          delete formData[key];
        })
      }
    }
  } catch (error) {
    console.error('确认操作失败',error)
  }
}

// 生成placeholder
const buildPlaceholder = (item) => {
  return item?.placeholder || buildViewProps(item).placeholder;
}

// 是否隐藏字段
const shouldHide = (item) => {
  const type = Object.prototype.toString.call(item?.visible);
  return type === '[object Boolean]' && item.visible === false;
}

// display:none隐藏
const shouldDisplayNone = (item) => {
  const type = Object.prototype.toString.call(item?.hide);
  return type === '[object Boolean]' && item.hide;
}

// 仅数字输入过滤
const handleOnlyNumber = (key, val) => {
  formData[key] = val.replace(/[^\d]/g,'');
}

// 字段变化回调
const handleFieldsChange = (changedFields, allFields) => {
  emit('fields-change', changedFields, allFields);
  props.onFieldsChange(changedFields, allFields);
}
const handleValuesChange = (changedFields, allFields) => {
  emit('values-change', changedFields, allFields);
  props.onValuesChange(changedFields, allFields);
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    const values = {...formData};
    emit('submit', values);
    props.onSubmit(values);
  } catch (error) {
    console.warn('表单校验失败:', error)
  }
}

// 重置表单
const handleReset = () => {
  const result = props.onReset(formData);
  if(result){
    formRef.value?.resetFields();
    Object.keys(formData).forEach(key=>{
      delete formData[key];
    })
  }
  emit('reset',{})
}

// 对外暴露方法
defineExpose({
  formRef,
  reset:()=>{
    const result = props.onReset(formData);
    if(result){
      formRef.value?.resetFields();
      Object.keys(formData).forEach(key=>delete formData[key])
    }
  },
  validateFields:async ()=>{
    try {
      const row = await formRef.value.validate();
      const values = {...formData};
      if(!row) return values;
    } catch (error) {
      console.warn('表单校验失败',error)
    }
  }
})
</script>

<style lang="scss" scoped>
.former-actions {
  margin-top: 16px;
  text-align: center;
}
</style>