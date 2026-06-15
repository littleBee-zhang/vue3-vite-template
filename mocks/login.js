import Mock from 'mockjs'
const { Random } = Mock

// MockJS 回调只接收 req 单个参数，无需 res
export const login = (req) => {
  // 可读取前端提交的账号密码做校验
  const body = req.body ? JSON.parse(req.body) : {}
  // 简单校验逻辑，和业务匹配
  if (body.username !== 'admin' || body.password !== '123456') {
    return {
      code: 500,
      message: '账号或密码错误'
    }
  }
  const data = {
    code: 200,
    message: '',
    data: {
      token: Random.guid(),
      userInfo:{
        id: Random.id(),
        name: Random.cname(),
        roleId: Random.id(),
        userName: Random.name(),
        fullArea:Random.county(true),
        dateTime:Random.datetime(),
      },
    },
  };
  return data
}
// MockJS 仅传入req单个参数，无res对象
export const  logout = (req) => {
  const data = {
    code: 200,
    message: '退出登录',
    data: {},
  };
  // 直接返回对象，Mock自动处理JSON响应，无需手动设置header、序列化发送
  return data
}