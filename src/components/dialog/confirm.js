import { ElMessageBox } from 'element-plus'

const widths = { small: 480, medium: 680, large: 880 }

export default function Confirm(options = {}) {
  const {
    className = '',
    style = {},
    bodyStyle = {},
    icon = null,
    title = '弹窗标题',
    width = 'medium',
    okText = '确定',
    okButtonProps = {},
    onOk = () => {},
    cancelText = '取消',
    cancelButtonProps = {},
    onCancel = () => {},
    afterClose = () => {},
    content = '弹窗内容',// 👇 新增：点击空白关闭
    closeOnClickModal = true,
    // 👇 新增：按ESC关闭
    closeOnPressEscape = true,// 👇 新增：图标类型（warning / success / info / error）
    type = '',
    // 👇 新增：内容居中
    center = false,
  } = options

  const w = widths[width] || width
  const cls = className ? `confirm-modal ${className}` : 'confirm-modal'

  ElMessageBox({
    title,
    message: content,
    confirmButtonText: okText,
    cancelButtonText: cancelText,
    dangerouslyUseHTMLString: true,
    width: w,
    type: type, // 图标
    center: center, // 居中
    customClass: cls,
    showCancelButton: true,
    closeOnClickModal: closeOnClickModal,
    closeOnPressEscape: closeOnPressEscape,
    ...okButtonProps,
    ...cancelButtonProps,
  })
    .then(async () => {
      await onOk()
    })
    .catch(() => {
      onCancel()
    })
    .finally(() => {
      afterClose()
    })
}