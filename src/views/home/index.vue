<template>
  <div>
    <MyCard>
      <Icon name="jiaoseguanli" />
      <MyTable
        row-key="id"
        ref="tableRef"
        :columns="columns"
        :data-source="dataList"
        :loading="loading"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </MyCard>
  </div>
</template>
<script setup>
// import { Dialog } from '@/components/index.js'
import { getList } from '@/api/index.js'
// 选中数据
const selectedRows = ref([])
const loading = ref(false)
const tableRef = ref(null)
// 分页配置
const pagination = reactive({
  current:1,
  pageSize:10,
  total:100
})
const columns = ref([
  { title: '姓名', dataIndex: 'name', width:120 },
  { title: '年龄', dataIndex: 'age', width:80, align:'center' },
  { title: '地址', dataIndex: 'address', ellipsis:true },
  { title: '地址', dataIndex: 'address', ellipsis:true },
  {
    title: '操作',
    dataIndex: 'action',
    width:150,
    align:'center',
    fixed:'right',
    actions:[
      {
        key: 'edit',
        type: 'primary',
        link:true,
        content: '编辑',
        onClick: (row) => {
          console.log(row,'编辑');
          if(row?.id){

          }
        }
      },
      
      // 2. 删除（带确认）
      {
        key: 'delete',
        type: 'danger',
        link: true,
        content: '删除',
        confirm: '确定要删除吗？',
        onClick: (row) => {}
      },

      // 3. 普通按钮
      {
        key: 'detail',
        type: 'success',
        link: true,
        content: '查看',
        onClick: (row) => {

        }
      }
    ]
  },
])
// 数据源
const dataList = ref([
  { id:1, name:'张三', age:28, address:'北京市朝阳区xxx街道' },
  { id:2, name:'李四', age:32, address:'上海市浦东新区xxx路' },
])

// 分页切换
const handlePageChange = (page,size)=>{
  pagination.current = page
  pagination.pageSize = size
}
// 条数切换
const handleSizeChange = (size)=>{
  pagination.current = 1
  pagination.pageSize = size
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
  // getList().then(res=>{
  //   console.log(res,'res');
  // })
  //   Dialog.Confirm({
  //   title: '提示',
  //   content: '确定要删除吗？',
  //   type: 'warning',
  //   onOk: () => {
  //     console.log('确定')
  //   },
  //   onCancel: () => {
  //     console.log('取消')
  //   }
  // })
})
</script>