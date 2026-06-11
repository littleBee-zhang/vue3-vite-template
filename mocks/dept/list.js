import Mock from 'mockjs'
const { Random } = Mock

export default function (req) {
  const body = req.body ? JSON.parse(req.body) : {}
  const { pageNum = 1, pageSize = 10 } = body
  const total = Random.integer(0, 100)

  const data = {
    code: 200,
    message: '',
    data: {
      records: Array.from(new Array(Random.integer(0, 5))).map((e, index) => {
        const parentId = Random.id();
        return {
          id: parentId,
          parentId: 0,
          deptName: '一级部门_' + (index + 1),
          sort: null,
          createTime: Random.datetime(),
          updateTime: Random.datetime(),
          deptChildren: Array.from(new Array(Random.integer(0, 10))).map((e, idx) => ({
            id: Random.id(),
            parentId,
            deptName: '二级部门_' + (idx + 1),
            sort: null,
            createTime: Random.datetime(),
            updateTime: Random.datetime(),
            deptChildren: [],
          })),
        };
      }),
      pages: pageNum,
      size: pageSize,
      total,
    }
  };
  return data
}