<template>
    <div class="desc-wrap">
        <el-descriptions v-bind="$attrs" :direction="direction" :column="column" :border="border">
            <template v-for="item in options" :key="item.prop">
                <el-descriptions-item :label="item.label" :span="item.span || 1">
                    <!-- 优先执行render渲染函数 -->
                    <component class="value-content" v-if="item.render" :is="item.render" :row="detailData" />

                    <!-- tag标签类型 -->
                    <el-tag class="value-content" v-else-if="item.type === 'tag'"
                        :type="item.tagType?.[detailData[item.prop]] || 'info'">
                        {{ item.dict?.[detailData[item.prop]] ?? detailData[item.prop] }}
                    </el-tag>

                    <!-- 其他格式 -->
                    <span class="value-content" v-else>
                        {{ formatValue(detailData[item.prop], item) }}
                    </span>
                </el-descriptions-item>
            </template>
        </el-descriptions>
    </div>
</template>

<script setup>
import models from './models'
const props = defineProps({
    detailData: { type: Object, default: () => ({}) },
    options: { type: Array, required: true },
    border: { type: Boolean, default: true },
    column: { type: Number, default: 2 },
    direction: { type: String, default: 'horizontal' },
    labelWidth: { type: [String, Number], default: '100px' },
})
const emit = defineEmits(['fields-change', 'values-change', 'submit', 'reset', 'confirm'])
const { formatValue, basePercent } = models(props, emit)

</script>

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

    :deep(.el-descriptions__label) {
        width: v-bind(labelWidth) !important;
    }

    .value-content {
        word-break: break-all; // 长链接/英文强制换行
        white-space: normal;
    }
}
</style>