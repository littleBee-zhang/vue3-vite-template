/**  全局注册自定义组件（直接使用即可）  **/ 
import Confirm from './dialog/confirm.js'
import Table from './table/index.vue'
import Card from './card/index.vue'
import Dialog from './dialog/index.vue'
import Form from './Form/index.vue'
import Icon from './iocn/index.vue'
import Echarts from './Echarts/index.vue'
import Upload from './upload/index.vue'
Dialog.Confirm = Confirm // 
/**  组件注册  **/ 
const install = (app) => {
  app.component('Form', Form)
  app.component('Table', Table)
  app.component('Card', Card)
  app.component('Icon', Icon)
  app.component('Echarts', Echarts)
  app.component('Dialog', Dialog)
  app.component('Upload', Upload)
}
/**  支持按需引入  **/   
Form.install = install
Table.install = install
Card.install = install
Dialog.install = install
Icon.install = install
Echarts.install = install
Upload.install = install

export default { install }