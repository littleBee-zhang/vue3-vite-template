<template>
  <Card>
    <Form ref="formRef" :dataSource="dataSource" :column="3" submit-text="" reset-text="" @submit="handleSubmit"
      @reset="handleReset" @fields-change="handleFieldsChange" @values-change="handleValuesChange" />
    <!-- <Descriptions :detailData="detailInfo" :options="descList" column="2" title="">
    </Descriptions> -->
  </Card>
</template>

<script setup>
import { ElImage } from 'element-plus'

const formerRef = ref(null)
const dataSource = [
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
  { key: 'upload', label: '上传', view: 'MyUpload' },
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
// 
// 接口返回详情数据
const detailInfo = {
  id: 10086,
  userName: 'https://picsum.photos/id/237/200/200https://picsum.photos/id/237/200/200',
  phone: '13900139000',
  state: 1,
  balance: 6892.3,
  createTime: '2026-06-15 14:20:00 ',
  avatar: 'https://picsum.photos/id/237/200/200'
}
// 渲染配置数组
const descList = [
  { label: '编号', prop: 'id' ,span:1 },
  {
    label: '姓名', prop: 'userName',
    render: (row) => {
      return h('span', row?.row.userName)
    },
  },
  {
    label: '手机号', prop: 'phone',
    render: (row) => h(ElImage, {
      src: row?.row.avatar,
      style: 'width:60px;height:60px;border-radius:50%',
      fit: 'cover',
      preview: true // 开启点击预览
    })
  },
  {
    label: '账号状态',
    prop: 'state',
    type: 'tag',
    dict: { 1: '正常', 0: '冻结' },
    tagType: { 1: 'success', 0: 'danger' }
  },
  { label: '账户余额', prop: 'balance', type: 'money', decimal: 2 },
  { label: '创建时间', prop: 'createTime', type: 'date' }
]

// 插槽配置
const slotList = [
  { label: '头像', prop: 'avatar' },
  { label: '用户名', prop: 'userName' }
]
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.app_form {
  width: 50%;
}
</style>