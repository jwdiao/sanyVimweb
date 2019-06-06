export const reversedInfoListItemsMap = {
    code:'生成号码',
    createTime:'生成日期',
    reversedCode:'冲销号码',
    reversedTime:'冲销日期',
    reversedName: '操作员',
}

export const goodsTransferListItemsMap = {
    code: '物料凭证',
    material: '物料编码',
    materialDescription: '物料描述',
    qualifiedQuantity:'合格品数量',
    unqualifiedQuantity:'不合格品数量',
    reason: '原因',
    status: '状态',
    createdAt:'日期',
}
export const inventoryInfoListItemsMap = {
    material: '物料编码',
    materialDescription: '物料描述',
    qualifiedQuantity:'合格品数量',
    unqualifiedQuantity:'不合格存数量',
    onTheWayQuantity:'在途数量',
}

export const reportsStatusList = [
    {
        key: 'receive',
        value: 1,
        label: '入库'
    },
    {
        key: 'other_receive',
        value: 2,
        label: '其它入库'
    },
    {
        key: 'other_receive_reversed',
        value: 3,
        label: '其他入库冲销'
    },
    {
        key: 'deliver_dispatch',
        value: 4,
        label: '配送出库'
    },
    {
        key: 'other_dispatch',
        value: 5,
        label: '其他出库'
    },
    {
        key: 'other_dispatch_reversed',
        value: 6,
        label: '其他出库冲销'
    },
    {
        key: 'transfer_inventory',
        value: 7,
        label: '移动库存'
    },
    {
        key: 'transfer_inventory_reversed',
        value: 8,
        label: '移动库存冲销'
    }

]