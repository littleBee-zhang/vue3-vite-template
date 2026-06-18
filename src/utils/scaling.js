// #### //
/**
 * 单个组件等比例缩放逻辑
 * @param {HTMLElement} targetDom 要缩放的目标DOM
 * @param {number} baseW 设计稿基准宽度
 * @param {number} baseH 设计稿基准高度
 * @param {number} defaultScale 【可选】默认固定缩放倍数，不传则自动按父容器适配
 * @param {boolean} enableScale 【可选】是否开启缩放，默认 true 开启
 */
export function setComponentScale(targetDom, baseW = 750, baseH = 1662, defaultScale = null, enableScale = false) {
    if (!targetDom) return

    // 关闭缩放：还原原始尺寸，清空缩放样式
    if (!enableScale) {
        targetDom.style.width = ''
        targetDom.style.height = ''
        targetDom.style.transform = ''
        targetDom.style.transformOrigin = ''
        return
    }

    const parent = targetDom.parentElement
    const viewportWidth = parent.clientWidth
    const viewportHeight = parent.clientHeight

    let scale
    // 优先级：传入固定缩放倍数 > 自动适配宽度
    if (defaultScale !== null && typeof defaultScale === 'number') {
        scale = defaultScale
    } else {
        scale = viewportWidth / baseW
    }
    // 缩放后的高度
    const scaledHeight = baseH * scale

    // 给目标组件设置固定基准尺寸 + 缩放
    targetDom.style.width = `${baseW}px`
    targetDom.style.height = `${baseH}px`
    targetDom.style.transform = `scale(${scale})`
    targetDom.style.transformOrigin = 'top left'
    targetDom.style.position = 'relative'

    // 父容器溢出强制控制
    if (scaledHeight > viewportHeight) {
        parent.style.overflowY = 'auto'
        parent.style.overflowX = 'hidden'
    } else {
        parent.style.overflow = 'hidden'
    }
    // 同步修改防止影响父级高度
    parent.style.height = `${scaledHeight}px`
    parent.style.overflow = 'hidden'

    return scale
}
/**
 * 初始化 + 窗口 resize 监听
 * @param {HTMLElement} targetDom
 * @param {number} baseW
 * @param {number} baseH
 * @param {number|null} defaultScale 固定缩放倍数
 * @param {boolean} enableScale 是否启用缩放
 */
export function initComponentFlexible(targetDom, baseW, baseH, defaultScale = null, enableScale = false) {
    const resizeHandler = () => {
        setComponentScale(targetDom, baseW, baseH, defaultScale, enableScale)
    }
    // 立即执行一次，初始化适配
    resizeHandler()
    // 挂载窗口resize监听
    window.addEventListener('resize', resizeHandler)
    // 挂载到DOM实例，方便后续销毁移除监听
    targetDom._resizeHandler = resizeHandler
}
/**
 * 销毁解绑监听
 * @param {HTMLElement} targetDom
 */
export function destroyComponentFlexible(targetDom) {
    if (targetDom?._resizeHandler) {
        window.removeEventListener('resize', targetDom._resizeHandler)
        delete targetDom._resizeHandler
    }
}