<template>
  <div>
    <Card>
      <!-- <ElButton>12</ElButton> -->
      <Table
        ref="tableRef"
        :columns="columns"
        :data-source="dataList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @selection-change="handleSelectionChange"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </Card>
  </div>
</template>
<script setup>
import Table from '@/components/table/index.vue'
import Card from '@/components/card/index.vue'
// 选中数据
const selectedRows = ref([])
const loading = ref(false)
const tableRef = ref(null)
// 分页配置
const pagination = reactive({
  current:1,
  pageSize:10,
  total:1
})
const columns = ref([
  { title: '姓名', dataIndex: 'name', width:120 },
  { title: '年龄', dataIndex: 'age', width:80, align:'center' },
  { title: '地址', dataIndex: 'address', ellipsis:true },
      {
        title: '状态',
        dataIndex: 'status',
        width:150,
        align:'center',
        render:(row)=> {
            return h(
                'span', // 标签名
                { type: row.status === 0 ? 'danger' : 'success' },
                () => row.status === 0 ? '失败' : '成功'
            );
        }
      },
  {
    title: '操作',
    dataIndex: 'action',
    width:150,
    align:'center',
    customRender:true,
  },
])
// 数据源
const dataList = ref([
  { id:1, name:'张三', age:28, address:'北京市朝阳区xxx街道' },
  { id:2, name:'李四', age:32, address:'上海市浦东新区xxx路' },
])

// 分页切换
const handlePageChange = (page,size)=>{
  pagination.current = 1
  pagination.pageSize = size
}
const handleSizeChange = (page)=>{
  pagination.current = page
}
// 多选事件
const handleSelectionChange = (event)=>{
  selectedRows.value = event
}

// 1.清空选中
const handleClearSelection = ()=>{
  tableRef.value.clearSelection()
  ElMessage.success('已清除选中')
}
// 2.全选/取消全选
const handleToggleAll = ()=>{
  tableRef.value.toggleAllSelection()
}
// 3.获取选中行
const handleGetSelected = ()=>{
  const rows = tableRef.value.getSelectedRows()
  ElMessage.info(`共选中${rows.length}行`)
}
// 4.刷新表格
const handleRefresh = ()=>{
  tableRef.value.refresh()
}
// 
onMounted(()=>{
  loading.value = true
  setTimeout(()=>{
    loading.value = false
  },1000)
})
</script>