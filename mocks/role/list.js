import Mock from 'mockjs'
const { Random } = Mock
export default function (req) {
  // 模拟两种场景：下拉枚举 / 分页列表
  const body = req.body ? JSON.parse(req.body) : {}
  // 1. 下拉选项数据（常用）
  const selectList = [
    { label: '超级管理员', value: 1, code: 'super_admin' },
    { label: '系统管理员', value: 2, code: 'sys_admin' },
    { label: '运营角色', value: 3, code: 'operate' },
    { label: '访客角色', value: 5, code: 'guest' },
    { label: '普通查看角色', value: 4, code: 'viewer' },
  ]

  // 2. 如果传分页参数，返回分页列表
  if (body.pageNum && body.pageSize) {
    const total = Random.integer(1, 10)
    const records = Array(Random.integer(1, body.pageSize)).fill(0).map((_, idx) => {
      const typeItem = Random.pick(selectList)
      return {
        id: Random.id(),
        roleName: typeItem.label,
        roleType: typeItem.value,
        roleCode: typeItem.code,
        sort: Random.integer(0, 20),
        status: Random.pick([0, 1]), // 0禁用 1启用
        createTime: Random.datetime(),
        remark: Random.ctitle(4, 12)
      }
    })
    return {
      code: 200,
      message: '',
      data: {
        records,
        pages: body.pageNum,
        size: body.pageSize,
        total
      }
    }
  }

  // 默认返回下拉枚举
  return {
    code: 200,
    message: '',
    data: selectList
  }
}