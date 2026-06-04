import { getDict } from '@/api/dict'

const state = {
  dictMap: {}, // { status: [], sex: [] }
}

const mutations = {
  SET_DICT(state, { type, data }) {
    state.dictMap[type] = data
  },
  CLEAR_DICT(state) {
    state.dictMap = {}
  },
}

const actions = {
  async getDict({ commit, state }, type) {
    if (state.dictMap[type]) return state.dictMap[type]

    try {
      const res = await getDict(type)
      commit('SET_DICT', { type, data: res.data || [] })
      return res.data
    } catch (e) {
      return []
    }
  },

  clearDict({ commit }) {
    commit('CLEAR_DICT')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}