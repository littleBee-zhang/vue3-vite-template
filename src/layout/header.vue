<template>
    <div class="header" >
        <div 
            :style="{
                width: collapse ? '44px' : '200px'
            }"
            class="header-left"
        >{{collapse ? 'LoGo' : '捕电科技'}}</div>
        <el-button
            text
            :icon="collapse ?  Expand : Fold"
            @click="toggleCollapse"
            style="margin-right: auto;font-size: 24px;"
        />
        <el-button @click="logout">退出登录</el-button>
    </div>
</template>

<script setup>
import { Fold, Expand } from '@element-plus/icons-vue'
const props = defineProps({
  modelValue: { // v-model 的值
    type: [String, Number, Object],
    default: null
  },
  collapse:{
    type: Boolean,
    default: false
  }
});

// --- Emits ---
const emit = defineEmits(['update:modelValue','toggle']);

// 退出
const logout = () => {
  localStorage.removeItem('token')
  ElMessage.success('退出成功')
  router.push('/login')
}
const toggleCollapse = () => {
  emit('toggle', !props.collapse)
}
</script>

<style lang="scss" scoped>
.header{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-sizing: border-box;
    .header-left{
        border-right: 1px solid #ccc;
        box-sizing: border-box;
        height: 90%;
        display: flex;
        align-items: center;
    }
}
</style>