/**
 * 表格头部控制布局
 * 包含搜索/添加等按钮的布局
 */
import React, {Component} from "react";
import moment from 'moment'
import {AdminTable} from "./AdminTable";
import {InputModal} from "./InputModal";
import {AdminHeader} from "./AdminHeader";
import {NewUserModal} from "./NewUserModal";

const _ = require('lodash')

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
                // 基础信息-三一工厂管理
                case 'sany_factory':
                    data.push({
                        key: i.toString(),
                        id: (i + 1).toString(),// 序号
                        sanyId: `SANY-${i + 1}`,// SANY工厂编号
                        sanyName: `三一工厂 ${i + 1}`,// SANY工厂名称
                        status: i % 3 !== 0 ? '启用' : '停用',//状态
                        createdAt: moment().format('YYYY-MM-DD HH:mm'),
                    });
                    break

                // 基础信息-供应商管理
                case 'vendor':
                    data.push({
                        key: i.toString(),
                        id: (i + 1).toString(),// 序号
                        vendorId: `VENDOR-${i + 1}`,// 供应商编号
                        vendorName: `供应商工厂 ${i + 1}`,// 供应商名称
                        status: i % 3 !== 0 ? '启用' : '停用',//状态
                        createdAt: moment().format('YYYY-MM-DD HH:mm'),
                    });
                    break

                // 基础信息-用户管理
                case 'user':
                    data.push({
                        key: i.toString(),
                        id: (i + 1).toString(),// 序号
                        userName: `user-${i + 1}`,//用户名
                        name: `用户-${i + 1}`,//姓名
                        mobile: `1392001234${Math.floor(Math.random()*10)}`,//手机号
                        vendor: `供应商-${i + 1}`,// 供应商
                        role: i % 3 !== 0 ? '收货员' : '发货员',//角色
                        status: i % 3 !== 0 ? '启用' : '停用',//状态
                        createdAt: moment().format('YYYY-MM-DD HH:mm'),
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
        console.log('immutableDataSet', immutableDataSet)
        console.log('onSearchButtonClicked called', selectedTabKey, searchConditionObject)
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
                } else if (value === 'userName' || value === 'name' || value === 'mobile') {
                    return data['userName'].indexOf(searchConditionObject['userName']) > -1
                        || data['name'].indexOf(searchConditionObject['name']) > -1
                        || data['mobile'] === searchConditionObject['mobile'] // *手机号搜索使用精确匹配
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

