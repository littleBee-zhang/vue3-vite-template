<template>
  <div class="header">
    <div :style="{
      width: collapse ? '44px' : '200px'
    }" class="header-left">LG {{ collapse ? '' : '捕电科技' }}</div>
    <el-button text :icon="collapse ? Expand : Fold" @click="toggleCollapse"
      style="margin-right: auto;font-size: 24px;" />
    <div class="header-right">
      <el-badge :value="messageTotal" :hidden="messageTotal === 0" :max="maxNumber" class="item">
        <Icon class="message" name="xiaoxizhongxin"></Icon>
      </el-badge>
      <el-button @click="logout">退出登录</el-button>
    </div>
  </div>
</template>

<script setup>
import socket from '@/utils/socket'
import { useRouter } from 'vue-router'
import { Fold, Expand } from '@element-plus/icons-vue'
const router = useRouter()
const props = defineProps({
  modelValue: { // v-model 的值
    type: [String, Number, Object],
    default: null
  },
  collapse: {
    type: Boolean,
    default: false
  },
  maxNumber: {
    type: Number,
    default: 99
  }
});
const messageTotal = ref(10)
// --- Emits ---
const emit = defineEmits(['update:modelValue', 'toggle']);

// 退出
const logout = () => {
  localStorage.removeItem('token')
  store.dispatch('dict/clearDict')
  store.dispatch('menu/clearMenu')
  ElMessage.success('退出成功')
  setTimeout(() => {
    router.push('/login')
  }, 1000)
}
const toggleCollapse = () => {
  emit('toggle', !props.collapse)
}
onMounted(() => {
  // 1. 连接
  // socket.connect()

  // // 2. 订阅消息（后端推送 type: message）
  // socket.on('message', (data) => {
  //   console.log('📩 收到新消息：', data)
  //   messageTotal(100)
  // })

  // // 3. 订阅通知
  // socket.on('notice', (data) => {
  //   console.log('🔔 收到通知：', data)
  // })
})

// 发送消息
function sendMessage() {
  socket.send({
    type: 'message',
    content: '你好',
    userId: 1001
  })
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;

  .header-left {
    border-right: 1px solid #ccc;
    box-sizing: border-box;
    height: 60%;
    display: flex;
    align-items: center;
  }

  .header-right {
    gap: 50px;
    display: flex;
    align-items: center;

    .message {}
  }
}
</style>