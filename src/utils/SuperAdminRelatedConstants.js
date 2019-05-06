/**
 * 超级管理员相关页面的常量
 * @type {*[]}
 */

export const superAdminMenuItems = [
    {
        key: 'sany_factory',
        title: 'SANY工厂管理',
        iconType: 'user'
    },
    {
        key: 'vendor',
        title: '供应商工厂管理',
        iconType: 'user'
    },
    {
        key: 'user',
        title: '用户管理',
        iconType: 'user'
    },
]

export const userTableColumns = [
    {
        title: '序号',
        dataIndex: 'id',
        width: '4%',
        editable: true,
    },
    {
        title: '用户名',
        dataIndex: 'userName',
        width: '9%',
        editable: true,
    },
    {
        title: '姓名',
        dataIndex: 'name',
        width: '9%',
        editable: true,
    },
    {
        title: '手机号',
        dataIndex: 'mobile',
        width: '14%',
        editable: true,
    },
    {
        title: '供应商',
        dataIndex: 'vendor',
        width: '9%',
        editable: true,
    },
    {
        title: '角色',
        dataIndex: 'role',
        width: '9%',
        editable: true,
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: '9%',
        editable: true,
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: '17%',
        editable: true,
    }
]

export const sanyFactoryTableColumns = [
    {
        title: '序号',
        dataIndex: 'id',
        width: '10%',
        editable: true,
    },
    {
        title: 'SANY工厂编号',
        dataIndex: 'sanyId',
        width: '15%',
        editable: true,
    },
    {
        title: 'SANY工厂名称',
        dataIndex: 'sanyName',
        width: '25%',
        editable: true,
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: '10%',
        editable: true,
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: '16%',
        editable: true,
    }
]

export const vendorsTableColumns = [
    {
        title: '序号',
        dataIndex: 'id',
        width: '10%',
        editable: true,
    },
    {
        title: '供应商编号',
        dataIndex: 'vendorId',
        width: '15%',
        editable: true,
    },
    {
        title: '供应商名称',
        dataIndex: 'vendorName',
        width: '25%',
        editable: true,
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: '10%',
        editable: true,
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: '16%',
        editable: true,
    }
]

export const validStateMap = [
    {
        key:'valid',
        value:'启用',
        label:'启用'
    },
    {
        key:'invalid',
        value:'停用',
        label:'停用'
    }
]

export const unitMap = [
    {
        key:'unit_t',
        value:'t',
        label:'t'
    },
    {
        key:'unit_kg',
        value:'kg',
        label:'kg'
    }
]


export const roleMap = [
    {
        key:'super_admin',
        value:'超级管理员',
        label:'超级管理员'
    },
    {
        key:'sender',
        value:'发货员',
        label:'发货员'
    },
    {
        key:'receiver',
        value:'收货员',
        label:'收货员'
    },
    {
        key:'sany_admin',
        value:'工厂管理员',
        label:'工厂管理员'
    },
    {
        key:'vendor_admin',
        value:'供应商管理员',
        label:'供应商管理员'
    }
]

export const vendorList = [
    {
        key: 'vendor1',
        value: '供应商-1',
        label: '供应商-1'
    },
    {
        key: 'vendor2',
        value: '供应商-2',
        label: '供应商-2'
    },
    {
        key: 'vendor3',
        value: '供应商-3',
        label: '供应商-3'
    }
]

export const factoryList = [
    {
        key: 'factory1',
        value: '工厂-1',
        label: '工厂-1'
    },
    {
        key: 'factory2',
        value: '工厂-2',
        label: '工厂-2'
    },
    {
        key: 'factory3',
        value: '工厂-3',
        label: '工厂-3'
    }

]