<template>
  <Former
    ref="tableRef"
    :data-source="dataSource"
    :column="2"
    submit-text="提交"
    reset-text="重置"
    @submit="handleSubmit"
    @reset="handleReset"
    @fields-change="handleFieldsChange"
    @values-change="handleValuesChange"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import Former from '@/components/former/index.vue'

const formerRef = ref(null)
const dataSource = computed(() => {
  return [
    {
      key: 'name',
      label: '姓名',
      view: 'Input',
      required: true,
      viewProps: {
        append: () => h('span', { style: { color: 'red' } }, '*'),
      },
    },
    {
      key: 'mobile',
      label: '手机号',
      view: 'Input',
      rules: [{ type: 'mobile' }],
      viewProps: { type: 'tel' },
    },
    {
      key: 'age',
      label: '年龄',
      view: 'InputNumber',
      required: true,
      viewProps: {
        formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
      },
    },
    {
      key: 'gender',
      label: '性别',
      view: 'Select',
      required: true,
      viewProps: {
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 2 },
        ],
        placeholder: '请选择性别',
        allowClear: true,
      },
    },
    { key: 'birthday', label: '生日', view: 'Picker' },
    { key: 'city', label: '城市', view: 'Cascader' },
    { key: 'remark', label: '备注', view: 'Input', viewProps: { type: 'textarea' } },
  ]
})

// 提交事件
const handleSubmit = (values) => {
  console.log('提交数据：', values)
}
// 重置事件
const handleReset = () => {
  // console.log('重置表单')
}
// 字段结构变化
const handleFieldsChange = (changed, all) => {
  // console.log('字段变化', changed, all)
}
// 表单值变化
const handleValuesChange = (changed, all) => {
  // console.log('值变化', changed, all)
}
</script>
<!-- Props API 说明 -->
参数	类型	默认值	说明
formProps	Object	()=>({})	原生 el-form 全部属性透传
form	Object	undefined	表单绑定数据源，v-model 双向绑定
dataSource	Array｜Function	()=>[]	表单配置项数组，支持函数动态返回配置
labelCol	Number	8	label 占栅格宽度（24 栅格体系）
wrapperCol	Number	16	内容区域占栅格宽度
gutter	Number	8	表单项之间间距
column	Number	3	一行展示几列，自动计算 col-span
onFieldsChange	Function	()=>{}	字段结构变更回调
onValuesChange	Function	()=>{}	表单值修改回调
onSubmit	Function	()=>{}	表单提交自定义回调
submitText	String	确定	提交按钮文案
submitProps	Object	()=>({})	提交按钮属性透传
onReset	Function	()=>{}	重置自定义钩子
resetText	String	重置	重置按钮文案
resetProps	Object	()=>({})	重置按钮属性透传
renderActions	Function｜null	null	自定义底部操作栏渲染
className	String	''	表单外层自定义类名
style	Object	()=>({})	表单行内样式
<!-- dataSource 配置项字段说明 -->
字段	说明
key	字段唯一标识，绑定 form 表单字段，非按钮项必填
label	表单项 label 展示文案
view	组件标识，和elements.js导出 key 对应（Input/Select/Picker/Cascader 等）
required	Boolean，是否必填，自动生成必填校验规则
requiredMsg	自定义必填错误提示文案
rules	校验规则数组，[{type:'规则key'}]，对应regulars.js内置正则
viewProps	对应组件原生属性（options/placeholder/allowClear/formatter 等）
allowClear	是否开启清空
onlyEntryNumber	Boolean，仅允许输入数字
span	单独自定义当前项所占栅格，优先级高于全局 column
visible	Boolean，false 则直接移除 dom（不渲染）
hide	Boolean，false 则 display:none 隐藏（dom 保留）
buttonType	仅 view=Button 时生效，按钮类型 primary/success
onClick/onReset	仅 view=Button 时，按钮点击回调
<!-- 事件 -->
事件	参数	说明
@submit	values	表单校验通过后触发，values 为全量表单数据
@reset	-	点击重置按钮触发
@fields-change	(changedFields, allFields)	字段结构变化
@values-change	(changedFields, allFields)	表单值发生修改