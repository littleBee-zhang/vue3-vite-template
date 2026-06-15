<template>
    <div class="home">
        <Card>
            <Table row-key="id" ref="tableRef" :columns="Columns(del)" :data-source="dataList" :loading="loading"
                :pagination="pagination" :showIndex="true" @selection-change="handleSelectionChange"
                @page-change="handlePageChange" @size-change="handleSizeChange" />
        </Card>
    </div>
</template>
<script setup>
import { useStore } from 'vuex'
import { roleList, roleDelete } from '@/api/system.js'
import { FieldMapping, generateBigDict } from '@/utils'
import { Columns } from './columns'
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
// 列表
const getList = async () => {
    const params = {
        pageNum: pagination?.current || 1,
        pageSize: pagination?.pageSize || 10,
    }
    try {
        const res = await roleList(params)
        const { total, records } = res || {}
        pagination.total = total
        dataList.value = records || []
    } catch (error) {

    }
}
const del = async (id) => {
    try {
        const res = await roleDelete({ id })
        console.log(res, 'res');

    } catch (error) {

    }
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