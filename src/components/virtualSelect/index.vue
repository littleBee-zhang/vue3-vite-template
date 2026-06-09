<template>
  <el-select-v2 :multiple="multiple" :filterable="filterable" :remote="remote" :remote-method="remoteMethod"
    :clearable="clearable" :options="optionsList" :disabled="disabled" :loading="loading" :placeholder="placeholder"
    :value-key="valueKey" option-label="labelKey" v-model="selectedValue" remote-show-suffix :placement="placement"
    @clear="$emit('clear')"></el-select-v2>
</template>

<script setup>
import { ref, watch } from 'vue';
// --- Props ---
const props = defineProps({
  modelValue: { type: [String, Number, Object], default: null },// v-model 的值
  options: { type: Array, required: true },// 数据源（一次性传入所有数据）
  valueKey: { type: String, default: 'value' },// 值的键名，如 'id'
  labelKey: { type: String, default: 'label' },// 标签的键名，如 'label'
  placeholder: { type: String, default: '请选择' },
  placement: { type: String, default: 'bottom' },
  disabled: { type: Boolean, default: false },
  filterable: { type: Boolean, default: true },
  remote: { type: Boolean, default: true },
  clearable: { type: Boolean, default: true },
  itemHeight: { type: Number, default: 34 },  // 每个选项的高度(px) Element Plus 默认选项高度
  labelList: { type: Array, default: [{ value: null, label: '请选择', disabled: true }] },
  multiple: { type: Boolean, default: false }
});

// --- Emits ---
const emit = defineEmits(['update:modelValue', 'clear']);

const selectedValue = ref(props.modelValue || (props.multiple ? [] : ''));
const optionsList = ref([...props.labelList, ...props.options || []]);
const loading = ref(false);

const remoteMethod = (query) => {
  if (query === "") {
    // 清空搜索时，重置为原始数据
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      optionsList.value = [...props.labelList, ...props.options];
    }, 200);
  } else {
    // 有搜索词时，进行过滤
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      // 从原始 options 中过滤，不要从 optionsList 过滤（防止累积错误）
      optionsList.value = [...props.labelList, ...(props?.options || [])].filter((item) => {
        const label = item[props.labelKey]?.toString().toLowerCase() || '';
        return label.includes(query.toLowerCase());
      });
    }, 200);
  }
};

// 监听外部传入的 options 变化，重置状态
watch(() => props.options, (newVal) => {
  optionsList.value = [...props.labelList, ...(newVal || [])];
  // 如果当前有搜索词，可能需要重新过滤，这里简单处理：如有值就重置搜索
  if (selectedValue.value) {
    remoteMethod('')
    // 可选：这里可以触发一次 remoteMethod() 来重置
  }
}, { immediate: true });

// 当父组件 modelValue 变化时，同步内部值
watch(() => props.modelValue, (newVal) => {
  selectedValue.value = newVal;
}, { immediate: true });

// 当内部选中值变化时，通知父组件
watch(selectedValue, (newVal) => {
  emit('update:modelValue', newVal);
});

// 这是解决弹窗场景问题的关键
watch(() => props.key, (newKey) => {
  // 重置 optionsList 为最新的 props.options
  optionsList.value = [...props.labelList, ...(props?.options || [])];
  // 重置 selectedValue 为最新的 props.modelValue
  selectedValue.value = props.modelValue;
}, { immediate: true }); //immediate: true 确保组件创建时也执行一次
</script>

<style scoped>
.pagination-virtual-select-container {
  width: 100%;
  max-width: 400px;
}

.select-dropdown {
  width: 100%;
}

.scroll-container {
  height: 200px;
  /* 可见区域高度 */
  overflow-y: auto;
  position: relative;
}

.scroll-spacer {
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
}

.scroll-content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  will-change: transform;
}

.scroll-item {
  height: v-bind(itemHeight + 'px');
  line-height: v-bind(itemHeight + 'px');
  padding: 0 15px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scroll-item:hover {
  background-color: #f5f7fa;
}

.scroll-item.is-selected {
  background-color: #ecf5ff;
  color: #409eff;
}

.loading-indicator,
.no-more-indicator {
  height: v-bind(itemHeight + 'px');
  line-height: v-bind(itemHeight + 'px');
  text-align: center;
  color: #909399;
  font-size: 12px;
}

.selected-label-display {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
}
</style>