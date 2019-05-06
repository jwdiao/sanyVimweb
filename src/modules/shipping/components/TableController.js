/**
 * 表格头部控制布局
 * 包含搜索/添加等按钮的布局
 */
import React, {Component} from "react";
import {message} from "antd";
import styled from "styled-components";
import moment from 'moment';
import {ShippingTableTypeA} from "./ShippingTableTypeA";
import {ShippingTableTypeB} from "./ShippingTableTypeB";
import {ShippingTableTypeC} from "./ShippingTableTypeC";
import * as XLSX from 'xlsx';
import {
    validStateMap,
} from "../../../utils";
import {ShippingHeader} from "./ShippingHeader";
import {InputModal} from "./InputModal";
import {AddShippingModal} from './AddShippingModal'
import {NewMaterialModal} from "./NewMaterialModal";

const _ = require('lodash')

/* generate an array of column objects */
const make_cols = refstr => {
    let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) o[i] = {name: XLSX.utils.encode_col(i), key: i}
    return o;
};
const uploadProps = {
    name: 'file',//upload file name
    //data:{'prop1': 1, prop2:'string'},//other fields
    showUploadList: false,
    action: 'http://localhost:8080/shipping/upload/batch/',
    // headers: {
    //     authorization: 'authorization-text', //auth header to be set
    // },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
            message.success(`${info.file.name} 文件上传中...`);
        }
        if (info.file.status === 'done') {
            console.log(info.file, info.fileList);
            message.success(`${info.file.name} 文件上传成功！`);

        } else if (info.file.status === 'error') {
            console.log(info.file, info.fileList);
            message.error(`${info.file.name} 文件上传失败！`);
        }
    },
    // 把excel的处理放在beforeUpload事件，否则要把文件上传到通过action指定的地址去后台处理
    // 这里我们没有指定action地址，因为没有传到后台
    beforeUpload: (file, fileList) => {
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {type: rABS ? 'binary' : 'array'});
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const xlsxJson = XLSX.utils.sheet_to_json(ws, {header: 1});
            console.log(xlsxJson);
            console.log(make_cols(ws['!ref']));
        };
        if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
        return true;
    },
};

class _TableController extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            editState: false,
            immutableDataSet: [],//用来备份数据集，防止修改筛选条件后，源数据改变
            dataSet: [],
            selectedRowKeys:[],//勾选的条目Keys
        }
    }

    componentWillMount() {
        // console.log('componentWillMount called', this.props)
        //Todo:For test only
        const {selectedTabKey} = this.props
        let dataSet = this.constructData(selectedTabKey)
        this.setState({
            dataSet,
            immutableDataSet: dataSet,
        })
    }

    componentWillReceiveProps(nextProps, nextState) {
        // console.log('componentWillReceiveProps called', nextProps)
        const {selectedTabKey: selectedTabKeyThis} = this.props
        const {selectedTabKey: selectedTabKeyNext} = nextProps
        if (selectedTabKeyThis !== selectedTabKeyNext) {
            const {selectedTabKey} = nextProps
            let dataSet = this.constructData(selectedTabKey)
            this.setState({
                dataSet,
                showModal:false,
                immutableDataSet: dataSet,
                selectedRowKeys:[],//切换了Tab后，清空选中的数据Key数组
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('shouldComponentUpdate called', nextProps, nextState)
        return nextState !== this.state || nextProps !== this.props;
    }

    // 构建数据
    // Todo: 此为 Mock 数据，待接入数据后，规范化数据结构
    constructData = (selectedTabKey) => {
        let data = [];
        for (let i = 0; i < 12; i++) {
            switch (selectedTabKey) {
                // A 类Table数据
                // 信息管理-待发货信息查询
                case 'to_be_shipped_infos':
                    data.push({
                        key: `key-${i.toString()}`,
                        id: (i + 1).toString(),// 序号
                        vendorName: `供应商-${i + 1}`,// 供应商
                        goodsStatus: i % 3 === 0 ? '待发货' : '已收货',// 货物状态
                        materialType: i % 2 === 0 ? '物料-1' : '物料-2',// 物料类型
                        materialAmount: Math.floor(Math.random() * 10),// 物料总数
                        sentTime: i % 2 === 0 ? moment().format('YYYY-MM-DD HH:mm') : moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm'),// 发货时间
                        transportPeriod: Math.floor(Math.random() * 10),// 运输周期
                    });
                    break

                // B 类Table数据
                // 信息管理-已冲销发货信息
                case 'reversed_infos':
                    data.push({
                        key: i.toString(),
                        id: (i + 1).toString(),// 序号
                        vendorName: `供应商-${i + 1}`,// 供应商
                        goodsStatus: i % 3 === 0 ? '待发货' : '已收货',// 货物状态
                        materialType: i % 2 === 0 ? '物料-1' : '物料-2',// 物料类型
                        materialAmount: Math.floor(Math.random() * 10),// 物料总数
                        sentTime: moment().format('YYYY-MM-DD HH:mm'),// 发货时间
                        transportPeriod: Math.floor(Math.random() * 10),// 运输周期
                    });
                    break
                // 信息管理-工厂发货信息
                case 'shipped_infos':
                    data.push({
                        key: i.toString(),
                        id: (i + 1).toString(),// 序号
                        number: `Z01-${i + 1}`,// 号码
                        vendorName: `供应商-${i + 1}`,// SANY工厂编号
                        goodsStatus: i % 3 === 0 ? '待发货' : '已收货',// SANY工厂名称
                        materialType: i % 2 === 0 ? '物料-1' : '物料-2',// 物料类型
                        materialAmount: Math.floor(Math.random() * 10),//状态
                        sentTime: moment().format('YYYY-MM-DD HH:mm'),
                        transportPeriod: Math.floor(Math.random() * 10),
                    });
                    break
                // 信息管理-物料类型管理
                case 'material_type_management':
                    data.push({
                        key: i.toString(),
                        id: (i + 1).toString(),// 序号
                        materialId: `WU-${i + 1}`,// 物料编号
                        materialName: `物料${i + 1}`,// 物料编号
                        vendorName: `供应商-${i + 1}`,// SANY工厂编号
                        clientFactory: '装机/重能',// 客户工厂
                        unit: i % 3 === 0 ? 'kg' : 't',// 单位
                        status: validStateMap.filter(state => state.value === (i % 2 !== 0))[0].label,//状态
                        createdAt: moment().format('YYYY-MM-DD HH:mm'),
                    });
                    break

                // C 类Table数据
                // 信息管理-VMI收货信息
                case 'vmi_received_infos':
                    data.push({
                        key: i.toString(),
                        id: (i + 1).toString(),// 序号
                        number: `Z01-${i + 1}`,// 号码
                        vendorName: `供应商-${i + 1}`,// 供应商
                        goodsStatus: i % 3 === 0 ? '待发货' : '已收货',// 货物状态
                        materialType: i % 2 === 0 ? '物料-1' : '物料-2',// 物料类型
                        materialAmount: Math.floor(Math.random() * 10),// 物料总数
                        sentTime: moment().format('YYYY-MM-DD HH:mm'),// 发货时间
                        transportPeriod: Math.floor(Math.random() * 10),// 运输周期
                        receivedTime: moment().format('YYYY-MM-DD HH:mm'),// 收货时间
                        qualifiedQuantity: Math.floor(Math.random() * 10),// 合格数量
                        unqualifiedQuantity: Math.floor(Math.random() * 10),// 不合格数量
                    });
                    break
                // 报表管理-货物移动查询
                case 'goods_transfer_query':
                    data.push({
                        key: i.toString(),
                        id: (i + 1).toString(),// 序号
                        vendorName: `供应商-${i + 1}`,// 供应商
                        goodsStatus: i % 3 === 0 ? '待发货' : '已收货',// 货物状态
                        materialType: i % 2 === 0 ? '物料-1' : '物料-2',// 物料类型
                        materialDescription: i % 2 === 0 ? '物料描述-1' : '物料描述-2',// 物料描述
                        location: '合格品库',// 库位
                        sourceLocation: '合格品库',// 源库位
                        destLocation: '不合格品库',// 目标库位
                        quantity: Math.floor(Math.random() * 10),// 数量
                        date: moment().format('YYYY-MM-DD HH:mm'),// 日期
                    });
                    break
                // 报表管理-库存信息查询
                case 'inventory_infos_query':
                    data.push({
                        key: i.toString(),
                        id: (i + 1).toString(),// 序号
                        materialType: i % 2 === 0 ? '物料-1' : '物料-2',// 物料类型
                        materialDescription: i % 2 === 0 ? '物料描述-1' : '物料描述-2',// 物料描述
                        qualifiedQuantity: Math.floor(Math.random() * 10),// 合格数量
                        unqualifiedQuantity: Math.floor(Math.random() * 10),// 不合格数量
                        onTheWayQuantity: Math.floor(Math.random() * 10),// 不合格数量
                        date: moment().format('YYYY-MM-DD HH:mm'),// 日期
                    });
                    break
                // 报表管理-冲销信息查询
                case 'reversed_infos_query':
                    data.push({
                        key: i.toString(),
                        id: (i + 1).toString(),// 序号
                        vendorName: `供应商-${i + 1}`,// 供应商
                        goodsStatus: i % 3 === 0 ? '待发货' : '已收货',// 货物状态
                        materialType: i % 2 === 0 ? '物料-1' : '物料-2',// 物料类型
                        materialDescription: i % 2 === 0 ? '物料描述-1' : '物料描述-2',// 物料描述
                        quantity: Math.floor(Math.random() * 10),// 数量
                        generatedNumber: `SC-${i + 1}`,//生成号码
                        generatedDate: moment().format('YYYY-MM-DD HH:mm'),// 生成日期
                        reversedNumber: `CX-${i + 1}`,//冲销号码
                        reversedDate: moment().format('YYYY-MM-DD HH:mm'),// 冲销号日期
                    });
                    break

                default:
                    break
            }
        }
        return data
    }

    // 搜索按钮回调(多页面共用)
    onSearchButtonClicked = (selectedTabKey, searchConditionObject) => {
        const immutableDataSet = this.state.immutableDataSet
        // console.log('immutableDataSet', immutableDataSet)
        console.log('onSearchButtonClicked called', selectedTabKey, searchConditionObject)
        let filteredDataSet = immutableDataSet.filter(data => {
            const keys = _.keys(searchConditionObject)
            const filteredKeys = keys.filter(key => !isEmpty(searchConditionObject[key]))
            const conditionResults = filteredKeys.map((value, index) => {
                // 特殊处理：字符串模糊匹配、日期匹配
                if (value === 'number') {
                    return data[value].indexOf(searchConditionObject[value]) > -1
                } else if (value === 'materialId' || value === 'materialName') {
                    return data['materialId'].indexOf(searchConditionObject['materialId']) > -1
                        || data['materialName'].indexOf(searchConditionObject['materialName']) > -1
                } else if (value === 'generatedNumber' || value === 'reversedNumber') {
                    return data['generatedNumber'].indexOf(searchConditionObject['generatedNumber']) > -1
                        || data['reversedNumber'].indexOf(searchConditionObject['reversedNumber']) > -1
                } else if (value === 'sentTime' || value === 'receivedTime' || value === 'date' || value === 'generatedDate' || value === 'reversedDate') {
                    return moment(data[value]).isSame(searchConditionObject[value], 'days')
                }
                return data[value] === searchConditionObject[value]
            })
            return conditionResults.reduce((previousValue, currentValue) => previousValue && currentValue, true)
        })
        this.setState({
            dataSet: filteredDataSet
        })
    }

    // 批量导入按钮回调(多页面共用)
    onBatchImportButtonClicked = (selectedTabKey) => {
        console.log('onBatchImportButtonClicked called', selectedTabKey)
    }

    // 删除按钮回调(仅供单页面使用)
    onDeleteButtonClicked = () => {
        console.log('onDeleteButtonClicked called')
        const { immutableDataSet, selectedRowKeys} = this.state
        selectedRowKeys.forEach(rowKey=>{
            const index = immutableDataSet.findIndex(data => data.key === rowKey)
            immutableDataSet.splice(index, 1)
        })
        this.setState({
            dataSet:immutableDataSet,
            immutableDataSet,
            selectedRowKeys:[],
            editState:false,
        })
    }

    // 批量发货按钮回调(仅供单页面使用)
    onBatchShippingButtonClicked = () => {
        console.log('onBatchShippingButtonClicked called')
    }

    // 增加按钮回调(多页面共用)
    onAddButtonClicked = (selectedTabKey) => {
        console.log('onAddButtonClicked called', selectedTabKey)
        this.setState({
            showModal: true
        })
    }

    // 联动：Table的勾选状态
    onTableItemsSelectedListener = (selectedRowKeys) => {
        console.log('onTableItemsSelectedListener called', selectedRowKeys)
        if (selectedRowKeys.length > 0) {
            this.setState({
                editState: true,
                selectedRowKeys
            })
        } else {
            this.setState({
                editState: false,
                selectedRowKeys
            })
        }
    }

    // 联动：Table的条目编辑操作
    onTableItemEditedListener = (tableType, newData) => {
        this.setState({
            immutableDataSet: newData
        })
    }

    // 联动：Table的条目删除操作
    onTableItemDeletedListener = (selectedTabKey, deletedItem) => {
        const {immutableDataSet} = this.state
        const index = immutableDataSet.findIndex(data => data.key === deletedItem.key)
        immutableDataSet.splice(index, 1)
        this.setState({
            immutableDataSet
        })
    }

    // 联动：Table的条目复制操作
    onTableItemDuplicatedListener = (selectedTabKey, duplicatedItem) => {
        console.log('onTableItemDuplicatedListener called',selectedTabKey, duplicatedItem)
        this.setState({
            showModal: true
        })
    }

    // 联动：Table的条目冲销操作
    onTableItemReversedListener = () => {

    }

    // 联动：Table的条目启用/停用操作
    onTableItemStateChangedListener = (tableType, newData) => {
        this.setState({
            immutableDataSet: newData
        })
    }

    // 联动：Modal 确定按钮点击事件监听
    onModalOkButtonClickedListener = () => {
        this.setState({
            showModal: false
        })
    }

    // 联动：Modal 取消按钮点击事件监听
    onModalCancelButtonClickedListener = () => {
        this.setState({
            showModal: false
        })
    }

    render() {
        const {
            selectedTabKey,// 当前选择的Tab页
        } = this.props

        const {
            dataSet,
            showModal,
            editState,
            selectedRowKeys
        } = this.state

        let tableComponent
        switch (selectedTabKey) {
            // 信息管理-待发货信息
            case 'to_be_shipped_infos':
                tableComponent = (
                    <div>
                        <ShippingHeader
                            selectedTabKey={selectedTabKey}
                            uploadProps={uploadProps}
                            onSearchButtonClicked={this.onSearchButtonClicked}
                            onBatchShippingButtonClicked={this.onBatchShippingButtonClicked}
                            onDeleteButtonClicked={this.onDeleteButtonClicked}
                            onBatchImportButtonClicked={this.onBatchImportButtonClicked}
                            onAddButtonClicked={this.onAddButtonClicked}
                            editState={editState}
                        />
                        <ShippingTableTypeA
                            dataSet={dataSet}
                            tableType={selectedTabKey}
                            selectedRowKeys={selectedRowKeys}
                            // 联动Table的选择状态
                            onTableItemsSelectedListener={this.onTableItemsSelectedListener}
                            onTableItemEditedListener={this.onTableItemEditedListener}
                            onTableItemDeletedListener={this.onTableItemDeletedListener}
                        />
                    </div>
                )
                break

            // 信息管理-已冲销发货信息
            case 'reversed_infos':
                tableComponent = (
                    <div>
                        <ShippingHeader
                            selectedTabKey={selectedTabKey}
                            onSearchButtonClicked={this.onSearchButtonClicked}
                            editState={editState}
                        />
                        <ShippingTableTypeB
                            dataSet={dataSet}
                            tableType={selectedTabKey}
                            onTableItemDuplicatedListener={this.onTableItemDuplicatedListener}
                        />
                    </div>
                )
                break

            // 信息管理-工厂发货信息
            case 'shipped_infos':
                tableComponent = (
                    <div>
                        <ShippingHeader
                            selectedTabKey={selectedTabKey}
                            onSearchButtonClicked={this.onSearchButtonClicked}
                            editState={editState}
                        />
                        <ShippingTableTypeB
                            dataSet={dataSet}
                            tableType={selectedTabKey}
                        />
                    </div>
                )
                break

            // 信息管理-物料类型管理
            case 'material_type_management':
                tableComponent = (
                    <div>
                        <ShippingHeader
                            selectedTabKey={selectedTabKey}
                            uploadProps={uploadProps}
                            onSearchButtonClicked={this.onSearchButtonClicked}
                            onBatchImportButtonClicked={this.onBatchImportButtonClicked}
                            onAddButtonClicked={this.onAddButtonClicked}
                            editState={editState}
                        />
                        <ShippingTableTypeB
                            dataSet={dataSet}
                            tableType={selectedTabKey}
                            onTableItemStateChangedListener={this.onTableItemStateChangedListener}
                            onTableItemEditedListener={this.onTableItemEditedListener}
                            onTableItemDeletedListener={this.onTableItemDeletedListener}
                        />
                    </div>
                )
                break

            // 信息管理-VMI收货信息
            case 'vmi_received_infos':
            // 报表管理-货物移动查询
            case 'goods_transfer_query':
            // 报表管理-库存信息查询
            case 'inventory_infos_query':
            // 报表管理-冲销信息查询
            case 'reversed_infos_query':
                tableComponent = (
                    <div>
                        <ShippingHeader
                            selectedTabKey={selectedTabKey}
                            onSearchButtonClicked={this.onSearchButtonClicked}
                            editState={editState}
                        />
                        <ShippingTableTypeC
                            dataSet={dataSet}
                            tableType={selectedTabKey}
                        />
                    </div>
                )
                break
            default:
                tableComponent = null
        }
        return (
            <div>
                {tableComponent}
                {
                    selectedTabKey === 'to_be_shipped_infos' && (
                        <AddShippingModal
                            modalType={selectedTabKey}
                            modalVisibility={showModal}
                            onOkClickedListener={this.onModalOkButtonClickedListener}
                            onCancelClickedListener={this.onModalCancelButtonClickedListener}
                        />
                    )
                }
                {
                    selectedTabKey === 'material_type_management' && (
                        <NewMaterialModal
                            modalType={selectedTabKey}
                            modalVisibility={showModal}
                            onOkClickedListener={this.onModalOkButtonClickedListener}
                            onCancelClickedListener={this.onModalCancelButtonClickedListener}
                        />
                    )
                }
                {
                    selectedTabKey === 'reversed_infos' && (
                        <InputModal
                            modalType={selectedTabKey}
                            modalVisibility={showModal}
                            onOkClickedListener={this.onModalOkButtonClickedListener}
                            onCancelClickedListener={this.onModalCancelButtonClickedListener}
                        />
                    )
                }
            </div>
        )
    }
}

const isEmpty = (fieldName) => {
    return !fieldName || fieldName === ''
}

export const TableController = _TableController