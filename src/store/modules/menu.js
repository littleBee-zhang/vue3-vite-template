import { getMenu } from '@/api/menu'
import { menuRoutes, menuRoutesList } from '@/router/defaultRoutes'
const state = {
  menuList: [], // 侧边栏菜单
  permissionList: [], // 按钮权限合集
  loadStatus: false
}

const mutations = {
  SET_MENU(state, list) {
    state.menuList = list
  },
  CLEAR_MENU(state) {
    state.menuList = []
  },
  SET_PERM(state, list) {
    state.permissionList = list
  },
  CLEAR_PERM(state) {
    state.permissionList = []
  },
}

const actions = {
  setMenu({ commit }, list) {
    try {
      commit('SET_MENU', list || [])
      return res
    } catch (e) {
      return []
    }
  },
  clearMenu({ commit }) {
    commit('CLEAR_MENU')
  },
  // 设置加载状态
  setLoadStatus(status) {
    this.loadStatus = status
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}