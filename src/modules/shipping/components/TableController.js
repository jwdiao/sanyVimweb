/**
 * 表格头部控制布局
 * 包含搜索/添加等按钮的布局
 */
import React, {Component} from "react";
import {message} from "antd";
import moment from 'moment';
import {ShippingTableTypeA} from "./ShippingTableTypeA";
import {ShippingTableTypeB} from "./ShippingTableTypeB";
import {ShippingTableTypeC} from "./ShippingTableTypeC";
import * as XLSX from 'xlsx';
import {
    Durian,
    ERROR_CODE_ADMIN_SANY_FACTORY_OTHER_ERROR, ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL,
    formatDate,
    http,
    orderStatusList
} from "../../../utils";
import {ShippingHeader} from "./ShippingHeader";
import {InputModal} from "./InputModal";
import {AddShippingModal} from './AddShippingModal'
import {NewMaterialModal} from "./NewMaterialModal";
import freshId from "fresh-id";
import {MaterialListModal} from "./MaterialListModal";
import {EditShippingMaterialModal} from "./EditShippingMaterialModal";

const _ = require('lodash')

/* generate an array of column objects */
const make_cols = refstr => {
    let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) o[i] = {name: XLSX.utils.encode_col(i), key: i}
    return o;
};
const uploadProps = {
    accept: '.xls,.xlsx',
    name: 'file',//upload file name
    //data:{'prop1': 1, prop2:'string'},//other fields
    showUploadList: false,
    action: '/order/upload',
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
    // beforeUpload: (file, fileList) => {
    //     const reader = new FileReader();
    //     const rABS = !!reader.readAsBinaryString;
    //     reader.onload = (e) => {
    //         /* Parse data */
    //         const bstr = e.target.result;
    //         const wb = XLSX.read(bstr, {type: rABS ? 'binary' : 'array'});
    //         /* Get first worksheet */
    //         const wsname = wb.SheetNames[0];
    //         const ws = wb.Sheets[wsname];
    //         /* Convert array of arrays */
    //         const xlsxJson = XLSX.utils.sheet_to_json(ws, {header: 1});
    //         console.log(xlsxJson);
    //         console.log(make_cols(ws['!ref']));
    //     };
    //     if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    //     return true;
    // },
};

class _TableController extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo:{},
            _vendorList:[],
            showModal: false,
            showMaterialListModal: false,
            order:{},
            editState: false,
            immutableDataSet: [],//用来备份数据集，防止修改筛选条件后，源数据改变
            dataSet: [],
            selectedRowKeys:[],//勾选的条目Keys
        }
    }

    async componentWillMount() {

        // 首先获取供应商列表
        const result = await http.post('/supplier/supplierList',{})
        if (result.ret === '200') {
            this.setState({
                _vendorList: result.data.content.map(item => ({key: `vendor_${item.code}`, value: item.code, label: item.name}))
            })
        } else {
            message.error('获取供应商列表失败！请稍候重试。')
        }
        // TODO：存储供应商列表至SessionStorage中？

        // 然后，从session中获取用户信息
        const user = Durian.get('user')
        console.log('TableController get user', user)
        if (user) {
            this.setState({
                userInfo: {...user, supplierCode: this.state._vendorList.filter(vendor=>vendor.label===user.supplierName)[0].value}
            })
        }

        // console.log('componentWillMount called', this.props)
        //Todo:For test only
        const {selectedTabKey} = this.props
        let dataSet = await this.constructData(selectedTabKey)
        this.setState({
            dataSet,
            immutableDataSet: dataSet,
        })
    }

    async componentWillReceiveProps(nextProps, nextState) {
        // console.log('componentWillReceiveProps called', nextProps)
        const {selectedTabKey: selectedTabKeyThis} = this.props
        const {selectedTabKey: selectedTabKeyNext} = nextProps
        if (selectedTabKeyThis !== selectedTabKeyNext) {
            // 清除数据集，防止不同页面数据错乱
            this.setState({
                dataSet:[],
            })
            const {selectedTabKey} = nextProps
            let dataSet = await this.constructData(selectedTabKey)
            this.setState({
                dataSet,
                showModal:false,
                showMaterialListModal: false,
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
    constructData = async (selectedTabKey) => {
        // 网络请求相关
        let params = {
            // page: 1,
            // pageSize:10,
        }

        // 接收数据集合
        let data = [];
        let originalContent = [];

        // 通过供应商编号 筛选当前发货员所对应供应商的数据
        // Todo: 问题？一个发货员有多个供应商，如何传参？
        const {userInfo} = this.state
        const {supplierCode} = userInfo

        switch (selectedTabKey) {
            // A 类Table数据
            // 信息管理-待发货信息查询
            case 'to_be_shipped_infos':
                originalContent = await this.callNetworkRequest({
                    requestUrl: '/order/find/all',
                    params: Object.assign({}, params, {status:1}, {supplierCode}),
                    requestMethod: 'POST'})
                data = originalContent.map((content,index)=>{
                    return {
                        index: index+1,
                        key: freshId(),
                        id: content.id,
                        number:content.code,
                        // vendorName: content.supplierName,
                        clientFactory: content.facoryCode,
                        status: orderStatusList.filter(status=>status.value === content.status)[0].label,// 状态
                        // material: validStateList.filter(state=>content.status===state.value)[0].label,
                        // materialAmount: content.createTime,
                        temporaryStoreTime: formatDate(content.saveTime),// 暂存时间
                        transportPeriod: content.transportTime,// 运输周期
                    }
                })
                break

            // B 类Table数据
            // 信息管理-供应商物料类型管理
            case 'vendor_material_type_management':
                originalContent = await this.callNetworkRequest({
                    requestUrl: '/factorySupplierMaterial/find/all',
                    params: Object.assign({}, params, {supplierCode}),
                    requestMethod: 'POST'})
                data = originalContent.map((content,index)=>{
                    return {
                        index: index+1,
                        key: freshId(),
                        id: content.id,
                        material: content.materialCode,// 物料编号
                        materialDescription: content.materialName,// 物料描述
                        vendorName: content.supplierName,// 供应商
                        clientFactory: content.factoryName,// 客户工厂
                        unit:content.units,// 单位
                        status: content.status,// 状态
                        createdAt: formatDate(content.createTime),//创建时间
                    }
                })
                break
            // 信息管理-工厂发货信息
            case 'shipped_infos':
                originalContent = await this.callNetworkRequest({
                    requestUrl: '/order/find/all',
                    params: Object.assign({}, params, {status:2}, {supplierCode}),
                    requestMethod: 'POST'})
                data = originalContent.map((content,index)=>{
                    return {
                        index: index+1,
                        key: freshId(),
                        id: content.id,
                        number: content.code,
                        // vendorName: content.supplierName,
                        clientFactory: content.factoryName,
                        status: orderStatusList.filter(status=>status.value === content.status)[0].label,// 状态
                        // material: validStateList.filter(state=>content.status===state.value)[0].label,
                        // materialAmount: content.createTime,
                        sentTime: formatDate(content.deliveryTime),// 发货时间
                        transportPeriod: content.transportTime,// 运输周期
                    }
                })
                break
            // 信息管理-已冲销发货信息
            case 'reversed_infos':
                originalContent = await this.callNetworkRequest({
                    requestUrl: '/order/find/all',
                    params: Object.assign({}, params, {status:3}, {supplierCode}),
                    requestMethod: 'POST'})
                data = originalContent.map((content,index)=>{
                    return {
                        index: index+1,
                        key: freshId(),
                        id: content.id,
                        number: content.code,//号码
                        reversedNumber: content.offsetCode, // 冲销号码
                        // vendorName: content.supplierName,// 供应商
                        clientFactory: content.factoryName,
                        status: orderStatusList.filter(status=>status.value === content.status)[0].label,// 状态
                        // material: validStateList.filter(state=>content.status===state.value)[0].label,
                        // materialAmount: content.createTime,
                        sentTime: '--',// 发货时间：Todo:接口需要增加该字段
                        reversedTime: formatDate(content.offsetTime),// 冲销时间
                        transportPeriod: content.transportTime,// 运输周期
                    }
                })
                break

            // C 类Table数据
            // 信息管理-VMI收货信息
            case 'vmi_received_infos':
                originalContent = await this.callNetworkRequest({
                    requestUrl: '/order/find/all',
                    params: Object.assign({}, params, {status:4}, {supplierCode}),
                    requestMethod: 'POST'})
                data = originalContent.map((content,index)=>{
                    return {
                        index: index+1,
                        key: freshId(),
                        id: content.id,
                        number: content.code,// 号码
                        // vendorName: content.supplierName,// 供应商名称
                        clientFactory: content.factoryName,
                        status: content.status,// 状态
                        sentTime: '--',// 发货时间：Todo:接口需要增加该字段
                        transportPeriod: content.transportTime,// 运输周期
                        receivedTime: formatDate(content.receiveTime),// 收货时间
                        // qualifiedQuantity: Math.floor(Math.random() * 10),// 合格数量
                        // unqualifiedQuantity: Math.floor(Math.random() * 10),// 不合格数量
                    }
                })
                break

            // 报表管理-货物移动查询
            case 'goods_transfer_query':
                originalContent = await this.callNetworkRequest({
                    requestUrl: '/statisticalReport/mobileQueryReport',
                    params: Object.assign({}, params, {supplierCode}),
                    requestMethod: 'POST'})
                data = originalContent.map((content,index)=>{
                    return {
                        index: index+1,
                        key: freshId(),
                        id: content.id,
                        material: content.materiaCode,// 物料
                        materialDescription: content.materiaName,// 物料描述
                        vendorId: content.supplierCode,
                        vendorName: content.supplierName,
                        qualifiedQuantity:content.qualifiedNumber,
                        unqualifiedQuantity:content.badNumber,
                        status: content.status,
                        createdAt: formatDate(content.createTime),// 日期
                    }
                })
                break
            // 报表管理-库存信息查询
            case 'inventory_infos_query':
                originalContent = await this.callNetworkRequest({
                    requestUrl: '/statisticalReport/inventoryInforQueryReport',
                    params: Object.assign({}, params, {supplierCode}),
                    requestMethod: 'POST'})
                data = originalContent.map((content,index)=>{
                    return {
                        index: index+1,
                        key: freshId(),
                        id: content.id,
                        material: content.materiaCode,// 物料
                        materialDescription: content.materiaName,// 物料描述
                        vendorId: content.supplierCode,
                        vendorName: content.supplierName,
                        qualifiedQuantity:content.qualifiedNumber,
                        unqualifiedQuantity:content.badNumber,
                        onTheWayQuantity: content.onTheWayNum,
                        createdAt: formatDate(content.createTime),// 日期
                    }
                })
                break

            // 报表管理-冲销信息查询
            case 'reversed_infos_query':
                for (let i = 1; i < 5; i++) {
                    originalContent = originalContent.concat(
                        await this.callNetworkRequest({
                        requestUrl: '/statisticalReport/writeOffinforInquiryreport',
                        params: Object.assign({}, params, {status:i},{supplierCode}),
                        requestMethod: 'POST'})
                    )
                }
                data = originalContent.map((content,index)=>{
                    return {
                        index: index+1,
                        key: freshId(),
                        id: content.id,
                        // material: content.materiaCode,// 物料
                        // materialDescription: content.materiaName,// 物料描述
                        // quantity:content.qualifiedNumber,// 数量
                        vendorName: content.supplierCode,// 供应商
                        status: content.status,// 状态
                        generatedNumber:content.deliveryCode,// 生成号码
                        generatedDate: formatDate(content.deliveryTime),// 生成日期
                        reversedNumber:content.offsetCode,// 生成日期
                        reversedDate: formatDate(content.offsetTime),// 冲销日期
                    }
                })
                break
            default:
                break

        }

        console.log('constructed data = ',data)
        return data
    }

    // 调用网络请求
    callNetworkRequest = async ({requestUrl, params, requestMethod}) => {
        let result
        if (requestMethod === 'POST') {
            result = await http.post(requestUrl,params)
        } else {
            result = await http.get(requestUrl)
        }
        // console.log(`request: ${requestUrl}',params:${params},'result:${result}`)
        const {data: _data} = result
        let originalContent =  _data.content
        // console.log('originalContent=',originalContent)
        return originalContent
    }

    // 搜索按钮回调(多页面共用)
    onSearchButtonClicked = (selectedTabKey, searchConditionObject) => {
        const immutableDataSet = this.state.immutableDataSet
        console.log('immutableDataSet', immutableDataSet)
        console.log('onSearchButtonClicked called', selectedTabKey, searchConditionObject)
        let filteredDataSet = immutableDataSet.filter(data => {
            const keys = _.keys(searchConditionObject)
            const filteredKeys = keys.filter(key => !isEmpty(searchConditionObject[key]))
            const conditionResults = filteredKeys.map((value, index) => {
                // 特殊处理：字符串模糊匹配、日期匹配
                if (value === 'number') {
                    return data[value].indexOf(searchConditionObject[value]) > -1
                } else if (value === 'material' || value === 'materialDescription') {
                    return data['material'].indexOf(searchConditionObject['material']) > -1
                        || data['materialDescription'].indexOf(searchConditionObject['materialDescription']) > -1
                } else if (value === 'generatedNumber' || value === 'reversedNumber') {
                    return data['generatedNumber'].indexOf(searchConditionObject['generatedNumber']) > -1
                        || data['reversedNumber'].indexOf(searchConditionObject['reversedNumber']) > -1
                } else if (
                    value === 'temporaryStoreTime'// 信息管理-待发货信息查询
                    || value === 'sentTime' || value === 'reversedTime'// 信息管理-已冲销发货信息
                    || value === 'receivedTime'
                    || value === 'createdAt'
                    || value === 'generatedDate' || value === 'reversedDate'// 报表管理-冲销信息查询
                ) {
                    return moment(data[value]).isSame(searchConditionObject[value], 'days')
                } else if (value === 'status') {
                    return parseInt(data[value]) === parseInt(searchConditionObject[value])
                }
                return data[value] === searchConditionObject[value]
            })
            return conditionResults.reduce((previousValue, currentValue) => previousValue && currentValue, true)
        })
        console.log('filteredDataSet',filteredDataSet)
        this.setState({
            dataSet: filteredDataSet
        })
    }

    // 批量导入按钮回调(多页面共用)
    onBatchImportButtonClicked = (selectedTabKey) => {
        console.log('onBatchImportButtonClicked called', selectedTabKey)
    }

    // 删除按钮回调(仅供单页面使用)
    onDeleteButtonClicked = async () => {
        console.log('onDeleteButtonClicked called')
        const { immutableDataSet, selectedRowKeys} = this.state

        for (let i = 0; i < selectedRowKeys.length; i++) {
            const rowKey = selectedRowKeys[i]
            const index = immutableDataSet.findIndex(data => data.key === rowKey)
            if (index > -1) {
                let requestUrl = `/order/delete/code/${immutableDataSet[index].number}`
                const result = await http.get(requestUrl)

                console.log('result', result)
                if (result.ret === '200') {
                    immutableDataSet.splice(index, 1)
                    this.setState({
                        dataSet:immutableDataSet,
                        immutableDataSet,
                    })
                } else {
                    message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL})`)
                }
            } else {
                // console.log('delete button clicked! error!', key)
                message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_OTHER_ERROR})`)
            }
        }
        this.setState({
            selectedRowKeys:[],
            editState:false,
        })

    }

    // 批量发货按钮回调(仅供单页面使用)
    onBatchShippingButtonClicked = async () => {
        console.log('onBatchShippingButtonClicked called')
        const { immutableDataSet, selectedRowKeys} = this.state
        let ids = []
        selectedRowKeys.forEach(rowKey=>{
            const index = immutableDataSet.findIndex(data => data.key === rowKey)
            if (index > -1) {
                ids.push(immutableDataSet[index].id)
            } else {
                // console.log('delete button clicked! error!', key)
                message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_OTHER_ERROR})`)
            }
        })
        const result = await http.post('/order/batchDelivery', {ids})
        console.log('result', result)
        if (result.ret === '200') {
            selectedRowKeys.forEach(rowKey =>{
                const index = immutableDataSet.findIndex(data => data.key === rowKey)
                if (index > -1) {
                    immutableDataSet.splice(index, 1)
                }
            })
            this.setState({
                dataSet:immutableDataSet,
                immutableDataSet,
            })
        } else {
            message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL})`)
        }
        this.setState({
            selectedRowKeys:[],
            editState:false,
        })
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
    onModalOkButtonClickedListener = async (selectedTabKey, addedData) => {
        console.log('onModalOkButtonClickedListener', selectedTabKey, addedData)
        // 为了保持数据一致性（如id、时间等需要从服务器返回的字段），重新请求数据。（TODO:待优化）
        this.setState({
            showModal: false,
            dataSet:[],
        })

        let dataSet = await this.constructData(selectedTabKey)
        this.setState({
            dataSet,
            immutableDataSet: dataSet,
            selectedRowKeys:[],//清空选中的数据Key数组，清除选中状态
        })
    }

    // 联动：Modal 取消按钮点击事件监听
    onModalCancelButtonClickedListener = () => {
        this.setState({
            showModal: false
        })
    }

    // 点击Table的行的回调，显示Modal展示物料列表
    onRowClickedListener = (record) => {
        console.log('-===onRowClickedListener===-', record)
        this.setState({
            showMaterialListModal: true,
            order: record
        })
    }

    // 点击Table的行显示的 Modal，确定按钮点击事件监听
    onMLMOkButtonClickedListener = () => {
        this.setState({
            showMaterialListModal: false,
            order: {}
        })
    }

    // 点击Table的行显示的 Modal，取消按钮点击事件监听
    onMLMCancelButtonClickedListener = () => {
        this.setState({
            showMaterialListModal: false,
            order: {}
        })
    }

    render() {
        const {
            selectedTabKey,// 当前选择的Tab页
        } = this.props

        const {
            dataSet,
            showModal,
            showMaterialListModal,
            editState,
            selectedRowKeys
        } = this.state

        let tableComponent
        switch (selectedTabKey) {
            // 信息管理-物料类型管理
            case 'vendor_material_type_management':
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
                            //点击Table的行的回调：弹出Modal显示物料相关的数据
                            onRowClickedListener={this.onRowClickedListener}
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
                            //点击Table的行的回调：弹出Modal显示物料相关的数据
                            onRowClickedListener={this.onRowClickedListener}
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
                            //点击Table的行的回调：弹出Modal显示物料相关的数据
                            onRowClickedListener={this.onRowClickedListener}
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
                            //点击Table的行的回调：弹出Modal显示物料相关的数据
                            onRowClickedListener={this.onRowClickedListener}
                        />
                    </div>
                )
                break
            default:
                tableComponent = null
        }
        // console.log('selectedTabKey',selectedTabKey,'showMaterialListModal',showMaterialListModal)
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
                    selectedTabKey === 'vendor_material_type_management' && (
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
                {
                    (
                       selectedTabKey === 'shipped_infos'
                        ||selectedTabKey === 'reversed_infos'
                        ||selectedTabKey === 'vmi_received_infos'
                        ||selectedTabKey === 'reversed_infos_query'
                    ) && (
                        <MaterialListModal
                            order={this.state.order}
                            modalType={selectedTabKey}
                            modalVisibility={showMaterialListModal}
                            onOkClickedListener={this.onMLMOkButtonClickedListener}
                            onCancelClickedListener={this.onMLMCancelButtonClickedListener}
                        />
                    )
                }
                {
                    (
                        selectedTabKey === 'to_be_shipped_infos'
                    ) && (
                        <EditShippingMaterialModal
                            order={this.state.order}
                            modalType={selectedTabKey}
                            modalVisibility={showMaterialListModal}
                            onOkClickedListener={this.onMLMOkButtonClickedListener}
                            onCancelClickedListener={this.onMLMCancelButtonClickedListener}
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