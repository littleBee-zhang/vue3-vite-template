export const Columns = (del) => {
    return [
        { title: '姓名', dataIndex: 'name', width: 120, align: 'center', },
        { title: '年龄', dataIndex: 'age', width: 80, align: 'center', render: (row) => { return h('span', row.age) } },
        { title: '手机号', dataIndex: 'phone', ellipsis: true, align: 'center', yesNoMin:'phone' },
        { title: '身份证号', dataIndex: 'idCard', ellipsis: true, align: 'center', yesNoMin:'idCard' },
        { title: '邮箱', dataIndex: 'email', ellipsis: true, align: 'center', },
        { title: '地址', dataIndex: 'address', ellipsis: true, align: 'center', },
        {
            title: '操作',
            dataIndex: 'action',
            width: 150,
            align: 'center',
            fixed: 'right',
            actions: [
                {
                    key: 'edit',
                    type: 'primary',
                    link: true,
                    content: '编辑',
                    onClick: (row) => {
                        console.log(row, '编辑');
                        if (row?.id) { }
                    }
                },

                // 2. 删除（带确认）
                {
                    key: 'delete',
                    type: 'danger',
                    link: true,
                    content: '删除',
                    confirm: '确定要删除吗？',
                    onClick: (row) => { del(row?.id) }
                },

                // 3. 普通按钮
                {
                    key: 'detail',
                    type: 'success',
                    link: true,
                    content: '查看',
                    onClick: (row) => { }
                }
            ]
        },
    ]
}