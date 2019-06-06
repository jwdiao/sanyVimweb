/**
 * 发货相关的Table 类型C:
 * 此类Table不具备批量操作的功能，也不可以编辑行，纯展示页面
 * 如：[报表管理-货物移动查询]页面的table
 */
import React, {Component} from 'react';
import {Table} from "antd";
import {
    goodsTransferTableColumns,
    inventoryInfosTableColumns,
    reversedInfosTableColumns,
    vmiReceivedTableColumns,
    reversedInfoStatusList,
    goodsTransferStatusList
} from "../../../utils";
import moment from "moment";

class FormCellComponent extends Component {
    render(){
        const {
            tableType,
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        if (dataIndex === 'status' && record[dataIndex]!=='') {
            if (tableType === 'reversed_infos_query') {
                console.log('record[dataIndex]',record[dataIndex])
                return (
                    <td {...restProps}>
                        {
                            reversedInfoStatusList.filter(status => status.value === parseInt(record[dataIndex]))[0].label //避免使用字面量作为value: 如 value为1,2,3...，显示的是'待发货/待发货'
                        }
                    </td>
                )
            } else if (tableType === 'goods_transfer_query') {
                // console.log('rrr',record)
                return (
                    <td {...restProps}>
                        {
                            goodsTransferStatusList.filter(status => status.value === parseInt(record[dataIndex]))[0].label //避免使用字面量作为value: 如 value为1,2,3...，显示的是'待发货/待发货'
                        }
                    </td>
                )
            }
        } else if (dataIndex === 'expectReachDate' && record[dataIndex]!=='') {
            return (
                <td {...restProps}>
                    {
                        moment(record[dataIndex]).format('YYYY-MM-DD')//预到日期是moment类型
                    }
                </td>
            )
        }
        return (
            <td {...restProps}>
                {
                    restProps.children
                }
            </td>
        )
    }
}

class _ShippingTableTypeC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTableType:'',
            data: null,
            columns: [],
            loading: true,
        };
    }

    componentWillMount() {
        // console.log('componentWillMount called', this.props)
        //Todo:For test only
        const {tableType, dataSet} = this.props
        let tableFields = this.constructTableFields(tableType)
        this.setState({
            currentTableType: tableType,
            data: dataSet,
            columns: tableFields,
            loading: false
        })
    }

    componentWillReceiveProps(nextProps, nextState) {
        // console.log('componentWillReceiveProps called', nextProps)
        const {tableType: tableTypeThis, dataSet:dataSetThis} = this.props
        const {tableType: tableTypeNext, dataSet:dataSetNext} = nextProps
        if (tableTypeThis !== tableTypeNext || dataSetThis!==dataSetNext) {
            const {tableType, dataSet} = nextProps
            let tableFields = this.constructTableFields(tableType)
            this.setState({
                currentTableType: tableType,
                data: dataSet,
                columns: tableFields,
                loading: false
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('shouldComponentUpdate called', nextProps, nextState)
        return nextState !== this.state || nextProps !== this.props;
    }

    constructTableFields = (tableType) => {
        let baseColumnsArray = []
        switch (tableType) {
            case 'vmi_received_infos':
                baseColumnsArray = vmiReceivedTableColumns
                break
            case 'goods_transfer_query':
                baseColumnsArray = goodsTransferTableColumns
                break
            case 'inventory_infos_query':
                baseColumnsArray = inventoryInfosTableColumns
                break
            case 'reversed_infos_query':
                baseColumnsArray = reversedInfosTableColumns
                break
            default:
                break
        }
        return baseColumnsArray
    }

    // 点击行的回调：传入参数订单的详情，之后使用该编号调用接口即可得到订单中的物料
    onRowClicked = (record) => {
        console.log('onRowClicked called', record)
        const {onRowClickedListener} = this.props
        if (onRowClickedListener) {
            onRowClickedListener(record)
        }
    }

    render() {
        const {data, currentTableType} = this.state
        const components = {
            body: {
                cell: FormCellComponent,
            },
        };

        const columns = this.state.columns.map(col=>{
            return {
                ...col,
                onCell : record => ({
                    tableType: currentTableType,
                    record,
                    dataIndex: col.dataIndex,
                })
            }
        })

        return (
            <Table
                className="data-board-table"
                // bodyStyle={{minHeight: 'calc(100vh - 280px)', maxHeight: 'calc(100vh - 280px)'}}
                bordered={false}
                dataSource={data}
                components={components}
                loading={data === null}
                columns={columns}
                onRow={(record) => {
                    return {
                        onClick: (event) => {this.onRowClicked(record)},// 点击行
                        // onDoubleClick: (event) => {},
                        // onContextMenu: (event) => {},
                        // onMouseEnter: (event) => {},  // 鼠标移入行
                        // onMouseLeave: (event) => {}
                    };
                }}
                scroll={{ x: currentTableType === 'goods_transfer_query' ? '120%':false }}
                pagination={{
                    showQuickJumper: true,
                }}
            />
        );
    }
}

export const ShippingTableTypeC = _ShippingTableTypeC;