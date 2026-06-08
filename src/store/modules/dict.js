import { getDict } from '@/api/dict'

const state = {
  dictMap: {}, // { status: [], sex: [] }
}

const mutations = {
  // 设置字典
  SET_DICT(state, { type, data }) {
    state.dictMap[type] = data
  },
  // 清空全部字典
  CLEAR_DICT(state) {
    state.dictMap = {}
  },
}

const actions = {
  /**
   * 获取字典（自带缓存 + 空值自动重请求）
   * @param type 字典类型：status / sex / role 等
   */
  async getDict({ commit, state }, type) {
    // 1. 如果没有该类型 → 直接请求
    if (!state.dictMap[type]) {
      return await requestDict()
    }

    // 2. 如果有该类型，但数组为空 → 重新请求
    if (Array.isArray(state.dictMap[type]) && state.dictMap[type].length === 0) {
      return await requestDict()
    }

    // 3. 正常有缓存 → 直接返回
    return state.dictMap[type]

    // 请求方法封装
    async function requestDict() {
      
      try {
        const res = await getDict(type)
        const data = res.data || []
        commit('SET_DICT', { type, data })
        return data
      } catch (e) {
        console.error(`获取字典【${type}】失败`, e)
        return []
      }
    }
  },

  // 清空所有字典缓存
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