import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 如果你用到 ElementPlus（组件）Vue（api） 自动导入，保留这两个：
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode, command  }) => {
  // 加载当前 mode 对应的环境变量
  const env = loadEnv(mode, process.cwd())
  // 区分开发/生产环境
  const isBuild = command === 'build'
  const isDev = mode === 'development'
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
          // additionalData: `@import "@/styles/variables.scss";` // 旧版本
          additionalData: `@use "@/styles/variables.scss" as *;`,
        }
      },
      build: {
        cssCodeSplit: true, // 拆分独立css文件
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@api': path.resolve(__dirname, 'src/api'),
      }
    },
    base: './',
    server: {
      port: env.VITE_PORT || 3000,
      open: true,        // 自启动浏览器
      host: true         // 允许局域网访问
    },
    // 生产环境自动清除 console / debugger
    esbuild: {
      drop: isBuild ? ['console', 'debugger'] : [],
    },
    // 依赖预构建，提升开发启动速度
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'element-plus', 'axios'],
    },
    // 打包构建优化
    build: {
      outDir: 'dist',
      emptyOutDir: true, // 打包前清空dist
      chunkSizeWarningLimit: 1500, // 分包告警阈值
      rollupOptions: {
        // 分包拆分，减小单js体积
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            elementPlus: ['element-plus']
          }
        }
      }
    },
    // 识别静态资源后缀
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
  }
})
