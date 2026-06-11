import Mock from 'mockjs'
const { Random } = Mock

export default function (req) {
  // 解析POST请求参数
  const body = req.body ? JSON.parse(req.body) : {}
  const { pageNum = 1, pageSize = 10 } = body
  const total = Random.integer(0, 100)

  const data = {
    code: 200,
    message: '',
    data: {
      records: Array.from(new Array(pageSize)).map(() => ({
        id: Random.id(),
        name: Random.cname(),
        remark: Random.ctitle(),
      })),
      pages: pageNum,
      size: pageSize,
      total,
    }
  };
  return data
}