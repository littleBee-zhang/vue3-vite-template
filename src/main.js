import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入中文包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 引入自定义组件
import MyComp from '@/components/index'
// 阿里Icon图标
import '@/assets/iconfont/iconfont.js'
import App from './App.vue'
import router from './router'
import './style.css'// 引入主题样式
import './styles/theme.scss'
// 
import store from './store' // 引入
const app = createApp(App)

// 一键全局注册 Former、Table等自定义组件
app.use(MyComp)
app.use(ElementPlus,{ locale: zhCn })
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store) // 挂载
app.use(router)
app.mount('#app')
// ✨ 设置默认深色主题
document.documentElement.className = ''