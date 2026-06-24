import Mock from 'mockjs'
const { Random } = Mock

export default function (req) {
  // 解析POST请求体分页参数
  const body = req.body ? JSON.parse(req.body) : {}
  const { pageNum = 1, pageSize = 10 } = body
  const total = Random.integer(0, 100)

  const data = {
    code: 200,
    message: '请求成功',
    data: {
      records: Array.from(new Array(pageSize)).map(() => ({
        id: Random.id(),
        idCard:Random.id(),
        name: Random.cname(),
        address: Random.county(true),
        age: Random.integer(18, 27),
        deptName: Random.cname(),
        email: Random.email(),
        password: Random.string(),
        phone: `1${Random.integer(1000000000, 9999999999)}`,
        roleName: Random.cname(),
        sex: Random.pick([1, 2]),
        username: Random.name(),
      })),
      pages: pageNum,
      size: pageSize,
      total,
    }
  };
  // MockJS直接return数据，自动处理JSON返回
  return data
}