// import { ElMessageBox } from 'element-plus'

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
    content = '弹窗内容',
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
    customClass: cls,
    center: false,
    showCancelButton: true,
    closeOnClickModal: true,
    closeOnPressEscape: true,
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