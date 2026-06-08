## API

#### 入参

| 参数	    说明	                        类型	        默认值
| list	    字典源数据数组	              Array	        []
| target	  查找目标（可传value /label）	Any	          undefined
| props	    自定义字段配置	              Object	      { value: 'value', label: 'label' }

#### 出参 Object<label, record> | null(入参错误时)

|参数	     说明	                  类型
|label	   匹配到的展示文本	       String
|value	   匹配到的编码 / 实际值	 Any
|record	   匹配到的完整原数据对象	 Object

## 示例

```js
import { FieldMapping } from '@/utils'

// 标准字典数据
const SEX = [
  { label: '保密', value: 0 },
  { label: '男', value: 1 },
  { label: '女', value: 2 },
]

// 1. 正向查询：根据 value 查 label
const res1 = FieldMapping(SEX, 0)
console.log(res1.label)    // 保密
console.log(res1.value)    // 0
console.log(res1.record)   // { label: '保密', value: 0 }

// 2. 反向查询：根据 label 查 value
const res2 = FieldMapping(SEX, '男')
console.log(res2.value)    // 1

// 3. 自定义字段（非标准 value/label 结构）
const FRUIT = [
  { name: '苹果', code: '01' },
  { name: '香蕉', code: '02' },
]
const res3 = FieldMapping(FRUIT, '01', { value: 'code', label: 'name' })
console.log(res3.label)   // 苹果

/**
 * value -> 保密
 * label -> 0
 * record -> { label: '保密', value: 0 }
*/
```
