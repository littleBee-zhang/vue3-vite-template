import Mock from 'mockjs'
const { Random } = Mock
// MockJS 仅传入req单个参数，无res对象
export const success = (req) => {
  const data = {
    code: 200,
    message: '操作成功',
    data: {},
  };
  // 直接返回对象，Mock自动处理JSON响应，无需手动设置header、序列化发送
  return data
}
export const Delete = (req) => {
  const data = {
    code: 200,
    message: '删除成功',
    data: {},
  }
  return data
}
export const Update = (req) => {
  const data = {
    code: 200,
    message: '更新成功',
    data: {},
  }
  return data
}
export const Add = (req) => {
  const data = {
    code: 200,
    message: '添加成功',
    data: {},
  }
  return data
}