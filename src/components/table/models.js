import { computed, watch } from 'vue'

export default function models(props, emit) {
    const currentPage = ref(1)
    const pageSize = ref(10)

    const total = computed(() => {
        return props.pagination?.total || props.dataSource.length
    })
    // 监听分页传入 
    watch(
        () => props.pagination,
        (val) => {
            if (val) {
                currentPage.value = val.current || 1
                pageSize.value = val.pageSize || 10
            }
        },
        { deep: true }
    )

    // 索引计算
    const indexMethod = (index) => {
        if (!props.pagination) return index + 1
        return (currentPage.value - 1) * pageSize.value + index + 1
    }

    // 分页事件（页数）
    const handleSizeChange = (size) => {
        pageSize.value = size
        emit('size-change', size, currentPage.value)
    }
    // 条数
    const handleCurrentChange = (page) => {
        currentPage.value = page
        emit('page-change', page, pageSize.value)
    }

    // 表格事件
    const handleSelectionChange = (val) => emit('selection-change', val)
    const handleSortChange = (val) => emit('sort-change', val)

    // 按钮属性过滤
    const getBtnProps = (item) => {
        const { onClick, ...rest } = item
        return rest
    }

    return {
        currentPage,
        pageSize,
        total,
        indexMethod,
        handleSizeChange,
        handleCurrentChange,
        handleSelectionChange,
        handleSortChange,
        getBtnProps
    }
}