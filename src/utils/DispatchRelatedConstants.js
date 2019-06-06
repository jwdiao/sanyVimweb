// 出库-配送出库/其他出库
export const dispatchItemsMap = {
    number: '出库单号',
    createTime: '出库时间',
    outName: '操作员',
    material:'物料编码',
    materialDescription:'物料描述',
    quantity: '出库数量',
    time: '配送时间',
    reason:'原因',
}

export const dispatchStatusList = [
    {
        key: 'deliver_dispatch',
        value: 1,
        label: '配送出库'
    },
    {
        key: 'other_dispatch',
        value: 2,
        label: '其他出库'
    },
    {
        key: 'other_dispatch_reversed',
        value: 3,
        label: '其他出库冲销'
    },
    {
        key: 'transfer_qualified_to_unqualified',
        value: 4,
        label: '移库',/*-合格品库到不合格品库*/
    },
    {
        key: 'transfer_unqualified_to_qualified',
        value: 5,
        label: '移库',/*-不合格品库到合格品库*/
    },
    {
        key: 'transfer_reversed',
        value: 6,
        label: '移库冲销'
    }
]
