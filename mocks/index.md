// 唯一身份ID
const id = Random.id()
// UUID token（登录专用）
const guid = Random.guid()
const uuid = Random.uuid()
// 中文人名
const cname = Random.cname()
// 英文姓名
const enName = Random.name()
// 中文标题，不传参数默认3-7个字
const ctitle1 = Random.ctitle()
// 指定固定长度5个字
const ctitle2 = Random.ctitle(5)
// 中文段落 min最少行数 max最多行数
const paragraph = Random.cparagraph(2, 4)
// 随机小写字符串，长度5
const strLower = Random.string('lower', 5)
// 随机数字字符串，长度6
const strNum = Random.string('number', 6)
// 完整省市区
const fullArea = Random.county(true)
// 仅省份
const province = Random.province()
// 仅城市
const city = Random.city()
// 0~100随机整数
const intNum = Random.integer(0, 100)
// 10~99 小数，小数点1~2位
const floatNum = Random.float(10, 99, 1, 2)
// 随机布尔值 true/false
const bool = Random.boolean()
// 从数组随机抽取一个元素
const pickItem = Random.pick([1,2,3,4,5])
// 打乱数组顺序
const shuffleArr = Random.shuffle([1,2,3,4,5])
// 完整年月日时分秒
const dateTime = Random.datetime()
// 仅年月日
const date = Random.date()
// 仅时分秒
const time = Random.time()
// 当前系统完整时间
const nowTime = Random.now()
// IPv4地址
const ip = Random.ip()
// 随机邮箱
const email = Random.email()
// 随机网址
const url = Random.url()
// 11位手机号
const phone = Random.phone()
// 十六进制颜色 #xxxxxx
const color = Random.color()
// 宽200 高100 背景#ccc 文字test的占位图地址
const imgUrl = Random.image('200x100', '#ccc', 'test')