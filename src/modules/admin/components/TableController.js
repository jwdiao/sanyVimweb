/**
 * 表格头部控制布局
 * 包含搜索/添加等按钮的布局
 */
import React, {Component} from "react";
import {message} from "antd";
import moment from 'moment'
import freshId from 'fresh-id'
import * as XLSX from 'xlsx';
import {AdminTable} from "./AdminTable";
import {InputModal} from "./InputModal";
import {AdminHeader} from "./AdminHeader";
import {NewUserModal} from "./NewUserModal";
import {formatDate, http, validStateList} from "../../../utils";
import {NewMaterialModal} from "../../shipping/components/NewMaterialModal";

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
    // action: 'http://localhost:8080/shipping/upload/batch/',
    action: 'http://10.19.8.21:9999/material/upload',
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
    // }
    // beforeUpload: (file, fileList) => {
    //     const fileName = file.val()
    //     const suffix = fileName.substring(fileName.lastIndexOf('.')+1, fileName.length)
    //     console.log('suffix', suffix)
    // }
};

class _TableController extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            editState: false,
            dataSet: [],
        }
    }

    componentWillMount() {
        // console.log('componentWillMount called', this.props)
        //Todo:For test only
        // const {selectedTabKey} = this.props
        // let dataSet = this.constructData(selectedTabKey)
        // this.setState({
        //     dataSet,
        //     immutableDataSet: dataSet,
        // })
    }

    async componentDidMount() {
        const {selectedTabKey} = this.props
        const content = await this.constructData(selectedTabKey)
        this.setState({
            dataSet: content,
            immutableDataSet: content,
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
                showModal: false,
                editState: false,
                selectedRowKeys:[],//切换了Tab后，清空选中的数据Key数组
            })
            const {selectedTabKey} = nextProps
            let dataSet = await this.constructData(selectedTabKey)
            this.setState({
                dataSet,
                immutableDataSet: dataSet,
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
        let params = {
            // page: 1,
            // pageSize:10,
        }

        // 接口请求
        let originalContent = []

        switch (selectedTabKey) {
            // 基础信息-三一工厂管理
            case 'sany_factory':
                originalContent = await this.callNetworkRequest({
                    requestUrl: '/factory/factoryList',
                    params,
                    requestMethod: 'POST'})
                return originalContent.map((content, index)=>{
                    return {
                        index:index+1,// 用于列表展示的序号
                        key: freshId(),// 用于列表渲染的key
                        id: content.id,// 数据库中该条数据的主键
                        sanyId: content.code,// SANY工厂编号
                        sanyName: content.name,// SANY工厂名称
                        status: content.status,// 状态
                        createdAt: formatDate(content.createTime),// 创建时间
                    }
                })

            // 基础信息-供应商管理
            case 'vendor':
                originalContent = await this.callNetworkRequest({
                    requestUrl: '/supplier/supplierList',
                    params,
                    requestMethod: 'POST'})
                return originalContent.map((content, index)=>{
                    return {
                        index:index+1,// 用于列表展示的序号
                        key: freshId(),// 用于列表渲染的key
                        id: content.id,// 数据库中该条数据的主键
                        vendorId: content.code,// 供应商编号
                        vendorName: content.name,// 供应商名称
                        status: content.status,// 状态
                        createdAt: formatDate(content.createTime),// 创建时间
                    }
                })

            // 基础信息-用户管理
            case 'user':
                originalContent = await this.callNetworkRequest({
                    requestUrl: '/user/userList',
                    params,
                    requestMethod: 'POST'})
                return originalContent.map((content, index)=>{
                    return {
                        index:index+1,// 用于列表展示的序号
                        key: freshId(),// 用于列表渲染的key
                        id: content.id,// 数据库中该条数据的主键
                        userName: content.userName,// 用户名
                        name: content.name,// 姓名
                        mobile: content.phone,// 手机号
                        vendor: content.supplierName,// 供应商
                        role: content.type,// 角色
                        status: content.status,// 状态
                        createdAt: formatDate(content.createTime),// 创建时间
                    }
                })

            // 基础信息-基础物料类型管理
            case 'basic_material_type_management':
                originalContent = await this.callNetworkRequest({
                    requestUrl: '/material/find/all',
                    params,
                    requestMethod: 'POST'})
                return originalContent.map((content, index)=>{
                    return {
                        index:index+1,// 用于列表展示的序号
                        key: freshId(),// 用于列表渲染的key
                        id: content.id,// 数据库中该条数据的主键
                        material: content.code,// 物料编号
                        materialDescription: content.name,// 物料描述
                        unit:content.units,// 单位
                        status: content.status,// 状态
                        createdAt: formatDate(content.createTime),// 创建时间
                    }
                })

            default:
                break
        }
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
        // console.log('immutableDataSet', immutableDataSet)
        // console.log('onSearchButtonClicked called', selectedTabKey, searchConditionObject)
        let filteredDataSet = immutableDataSet.filter(data => {
            const keys = _.keys(searchConditionObject)
            const filteredKeys = keys.filter(key => !isEmpty(searchConditionObject[key]))
            const conditionResults = filteredKeys.map((value, index) => {
                // 特殊处理：字符串模糊匹配、日期匹配
                if (value === 'sanyId' || value === 'sanyName') {
                    return data['sanyId'].indexOf(searchConditionObject['sanyId']) > -1
                        || data['sanyName'].indexOf(searchConditionObject['sanyName']) > -1
                } else if (value === 'vendorId' || value === 'vendorName') {
                    return data['vendorId'].indexOf(searchConditionObject['vendorId']) > -1
                        || data['vendorName'].indexOf(searchConditionObject['vendorName']) > -1
                } else if (value === 'vendor') {
                    return data['vendor'].indexOf(searchConditionObject['vendor']) > -1
                } else if (value === 'userName' || value === 'name' || value === 'mobile') {
                    return data['userName'].indexOf(searchConditionObject['userName']) > -1
                        || data['name'].indexOf(searchConditionObject['name']) > -1
                        || data['mobile'] === searchConditionObject['mobile'] // *手机号搜索使用精确匹配
                } else if (value === 'material' || value === 'materialDescription') {
                    return data['material'].indexOf(searchConditionObject['material']) > -1
                        || data['materialDescription'].indexOf(searchConditionObject['materialDescription']) > -1
                } else if (value === 'status') {
                    return parseInt(data[value]) === parseInt(searchConditionObject[value])
                }
                return data[value] === searchConditionObject[value]
            })
            return conditionResults.reduce((previousValue, currentValue) => previousValue && currentValue, true)
        })
        this.setState({
            dataSet: filteredDataSet
        })
    }

    onAddButtonClicked = (selectedTabKey) => {
        console.log('onAddButtonClicked called', selectedTabKey)
        this.setState({
            showModal: true
        })
    }

    // 批量导入按钮回调
    onBatchImportButtonClicked = (selectedTabKey) => {
        console.log('onBatchImportButtonClicked called', selectedTabKey)
    }

    // 联动：Modal 确定按钮点击事件监听
    onModalOkButtonClickedListener = async (selectedTabKey, addedData) => {
        console.log('onModalOkButtonClickedListener', selectedTabKey, addedData)
        // console.log('this.state.dataSet', this.state.dataSet)
        // this.setState((prevState)=>{
        //     const neWData = Object.assign({}, addedData, {id: prevState.dataSet[prevState.dataSet.length-1].id +1})
        //     const newDataSet = prevState.dataSet.concat([neWData])
        //     console.log('newDataSet', newDataSet)
        //     return {
        //         showModal: false,
        //         dataSet: newDataSet,
        //         immutableDataSet: newDataSet,
        //         selectedRowKeys:[],//切换了Tab后，清空选中的数据Key数组
        //     }
        // })

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

    render(){
        const {selectedTabKey} = this.props
        const {
            dataSet,
            showModal,
            editState,
        } = this.state

        let tableComponent
        switch (selectedTabKey) {
            //
            case 'sany_factory':
                tableComponent = (
                    <div>
                        <AdminHeader
                            selectedTabKey={selectedTabKey}
                            onSearchButtonClicked={this.onSearchButtonClicked}
                            onAddButtonClicked={this.onAddButtonClicked}
                            editState={editState}
                        />
                        <AdminTable
                            dataSet={dataSet}
                            tableType={selectedTabKey}
                            // 联动Table的选择状态
                            onTableItemsSelectedListener={this.onTableItemsSelectedListener}
                            onTableItemEditedListener={this.onTableItemEditedListener}
                            onTableItemDeletedListener={this.onTableItemDeletedListener}
                        />
                    </div>
                )
                break
            case 'vendor':
                tableComponent = (
                    <div>
                        <AdminHeader
                            selectedTabKey={selectedTabKey}
                            onSearchButtonClicked={this.onSearchButtonClicked}
                            onAddButtonClicked={this.onAddButtonClicked}
                            editState={editState}
                        />
                        <AdminTable
                            dataSet={dataSet}
                            tableType={selectedTabKey}
                            // 联动Table的选择状态
                            onTableItemsSelectedListener={this.onTableItemsSelectedListener}
                            onTableItemEditedListener={this.onTableItemEditedListener}
                            onTableItemDeletedListener={this.onTableItemDeletedListener}
                        />
                    </div>
                )
                break
            case 'user':
                tableComponent = (
                    <div>
                        <AdminHeader
                            selectedTabKey={selectedTabKey}
                            onSearchButtonClicked={this.onSearchButtonClicked}
                            onAddButtonClicked={this.onAddButtonClicked}
                            editState={editState}
                        />
                        <AdminTable
                            dataSet={dataSet}
                            tableType={selectedTabKey}
                            // 联动Table的选择状态
                            onTableItemsSelectedListener={this.onTableItemsSelectedListener}
                            onTableItemEditedListener={this.onTableItemEditedListener}
                            onTableItemDeletedListener={this.onTableItemDeletedListener}
                        />
                    </div>
                )
                break
            // 信息管理-物料类型管理
            case 'basic_material_type_management':
                tableComponent = (
                    <div>
                        <AdminHeader
                            selectedTabKey={selectedTabKey}
                            uploadProps={uploadProps}
                            onSearchButtonClicked={this.onSearchButtonClicked}
                            onBatchImportButtonClicked={this.onBatchImportButtonClicked}
                            onAddButtonClicked={this.onAddButtonClicked}
                            editState={editState}
                        />
                        <AdminTable
                            dataSet={dataSet}
                            tableType={selectedTabKey}
                            onTableItemStateChangedListener={this.onTableItemStateChangedListener}
                            onTableItemEditedListener={this.onTableItemEditedListener}
                            onTableItemDeletedListener={this.onTableItemDeletedListener}
                        />
                    </div>
                )
                break
            default:
                return null
        }

        return (
            <div>
                {tableComponent}
                {/***增加SANY工厂和供应商的modal布局较为简单，写一套***/}
                {
                    (selectedTabKey === 'sany_factory' || selectedTabKey === 'vendor')
                    && (
                        <InputModal
                            modalType={selectedTabKey}
                            modalVisibility={showModal}
                            onOkClickedListener={this.onModalOkButtonClickedListener}
                            onCancelClickedListener={this.onModalCancelButtonClickedListener}
                        />
                    )
                }

                {/***因为增加新用户的modal布局较为复杂，单独写***/}
                {
                    (selectedTabKey === 'user')
                    && (
                        <NewUserModal
                            modalType={selectedTabKey}
                            modalVisibility={showModal}
                            onOkClickedListener={this.onModalOkButtonClickedListener}
                            onCancelClickedListener={this.onModalCancelButtonClickedListener}
                        />
                    )
                }
                {
                    selectedTabKey === 'basic_material_type_management' && (
                        <NewMaterialModal
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

