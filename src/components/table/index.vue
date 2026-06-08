<template>
  <div class="table-card my-table">
    <el-table ref="tableRef" v-bind="{ ...$attrs }" v-loading="loading" :data="dataSource" :default-sort="defaultSort"
      :row-key="rowKey || 'id'" :stripe="stripe" :border="border" :size="size || 'default'" :height="height"
      :max-height="maxHeight" :header-cell-style="headerCellStyle" :cell-style="cellStyle"
      @selection-change="handleSelectionChange" @sort-change="handleSortChange">

      <!-- 多选列 -->
      <el-table-column v-if="rowSelection" type="selection" :width="rowSelection.width || 55"
        :selectable="rowSelection.selectable" :reserve-selection="rowSelection.reserveSelection" />

      <!-- 索引列 -->
      <el-table-column v-if="showIndex" type="index" :width="showIndexWidth || 72" :label="showIndexLabel || '#'"
        :index="indexMethod" />

      <!-- 展开列 -->
      <el-table-column v-if="expandable" type="expand" :width="expandWidth || 50">
        <template #default="{ row }">
          <slot name="expand" :row="row" />
        </template>
      </el-table-column>

      <!-- 主体列 -->
      <el-table-column v-for="col in columns" :key="col.dataIndex || col.key" :prop="col.dataIndex" :label="col.title"
        :width="col.width" :min-width="col.minWidth" :fixed="col.fixed" :sortable="col.sorter ? 'custom' : false"
        :show-overflow-tooltip="col.ellipsis !== false" :align="col.align || 'left'"
        :header-align="col.align || 'left'">
        <template #default="scope">
          <!-- 多操作列 -->
          <el-space v-if="col.actions" :size="spaceSize">
            <template v-for="(item, idx) in col.actions" :key="idx">
              <!-- 渲染函数 / 组件 -->
              <component v-if="typeof item.content === 'function'" :is="item.content(scope.row)" />

              <!-- 确认按钮 -->
              <el-popconfirm v-else-if="item.confirm" :title="item.confirm"
                @confirm="() => item.onClick?.(scope?.row || {})">
                <template #reference>
                  <el-button size="small" v-bind="item">
                    {{ item.content }}
                  </el-button>
                </template>
              </el-popconfirm>

              <!-- 普通按钮 -->
              <el-button v-else size="small" v-bind="item" @click.stop="() => item.onClick?.(scope?.row || {})">
                {{ item.content }}
              </el-button>
            </template>
          </el-space>

          <!-- 单个 content -->
          <span v-else-if="col.content">
            <component v-if="typeof col.content === 'function'" :is="col.content(scope?.row || {})" />
            <span v-else>{{ scope.row[col.dataIndex] }}</span>
          </span>

          <!-- 普通字段 -->
          <span v-else>
            {{ scope.row[col.dataIndex] }}
          </span>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <div v-if="pagination" class="pagination-wrapper">
      <el-pagination background v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true },
  dataSource: { type: Array, default: () => [] },
  rowKey: { type: String, default: 'id' },
  loading: { type: Boolean, default: false },
  pagination: { type: [Object, Boolean], default: true },
  rowSelection: { type: [Object, Boolean], default: false },
  showIndex: { type: Boolean, default: false },
  showIndexLabel: { type: String, default: "#" },
  showIndexWidth: { type: Number, default: 72 },
  expandable: { type: Boolean, default: false },
  spaceSize: { type: Number, default: 8 },
  stripe: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  size: { type: String, default: '' },
  height: [String, Number],
  maxHeight: [String, Number],
  headerCellStyle: Object,
  cellStyle: Object,
  defaultSort: Object,
})

const emit = defineEmits(['selection-change', 'sort-change', 'page-change', 'size-change'])

const tableRef = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => props.pagination?.total || props.dataSource.length)

watch(() => props.pagination, (val) => {
  if (val) {
    currentPage.value = val.current || 1
    pageSize.value = val.pageSize || 10
  }
}, { deep: true })

// ======================  核心修改：自动计算索引 ======================
const indexMethod = (index) => {
  // 如果关闭分页 → 直接返回 index+1
  if (!props.pagination) return index + 1
  // 分页模式：(当前页 -1) * 每页条数 + index + 1
  return (currentPage.value - 1) * pageSize.value + index + 1
}
// 条数切换（外面默认改为第一页）
const handleSizeChange = (size) => {
  pageSize.value = size
  emit('size-change', size, currentPage.value)
}
// 页数切换（返回当前页数和条数）
const handleCurrentChange = (page) => {
  currentPage.value = page
  emit('page-change', page, pageSize.value)
}
const handleSelectionChange = (val) => emit('selection-change', val)
const handleSortChange = (val) => emit('sort-change', val)

defineExpose({
  tableRef,
  clearSelection: () => tableRef.value?.clearSelection(),
  getSelectedRows: () => tableRef.value?.getSelectionRows(),
  // 清除排序
  clearSort: () => tableRef.value?.clearSort(),
})
</script>

<style scss lang="scss">
.table-card {
  background: #fff;
  padding: 12px;

  :deep(.el-card__body) {
    padding: 24px;
  }
}

.table-card .el-table__header th.el-table__cell {
  background: #f5f7fa !important;
  color: #515a6e !important;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>