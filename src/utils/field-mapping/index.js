/**
 * 标签字段映射
 * 解决：表格大量调用、数据量过大导致的卡顿问题
 * 特性：一次构建缓存，永久 O(1) 极速查询，Vue 表格渲染安全稳定
 * @param {Array} list 字典数组 [{ label, value }]
 * @param {String|Number} key 要匹配的值
 * @returns { label, record } | 空对象（防止表格报错）
 */
export default (list = [], key = undefined) => {
  // 安全校验
  if (!Array.isArray(list) || (key === undefined && key !== 0)) {
    return { label: '', record: null };
  }

  // 核心：第一次调用时构建 MAP 缓存（只执行一次）
  if (!list._valueMap) {
    list._valueMap = new Map();
    list.forEach((item) => {
      if (!item) return;
      // 统一格式化为两位字符串（保持你原有逻辑：1 → 01）
      const mapKey = `00${item.value}`.slice(-2);
      list._valueMap.set(mapKey, {
        label: item.label,
        record: item,
      });
    });
  }

  // 从缓存中直接取值（极快，不遍历）
  const targetKey = `00${key}`.slice(-2);
  return list._valueMap.get(targetKey) || { label: '', record: null };
};