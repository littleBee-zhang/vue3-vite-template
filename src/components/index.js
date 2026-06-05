/**  全局注册自定义组件（直接使用即可）  **/ 
import Former from './former/index.vue'
import Table from './table/index.vue'
import Card from './card/index.vue'
import Dialog from './dialog/index.vue'
import Confirm from './dialog/confirm.js'

Dialog.Confirm = Confirm // 
// 组件注册
const install = (app) => {
  app.component('Former', Former)
  app.component('Table', Table)
  app.component('Card', Card)
  app.component('Dialog', Dialog)
}
// // 支持按需引入 
Former.install = install
Table.install = install
Card.install = install
Dialog.install = install

export default { install }
export { Former, Table , Card , Dialog}