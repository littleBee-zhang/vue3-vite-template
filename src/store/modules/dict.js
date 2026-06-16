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
    // 封装请求，传入type
    async function requestDict() {
      try {
        const res = await getDict(type)
        console.log(res,'res');
        
        const data = res.data || []
        // 存入仓库缓存
        commit('SET_DICT', { type, data })
        return data
      } catch (e) {
        console.error(`获取字典【${type}】失败`, e)
        return []
      }
    }

    // 统一判断：无缓存 或 缓存是空数组 → 重新请求
    const cache = state.dictMap[type]
    if (!cache || (Array.isArray(cache) && cache.length === 0)) {
      return await requestDict()
    }

    // 缓存有效直接返回
    return cache
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