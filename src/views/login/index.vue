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
          <el-button type="primary" :loading="loading" native-type="submit" style="width:100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Login } from '@/api/login'
const route = useRoute()
const username = ref('admin')
const password = ref('123456')
const loading = ref(false)
const router = useRouter()

const login = async () => {
  try {
    loading.value = true
    const res = await Login({ username: username.value, password: password.value })
    // 仅code=200才算登录成功

    if (res.code === 200) {
      const { token,userInfo } = res.data || {}
      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        ElMessage.success('登录成功')
        setTimeout(() => {
          loading.value = false
          router.push('/home')
        }, 1000)
      } else {
        ElMessage.error('未获取到登录凭证')
      }
    } else {
      // 后端返回业务错误码提示
      ElMessage.error(res.message || '登录失败')
      loading.value = false
    }

  } catch (error) {
    loading.value = false
    ElMessage.error('网络异常，请稍后重试')
  }
}
const keyEvent = (e) => {
  if (e.key === 'Enter') login()
}

// 挂载监听
onMounted(() => {
  window.addEventListener('keydown', keyEvent)
})
// 销毁必须移除监听，防止多页面冲突
onUnmounted(() => {
  window.removeEventListener('keydown', keyEvent)
})
</script>
<style lang="scss" scoped></style>