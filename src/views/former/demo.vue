<template>
    <Card>
        <!-- 自定义外层容器控制均分两列 -->
        <div class="desc-wrap">
            <el-descriptions :column="2" border class="desc-table">
                <el-descriptions-item label="编号">10086</el-descriptions-item>
                <el-descriptions-item label="姓名">
                    账号状态账号状态账号状态账号状态账号状态账号状态账号状态账号状态账号状态账号状态账号状态账号状态账号状态
                    <!-- <div class="text-ellipsis-wrap">
                    </div> -->
                </el-descriptions-item>
                <el-descriptions-item label="手机号">13900139000</el-descriptions-item>
                <el-descriptions-item label="账号状态">
                    <el-tag type="success">正常</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="账户余额">6892.30</el-descriptions-item>
                <el-descriptions-item label="创建时间">2026/6/15 14:20:00</el-descriptions-item>
            </el-descriptions>
        </div>
    </Card>
</template>

<style scoped lang="scss">
.desc-wrap {
    width: 100%;

    // Grid 强制两列 1:1 等分
    :deep(.el-descriptions__table) {
        width: 100%;
        table-layout: fixed;
        /* 固定列宽，均分生效 */
    }

    :deep(.el-descriptions__row) {
        display: grid;
        grid-template-columns: 1fr 1fr !important; // 两列完全等宽
        width: 100%;
    }

    :deep(.el-descriptions__cell) {
        width: 100% !important;
    }
    :deep(.el-descriptions__label){
        width: 120px !important;
    }
}

// 内容自动换行样式
.text-ellipsis-wrap {
    word-break: break-all; // 长链接/英文强制换行
    white-space: normal;
    line-height: 1.5;
}
</style>