import Mock from 'mockjs'
const { Random } = Mock

export default function (req) {
  const data = {
    code: 200,
    message: '',
    data: {
      id: Random.id(),
      name: Random.cname(),
      remark: Random.ctitle(),
    },
  };
  return data
}