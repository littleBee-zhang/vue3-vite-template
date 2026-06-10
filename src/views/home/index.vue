<template>
  <div class="home">
    <Card>
      <Icon name="jiaoseguanli" />
      <Table row-key="id" ref="tableRef" :columns="columns" :data-source="dataList" :loading="loading"
        :pagination="pagination" :showIndex="true" @selection-change="handleSelectionChange"
        @page-change="handlePageChange" @size-change="handleSizeChange" />
    </Card>
  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import { getList } from '@/api/index.js'
import { FieldMapping, generateBigDict } from '@/utils'
const store = useStore()
const dictList = store.state.dict

// 选中数据
const selectedRows = ref([])
const loading = ref(false)
const tableRef = ref(null)
// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 10
})
const columns = ref([
  { title: '姓名', dataIndex: 'name', width: 120, align: 'center', },
  {
    title: '年龄', dataIndex: 'age', width: 80, align: 'center', render: (row) => {
      return h('span', row.age)
    }
  },
  { title: '地址', dataIndex: 'address', ellipsis: true, align: 'center', },
  { title: '地址', dataIndex: 'address', ellipsis: true, align: 'center', },
  { title: '地址', dataIndex: 'address', ellipsis: true, align: 'center', },
  { title: '地址', dataIndex: 'address', ellipsis: true, align: 'center', },
  { title: '地址', dataIndex: 'address', ellipsis: true, align: 'center', },
  { title: '地址', dataIndex: 'address', ellipsis: true, align: 'center', },
  { title: '地址', dataIndex: 'address', ellipsis: true, align: 'center', },
  { title: '地址', dataIndex: 'address', ellipsis: true, align: 'center', },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    align: 'center',
    fixed: 'right',
    actions: [
      {
        key: 'edit',
        type: 'primary',
        link: true,
        content: '编辑',
        onClick: (row) => {
          console.log(row, '编辑');
          if (row?.id) { }
        }
      },

      // 2. 删除（带确认）
      {
        key: 'delete',
        type: 'danger',
        link: true,
        content: '删除',
        confirm: '确定要删除吗？',
        onClick: (row) => { }
      },

      // 3. 普通按钮
      {
        key: 'detail',
        type: 'success',
        link: true,
        content: '查看',
        onClick: (row) => { }
      }
    ]
  },
])
const generateList = (num = 10, key = '状态') => {
  const list = []
  for (let i = 0; i < num; i++) {
    list.push({
      id: i + 1,
      name: `${key}-${i + 1}`,
      age: i + 1,
      address: `地区xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx${i + 1}xx街道`
    })
  }
  return list
}
// 数据源
const dataList = ref(generateList())

// 分页切换
const handlePageChange = (page, size) => {
  pagination.current = page
  pagination.pageSize = size
}
// 条数切换
const handleSizeChange = (size) => {
  pagination.current = 1
  pagination.pageSize = size
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
  // console.log(statusList,sexList);
})
</script>
<style lang="scss" scoped>
  @use './index.module.scss';
</style>