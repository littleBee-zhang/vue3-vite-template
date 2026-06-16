export const Columns = [
    { title: '姓名', dataIndex: 'name', width: 120, align: 'center', },
    { title: '年龄', dataIndex: 'age', width: 80, align: 'center', render: (row) => { return h('span', row.age) } },
    { title: '手机号', dataIndex: 'phone', ellipsis: true, align: 'center', yesNoMin: 'phone' },
    { title: '身份证号', dataIndex: 'idCard', ellipsis: true, align: 'center', yesNoMin: 'idCard' },
    { title: '邮箱', dataIndex: 'email', ellipsis: true, align: 'center', },
    { title: '地址', dataIndex: 'address', ellipsis: true, align: 'center', },
]
