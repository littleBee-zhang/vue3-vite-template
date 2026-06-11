import Mock from 'mockjs'
const { Random } = Mock

export default function (req) {
  return {
    code: 200,
    message: '',
    data: {}
  }
}