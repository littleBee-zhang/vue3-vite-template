import { defineConfig ,loadEnv  } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 如果你用到 ElementPlus（组件）Vue（api） 自动导入，保留这两个：
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode  })=>{
  // 加载当前 mode 对应的环境变量
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
    vue(),
    // 自动导入 API（ElMessage / ref 等）无需导入可直接使用
    AutoImport({
      imports: [
        'vue',           
      ],// 自动导入 （ ref reactive computed 等 ） 无需导入可直接使用
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
    // 自动导入组件（el-button、el-card 等）
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'css' })],
      dts: false,
    }),

    ],
    // 全局 SCSS 注入
    css: {
      preprocessorOptions: {
        scss: {
          // 自动引入全局变量，组件里直接用 $primary-color
          // additionalData: `@import "@/styles/variables.scss";`
          additionalData: `@use "@/styles/variables.scss" as *;`,
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
      port: env.VITE_PORT || 3000,
      open: true,        // 自启动浏览器
      host: true         // 允许局域网访问
    },
}
})
