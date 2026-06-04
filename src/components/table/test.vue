<template>
  <div class="table-card my-table">
    <el-table
      ref="tableRef"
      v-bind="{...$attrs}"
      v-loading="loading"
      :data="dataSource"
      :default-sort="defaultSort"
      :row-key="rowKey || 'id'"
      :stripe="stripe"
      :border="border"
      :size="size"
      :height="height"
      :max-height="maxHeight"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 多选列 -->
      <el-table-column
        v-if="rowSelection"
        type="selection"
        :width="rowSelection.width || 55"
        :selectable="rowSelection.selectable"
        :reserve-selection="rowSelection.reserveSelection"
      />

      <!-- 索引列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        :width="showIndexWidth || 72"
        :label="showIndexLabel || '序号'"
        :index="indexMethod"
      />

      <!-- 展开列 -->
      <el-table-column
        v-if="expandable"
        type="expand"
        :width="expandWidth || 50"
      >
        <template #default="{ row }">
          <slot name="expand" :row="row" />
        </template>
      </el-table-column>

      <!-- 动态遍历列 -->
      <el-table-column
        v-for="col in columns"
        :key="col.dataIndex || col.key"
        :prop="col.dataIndex"
        :label="col.title"
        :width="col.width"
        :min-width="col.minWidth"
        :fixed="col.fixed"
        :sortable="col.sorter ? 'custom' : false"
        :show-overflow-tooltip="col.ellipsis !== false"
        :align="col.align || 'left'"
        :header-align="col.align || 'left'"
      >
        <!-- 自定义渲染插槽 -->
        <template v-if="col.customRender" #default="scope">
          <slot :name="`customRender_${col.dataIndex}`" v-bind="scope" />
        </template>
        <!-- 外部作用域插槽 -->
        <template v-else-if="$slots[`customRender_${col.dataIndex}`]" #default="scope">
          <slot :name="`customRender_${col.dataIndex}`" v-bind="scope" />
        </template>
        <!-- 按钮/二次确认/自定义渲染 -->
        <template v-else-if="col.render || col.confirm" #default="scope">
          <span v-if="col.confirm">
            <el-space direction="horizontal" alignment="start" :size="spaceSize">
              <span v-for="(item, idx) in col.confirm || []" :key="idx">
                <el-popconfirm
                  v-bind="{...item}"
                  :title="item.title || '确认执行此操作？'"
                  :confirm-button-text="item.okText || '确认'"
                  :cancel-button-text="item.cancelText || '取消'"
                  :icon="item.icon"
                  :icon-color="item.iconColor"
                  :width="item.width || '3rem'"
                  @confirm="handleConfirm(item, scope.row, scope.$index, scope.column)"
                >
                  <template #reference>
                    <el-button
                      size="small"
                      v-bind="{...(item?.buttonProps || {})}"
                      :type="item.buttonType || 'primary'"
                      @click.stop
                    >
                      {{ item.buttonText || '按钮' }}
                    </el-button>
                  </template>
                </el-popconfirm>
                <el-button
                  size="small"
                  v-bind="{...(item?.buttonProps || {})}"
                  :type="item.buttonType || 'primary'"
                  @click.stop="handleChangeBtn(item, scope.row, scope.$index, scope.column)"
                >
                  {{ item.buttonText || '按钮' }}
                </el-button>
              </span>
            </el-space>
          </span>
          <component v-else-if="col.render" :is="col.render(scope.row, scope.column)" />
        </template>

        <!-- 空数据插槽 -->
        <template v-if="$slots.empty" #empty>
          <slot name="empty" />
        </template>
        <!-- 底部加载插槽 -->
        <template v-if="$slots.loading" #append>
          <slot name="loading" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div v-if="pagination" class="pagination-wrapper my-page">
      <el-pagination
        background
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total || pagination.total"
        :page-sizes="pagination.pageSizeOptions || [10,20,50,100]"
        :layout="layout"
        :show-total="pagination.showTotal !== false"
        :show-quick-jumper="pagination.showQuickJumper || false"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, h } from 'vue'

// Props配置
const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  dataSource: {
    type: Array,
    default: () => []
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: [Object, Boolean],
    default: true
  },
  layout: {
    type: String,
    default:'total,sizes,prev,pager,next,jumper'
  },
  rowSelection: {
    type: [Object, Boolean],
    default: false
  },
  showIndex: {
    type: Boolean,
    default: false
  },
  showIndexWidth: {
    type: Number,
    default: 72
  },
  showIndexLabel: {
    type: String,
    default: '序号'
  },
  indexMethod: {
    type: Function,
    default: null
  },
  expandable: {
    type: Boolean,
    default: false
  },
  expandWidth: {
    type: Number,
    default: 50
  },
  spaceSize: {
    type: Number,
    default: 5
  },
  stripe: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator: (v) => ['large','default','small'].includes(v)
  },
  maxHeight: {
    type: [Number, String],
    default: null
  },
  height: {
    type: [Number, String],
    default: null
  },
  headerCellStyle: {
    type: Object,
    default: () => ({})
  },
  cellStyle: {
    type: Object,
    default: () => ({})
  },
  defaultSort: {
    type: Object,
    default: () => ({ prop: 'age', order: 'descending' })
  }
})

// 自定义事件
const emit = defineEmits([
  'update:currentPage',
  'update:pageSize',
  'selection-change',
  'sort-change',
  'page-change',
  'size-change'
])

// 响应式变量
const tableRef = ref(null)
const currentPage = ref(props.pagination?.current || 1)
const pageSize = ref(props.pagination?.pageSize || 10)
const total = computed(() => props.pagination?.total ?? props.dataSource.length)
const selectedRowKeys = ref([])

// 监听分页props变化
watch(() => props.pagination, (val) => {
  if(val && typeof val === 'object'){
    currentPage.value = val.current || 1
    pageSize.value = val.pageSize || 10
  }
},{ deep: true })

// 页码切换
const handleCurrentChange = (page) => {
  currentPage.value = page
  emit('update:currentPage', page)
  emit('page-change', page, pageSize.value)
  if(props.pagination?.onChange){
    props.pagination.onChange(page, pageSize.value)
  }
}

// 每页条数切换
const handleSizeChange = (size) => {
  pageSize.value = size
  emit('update:pageSize', size)
  emit('page-change', currentPage.value, size)
  emit('size-change', size)
  if(props.pagination?.onChange){
    props.pagination.onChange(currentPage.value, size)
  }
}

// 多选事件
const handleSelectionChange = (keys) => {
  selectedRowKeys.value = keys
  emit('selection-change', keys)
  if(props.rowSelection?.onChange){
    props.rowSelection.onChange(keys)
  }
}

// 排序事件
const handleSortChange = ({ prop, order }) => {
  emit('sort-change', { column: prop, prop, order })
}

// 普通按钮点击
const handleChangeBtn = async (params, row, index, column) => {
  try {
    if(params.onClick){
      const res = await params.onClick(row, index, column)
      if(res === false) return
    }
  } catch (err) {
    console.error('确认操作失败', err)
  }
}

// popconfirm二次确认
const handleConfirm = async (confirm, row, index, column) => {
  try {
    if(confirm.onConfirm){
      const res = await confirm.onConfirm(row, index, column)
      if(res === false) return
    }
  } catch (err) {
    console.error('确认操作失败', err)
  }
}

// 对外暴露方法
defineExpose({
  tableRef,
  // 清空勾选
  clearSelection: () => tableRef.value?.clearSelection(),
  // 切换单行选中
  toggleRowSelection: (row, selected) => tableRef.value?.toggleRowSelection(row, selected),
  // 全选/取消全选
  toggleAllSelection: () => tableRef.value?.toggleAllSelection(),
  // 获取选中行
  getSelectedRows: () => selectedRowKeys.value,
  // 刷新表格(清空选中+排序+筛选)
  refresh: () => {
    tableRef.value?.clearSelection()
    tableRef.value?.clearSort()
    tableRef.value?.clearFilter()
  },
  // 清除排序
  clearSort: () => tableRef.value?.clearSort(),
  // 清除筛选
  clearFilter: () => tableRef.value?.clearFilter(),
  // 滚动至指定行
  scrollToRow: (row) => tableRef.value?.scrollToRow(row),
  // 获取table实例
  getTableData: () => tableRef.value || {}
})
</script>

<style scoped lang="scss">
.table-card {
  // border-radius: 4px;
  // border: 1px solid #dfe0f0;
  background: #fff;
  box-sizing: border-box;
  padding: 8px;

  :deep(.el-card__body) {
    padding: 24px;
  }
  :deep(.el-table__header th.el-table__cell ){
    background: #f5f7fa !important;
    color: #515a6e !important;
  }
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>