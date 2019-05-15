export const reversedInfoListItemsMap = {
    vmiFactory:'VMI 工厂',
    inventoryState: '货物状态',
    generatedNumber:'生成号码',
    generatedDate:'生成日期',
    reversedNumber:'冲销号码',
    reversedDate:'冲销日期'
}

export const goodsTransferListItemsMap = {
    material: '物料',
    materialDescription: '物料描述',
    qualifiedQuantity:'合格品库存数量',
    unqualifiedQuantity:'不合格品库存数量',
    status: '状态',
    createdAt:'日期',
}
export const inventoryInfoListItemsMap = {
    material: '物料',
    materialDescription: '物料描述',
    qualifiedQuantity:'合格品库存数量',
    unqualifiedQuantity:'不合格品库存数量',
    onTheWayQuantity:'在途数量',
    createdAt:'日期',
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