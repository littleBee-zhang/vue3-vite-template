<template>
  <div class="header">
    <div :style="{
      width: collapse ? '54px' : '200px'
    }" class="header-left">
      <img class="header-left-img" :src="LOGO_PNG" alt="">
      {{ collapse ? '' : '捕电科技' }}
    </div>
    <div class="header-center">
      <!-- 折叠/展开按钮 -->
      <el-button text :icon="collapse ? Expand : Fold" @click="toggleCollapse" style="font-size: 24px;" />
      <el-icon class="center-icon" @click="goHome">
        <HomeFilled />
      </el-icon>
      <!-- 新增：当前页面面包屑 -->
      <div class="current-page">
        <span>{{ pageName }}</span>
      </div>
    </div>
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
import { useRouter, useRoute } from 'vue-router'
import { reactive, computed, inject } from 'vue';
import { Fold, Expand, ArrowDown, HomeFilled } from '@element-plus/icons-vue'
import socket from '@/utils/socket'
import { LOGO_PNG } from '@/assets'
const router = useRouter()
const store = useStore()
const route = useRoute()
const props = defineProps({
  modelValue: { type: [String, Number, Object], default: null },
  collapse: { type: Boolean, default: false },
  maxNumber: { type: Number, default: 99 }
});
// --- Emits ---
const emit = defineEmits(['update:modelValue', 'toggle']);
const messageTotal = ref(10)
// 拿到全局菜单树
const menuTree = inject('menuTree', [])

// 递归根据path查找菜单
const findMenu = (list, targetPath) => {
  for (const node of (list || [])) {
    if (node.path === targetPath) return node
    if (node.children?.length) {
      const child = findMenu(node.children, targetPath)
      if (child) return child
    }
  }
  return null
}
// 自动获取当前页面名称
const pageName = computed(() => {
  const target = findMenu(menuTree, route.path)
  return target?.name || target?.meta?.title || '未知页面'
})
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
const goHome = () => {
  router.push('/home')
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
    // padding-left: 2px;
    display: flex;
    align-items: center;

    .header-left-img {
      height: 50px;
      width: 50px;
    }
  }

  .header-center {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 20px;
    gap: 5px;
    .center-icon{
      cursor: pointer;
    }
    .current-page {
      position: relative;
      top: -1px;
    }
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