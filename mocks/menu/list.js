import Mock from 'mockjs'
const { Random } = Mock

export default function (req) {
  const body = req.body ? JSON.parse(req.body) : {}
  const { pageNum = 1, pageSize = 10 } = body

  const data = {
    code: 200,
    message: '',
    data: Array.from(new Array(Random.integer(0, 5))).map((e, index) => {
      const parentId = Random.id();
      return {
        id: parentId,
        name: '一级菜单_' + (index + 1),
        parentId: 0,
        sort: index,
        type: '1',
        url: '/' + Random.string('lower'),
        childrenMenu: Array.from(new Array(Random.integer(0, 10))).map((e, idx) => ({
          id: Random.id(),
          name: '二级菜单_' + (idx + 1),
          parentId: parentId,
          sort: idx,
          type: '1',
          url: '/' + Random.string('lower'),
          childrenMenu: [],
        })),
      };
    }),
  };
  return data
}