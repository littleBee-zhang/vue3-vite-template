import Mock from 'mockjs'
const { Random } = Mock

// MockJS 回调只接收 req 单个参数，无需 res
export default function (req) {
  // 可读取前端提交的账号密码做校验
  const body = req.body ? JSON.parse(req.body) : {}
  // 简单校验逻辑，和业务匹配
  if (body.username !== 'admin' || body.password !== '123456') {
    return {
      code: 401,
      message: '账号或密码错误'
    }
  }

  const data = {
    code: 200,
    message: '',
    data: {
      id: Random.id(),
      name: Random.cname(),
      roleId: Random.id(),
      token: Random.guid(),
      username: Random.name(),
    },
  };
  return data
}