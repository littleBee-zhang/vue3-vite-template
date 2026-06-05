/**  全局注册自定义组件（直接使用即可）  **/ 
import Confirm from './dialog/confirm.js'
import Table from './table/index.vue'
import Card from './card/index.vue'
import Dialog from './dialog/index.vue'
// import Form from '@/components/Form/index.vue'
import Form from './Form/index.vue'
import Icon from './iocn/index.vue'
// import SvgIcon from './SvgIcon.vue'
// const install = app=>{
//   app.component('SvgIcon',SvgIcon)
// }
Dialog.Confirm = Confirm // 
// 组件注册
const install = (app) => {
  app.component('Form', Form)
  app.component('Table', Table)
  app.component('Card', Card)
  app.component('Icon', Icon)
  app.component('Dialog', Dialog)
  app.component('MyFormer', Form)
  app.component('MyTable', Table)
  app.component('MyCard', Card)
  app.component('MyDialog', Dialog)
}
// // 支持按需引入 
Form.install = install
Table.install = install
Card.install = install
Dialog.install = install
Icon.install = install

export default { install }
export { 
  Form, 
  Table , 
  Card , 
  Dialog , 
}