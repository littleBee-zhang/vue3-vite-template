<template>
  <Card>
    <Form
      ref="formRef"
      :dataSource="dataSource"
      :column="3"
      submit-text="提交"
      reset-text="重置"
      @submit="handleSubmit"
      @reset="handleReset"
      @fields-change="handleFieldsChange"
      @values-change="handleValuesChange"
    />
  </Card>
</template>

<script setup>
const formerRef = ref(null)
const dataSource =  [
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
      view: 'Input',
      required: true,
    },
    {
      key: 'gender',
      label: '性别',
      view: 'VirtualSelect',
      required: true,
      viewProps: {
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 2 },
        ],
        allowClear: true,
      },
    },
    { key: 'birthday', label: '生日', view: 'Picker' },
    { key: 'city', label: '城市', view: 'Cascader' },
    { key: 'remark', label: '备注', view: 'Input', viewProps: { type: 'textarea' } },
  ]


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

<style lang="scss" scoped>
.app{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.app_form{
  width: 50%;
}
</style>