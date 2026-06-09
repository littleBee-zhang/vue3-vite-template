<template>
  <div style="height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f5f5">
    <el-card style="width:450px">
      <h2 style="text-align:center;margin-bottom:20px">系统登录</h2>
      <el-form @submit.prevent="login">
        <el-form-item>
          <el-input v-model="username" placeholder="账号" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" style="width:100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
const route = useRoute()
const username = ref('admin')
const password = ref('123456')
const router = useRouter()

const login = () => {
  localStorage.setItem('token', 'demo-token')
  ElMessage.success('登录成功')
  // 强制跳转
  setTimeout(() => {
    router.push('/home')
  }, 300)
}
onMounted(async () => {
  // 登录页面 → 不加载菜单

  // console.log(route);

})
</script>
<style lang="scss" scoped ></style>