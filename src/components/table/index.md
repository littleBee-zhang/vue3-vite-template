<template>
  <div>
    <Table
      ref="tableRef"
      :columns="columns"
      :data-source="dataList"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      @selection-change="handleSelectionChange"
      @page-change="handlePageChange"
    />
    <!-- 操作按钮组 -->
    <div style="margin:12px 0;">
      <el-button @click="handleClearSelection">清除选中</el-button>
      <el-button @click="handleToggleAll">全选/取消</el-button>
      <el-button @click="handleGetSelected">获取选中行({{selectedRows.length}})</el-button>
      <el-button @click="handleRefresh">刷新表格</el-button>
    </div>
    <!-- 展示选中数据 -->
    <div v-if="selectedRows.length > 0">
      <h3>选中的行：</h3>
      <pre>{{selectedRows}}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Table from '@/components/table/index.vue'

// 表格实例
const tableRef = ref(null)
// 列配置
const columns = ref([
  { title: '姓名', dataIndex: 'name', width:120 },
  { title: '年龄', dataIndex: 'age', width:80, align:'center' },
  { title: '地址', dataIndex: 'address', ellipsis:true },
      {
        title: '状态',
        dataIndex: 'status',
        width:150,
        align:'center',
        render:(row)=> {
            return h(
                'span', // 标签名
                { type: row.status === 0 ? 'danger' : 'success' },
                () => row.status === 0 ? '失败' : '成功'
            );
        }
      },
  {
    title: '操作',
    dataIndex: 'action',
    width:150,
    align:'center',
    actions:[
      {
        key: 'edit',
        type: 'primary',
        content: (row) => h(Operation, {
          title: '编辑',
          openText: '编辑',
          onOk: (close) => {
            console.log('编辑');
          }
        }, {
          default: () => '弹窗表单内容'
        })
      },
      
      // 2. 删除（带确认）
      {
        key: 'delete',
        type: 'danger',
        link: true,
        content: '删除',
        confirm: '确定要删除吗？',
        onClick: (row) => {}
      },

      // 3. 普通按钮
      {
        key: 'detail',
        type: 'success',
        link: true,
        content: '查看',
        onClick: (row) => {

        }
      }
    ]
  },
])
// 数据源
const dataList = ref([
  { id:1, name:'张三', age:28, address:'北京市朝阳区xxx街道' },
  { id:2, name:'李四', age:32, address:'上海市浦东新区xxx路' },
])
// 选中数据
const selectedRows = ref([])
const loading = ref(false)
// 分页配置
const pagination = ref({
  current:1,
  pageSize:10,
  total:100
})

// 分页切换
const handlePageChange = (page,size)=>{
  console.log('当前页',page,'每页条数',size)
}
// 多选事件
const handleSelectionChange = (event)=>{
  selectedRows.value = event
}

// 1.清空选中
const handleClearSelection = ()=>{
  tableRef.value.clearSelection()
  ElMessage.success('已清除选中')
}
// 2.全选/取消全选
const handleToggleAll = ()=>{
  tableRef.value.toggleAllSelection()
}
// 3.获取选中行
const handleGetSelected = ()=>{
  const rows = tableRef.value.getSelectedRows()
  ElMessage.info(`共选中${rows.length}行`)
}
// 4.刷新表格
const handleRefresh = ()=>{
  tableRef.value.refresh()
}
</script>
<!-- props 入参说明 -->
参数	类型	默认值	说明
columns	Array	必填	表格列配置数组
dataSource	Array	[]	表格数据源
permissions	Array	[]	用户权限数组
rowKey	String	id	行主键字段名
loading	Boolean	false	表格加载状态
pagination	Object/Boolean	true	分页配置，false 关闭分页
rowSelection	Object/Boolean	false	开启多选框配置
showIndex	Boolean	false	是否显示序号列
showIndexWidth	Number	72	序号列宽度
showIndexLabel	String	序号	序号列表头文字
expandable	Boolean	false	是否开启展开行
expandWidth	Number	50	展开图标列宽度
stripe	Boolean	true	斑马纹
border	Boolean	false	表格边框
size	String	default	尺寸：large/default/small
height	String/Number	null	表格固定高度
maxHeight	String/Number	null	表格最大高度
defaultSort	Object	{prop:'age',order:'descending'}	默认排序
<!-- pagination 对象配置项 -->
{ current:1, pageSize:10, total:0, pageSizeOptions:[10,20,50,100], layout:'total,sizes,prev,pager,next,jumper' }
<!-- columns 列配置参数 -->
字段	类型	说明
title	String	列表头名称
permission	String	权限标识
dataIndex	String	绑定数据源字段
width/minWidth	Number	列宽、最小自适应宽度
fixed	Boolean/String	固定列 left /right
align	String	单元格对齐 left/center/right
ellipsis	Boolean	文字超出省略，默认 true
sorter	Boolean	开启自定义排序
yesNoMin	String	是否脱敏 idCard  phone  name  carNo
customRender	Boolean	启用插槽自定义单元格
render	Function	JSX 函数渲染单元格
confirm	Array	操作按钮 + 弹窗确认配置
<!-- confirm 二次确认按钮配置 -->
配置在 columns.confirm = [{}]
| 参数 | 类型 | 默认 | 说明 |
| ---- | ---- | ---- | ---- |
| buttonText | String | 按钮 | 按钮展示文字 |
| buttonType | String | primary | el-button 类型 |
| buttonProps | Object | {} | 按钮原生属性 |
| title | String | 确认执行此操作？ | 弹窗提示文案 |
| okText | String | 确认 | 弹窗确认按钮文字 |
| cancelText | String | 取消 | 弹窗取消按钮文字 |
| onConfirm | Function | - | 弹窗确认回调 (row,index,column) |
| onClick | Function | - | 无弹窗普通按钮点击 |
<!-- 组件对外暴露方法 绑定 ref 后：tableRef.value.方法名() -->
方法名	说明
clearSelection()	清空表格全部勾选
toggleRowSelection(row,selected)	单独选中 / 取消单行
toggleAllSelection()	全选 / 取消全选
getSelectedRows()	获取选中行数组
refresh()	清空选中 + 排序 + 筛选
clearSort()	清除表头排序
clearFilter()	清除列筛选
scrollToRow(row)	滚动至指定行
getTableData()	获取 el-table 原生实例
<!-- 组件支持事件 -->
事件	入参	说明
@page-change	(page, pageSize)	页码 / 每页条数变更
@size-change	(size)	每页条数修改
@selection-change	(selectedList)	勾选数据变化
@sort-change	({prop,order})	表头排序切换
@update:currentPage	page	页码双向绑定
@update:pageSize	size	页大小双向绑定