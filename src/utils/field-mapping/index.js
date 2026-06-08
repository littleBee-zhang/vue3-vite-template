// 全局缓存池（自动回收，无内存泄漏）
const dictCache = new WeakMap();
/**
 * 万能字典查询
 * @param {Array} list 字典数组
 * @param {any} targetValue 要查询的值（value 或 label）
 * @param {Object} props 自定义字段名 { label: 'xxx', value: 'xxx' }
 * @returns {Object} { label, value, record }
 */
export const FieldMapping = (list = [], targetValue = undefined, props = {}) => {
  // 默认字段配置
  const { label = 'label', value = 'value' } = props;
  // 安全校验
  if (!Array.isArray(list)) return { label: '', value: null, record: null };
  if (targetValue === undefined || targetValue === null || targetValue === '') {
    return { label: '', value: null, record: null };
  }
  // 构建缓存（只执行一次）
  if (!dictCache.has(list)) {
    const valueMap = new Map();
    const labelMap = new Map();
    const len = list.length;
    for (let i = 0; i < len; i++) {
      const item = list[i];
      if (!item) continue;
      const itemValue = item[value];
      const itemLabel = item[label];
      if (itemValue === undefined || itemValue === null || itemLabel === undefined) continue;
      // 正查缓存：value → { label, record }
      valueMap.set(String(itemValue), {
        label: itemLabel ?? '',
        value: itemValue,
        record: item
      });
      // 反查缓存：label → { value, record }
      labelMap.set(String(itemLabel).trim(), {
        label: itemLabel ?? '',
        value: itemValue,
        record: item
      });
    }
    dictCache.set(list, { valueMap, labelMap });
  }
  const cache = dictCache.get(list);
  const key = String(targetValue);
  // 先尝试正查（根据 value 找 label）
  const byValue = cache.valueMap.get(key);
  if (byValue) return byValue;
  // 再尝试反查（根据 label 找 value）
  const byLabel = cache.labelMap.get(key.trim());
  if (byLabel) return byLabel;
  // 都找不到
  return { label: '', value: null, record: null };
};
/**
 * 生成 10000 条测试字典数据
 * @returns {Array} 字典数组 [{ value: number, label: string }]
 */
export const generateBigDict = (num = 10000, key='状态') => {
  const list = []
  for (let i = 0; i < num; i++) {
    list.push({
      value: i+1,               // 数字 value（0~9999）
      label: `${key}-${i+1}`       // 标签
    })
  }
  return list
}
