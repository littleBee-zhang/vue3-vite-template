<template>
    <div class="error-content">
        <el-empty description="页面不存在，请点击返回首页" />
        <el-button @click="$router.push('/home')">返回首页</el-button>
    </div>
</template>
<style lang="scss" scoped>
.error-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    flex-direction: column;
    padding-bottom: 20%;
}
</style>