<template>
    <div class="excel-upload-edit">
        <!-- 上传区域 -->
        <el-upload class="upload-excel" accept=".xlsx,.xls" :limit="1" :file-list="fileList" :auto-upload="false"
            :on-change="handleFileChange" :on-remove="handleFileRemove">
            <el-button type="primary">{{ uploadText }}</el-button>
            <template #tip>
                <div class="el-upload__tip">{{ tipText }}</div>
            </template>
        </el-upload>

        <!-- 可编辑表格 -->
        <div v-if="tableData.length && tableHeader.length" class="table-container">
            <div class="table-toolbar" v-if="showToolbar">
                <el-button type="success" @click="handleAddRow">新增</el-button>
                <el-button type="warning" @click="handleExportExcel">导出Excel</el-button>
                <el-button type="danger" @click="handleClearTable">清空</el-button>
            </div>

            <el-table :data="tableData" border style="width:100%;margin-top:16px" highlight-current-row
                :max-height="tableMaxHeight">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column v-for="(header, idx) in tableHeader" :width="colWidthList[idx]" :key="idx"
                    :prop="header" :label="header" align="center">
                    <template #default="scope">
                        <el-input v-model="tableData[scope.$index][header]" placeholder="请输入" size="small"
                            @input="handleDataChange" />
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="90" align="center" fixed="right" v-if="showDelBtn">
                    <template #default="scope">
                        <el-popconfirm class="box-item" @confirm="handleDeleteRow(scope.$index)" title="是否删除该条数据？"
                            placement="top">
                            <template #reference>
                                <el-button type="danger" size="small" link>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'
import { isDateTimeValue, formatExcelDate } from './dateJudge'

// ===================== Props 外部可配置 =====================
const props = defineProps({
    // 上传按钮文字
    uploadText: { type: String, default: '点击上传Excel文件' },
    // 底部提示文案
    tipText: { type: String, default: '仅支持 .xlsx / .xls，最大10MB' },
    // 表格最大高度
    tableMaxHeight: { type: String, default: '600px' },
    // 是否显示顶部工具栏(新增/导出/清空)
    showToolbar: { type: Boolean, default: true },
    // 是否显示行删除按钮
    showDelBtn: { type: Boolean, default: true },
    // 外部回填数据
    modelValue: { type: Array, default: () => [] },
    // 自适应列宽配置
    autoWidthOption: {
        type: Object,
        default: () => ({
            minWidth: 80,    // 最小宽度px
            maxWidth: 350,    // 最大宽度px
            charPx: 14        // 单个字符占用像素
        })
    }
})

// ===================== 自定义事件 =====================
const emit = defineEmits(['update:modelValue', 'change', 'upload-success'])

// ===================== 内部状态 =====================
const fileList = ref([])
const tableHeader = ref([])
const tableData = ref([])
const colWidthList = ref([])
// 监听外部 v-model 回填数据
watch(
    () => props.modelValue,
    (val) => {
        if (Array.isArray(val) && val.length) {
            tableData.value = JSON.parse(JSON.stringify(val))
            tableHeader.value = Object.keys(tableData.value[0] || {})
        }
    },
    { immediate: true, deep: true }
)
/**
 * 核心：自动根据表头+整列内容计算每列宽度
 */
const autoCalcAllColumnWidth = () => {
    const { minWidth, maxWidth, charPx } = props.autoWidthOption
    const widths = []

    // 1、第一步：先算出每列基础自适应宽度
    tableHeader.value.forEach((header, index) => {
        let maxCharLen = String(header).length
        tableData.value.forEach(row => {
            const cellVal = String(row[header] ?? '')
            if (cellVal.length > maxCharLen) {
                maxCharLen = cellVal.length
            }
        })
        let realWidth = maxCharLen * charPx
        realWidth = Math.max(minWidth, Math.min(maxWidth, realWidth))
        widths.push(realWidth)
    })

    // 外部自定义列宽覆盖
    // if (props.columnWidths.length) {
    //     props.columnWidths.forEach((w, idx) => {
    //         if (widths[idx] !== undefined) widths[idx] = w
    //     })
    // }

    // 2、获取表格容器可视宽度（el-table 实际可用宽度）
    const tableEl = document.querySelector('.excel-upload-edit .table-container .el-table__body-wrapper')
    if (!tableEl || widths.length === 0) {
        colWidthList.value = widths
        return
    }
    const tableTotalWidth = tableEl.clientWidth
    const sumColWidth = widths.reduce((sum, w) => sum + w, 0)

    // 3、判断：总宽度不足，最后一列填充剩余空间
    if (sumColWidth < tableTotalWidth) {
        const remainSpace = tableTotalWidth - sumColWidth
        const lastIndex = widths.length - 1
        widths[lastIndex] = widths[lastIndex] + remainSpace
        // 依然限制最大宽度，防止极端过宽
        widths[lastIndex] = Math.min(widths[lastIndex], maxWidth * 2)
    }

    colWidthList.value = widths
}
// 数据同步父组件
const syncParentData = () => {
    emit('update:modelValue', tableData.value)
    emit('change', tableData.value)
}

// ===================== 文件解析逻辑 =====================
const handleFileChange = (file) => {
    const rawFile = file.raw
    if (!rawFile) return

    // 格式校验
    const isExcel = /\.(xlsx|xls)$/i.test(rawFile.name)
    if (!isExcel) {
        ElMessage.error('仅支持 xlsx / xls 格式表格')
        return
    }
    // 大小校验 10MB
    const isLt10M = rawFile.size / 1024 / 1024 < 10
    if (!isLt10M) {
        ElMessage.error('文件不能超过10MB')
        return
    }

    const reader = new FileReader()
    // 替换组件内 handleFileChange 中解析逻辑
    reader.onload = (e) => {
        try {
            const workbook = XLSX.read(e.target.result, {
                type: 'array',
                cellDates: true,
                cellNF: true,
                raw: false
            })
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]

            // 手动遍历单元格，保留原生单元格对象用于日期判断
            const range = XLSX.utils.decode_range(sheet['!ref'])
            const rows = []
            let headers = []

            // 遍历行
            for (let r = range.s.r; r <= range.e.r; r++) {
                const rowObj = {}
                // 遍历列
                for (let c = range.s.c; c <= range.e.c; c++) {
                    const cellKey = XLSX.utils.encode_cell({ r, c })
                    const cell = sheet[cellKey]
                    if (!cell) continue

                    // 第一行做表头
                    if (r === 0) {
                        headers.push(cell.v)
                    } else {
                        const field = headers[c]
                        // 判断是否是时间，自动格式化
                        if (isDateTimeValue(cell.v, cell)) {
                            rowObj[field] = formatExcelDate(cell.v, cell)
                        } else {
                            rowObj[field] = cell.v
                        }
                    }
                }
                if (r !== 0 && Object.keys(rowObj).length) rows.push(rowObj)
            }

            if (!rows.length) {
                ElMessage.warning('表格无有效数据')
                return
            }
            tableHeader.value = headers
            tableData.value = rows
            autoCalcAllColumnWidth()
            syncParentData()
            emit('upload-success', rows)
            ElMessage.success(`解析成功，共${rows.length}行数据`)
        } catch (err) {
            console.error(err)
            ElMessage.error('文件解析失败，文件损坏或格式异常')
        }
    }
    reader.readAsArrayBuffer(rawFile)
}

const handleFileRemove = () => {
    handleClearTable()
}

// ===================== 表格编辑操作 =====================
const handleDataChange = () => {
    syncParentData()
}

const handleAddRow = () => {
    if (!tableHeader.value.length) {
        ElMessage.warning('请先上传表格生成表头')
        return
    }
    const emptyRow = {}
    tableHeader.value.forEach(key => emptyRow[key] = '')
    tableData.value.push(emptyRow)
    syncParentData()
}

const handleDeleteRow = (index) => {
    tableData.value.splice(index, 1)
    syncParentData()
}

const handleClearTable = () => {
    fileList.value = []
    tableHeader.value = []
    tableData.value = []
    syncParentData()
}

// ===================== 导出Excel =====================
const handleExportExcel = () => {
    if (!tableData.value.length) {
        ElMessage.warning('暂无数据可导出')
        return
    }
    const sheet = XLSX.utils.json_to_sheet(tableData.value)
    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, '表格数据')
    XLSX.writeFile(book, `表格数据_${new Date().getTime()}.xlsx`)
    ElMessage.success('导出完成')
}
</script>

<style scoped>
.excel-upload-edit {
    width: 100%;
}

.table-container {
    margin-top: 24px;
}

.table-toolbar {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    /* padding-bottom: 20px; */
}
</style>