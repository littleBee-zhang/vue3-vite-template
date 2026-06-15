export const Columns = (del) => {
    return [
        { title: '姓名', dataIndex: 'name', align: 'center', },
        { title: '路径', dataIndex: 'path', ellipsis: true, align: 'center', },
        { title: '类型', dataIndex: 'type', ellipsis: true, align: 'center', },
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