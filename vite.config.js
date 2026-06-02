import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 如果你用到 ElementPlus 自动导入，保留这两个：
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] })
  ],
  // 全局 SCSS 注入
  css: {
    preprocessorOptions: {
      scss: {
        // 自动引入全局变量，组件里直接用 $primary-color
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  base:'./',
  server: {
    port: 3000,
    open: true,        // 自启动浏览器
    host: true         // 允许局域网访问
  },
//   define: {
//     __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE),
//     __API_URL__: JSON.stringify(env.VITE_BASE_URL)
//   }
})
