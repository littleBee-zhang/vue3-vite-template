import Mock from 'mockjs'
const { Random } = Mock

export default function (req) {
  const data = {
    code: 200,
    message: '',
    data: Array.from(new Array(Random.integer(0, 10))).map((e, index) => ({
      createTime: Random.datetime(),
      id: Random.id(),
      isDelete: null,
      menuId: Random.id(),
      roleId: Random.id(),
      updateTime: null,
    })),
  };
  return data
}