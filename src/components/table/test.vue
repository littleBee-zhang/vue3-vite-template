<template>
  <div class="table-card my-table">
    <el-table
      ref="tableRef"
      v-bind="{ ...$attrs }"
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
        :index="indexMethod || defaultIndexMethod"
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
        :key="col.dataIndex || col.key || col.title"
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

        <!-- 按钮/二次确认 -->
        <template v-else-if="col.confirm" #default="scope">
          <el-space direction="horizontal" alignment="start" :size="spaceSize">
            <template v-for="(item, idx) in col.confirm" :key="idx">
              <!-- 二次确认按钮 -->
              <el-popconfirm
                v-if="item.onConfirm"
                v-bind="{ ...item }"
                :title="item.title || '确认执行此操作？'"
                :confirm-button-text="item.okText || '确认'"
                :cancel-button-text="item.cancelText || '取消'"
                :icon="item.icon"
                :icon-color="item.iconColor"
                width="160"
                @confirm="handleConfirm(item, scope.row, scope.$index, scope.column)"
              >
                <template #reference>
                  <el-button
                    size="small"
                    v-bind="{ ...(item.buttonProps || {}) }"
                    :type="item.buttonType || 'primary'"
                    @click.stop
                  >
                    {{ item.buttonText || '操作' }}
                  </el-button>
                </template>
              </el-popconfirm>

              <!-- 普通按钮 -->
              <el-button
                v-else
                size="small"
                v-bind="{ ...(item.buttonProps || {}) }"
                :type="item.buttonType || 'primary'"
                @click.stop="handleChangeBtn(item, scope.row, scope.$index, scope.column)"
              >
                {{ item.buttonText || '操作' }}
              </el-button>
            </template>
          </el-space>
        </template>

        <!-- render 函数渲染 -->
        <template v-else-if="col.render" #default="scope">
          <component :is="col.render(scope.row, scope.column, scope.$index)" />
        </template>
      </el-table-column>

      <!-- 空数据插槽 -->
      <template v-if="$slots.empty" #empty>
        <slot name="empty" />
      </template>
      <!-- 底部加载插槽 -->
      <template v-if="$slots.loading" #append>
        <slot name="loading" />
      </template>
    </el-table>

    <!-- 分页区域 -->
    <div v-if="!!pagination" class="pagination-wrapper my-page">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="pagination.pageSizeOptions || [10, 20, 50, 100]"
        :layout="pagination.layout || 'total, sizes, prev, pager, next, jumper'"
        :show-total="pagination.showTotal !== false"
        :show-quick-jumper="pagination.showQuickJumper || false"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

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
    default: true
  },
  border: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator: (v) => ['large', 'default', 'small'].includes(v)
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
    default: () => ({})
  }
})

const emit = defineEmits([
  'update:currentPage',
  'update:pageSize',
  'selection-change',
  'sort-change',
  'page-change',
  'size-change'
])

// 响应式
const tableRef = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRowKeys = ref([])

// 初始化分页
onMounted(() => {
  if (props.pagination && typeof props.pagination === 'object') {
    currentPage.value = props.pagination.current || 1
    pageSize.value = props.pagination.pageSize || 10
  }
})

// 监听分页
watch(
  () => props.pagination,
  (val) => {
    if (val && typeof val === 'object') {
      currentPage.value = val.current || 1
      pageSize.value = val.pageSize || 10
    }
  },
  { deep: true, immediate: true }
)

// 总数
const total = computed(() => {
  if (!props.pagination) return 0
  return props.pagination.total ?? props.dataSource.length
})

// 默认序号方法
const defaultIndexMethod = (index) => {
  return (currentPage.value - 1) * pageSize.value + index + 1
}

// 页码切换
const handleCurrentChange = (page) => {
  currentPage.value = page
  emit('update:currentPage', page)
  emit('page-change', page, pageSize.value)
  props.pagination?.onChange?.(page, pageSize.value)
}

// 每页条数
const handleSizeChange = (size) => {
  pageSize.value = size
  emit('update:pageSize', size)
  emit('page-change', currentPage.value, size)
  emit('size-change', size)
  props.pagination?.onChange?.(currentPage.value, size)
}

// 多选
const handleSelectionChange = (val) => {
  selectedRowKeys.value = val
  emit('selection-change', val)
  props.rowSelection?.onChange?.(val)
}

// 排序
const handleSortChange = ({ prop, order }) => {
  emit('sort-change', { prop, order })
}

// 普通按钮
const handleChangeBtn = async (item, row, index, column) => {
  try {
    await item.onClick?.(row, index, column)
  } catch (err) {
    console.error('按钮点击异常：', err)
  }
}

// 确认按钮
const handleConfirm = async (item, row, index, column) => {
  try {
    await item.onConfirm?.(row, index, column)
  } catch (err) {
    console.error('确认操作失败：', err)
  }
}

// 暴露
defineExpose({
  tableRef,
  clearSelection: () => tableRef.value?.clearSelection(),
  toggleRowSelection: (row, selected) => tableRef.value?.toggleRowSelection(row, selected),
  toggleAllSelection: () => tableRef.value?.toggleAllSelection(),
  getSelectedRows: () => selectedRowKeys.value,
  refresh: () => {
    tableRef.value?.clearSelection()
    tableRef.value?.clearSort()
    tableRef.value?.clearFilter()
  },
  clearSort: () => tableRef.value?.clearSort(),
  clearFilter: () => tableRef.value?.clearFilter(),
  scrollToRow: (row) => tableRef.value?.scrollToRow(row),
  getTableEl: () => tableRef.value || {}
})
</script>

<style scoped lang="scss">
.table-card {
  border-radius: 4px;
  border: 1px solid #dfe0e6;
  background: #fff;
  box-sizing: border-box;
  padding: 8px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin: 16px 8px 8px;
}
</style>