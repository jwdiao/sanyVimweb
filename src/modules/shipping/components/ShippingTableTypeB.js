/**
 * 发货相关的Table 类型B:
 * 此类Table不具备批量操作的功能，但可以编辑行
 * 如：[信息管理-工厂发货信息]页面的table
 */
import React, {Component} from 'react';
import {Form, Input, message, Popconfirm, Select, Table} from "antd";
import freshId from 'fresh-id'
import {
    materialTypeTableColumns, orderStatusList,
    reversedTableColumns,
    shippedTableColumns,
    TABLE_OPERATION_DELETE,
    TABLE_OPERATION_DUPLICATE,
    TABLE_OPERATION_EDIT,
    TABLE_OPERATION_REVERSE, TABLE_OPERATION_STATUS,
    unitList,
    validStateList,
    http, ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL, ERROR_CODE_ADMIN_SANY_FACTORY_OTHER_ERROR
} from "../../../utils";
import styled from "styled-components";

const FormItem = Form.Item;
const EditableContext = React.createContext();

const Option = Select.Option

class EditableCell extends React.Component {

    state = {
        data: [],
        value: undefined,
    }

    getInput = (columnId) => {
        const {inputType, vendorList, factoryList} = this.props
        if (inputType === 'selector') {
            let options = []
            switch (columnId) {
                case 'unit':
                    options = unitList
                    break
                case 'status':
                    options = validStateList
                    break
                case 'vendorName':
                    options = vendorList
                    break
                case 'clientFactory':
                    options = factoryList
                    break
                default:
                    break
            }
            return <Select>
                {
                    options.map(option => {
                        return (
                            <Option
                                key={freshId()}
                                value={
                                    columnId === 'status'
                                        ? validStateList.filter(state => state.value === option.value)[0].value
                                        : (
                                            columnId === 'vendorName'
                                                ? vendorList.filter(role => role.value === option.value)[0].value
                                                : (
                                                    columnId === 'clientFactory'
                                                        ? factoryList.filter(role => role.value === option.value)[0].value
                                                        : option.value
                                                )
                                        )
                                }
                            >
                                {option.label}
                            </Option>
                        )
                    })
                }
            </Select>
        } else if (inputType === 'search_selector') {
            const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
            return (
                <Select
                    showSearch
                    value={this.state.value}
                    placeholder={columnId === 'vendorName' ? '供应商编号' :'工厂编号'}
                    style={{width:'100%'}}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={this.handleSearch(columnId)}
                    onChange={this.handleChange}
                    notFoundContent={null}
                >
                    {options}
                </Select>
            )
        }
        return <Input/>;
    };

    handleSearch = (type) => (value) => {
        //fetch(value, data => this.setState({ data }));
        console.log('value, type', value, type)
        let requestUrl = ''
        switch (type) {
            case 'vendorName':
                requestUrl = '/supplier/supplierList'
                break
            case 'clientFactory':
                requestUrl = '/factory/factoryList'
                break
            default:
                break
        }
        http.post(requestUrl,{
            code: value
        }).then(result=>{
            if (result && result.data.content) {
                this.setState({
                    data: result.data.content.map(item=>({value: item.code, text: item.name}))
                })
            }
        })
    }

    handleChange = (value) => {
        this.setState({ value });
    }

    render() {
        const {
            vendorList,
            factoryList,
            tableType,
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const {getFieldDecorator} = form;
                    return (
                        <td {...restProps}>
                            {
                                editing ? (
                                    <FormItem style={{margin: 0}}>
                                        {getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `请输入${title}!`,
                                            }],
                                            initialValue: (
                                                record[dataIndex]
                                            ),
                                        })(this.getInput(dataIndex))}
                                    </FormItem>
                                ) : (
                                    dataIndex === 'status' && (tableType === 'shipped_infos' || tableType === 'reversed_infos') && record[dataIndex] !== ''
                                        ? orderStatusList.filter(status => status.value === parseInt(record[dataIndex]))[0].label //避免使用字面量作为value: 如 value为1,2,3...，显示的是'待发货/待发货'
                                        : (dataIndex === 'status' && tableType === 'vendor_material_type_management' && record[dataIndex] !== ''
                                            ? validStateList.filter(status => status.value === parseInt(record[dataIndex]))[0].label
                                            : restProps.children
                                        )
                                )
                            }
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

class _ShippingTableTypeB extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [],
            editingKey: '',

            //
            vendorList: [],
            factoryList:[]
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

    async componentDidMount() {
        const result1 = await http.post('/supplier/supplierList',{})
        if (result1.ret === '200') {
            this.setState({
                vendorList: result1.data.content.map(item => ({key: `vendor_${item.code}`, value: item.code, label: item.name}))
            })
        } else {
            message.error('获取供应商列表失败！请稍候重试。')
        }

        const result2 = await http.post('/factory/factoryList',{})
        if (result2.ret === '200') {
            this.setState({
                factoryList: result2.data.content.map(item => ({key: `factory_${item.code}`, value: item.code, label: item.name}))
            })
        } else {
            message.error('获取工厂列表失败！请稍候重试。')
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        // console.log('componentWillReceiveProps called', nextProps)
        const {tableType: tableTypeThis, dataSet: dataSetThis} = this.props
        const {tableType: tableTypeNext, dataSet: dataSetNext} = nextProps
        if (tableTypeThis !== tableTypeNext || dataSetThis !== dataSetNext) {
            const {tableType, dataSet} = nextProps
            let tableFields = this.constructTableFields(tableType)
            this.setState({
                data: dataSet,
                columns: tableFields,
                editingKey: '',// 注意重置此state,防止切换不同的SideBar的Item时，编辑状态不重置的问题
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('shouldComponentUpdate called', nextProps, nextState)
        return nextState !== this.state || nextProps !== this.props;
    }

    // 构建表头结构
    constructTableFields = (tableType) => {
        let baseColumnsArray = []
        switch (tableType) {
            case 'reversed_infos':
                baseColumnsArray = reversedTableColumns
                break
            case 'shipped_infos':
                baseColumnsArray = shippedTableColumns
                break
            case 'vendor_material_type_management':
                baseColumnsArray = materialTypeTableColumns
                break
            default:
                break
        }
        return baseColumnsArray.concat(this.getOperationFields(tableType))
    }

    // 根据不同表获取不同的【操作】集合
    getOperationFields = (tableType) => {
        let operationFieldsArray = []
        switch (tableType) {
            case 'vendor_material_type_management':
                operationFieldsArray = [
                    {
                        title: '操作',
                        dataIndex: 'operation',
                        render: (text, record) => {
                            const {editingKey} = this.state;
                            const editable = this.isEditing(record);
                            return (
                                <div>
                                    {editable ? (
                                        <OperationArea>
                                            <EditableContext.Consumer>
                                                {form => (
                                                    <a
                                                        href="javascript:;"
                                                        onClick={() => this.save(form, record)}
                                                        style={{marginRight: 8}}
                                                    >
                                                        保存
                                                    </a>
                                                )}
                                            </EditableContext.Consumer>
                                            <Popconfirm
                                                title="确定取消吗?"
                                                onConfirm={() => this.cancel(record.key)}
                                            >
                                                <a>取消</a>
                                            </Popconfirm>
                                        </OperationArea>
                                    ) : (
                                        <OperationArea>
                                            <EditableContext.Consumer>
                                                {
                                                    form => (
                                                        <Popconfirm
                                                            title={record.status === 1 ? "确定停用吗?" : "确定启用吗?"}
                                                            onConfirm={() => this.changeStatus(form, record)}
                                                        >
                                                            <OperationButton
                                                                disabled={editingKey !== ''}
                                                                color={TABLE_OPERATION_STATUS}
                                                            >
                                                                {record.status === 1 ? "停用" : "启用"}
                                                            </OperationButton>
                                                        </Popconfirm>
                                                    )
                                                }
                                            </EditableContext.Consumer>

                                            <OperationButton
                                                disabled={editingKey !== ''}
                                                color={TABLE_OPERATION_EDIT}
                                                onClick={() => this.edit(record.key)}
                                            >
                                                编辑
                                            </OperationButton>

                                            <Popconfirm
                                                title="确定删除吗?"
                                                onConfirm={() => this.delete(record.key)}
                                            >
                                                <OperationButton
                                                    disabled={editingKey !== ''}
                                                    color={TABLE_OPERATION_DELETE}
                                                >
                                                    删除
                                                </OperationButton>
                                            </Popconfirm>

                                        </OperationArea>
                                    )}
                                </div>
                            );
                        },
                    }
                ]
                break

            case 'shipped_infos':
                operationFieldsArray = [
                    {
                        title: '操作',
                        dataIndex: 'operation',
                        render: (text, record) => {
                            const {editingKey} = this.state;
                            return (
                                <div>
                                    <OperationArea>
                                        <Popconfirm
                                            title="确定冲销吗?"
                                            onConfirm={(event) => {
                                                this.delete(record.key)
                                                event.stopPropagation()
                                            }}
                                            onCancel={(event) => {
                                                event.stopPropagation()
                                            }}
                                        >
                                            <OperationButton
                                                disabled={editingKey !== ''}
                                                color={TABLE_OPERATION_REVERSE}
                                                onClick={event => {
                                                    event.stopPropagation()
                                                }}
                                            >
                                                冲销
                                            </OperationButton>
                                        </Popconfirm>
                                    </OperationArea>
                                </div>
                            );
                        },
                    }
                ]
                break

            case 'reversed_infos':
                operationFieldsArray = [
                    {
                        title: '操作',
                        dataIndex: 'operation',
                        render: (text, record) => {
                            const {editingKey} = this.state;
                            return (
                                <div>
                                    <OperationArea>
                                        <OperationButton
                                            disabled={editingKey !== ''}
                                            color={TABLE_OPERATION_DUPLICATE}
                                            onClick={(event) => {
                                                this.duplicate(record.key)
                                                event.stopPropagation()
                                            }}
                                        >
                                            复制
                                        </OperationButton>
                                    </OperationArea>
                                </div>
                            );
                        },
                    }
                ]
                break

            default:
                break
        }
        return operationFieldsArray
    }

    isEditing = record => record.key === this.state.editingKey;

    // 取消
    cancel = () => {
        this.setState({editingKey: ''});
    };

    // 复制
    duplicate = async (key) => {
        console.log('duplicate button called!', key)
        // const {tableType, onTableItemDuplicatedListener} = this.props
        // // Todo: 调用后台接口，复制数据至待发货
        // if (onTableItemDuplicatedListener) {
        //     let newData = [...this.state.data];
        //     const index = newData.findIndex(item => key === item.key);
        //     const item = newData[index];
        //     onTableItemDuplicatedListener(tableType, item)
        // }
        let newData = [...this.state.data];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
            const result = await this.callNetworkRequest({
                requestUrl:`/order/copy/${newData[index].id}`,
                params:{},
                requestMethod:'GET'
            })

            if (result) {
                message.success('发货单复制成功！')
            } else {
                message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL})`)
            }
        } else {
            console.log('delete button clicked! error!', key)
            message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_OTHER_ERROR})`)
        }
    }

    // (Deprecated)冲销（使用删除接口）
    reverseRecord = (key) => {
        console.log('reverseRecord button called!', key)
    }

    // 保存
    save = (form, record) => {
        const {tableType, onTableItemEditedListener} = this.props
        form.validateFields(async (error, row) => {
            if (error) {
                return;
            }

            let newData = [...this.state.data];
            const index = newData.findIndex(item => record.key === item.key);
            if (index > -1) {
                const item = newData[index];
                console.log('item=', item, 'row=', row)

                let params = {
                    id: item.id,
                    // status:row.status,
                }
                let requestUrl = ''
                switch (tableType) {
                    case 'vendor_material_type_management':
                        requestUrl = '/factorySupplierMaterial/save'
                        params = Object.assign({}, params, {
                            // materialCode:row.material, //暂时禁用修改物料的功能
                            supplierCode: row.vendorName,
                            factoryCode: row.clientFactory
                        })
                        break
                    default:
                        break
                }
                const result = await this.callNetworkRequest({
                    requestUrl,
                    params,
                    requestMethod: 'POST'
                })

                // console.log('result =' ,result)
                if (result) {
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    this.setState({
                        data: newData,
                        editingKey: ''
                    });

                    if (onTableItemEditedListener) {
                        onTableItemEditedListener(tableType, newData)
                    }
                } else {
                    message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL})`)
                }
            } else {
                message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_OTHER_ERROR})`)
                newData.push(row);
                this.setState({data: newData, editingKey: ''});
            }
        });
    }

    // 状态：停用/启用 切换
    changeStatus = (form, record) => {
        const {tableType, onTableItemStateChangedListener} = this.props
        form.validateFields(async (error, row) => {
            // if (error) {
            //     return;
            // }
            let newData = [...this.state.data];
            const index = newData.findIndex(item => record.key === item.key);
            if (index > -1) {
                let item = newData[index];
                const validState = validStateList.filter(state => state.value === item.status)[0]
                const newStatus = validStateList.filter(state => state.value !== validState.value)[0].value

                let params = {
                    id: item.id,
                    status: newStatus, // 默认启用状态
                }
                let requestUrl = ''
                let requestMethod = 'POST'
                switch (tableType) {
                    case 'vendor_material_type_management':
                        requestUrl = `/factorySupplierMaterial/update/status/${newStatus === 1 ? 'start' : 'stop'}/${item.id}`
                        requestMethod = 'GET'
                        break
                    default:
                        break
                }

                const result = await this.callNetworkRequest({
                    requestUrl,
                    params,
                    requestMethod
                })

                if (result) {
                    item.status = newStatus
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    this.setState({
                        data: newData,
                        editingKey: ''
                    });

                    if (onTableItemStateChangedListener) {
                        onTableItemStateChangedListener(tableType, newData)
                    }
                } else {
                    message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL})`)
                }

            } else {
                message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_OTHER_ERROR})`)
                newData.push(row);
                this.setState({data: newData, editingKey: ''});
            }
        });
    }

    // 编辑
    edit = (key) => {
        this.setState({editingKey: key});
    }

    // 删除
    delete = async (key) => {
        const { tableType, onTableItemDeletedListener } = this.props
        let newData = [...this.state.data];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
            let params = {
                id:newData[index].id,
            }
            let requestUrl = ''
            let requestMethod = 'POST'
            switch (tableType) {
                case 'vendor_material_type_management':
                    requestUrl = `/factorySupplierMaterial/delete/${newData[index].id}`
                    requestMethod = 'GET'
                    break

                // 冲销操作，实际上与删除操作是一样的
                case 'shipped_infos':
                    requestUrl = `/order/update/offset/${newData[index].id}`
                    requestMethod = 'GET'
                    break
                default:
                    break
            }
            const result = await this.callNetworkRequest({
                requestUrl,
                params,
                requestMethod
            })

            // console.log('result =' ,result)
            if (result) {
                const item = newData[index];
                newData.splice(index, 1);
                newData = newData.map((data,index)=>({...data, index:index+1}))// 删除（或冲销）后，注意修改序号
                this.setState({
                    data: newData,
                    editingKey: ''
                }, () => {
                    if (onTableItemDeletedListener) {
                        onTableItemDeletedListener(tableType, item)
                    }
                });
            } else {
                message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL})`)
            }
        } else {
            console.log('delete button clicked! error!', key)
            message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_OTHER_ERROR})`)
        }
    }

    // 点击行的回调：传入参数订单的详情，之后使用该编号调用接口即可得到订单中的物料
    onRowClicked = (record) => {
        console.log('onRowClicked called', record)
        const {onRowClickedListener} = this.props
        if (onRowClickedListener) {
            onRowClickedListener(record)
        }
    }

    // 调用网络请求
    callNetworkRequest = async ({requestUrl, params, requestMethod}) => {
        let result
        if (requestMethod === 'POST') {
            result = await http.post(requestUrl, params)
        } else {
            result = await http.get(requestUrl)
        }
        console.log(`request: ${requestUrl}`, 'params:', params, 'result:', result)
        return result && result.ret === '200'
    }

    render() {
        const {tableType} = this.props
        const {vendorList, factoryList } = this.state
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = this.state.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    tableType,
                    record,
                    inputType: (col.dataIndex === 'unit' || col.dataIndex === 'status' || col.dataIndex === 'vendorName' || col.dataIndex === 'clientFactory') ? 'selector' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                    vendorList,
                    factoryList,
                }),
            };
        });

        return (
            <EditableContext.Provider value={this.props.form}>
                <Table
                    className="data-board-table"
                    // bodyStyle={{minHeight: 'calc(100vh - 280px)', maxHeight: 'calc(100vh - 280px)'}}
                    components={components}
                    bordered
                    dataSource={this.state.data}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: this.cancel,
                    }}
                    onRow={(record) => {
                        return {
                            onClick: (event) => {
                                // 点击行: 只有在非编辑状态冰球没有点击编辑按钮，才可以响应行点击事件
                                if (!this.isEditing(record)) {
                                    this.onRowClicked(record)
                                }
                            },
                            // onDoubleClick: (event) => {},
                            // onContextMenu: (event) => {},
                            // onMouseEnter: (event) => {},  // 鼠标移入行
                            // onMouseLeave: (event) => {}
                        };
                    }}
                />
            </EditableContext.Provider>
        );
    }
}

const EditableFormTable = Form.create()(_ShippingTableTypeB);

export const ShippingTableTypeB = EditableFormTable;

const OperationArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const OperationButton = styled.a`
  margin-left:4%; 
  margin-right:4%; 
  color:${p => (p.disabled ? 'gray' : p.color)};
`