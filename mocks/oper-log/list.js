import Mock from 'mockjs'
const { Random } = Mock

export default function (req) {
  // 解析post提交的分页参数
  const body = req.body ? JSON.parse(req.body) : {}
  const { pageNum = 1, pageSize = 10 } = body
  const total = Random.integer(0, 100)

  const data = {
    code: 200,
    message: '',
    data: {
      records: Array.from(new Array(pageSize)).map(() => ({
        id: Random.id(),
        operIp: Random.ip(),
        operName: Random.cname(),
        operTime: Random.datetime(),
        title: Random.ctitle(),
      })),
      pages: pageNum,
      size: pageSize,
      total,
    }
  };
  return data
}