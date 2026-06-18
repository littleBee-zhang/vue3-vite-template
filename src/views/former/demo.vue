<template>
    <Card>
        <ExcelUploadEdit @change="changeValue" />
    </Card>
</template>

<script setup>
import ExcelUploadEdit from '@/components/ExcelUploadEdit/index.vue'
const changeValue = (values) => {
    // console.log(values,'values');
}
</script>

<style scoped>
</style>