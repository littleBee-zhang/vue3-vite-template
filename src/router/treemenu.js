/**
 * 合并默认菜单+动态菜单，按path去重，自动还原完整树形结构
 * @param {Array} defaultMenu 静态基础菜单
 * @param {Array} dynamicMenu 后端动态菜单
 * @returns {Array} 去重后完整树形菜单
 */
export function mergeUniqueMenuByPath(defaultMenu, dynamicMenu) {
    // 1. 全局存储所有节点，key=path，自动去重（后遍历覆盖前面）
    const nodeMap = new Map()
    // 存储所有节点的父path映射
    const parentPathMap = new Map()

    // 递归遍历收集所有节点
    const travelCollect = (list, parentPath = '') => {
        if (!Array.isArray(list)) return
        list.forEach(node => {
            const item = { ...node }
            // 记录当前节点的父路由path
            parentPathMap.set(item.path, parentPath)
            // 递归子节点，父path传当前节点path
            if (Array.isArray(item.children) && item.children.length) {
                travelCollect(item.children, item.path)
            } else {
                item.children = []
            }
            // 重复path直接覆盖（动态菜单后遍历，覆盖默认）
            nodeMap.set(item.path, item)
        })
    }

    // 先收集默认菜单，再收集动态菜单（动态覆盖同path默认）
    travelCollect(defaultMenu)
    travelCollect(dynamicMenu)

    // 2. 递归重建树形结构
    const buildTree = (parentPath = '') => {
        const tree = []
        nodeMap.forEach((node, selfPath) => {
            // 当前节点的父path等于传入的parentPath，说明是当前层级子节点
            if (parentPathMap.get(selfPath) === parentPath) {
                // 递归构建自己的子节点
                node.children = buildTree(selfPath)
                tree.push(node)
            }
        })
        return tree
    }

    // parentPath='' 代表顶层根节点
    return buildTree('')
}

/**
 * 单一份树形菜单内部按path去重并还原树
 * @param {Array} tree 原始树形数组
 * @returns {Array} 去重树形
 */
export function uniqueSingleTreeByPath(tree) {
    const nodeMap = new Map()
    const parentPathMap = new Map()

    const travel = (list, parentPath = '') => {
        list.forEach(node => {
            parentPathMap.set(node.path, parentPath)
            const copy = { ...node }
            if (copy.children?.length) travel(copy.children, copy.path)
            else copy.children = []
            if (!nodeMap.has(copy.path)) nodeMap.set(copy.path, copy)
        })
    }
    travel(tree)

    const build = (pPath = '') => {
        const res = []
        nodeMap.forEach((node, path) => {
            if (parentPathMap.get(path) === pPath) {
                node.children = build(path)
                res.push(node)
            }
        })
        return res
    }
    return build('')
}