import Former from './index.vue'
// 组件注册
const install = (app) => {
    app.component('Former',Former)
}
// 支持按需引入 
Former.install = inatall
export default Former