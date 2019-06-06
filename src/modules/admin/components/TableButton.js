import React from "react";
import {
    PRIMARY_COLOR,
    TABLE_OPERATION_DELETE,
    TABLE_OPERATION_DUPLICATE,
    TABLE_OPERATION_REVERSE,
    TABLE_OPERATION_STATUS, TABLE_OPERATION_STATUS_INACTIVE
} from "../../../utils";
import {Button} from "antd";

export const TableButton = ({disabled = false, customizedText, type,onClick}) => {
    let textColor = '#fff'
    let backgroundColor = PRIMARY_COLOR
    let borderColor = PRIMARY_COLOR
    let buttonText = ''
    switch (type) {
        // 编辑
        case 'edit':
            textColor = PRIMARY_COLOR
            backgroundColor = '#fff'
            borderColor = PRIMARY_COLOR
            buttonText = '编辑'
            break
        // 删除
        case 'delete':
            textColor = '#fff'
            backgroundColor = TABLE_OPERATION_DELETE
            borderColor = TABLE_OPERATION_DELETE
            buttonText = '删除'
            break
        // 保存
        case 'save':
            if (customizedText === '启用') {
                textColor = TABLE_OPERATION_STATUS_INACTIVE
                borderColor = TABLE_OPERATION_STATUS_INACTIVE
            } else {
                textColor = TABLE_OPERATION_STATUS
                borderColor = TABLE_OPERATION_STATUS
            }
            backgroundColor = '#fff'
            buttonText = '保存'
            break
        // 取消
        case 'cancel':
            textColor = TABLE_OPERATION_DELETE
            backgroundColor = '#fff'
            borderColor = TABLE_OPERATION_DELETE
            buttonText = '取消'
            break
        // 复制
        case 'duplicate':
            textColor = '#fff'
            backgroundColor = TABLE_OPERATION_DUPLICATE
            borderColor = TABLE_OPERATION_DUPLICATE
            buttonText = '复制'
            break
        // 冲销
        case 'reverse':
            textColor = '#fff'
            backgroundColor = TABLE_OPERATION_REVERSE
            borderColor = TABLE_OPERATION_REVERSE
            buttonText = '冲销'
            break
        default:
            break
    }
    return (
        <Button
            className={'table-button-style'}
            disabled={disabled}
            onClick={onClick}
            type={"default"}
            size={"small"}
            style={{
                marginLeft: '2%',
                marginRight:'2%',
                color: disabled ? '#fff': textColor,
                backgroundColor: disabled ? '#e3e3e3': backgroundColor,
                borderRadius:4,
                borderColor: disabled ? '#e3e3e3': borderColor
            }}
        >
            {customizedText ? customizedText :buttonText}
        </Button>
    )
}