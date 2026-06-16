<template>
  <div class="home">
    <Card>
      <!-- <Icon name="jiaoseguanli" /> -->
      <Table row-key="id" ref="tableRef" :columns="[...Columns, ...actionList]" :data-source="dataList"
        :loading="loading" :pagination="pagination" :showIndex="true" @selection-change="handleSelectionChange"
        @page-change="handlePageChange" @size-change="handleSizeChange" :permissions="['edit']" />
    </Card>
  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import { List, Delete } from '@/api/user.js'
import { FieldMapping, generateBigDict } from '@/utils'
import { Columns } from './columns'
import Operation from './operation.vue'
const store = useStore()
const dictList = store.state.dict

// 选中数据
const selectedRows = ref([])
const loading = ref(false)
const tableRef = ref(null)
// 数据源
const dataList = ref([])
// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})
const actionList = [
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    align: 'center',
    fixed: 'right',
    actions: [
      // 编辑
      { key: 'edit', permission:'edit', type: 'primary', link: true, content: '编辑', onClick: (row) => actionMethod(row, 'edit') },
      // 2. 删除（带确认）
      { key: 'delete', type: 'danger', link: true, content: '删除', confirm: '确定要删除吗？', onClick: (row) => actionMethod(row, 'delete') },
      // 3. 普通按钮
      { key: 'detail', type: 'success', link: true, content: '详情', onClick: (row) => actionMethod(row, 'detail') }
    ]
  },
]
// 列表
const getList = async () => {
  const params = {
    pageNum: pagination?.current || 1,
    pageSize: pagination?.pageSize || 10,
  }
  try {
    const res = await List(params)
    const { total, records } = res || {}
    pagination.total = total
    dataList.value = records || []
  } catch (error) {

  }
}
const del = async (id) => {
  try {
    await Delete({ id })
  } catch (error) {

  }
}
// 表格操作方法
const actionMethod = (row, type) => {
  if (type === 'delete') del({ id: row.id })
  console.log(row, type);
}

// 分页切换
const handlePageChange = (page, size) => {
  pagination.current = page
  pagination.pageSize = size
  getList()
}
// 条数切换
const handleSizeChange = (size) => {
  pagination.current = 1
  pagination.pageSize = size
  getList()
}
// 多选事件
const handleSelectionChange = (event) => {
  selectedRows.value = event
}

// 1.清空选中
const handleClearSelection = () => {
  tableRef.value.clearSelection()
  ElMessage.success('已清除选中')
}
// 2.全选/取消全选
const handleToggleAll = () => {
  tableRef.value.toggleAllSelection()
}
// 3.获取选中行
const handleGetSelected = () => {
  const rows = tableRef.value.getSelectedRows()
  ElMessage.info(`共选中${rows.length}行`)
}
// 4.刷新表格
const handleRefresh = () => {
  tableRef.value.refresh()
}
// 
let statusList = []
let sexList = []
onMounted(async () => {
  statusList = await store.dispatch('dict/getDict', 'status')
  sexList = await store.dispatch('dict/getDict', 'sex')
  getList()
})
</script>
<style lang="scss" scoped>
@use './index.module.scss';
</style>