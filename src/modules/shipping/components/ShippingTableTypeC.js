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
    vmiReceivedTableColumns
} from "../../../utils";

class _ShippingTableTypeC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [],
            loading: false,
        };
    }

    componentWillMount() {
        // console.log('componentWillMount called', this.props)
        //Todo:For test only
        const {tableType, dataSet} = this.props
        let tableFields = this.constructTableFields(tableType)
        this.setState({
            data: dataSet,
            columns: tableFields
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
                data: dataSet,
                columns: tableFields,
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

    render() {
        // const {tableType} = this.props
        return (
            <Table
                className="data-board-table"
                // bodyStyle={{minHeight: 'calc(100vh - 280px)', maxHeight: 'calc(100vh - 280px)'}}
                bordered
                dataSource={this.state.data}
                columns={this.state.columns}
            />
        );
    }
}

export const ShippingTableTypeC = _ShippingTableTypeC;