import { getMenu } from '@/api/menu'

const state = {
  menuList: [], // 侧边栏菜单
}

const mutations = {
  SET_MENU(state, list) {
    state.menuList = list
  },
  CLEAR_MENU(state) {
    state.menuList = []
  },
}

const actions = {
  async loadMenu({ commit }) {
    try {
      const res = await getMenu()
      commit('SET_MENU', res.data || [])
      return res.data
    } catch (e) {
      return []
    }
  },

  clearMenu({ commit }) {
    commit('CLEAR_MENU')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}