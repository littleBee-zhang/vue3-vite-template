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
import { Login } from '@/api/login'
const route = useRoute()
const username = ref('admin')
const password = ref('123456')
const router = useRouter()

const login = async () => {
  try {
    const res = await Login({ username: username.value, password: password.value })
    // 仅code=200才算登录成功
    if (res.code === 200) {
      const { token } = res.data || {}
      if (token) {
        localStorage.setItem('token', token)
        ElMessage.success('登录成功')
        router.push('/home')
      } else {
        ElMessage.error('未获取到登录凭证')
      }
    } else {
      // 后端返回业务错误码提示
      ElMessage.error(res.message || '登录失败')
    }
  } catch (error) {
    ElMessage.error('网络异常，请稍后重试')
  }
}
onMounted(async () => {
  // 登录页面 → 不加载菜单

  // console.log(route);

})
</script>
<style lang="scss" scoped></style>