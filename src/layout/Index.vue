<template>
  <!-- 登录全屏 -->
  <div v-if="isFullScreen" class="full-page">
    <router-view />
  </div>

  <!-- 主布局：顶部头部 + 左下侧边栏 + 右下内容 -->
  <el-container v-else style="height: 100vh">
    <!-- 顶部头部 -->
    <el-header class="top-header">
      <Header @toggle="toggleCollapse" :collapse="isCollapse" />
    </el-header>

    <!-- 下部容器：侧边栏 + 内容 -->
    <el-container style="height: calc(100vh - 60px)">
      <!-- 左侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '220px'"
        style="background-color: #fff; height: 100%; transition: width 0.3s">
        <el-menu router :default-active="selectPath" background-color="#fff" text-color="#000"
          active-text-color="#409EFF" style="height: 100%; border-right: none" :collapse="isCollapse">
          <sidebar-item v-for="item in menuList" :key="item.path" :item="item" :collapse="isCollapse" />
        </el-menu>
      </el-aside>

      <!-- 右侧内容区域 -->
      <el-main class="main-container">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Fold, Expand } from '@element-plus/icons-vue'
import { mergeMenu, dynamicRouteToVueRoute } from '@/router/dynamicRouter'
import { menuRoutes } from '@/router/defaultRoutes'
import { getMenu } from '@/api/menu'
import SidebarItem from './SidebarItem.vue'
import Header from './header.vue'
const store = useStore()
const route = useRoute()
const router = useRouter()
const menuList = ref([])
const selectPath = ref('') // 修复拼写错误
// 全屏判断（登录页）
const isFullScreen = computed(() => {
  return route.path === '/login' || route.meta?.hidden === true
})
// 🔥 侧边栏折叠状态
const isCollapse = ref(false)

// 切换折叠/展开
const toggleCollapse = (value) => {
  isCollapse.value = value
}
// 加载菜单
const loadMenu = async () => {
  const list = dynamicRouteToVueRoute(menuRoutes).filter((item) => {
    return item.meta?.title && !item.meta?.hidden
  })
  selectPath.value = route?.path
  if (isFullScreen.value) return
  try {
    const routerList = [
      ...new Map(
        [...mergeMenu(list, [])].map((item) => [item.path, item])
      ).values(),
    ]
    menuList.value = routerList
  } catch (e) {
    menuList.value = mergeMenu([], [])
  }
}
watch(
  () => route.path,
  () => loadMenu(),
  { immediate: true }
)
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  // 全局拉取常用字典
  await store.dispatch('dict/getDict', 'status')
  await store.dispatch('dict/getDict', 'sex')
  await store.dispatch('dict/getDict', 'role')

  // 拉取菜单
  // await store.dispatch('menu/getMenu')
})
</script>

<style lang="scss" scoped>
.full-page {
  width: 100vw;
  height: 100vh;
}

.main-container {
  margin: 0;
  padding: 20px;
  background: #f7f7f7;
  overflow: auto;
  box-sizing: border-box;
}

.top-header {
  background: #fff;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.078);
}
</style>