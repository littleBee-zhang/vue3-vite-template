export const Columns = (del) => {
    return [
        { title: '角色名称', dataIndex: 'roleName', width: 120, align: 'center', },
        { title: '角色类型', dataIndex: 'roleCode', width: 120, align: 'center', },
        { title: '备注', dataIndex: 'remark', ellipsis: true, align: 'center', },
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