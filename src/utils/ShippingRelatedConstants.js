export const shippingMenuItems = [
    // 1-4为信息管理的条目
    {
        key: 'vendor_material_type_management',
        title: '货源清单管理',
        parentTitle: '信息管理',
        iconType: 'user'
    },
    {
        key: 'to_be_shipped_infos',
        title: '发货管理',
        parentTitle: '信息管理',
        iconType: 'user'
    },
    {
        key: 'shipped_infos',
        title: '在途管理',
        parentTitle: '信息管理',
        iconType: 'user'
    },
    {
        key: 'reversed_infos',
        title: '冲销管理',
        parentTitle: '信息管理',
        iconType: 'user'
    },

    // 5-8为报表管理的条目
    {
        key: 'vmi_received_infos',
        title: '收货信息查询',
        parentTitle: '报表管理',
        iconType: 'user'
    },
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

// 信息管理-货源清单管理
export const materialTypeTableColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '5%',
        editable: false,
    },
    {
        title: '供应商编码',
        dataIndex: 'vendorCode',
        width: '8%',
        editable: false,
    },
    {
        title: '供应商名称',
        dataIndex: 'vendorName',
        width: '15%',
        editable: false,
    },
    {
        title: '物料编码',
        dataIndex: 'material',
        width: '10%',
        editable: false,
    },
    {
        title: '物料描述',
        dataIndex: 'materialDescription',
        width: '15%',
        editable: false,
    },
    {
        title: '单位',
        dataIndex: 'unit',
        width: '5%',
        editable: false,
    },
    {
        title: '客户工厂',
        dataIndex: 'clientFactory',
        width: '12%',
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
        editable: false,
    }
]

// 信息管理-发货管理
export const toBeShippedTableColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '5%',
        editable: false,
    },
    {
        title: '系统ID',
        dataIndex: 'number',
        width: '15%',
        editable: false,
    },
    {
        title: '客户工厂',
        dataIndex: 'clientFactory',
        width: '15%',
        editable: true,
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: '10%',
        editable: false,
    },
    {
        title: '暂存时间',
        dataIndex: 'temporaryStoreTime',
        width: '15%',
        editable: false,
    },
    {
        title: '预到日期',
        dataIndex: 'expectReachDate',
        width: '10%',
        editable: true,
    },
    {
        title: '操作人',
        dataIndex: 'operator',
        width: '10%',
        editable: false,
    }
]

// 信息管理-在途管理
export const shippedTableColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '5%',
        editable: true,
    },
    // {
    //     title: '系统ID',
    //     dataIndex: 'number',
    //     width: '15%',
    //     editable: true,
    // },
    {
        title: '发货单号',
        dataIndex: 'shippedNumber',
        width: '20%',
        editable: true,
    },
    {
        title: '客户工厂',
        dataIndex: 'clientFactory',
        width: '20%',
        editable: true,
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: '8%',
        editable: false,
    },
    {
        title: '发货时间',
        dataIndex: 'sentTime',
        width: '15%',
        editable: true,
    },
    {
        title: '预到日期',
        dataIndex: 'expectReachDate',
        width: '10%',
        editable: true,
    },
    {
        title: '操作人',
        dataIndex: 'operator',
        width: '10%',
        editable: true,
    }
]

// 信息管理-冲销管理
export const reversedTableColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '5%',
        editable: true,
    },
    // {
    //     //     title: '系统ID',
    //     //     dataIndex: 'number',
    //     //     width: '15%',
    //     //     editable: true,
    //     // },
    {
        title: '冲销单号',
        dataIndex: 'reversedNumber',
        width: '20%',
        editable: true,
    },
    {
        title: '客户工厂',
        dataIndex: 'clientFactory',
        width: '20%',
        editable: true,
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: '8%',
        editable: false,
    },
    {
        title: '冲销时间',
        dataIndex: 'reversedTime',
        width: '15%',
        editable: true,
    },
    {
        title: '预到日期',
        dataIndex: 'expectReachDate',
        width: '10%',
        editable: true,
    },
    {
        title: '操作人',
        dataIndex: 'operator',
        width: '10%',
        editable: true,
    }
]

// 报表管理-收货信息查询
export const vmiReceivedTableColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '5%',
        editable: true,
    },
    // {
    //     title: '系统ID',
    //     dataIndex: 'number',
    //     width: '10%',
    //     editable: true,
    // },
    {
        title: '供应商名称',
        dataIndex: 'vendorName',
        width: '15%',
        editable: true,
    },
    {
        title: '收货单号',
        dataIndex: 'receiveNumber',
        width: '15%',
        editable: true,
    },
    {
        title: '客户工厂',
        dataIndex: 'clientFactory',
        width: '15%',
        editable: true,
    },
    {
        title: '发货时间',
        dataIndex: 'sentTime',
        width: '15%',
        editable: true,
    },
    {
        title: '发货人',
        dataIndex: 'sender',
        width: '10%',
        editable: true,
    },
    {
        title: '预到日期',
        dataIndex: 'expectReachDate',
        width: '10%',
        editable: true,
    },
    {
        title: '收货时间',
        dataIndex: 'receivedTime',
        width: '15%',
        editable: true,
    }
]

// 报表管理-货物移动查询
export const goodsTransferTableColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '3%',
        editable: true,
        // fixed: 'left',
    },
    {
        title: '物料凭证',
        dataIndex: 'number',
        width: '8%',
        editable: true,
        //fixed: 'left',
    },
    {
        title: '物料编码',
        dataIndex: 'material',
        width: '6%',
        editable: true,
    },
    {
        title: '物料描述',
        dataIndex: 'materialDescription',
        width: '9%',
        editable: true,
    },
    {
        title: '单位',
        dataIndex: 'unit',
        width: '4%',
        editable: true,
    },
    {
        title: '供应商名称',
        dataIndex: 'vendorName',
        width: '9%',
        editable: true,
    },
    {
        title: '合格品库存数量',
        dataIndex: 'qualifiedQuantity',
        width: '8%',
        editable: true,
    },
    {
        title: '不合格品库存数量',
        dataIndex: 'unqualifiedQuantity',
        width: '8%',
        editable: true,
    },
    {
        title: '移动类型',
        dataIndex: 'status',
        width: '8%',
        editable: true,
    },
    {
        title: '原因',
        dataIndex: 'reason',
        width: '8%',
        editable: true,
    },
    {
        title: '操作人',
        dataIndex: 'operator',
        width: '7%',
        editable: true,
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: '9%',
        editable: true,
    }
]

// 报表管理-库存信息查询
export const inventoryInfosTableColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '4%',
        editable: true,
    },
    {
        title: '物料编码',
        dataIndex: 'material',
        width: '8%',
        editable: true,
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
        width: '4%',
        editable: true,
    },
    {
        title: '合格品库存数量',
        dataIndex: 'qualifiedQuantity',
        width: '8%',
        editable: true,
    },
    {
        title: '不合格品库存数量',
        dataIndex: 'unqualifiedQuantity',
        width: '8%',
        editable: true,
    },
    {
        title: '在途数量',
        dataIndex: 'onTheWayQuantity',
        width: '8%',
        editable: true,
    },
    {
        title: '供应商编码',
        dataIndex: 'vendorId',
        width: '8%',
        editable: true,
    },
    {
        title: '供应商名称',
        dataIndex: 'vendorName',
        width: '16%',
        editable: true,
    },
    {
        title: '当前时间',
        dataIndex: 'createdAt',
        width: '16%',
        editable: true,
    }
]

// 报表管理-冲销信息查询
export const reversedInfosTableColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '5%',
        editable: true,
    },
    // {
    //     title: '系统ID',
    //     dataIndex: 'number',
    //     width: '13%',
    //     editable: true,
    // },
    {
        title: '供应商',
        dataIndex: 'vendorName',
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
        title: '生成号码',
        dataIndex: 'generatedNumber',
        width: '15%',
        editable: true,
    },
    {
        title: '生成日期',
        dataIndex: 'generatedDate',
        width: '15%',
        editable: true,
    },
    {
        title: '冲销号码',
        dataIndex: 'reversedNumber',
        width: '15%',
        editable: true,
    },
    {
        title: '冲销日期',
        dataIndex: 'reversedDate',
        width: '15%',
        editable: true,
    },
    {
        title: '操作人',
        dataIndex: 'operator',
        width: '15%',
        editable: true,
    },
]

/**
 * 订单状态
 * @type {*[]}
 * Todo:校验后端返回状态码是否正确
 */
export const goodsTransferStatusList = [
    {
        key: 'received',
        value: 1,
        label: '入库(101K)'
    },
    {
        key: 'other_received',
        value: 2,
        label: '其他入库(Z01K)'
    },
    {
        key: 'other_received_reversed',
        value: 3,
        label: '其他入库冲销(Z02K)'
    },
    {
        key: 'deliver_dispatched',
        value: 4,
        label: '配送出库(261K)'
    },
    {
        key: 'other_dispatched',
        value: 5,
        label: '其他出库(Z03K)'
    },
    {
        key: 'other_dispatched_reversed',
        value: 6,
        label: '其他出库冲销(Z04K)'
    },
    {
        key: 'transfer',
        value: 7,
        label: '移库(311K)'
    },
    {
        key: 'transfer_reversed',
        value: 8,
        label: '移库冲销(312K)'
    },

]

/**
 * 订单状态
 * @type {*[]}
 * Todo:校验后端返回状态码是否正确
 */
export const reversedInfoStatusList = [
    {
        key: 'received_reversed',
        value: 1,
        label: '收货冲销'
    },
    {
        key: 'other_received_reversed',
        value: 2,
        label: '其他入库冲销'
    },
    {
        key: 'other_sent_reversed',
        value: 3,
        label: '其他出库冲销'
    },
    {
        key: 'transfer_reversed',
        value: 4,
        label: '移库冲销'
    },

]