import Mock from 'mockjs'
const { Random } = Mock

export default function (req) {
  const data = {
    code: 200,
    message: '',
    data: {
      id: Random.id(),
      name: Random.cname(),
      address: Random.county(true),
      age: Random.integer(0, 100),
      deptName: Random.cname(),
      email: Random.email(),
      password: Random.string(),
      phone: `1${Random.integer(1000000000, 9999999999)}`,
      roleName: Random.cname(),
      sex: Random.pick([1, 2, 3]),
      username: Random.name(),
    },
  };
  return data
}