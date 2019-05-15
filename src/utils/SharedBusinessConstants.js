/**
 * 共用业务常量
 */

/**
 * 订单状态
 * @type {*[]}
 */
export const orderStatusList = [
    {
        key: 'temporary_store',
        value: 1,
        label: '待发货'
    },
    {
        key: 'sent',
        value: 2,
        label: '已发货'
    },
    {
        key: 'sent_reversed',
        value: 3,
        label: '已发货冲销'
    },
    {
        key: 'received',
        value: 4,
        label: '已收货'
    },
    {
        key: 'other_received',
        value: 5,
        label: '其他入库已收货'
    },
    {
        key: 'other_received_reversed',
        value: 6,
        label: '其他入库已收货冲销'
    }
]

/**
 * 启用/停用状态：适用场景：
 * 1、供应商物料状态
 * @type {*[]}
 */
export const validStateList = [
    {
        key:'valid',
        value:1,
        label:'启用'
    },
    {
        key:'invalid',
        value:2,
        label:'停用'
    }
]

/**
 * 发货单物料状态
 * @type {*[]}
 */
export const orderMaterialStatusList = [
    {
        key: 'receiving',
        value: 1,
        label: '待收货'
    },
    {
        key: 'received',
        value: 2,
        label: '已收货'
    }
]

/**
 * 库区
 * @type {*[]}
 */
export const reservoirLibraryList = [
    {
        key: 'qualified_goods_library',
        value: 1,
        label: '合格品库'
    },
    {
        key: 'unqualified_goods_library',
        value: 2,
        label: '不合格品库'
    }
]

