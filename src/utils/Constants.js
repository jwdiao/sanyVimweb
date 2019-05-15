import moment from "moment";

export const PRIMARY_COLOR = '#5a8cff'
export const SECONDARY_COLOR = '#478EDA'//次要颜色，用于渐变的末端，起始端使用PRIMARY_COLOR
export const TABLE_OPERATION_EDIT = PRIMARY_COLOR// 编辑按钮
export const TABLE_OPERATION_STATUS = '#29ad00' // 状态：启用/停用按钮
export const TABLE_OPERATION_DELETE = '#ff404a' // 删除按钮
export const TABLE_OPERATION_DUPLICATE = 'orange' // 复制按钮
export const TABLE_OPERATION_REVERSE = '#29ad00' // 冲销按钮

export const TRIPLEDES_KEY = 'sanyznyjzyvmi';//登录密码加密用key

export const ORDER_STATUS = ['', '待发货', '已发货', '已发货冲销', '已收货', '其它入库已收货', '其它入库已收货冲销'];
export const WAREHOUSE_STATUS = ['', '配送出库', '其它出库 ', '其它出库冲销', '移库-合格品库到不合格品库', '移库-不合格品库到合格品库', '移库冲销'];
export const INVENTORY_STATUS = ['', '入库', '其他入库 ', '其它入库冲销', '配送出库', '其他出库', '其它出库冲销', '移动库存', '移动库存冲销'];

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const FACTORIES = [
    {
        code: 'F-1000',
        name: '北京桩机'
    }
]

export function formatDate(dateString) {
    if (dateString && dateString!=='') {
        return moment(dateString).format(DATE_FORMAT)
    }
    return '--'
}