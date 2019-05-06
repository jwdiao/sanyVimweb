export const shippingMenuItems = [
    // 1-5为信息管理的条目
    {
        key: 'to_be_shipped_infos',
        title: '待发货信息查询',
        parentTitle: '信息管理',
        iconType: 'user'
    },
    {
        key: 'reversed_infos',
        title: '已冲销发货信息',
        parentTitle: '信息管理',
        iconType: 'user'
    },
    {
        key: 'shipped_infos',
        title: '工厂发货信息',
        parentTitle: '信息管理',
        iconType: 'user'
    },
    {
        key: 'vmi_received_infos',
        title: 'VMI收货信息',
        parentTitle: '信息管理',
        iconType: 'user'
    },
    {
        key: 'material_type_management',
        title: '物料类型管理',
        parentTitle: '信息管理',
        iconType: 'user'
    },

    // 6-8为报表管理的条目
    {
        key: 'goods_transfer_query',
        title: '货物移动查询',
        parentTitle: '报表管理',
        iconType: 'user'
    },
    {
        key: 'inventory_infos_query',
        title: '库存信息查询',
        parentTitle: '报表管理',
        iconType: 'user'
    },
    {
        key: 'reversed_infos_query',
        title: '冲销信息查询',
        parentTitle: '报表管理',
        iconType: 'user'
    },
]

export const toBeShippedTableColumns = [
    {
        title: '序号',
        dataIndex: 'id',
        width: '5%',
        editable: true,
    },
    {
        title: '供应商',
        dataIndex: 'vendorName',
        width: '12%',
        editable: true,
    },
    {
        title: '货物状态',
        dataIndex: 'goodsStatus',
        width: '12%',
        editable: true,
    },
    {
        title: '物料类型',
        dataIndex: 'materialType',
        width: '12%',
        editable: true,
    },
    {
        title: '物料总数',
        dataIndex: 'materialAmount',
        width: '12%',
        editable: true,
    },
    {
        title: '发货时间',
        dataIndex: 'sentTime',
        width: '19%',
        editable: true,
    },
    {
        title: '运输周期',
        dataIndex: 'transportPeriod',
        width: '12%',
        editable: true,
    }
]

export const shippedTableColumns = [
    {
        title: '序号',
        dataIndex: 'id',
        width: '5%',
        editable: true,
    },
    {
        title: '号码',
        dataIndex: 'number',
        width: '12%',
        editable: true,
    },
    {
        title: '供应商',
        dataIndex: 'vendorName',
        width: '10%',
        editable: true,
    },
    {
        title: '货物状态',
        dataIndex: 'goodsStatus',
        width: '10%',
        editable: true,
    },
    {
        title: '物料类型',
        dataIndex: 'materialType',
        width: '10%',
        editable: true,
    },
    {
        title: '物料总数',
        dataIndex: 'materialAmount',
        width: '10%',
        editable: true,
    },
    {
        title: '发货时间',
        dataIndex: 'sentTime',
        width: '17%',
        editable: true,
    },
    {
        title: '运输周期',
        dataIndex: 'transportPeriod',
        width: '10%',
        editable: true,
    }
]

export const vmiReceivedTableColumns = [
    {
        title: '序号',
        dataIndex: 'id',
        width: '6%',
        editable: true,
    },
    {
        title: '号码',
        dataIndex: 'number',
        width: '9%',
        editable: true,
    },
    {
        title: '供应商',
        dataIndex: 'vendorName',
        width: '9%',
        editable: true,
    },
    {
        title: '货物状态',
        dataIndex: 'goodsStatus',
        width: '9%',
        editable: true,
    },
    {
        title: '物料类型',
        dataIndex: 'materialType',
        width: '9%',
        editable: true,
    },
    {
        title: '物料总数',
        dataIndex: 'materialAmount',
        width: '9%',
        editable: true,
    },
    {
        title: '发货时间',
        dataIndex: 'sentTime',
        width: '11%',
        editable: true,
    },
    {
        title: '运输周期',
        dataIndex: 'transportPeriod',
        width: '9%',
        editable: true,
    },
    {
        title: '收货时间',
        dataIndex: 'receivedTime',
        width: '11%',
        editable: true,
    },
    {
        title: '合格数量',
        dataIndex: 'qualifiedQuantity',
        width: '9%',
        editable: true,
    },
    {
        title: '不合格数量',
        dataIndex: 'unqualifiedQuantity',
        width: '9%',
        editable: true,
    }
]

export const materialTypeTableColumns = [
    {
        title: '序号',
        dataIndex: 'id',
        width: '5%',
        editable: true,
    },
    {
        title: '物料编号',
        dataIndex: 'materialId',
        width: '8%',
        editable: true,
    },
    {
        title: '物料名称',
        dataIndex: 'materialName',
        width: '10%',
        editable: true,
    },
    {
        title: '供应商',
        dataIndex: 'vendorName',
        width: '15%',
        editable: true,
    },
    {
        title: '客户工厂',
        dataIndex: 'clientFactory',
        width: '12%',
        editable: true,
    },
    {
        title: '单位',
        dataIndex: 'unit',
        width: '8%',
        editable: true,
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: '7%',
        editable: true,
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: '15%',
        editable: true,
    }
]

export const goodsTransferTableColumns = [
    {
        title: '序号',
        dataIndex: 'id',
        width: '10%',
        editable: true,
    },
    {
        title: '供应商',
        dataIndex: 'vendorName',
        width: '10%',
        editable: true,
    },
    {
        title: '货物状态',
        dataIndex: 'goodsStatus',
        width: '10%',
        editable: true,
    },
    {
        title: '物料类型',
        dataIndex: 'materialType',
        width: '10%',
        editable: true,
    },
    {
        title: '物料描述',
        dataIndex: 'materialDescription',
        width: '10%',
        editable: true,
    },
    {
        title: '库位',
        dataIndex: 'location',
        width: '10%',
        editable: true,
    },
    {
        title: '源库位',
        dataIndex: 'sourceLocation',
        width: '10%',
        editable: true,
    },
    {
        title: '目标库位',
        dataIndex: 'destLocation',
        width: '10%',
        editable: true,
    },
    {
        title: '数量',
        dataIndex: 'quantity',
        width: '10%',
        editable: true,
    },
    {
        title: '日期',
        dataIndex: 'date',
        width: '10%',
        editable: true,
    }
]

export const inventoryInfosTableColumns = [
    {
        title: '序号',
        dataIndex: 'id',
        width: '12%',
        editable: true,
    },
    {
        title: '物料类型',
        dataIndex: 'materialType',
        width: '20%',
        editable: true,
    },
    {
        title: '物料描述',
        dataIndex: 'materialDescription',
        width: '12%',
        editable: true,
    },
    {
        title: '合格品数量',
        dataIndex: 'qualifiedQuantity',
        width: '12%',
        editable: true,
    },
    {
        title: '不合格品数量',
        dataIndex: 'unqualifiedQuantity',
        width: '12%',
        editable: true,
    },
    {
        title: '在途数量',
        dataIndex: 'onTheWayQuantity',
        width: '12%',
        editable: true,
    },
    {
        title: '日期',
        dataIndex: 'date',
        width: '20%',
        editable: true,
    }
]

export const reversedInfosTableColumns = [
    {
        title: '序号',
        dataIndex: 'id',
        width: '10%',
        editable: true,
    },
    {
        title: '供应商',
        dataIndex: 'vendorName',
        width: '10%',
        editable: true,
    },
    {
        title: '货物状态',
        dataIndex: 'goodsStatus',
        width: '10%',
        editable: true,
    },
    {
        title: '物料类型',
        dataIndex: 'materialType',
        width: '10%',
        editable: true,
    },
    {
        title: '物料描述',
        dataIndex: 'materialDescription',
        width: '10%',
        editable: true,
    },
    {
        title: '数量',
        dataIndex: 'quantity',
        width: '10%',
        editable: true,
    },
    {
        title: '生成号码',
        dataIndex: 'generatedNumber',
        width: '10%',
        editable: true,
    },
    {
        title: '生成日期',
        dataIndex: 'generatedDate',
        width: '10%',
        editable: true,
    },
    {
        title: '冲销号码',
        dataIndex: 'reversedNumber',
        width: '10%',
        editable: true,
    },
    {
        title: '冲销号日期',
        dataIndex: 'reversedDate',
        width: '10%',
        editable: true,
    }
]

export const goodsStatusMap = [
    {
        key: 'sender_sent',
        value: '供应商发货',
        label: '供应商发货'
    },
    {
        key: 'to_be_sent',
        value: '待发货',
        label: '待发货'
    },
    {
        key: 'to_be_received',
        value: '待收货',
        label: '待收货'
    },
    {
        key: 'received',
        value: '已收货',
        label: '已收货'
    },
    {
        key: 'delivered',
        value: '已配送',
        label: '已配送'
    }
]

export const materialTypeMap = [
    {
        key: 'materialType1',
        value: '物料-1',
        label: '物料-1'
    },
    {
        key: 'materialType2',
        value: '物料-2',
        label: '物料-2'
    },
    {
        key: 'materialType3',
        value: '物料-3',
        label: '物料-3'
    },
    {
        key: 'materialType4',
        value: '物料-4',
        label: '物料-4'
    }
]

export const materialDescriptionMap = [
    {
        key: 'materialType1',
        value: '物料描述-1',
        label: '物料描述-1'
    },
    {
        key: 'materialType2',
        value: '物料描述-2',
        label: '物料描述-2'
    },
    {
        key: 'materialType3',
        value: '物料描述-3',
        label: '物料描述-3'
    },
    {
        key: 'materialType4',
        value: '物料描述-4',
        label: '物料描述-4'
    }
]

export const reservoirLibraryList = [
    {
        key: 'qualified_goods_library',
        value: '合格品库',
        label: '合格品库'
    },
    {
        key: 'unqualified_goods_library',
        value: '不合格品库',
        label: '不合格品库'
    }
]