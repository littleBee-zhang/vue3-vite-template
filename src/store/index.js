import { createStore } from 'vuex'
import dict from './modules/dict'
import menu from './modules/menu'

export default createStore({
  modules: {
    dict,   // 字典
    menu,   // 菜单
  },
})