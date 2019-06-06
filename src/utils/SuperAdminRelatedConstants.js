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
        title: '供应商管理',
        iconType: 'user'
    },
    {
        key: 'user',
        title: '用户管理',
        iconType: 'user'
    },
    {
        key: 'basic_material_type_management',
        title: '基础物料管理',
        iconType: 'user'
    }
]

// 基础信息-SANY工厂管理
export const sanyFactoryTableColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '10%',
        editable: false,
    },
    {
        title: 'SANY工厂编号',
        dataIndex: 'sanyId',
        width: '15%',
        editable: false,
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
        width: '25%',
        editable: false,
    }
]

// 基础信息-供应商管理
export const vendorsTableColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '10%',
        editable: false,
    },
    {
        title: '供应商编号',
        dataIndex: 'vendorId',
        width: '20%',
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
        width: '25%',
        editable: false,
    }
]

// 基础信息-用户管理
export const userTableColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '5%',
        editable: false,
    },
    {
        title: '用户名',
        dataIndex: 'userName',
        width: '10%',
        editable: false,
    },
    {
        title: '姓名',
        dataIndex: 'name',
        width: '10%',
        editable: true,
    },
    {
        title: '手机号',
        dataIndex: 'mobile',
        width: '15%',
        editable: true,
    },
    {
        title: '密码',
        dataIndex: 'password',
        width: '10%',
        editable: true,
    },
    {
        title: '供应商',
        dataIndex: 'vendor',
        width: '15%',
        editable: true,
    },
    {
        title: '角色',
        dataIndex: 'role',
        width: '10%',
        editable: true,
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: '5%',
        editable: true,
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: '15%',
        editable: false,
    }
]

// 基础信息-基础物料管理
export const basicMaterialTypeTableColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '5%',
        editable: false,
    },
    {
        title: '物料编码',
        dataIndex: 'material',
        width: '20%',
        editable: false,
    },
    {
        title: '物料描述',
        dataIndex: 'materialDescription',
        width: '20%',
        editable: true,
    },
    {
        title: '单位',
        dataIndex: 'unit',
        width: '10%',
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
        width: '25%',
        editable: false,
    }
]


// 角色列表
export const roleList = [
    {
        key:'super_admin',
        value:1,
        label:'系统管理员'
    },
    {
        key:'sany_admin',
        value:2,
        label:'VMI工厂管理员'
    },
    {
        key:'receiver',
        value:3,
        label:'供应商仓管员'
    },
    {
        key:'sender',
        value:4,
        label:'供应商发货员'
    },
    {
        key:'vendor_admin',
        value:5,
        label:'供应商管理员'
    }
]
