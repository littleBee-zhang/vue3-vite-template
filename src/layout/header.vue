<template>
  <div class="header">
    <div :style="{
      width: collapse ? '44px' : '200px'
    }" class="header-left">LG {{ collapse ? '' : '捕电科技' }}</div>

    <!-- 折叠/展开按钮 -->
    <el-button text :icon="collapse ? Expand : Fold" @click="toggleCollapse"
      style="margin-right: auto;font-size: 24px;" />
    <div class="header-right">
      <el-badge :value="messageTotal" :hidden="messageTotal === 0" :max="maxNumber" class="item">
        <Icon class="message" name="xiaoxizhongxin"></Icon>
      </el-badge>
      <!-- 全屏按钮 -->
      <el-button text circle @click="switchFullScreen" title="全屏/退出全屏">
        <el-icon size="18">
          <FullScreen v-if="!isFull" />
          <CircleClose v-else />
        </el-icon>
      </el-button>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          欢迎您，{{ state.memberName }}
          <!-- el-icon 同样连写，图标写法适配Element Plus -->
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>

        <!-- 下拉插槽 #dropdown -->
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item command="azsc">安装手册</el-dropdown-item> -->
            <el-dropdown-item command="repassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { reactive } from 'vue';
import { Fold, Expand, ArrowDown } from '@element-plus/icons-vue'
import socket from '@/utils/socket'
const router = useRouter()
const store = useStore()
const props = defineProps({
  modelValue: { type: [String, Number, Object], default: null },
  collapse: { type: Boolean, default: false },
  maxNumber: { type: Number, default: 99 }
});
// --- Emits ---
const emit = defineEmits(['update:modelValue', 'toggle']);
const messageTotal = ref(10)
// 标记当前是否全屏
const isFull = ref(false)
const state = reactive({
  memberName: '测试用户'
})
// 退出
const logout = () => {
  localStorage.removeItem('token')
  store.dispatch('dict/clearDict')
  store.dispatch('menu/clearMenu')
  ElMessage.success('退出成功')
  setTimeout(() => { router.push('/login') }, 1000)
}
const toggleCollapse = () => {
  emit('toggle', !props.collapse)
}
// 操作菜单
const handleCommand = (command) => {
  console.log(command, 'command');
  if (command === 'logout') {
    logout()
  }
}
// 全屏切换核心方法
const switchFullScreen = () => {
  const dom = document.documentElement
  // 判断当前是否处于全屏状态
  if (!document.fullscreenElement) {
    // 进入全屏
    dom.requestFullscreen().then(() => {
      isFull.value = true
    }).catch(err => {
      console.warn('全屏开启失败：', err)
    })
  } else {
    // 退出全屏
    document.exitFullscreen().then(() => {
      isFull.value = false
    })
  }
}

// 监听ESC按键、手动退出全屏同步状态
document.addEventListener('fullscreenchange', () => {
  isFull.value = !!document.fullscreenElement
})
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

// // 发送消息
// function sendMessage() {
//   socket.send({
//     type: 'message',
//     content: '你好',
//     userId: 1001
//   })
// }
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
    gap: 35px;
    display: flex;
    align-items: center;

    .el-dropdown-link {
      cursor: pointer;
      display: block;
    }

    /* 清除所有el组件聚焦轮廓 */
    :deep(.el-dropdown-link:focus-visible) {
      outline: none !important;
      box-shadow: 0 0 0 0 transparent;
    }
  }
}
</style>