import Mock from 'mockjs'
const { Random } = Mock

export default function (req) {
  const parentId = Random.id()
  const index = Random.integer(1, 99)

  const data = {
    code: 200,
    message: '',
    data: {
      id: Random.id(),
      parentId,
      deptName: '二级部门' + index,
      sort: Random.integer(0, 50),
      createTime: Random.datetime(),
      updateTime: Random.datetime(),
    },
  };
  return data
}