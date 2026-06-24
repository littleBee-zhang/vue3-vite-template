export const Columns = [
    { title: '姓名', dataIndex: 'name', width: 120, align: 'center', },
    { title: '年龄', dataIndex: 'age', width: 80, align: 'center', render: (row) => { return h('span', row.age) } },
    { title: '手机号', dataIndex: 'phone', ellipsis: true, align: 'center', yesNoMin: 'phone' },
    { title: '身份证号', dataIndex: 'idCard', ellipsis: true, align: 'center', yesNoMin: 'idCard' },
    { title: '邮箱', dataIndex: 'email', ellipsis: true, align: 'center', },
    { title: '地址', dataIndex: 'address', ellipsis: true, align: 'center', },
]
export const DescColumns = [
    { label: '姓名', prop: 'name', },
    { label: '年龄', prop: 'age', },
    { label: '手机号', prop: 'phone', },
    { label: '身份证号', prop: 'idCard', },
    { label: '邮箱', prop: 'email', decimal: 2 },
    { label: '地址', prop: 'address', },
    { label: '英文姓名', prop: 'username', },
    { label: '角色姓名', prop: 'roleName', },
    {
        label: '性别', prop: 'sex', render: (row) => {
            return h('span', row.sex === 1 ? '男' : '女')
        }
    },
    { label: 'ID', prop: 'id', },
]
