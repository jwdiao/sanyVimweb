import React, {Component} from 'react';
import {Form, Input, Popconfirm, Table, Select, message} from "antd";
import freshId from 'fresh-id'
import styled from 'styled-components'
import {
    sanyFactoryTableColumns,
    vendorsTableColumns,
    userTableColumns,
    basicMaterialTypeTableColumns,
    roleList,
    validStateList,
    http,
    TABLE_OPERATION_DELETE,
    TABLE_OPERATION_EDIT,
    TABLE_OPERATION_STATUS, ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL, ERROR_CODE_ADMIN_SANY_FACTORY_OTHER_ERROR
} from "../../../utils";

const FormItem = Form.Item;
const EditableContext = React.createContext();

const Option = Select.Option

class EditableCell extends React.Component {

    getInput = (columnId, record) => {
        const {_unitList, _vendorList, inputType} = this.props
        if (inputType === 'selector') {
            let options = []
            switch (columnId) {
                case 'status':
                    options = validStateList
                    break
                case 'role':
                    options = roleList
                    break
                case 'unit':
                    options = _unitList
                    break
                case 'vendor':
                    options = _vendorList
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
                                            columnId === 'role'
                                                ? roleList.filter(role => role.value === option.value)[0].value
                                                : (
                                                    columnId === 'unit'
                                                        ? _unitList.filter(unit => unit.label === option.label)[0].label
                                                        : (
                                                            columnId === 'vendor'
                                                                ? _vendorList.filter(vendor => vendor.value === option.value)[0].value
                                                                : option.value
                                                        )
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
        } else if (inputType === 'multi_selector') {
            console.log('record', record)
            return <Select
                style={{width: '100%'}}
                mode="multiple"
            >
                {
                    _vendorList.map(option => {
                        return (
                            <Option
                                key={freshId()}
                                value={
                                    columnId === 'vendor'
                                        ? _vendorList.filter(vendor => vendor.value === option.value)[0].value
                                        : option.value
                                }
                            >
                                {option.label}
                            </Option>
                        )
                    })
                }
            </Select>
        }
        return <Input/>;
    };

    render() {
        const {
            _unitList,
            _vendorList,
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        // console.log('renderrenderrender',this.props)
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const {getFieldDecorator} = form;

                    let vendorInitialValueList = []
                    // 特殊处理：供应商列表是多选，设定默认值时，提前计算
                    if (dataIndex === 'vendor' && record[dataIndex].length > 0) {
                        console.log('----', record[dataIndex], 'length', record[dataIndex].length)
                        const splittedVendorName = record[dataIndex].substr(0, record[dataIndex].length - 1)
                        const splittedVendorNameList = splittedVendorName.split(',').filter(i => i !== '')
                        console.log('splittedVendorNameList', splittedVendorNameList)
                        vendorInitialValueList = splittedVendorNameList.map((vendorName => {
                            return _vendorList.filter(vendor => vendor.label === vendorName)[0].value
                        }))
                        console.log('vendorInitialValueList', vendorInitialValueList)
                    }

                    return (
                        <td {...restProps}>
                            {
                                editing ? (
                                    <FormItem style={{margin: 0}}>
                                        {getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `请输入 ${title}!`,
                                            }],
                                            initialValue: dataIndex === 'vendor' ? vendorInitialValueList : record[dataIndex],
                                        })(this.getInput(dataIndex, record))}
                                    </FormItem>
                                ) : (
                                    dataIndex === 'status' && record[dataIndex] !== ''
                                        ? validStateList.filter(status => status.value === parseInt(record[dataIndex]))[0].label //避免使用字面量作为value: 如 value为1,2,3...，显示的是'待发货/待发货'
                                        : (
                                            dataIndex === 'role' && record[dataIndex] !== ''
                                                ? roleList.filter(role => role.value === parseInt(record[dataIndex]))[0].label
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

class _AdminTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [],
            editingKey: '',
            currentPage: 1,

            //
            _unitList: [],
            _vendorList: [],
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
        const result1 = await http.get('/dynamicProperty/find/type/units')
        if (result1.ret === '200') {
            this.setState({
                _unitList: result1.data.map(item => ({key: `unit_${item.code}`, value: item.code, label: item.name}))
            })
        } else {
            message.error('获取物料单位失败！请稍候重试。')
        }

        const result2 = await http.post('/supplier/supplierList', {})
        if (result2.ret === '200') {
            this.setState({
                _vendorList: result2.data.content.map(item => ({
                    key: `vendor_${item.code}`,
                    value: item.code,
                    label: item.name
                }))
            })
        } else {
            message.error('获取供应商列表失败！请稍候重试。')
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        console.log('componentWillReceiveProps called', nextProps)
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
            case 'sany_factory':
                baseColumnsArray = sanyFactoryTableColumns
                break
            case 'vendor':
                baseColumnsArray = vendorsTableColumns
                break
            case 'user':
                baseColumnsArray = userTableColumns
                break
            case 'basic_material_type_management':
                baseColumnsArray = basicMaterialTypeTableColumns
                break
            default:
                break
        }
        return baseColumnsArray.concat(this.getOperationFields(tableType))
    }

    getOperationFields = () => {
        return [
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
    }

    isEditing = record => record.key === this.state.editingKey;

    // 取消
    cancel = () => {
        this.setState({editingKey: ''});
    };

    // 保存
    save = (form, record) => {
        const {tableType} = this.props
        const {_unitList, _vendorList} = this.state
        // console.log('_unitList', _unitList, '_vendorList', _vendorList)
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
                    status: row.status,
                }
                let requestUrl = ''
                switch (tableType) {
                    case 'sany_factory':
                        requestUrl = '/factory/addOrUpdateFactory'
                        params = Object.assign({}, params, {
                            code: row.sanyId,
                            name: row.sanyName,
                        })
                        break
                    case 'vendor':
                        requestUrl = '/supplier/addOrUpdateSupplier'
                        params = Object.assign({}, params, {
                            code: row.vendorCode,
                            name: row.vendorName,
                        })
                        break
                    case 'user':
                        requestUrl = '/user/addOrUpdateUser'
                        let vendorStr = ''
                        if (typeof row.vendor === 'string') {
                            vendorStr = row.vendor + ','
                        } else {
                            row.vendor.forEach(v => {
                                if (v !== '') {
                                    vendorStr += v + ','
                                }
                            })
                        }
                        // console.log('vendorStr =',vendorStr)
                        params = Object.assign({}, params, {
                            userName: row.userName,
                            name: row.name,
                            // password:row.password,
                            phone: row.mobile,
                            supplierCode: vendorStr,
                            type: row.role,
                        })
                        break
                    // TODO：基础物料管理，接口没有提供修改状态的接口
                    case 'basic_material_type_management':
                        requestUrl = '/material/save'
                        params = Object.assign({}, params, {
                            code: row.material,
                            name: row.materialDescription,
                            units: _unitList.filter(unit => unit.label === row.unit)[0].label,// TODO: 从sessionStorage中获取，这里要改下，不应该每次都从后端获取
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
                    // 对基础物料信息的 单位显示，要特别处理
                    if (tableType === 'basic_material_type_management') {
                        newData.splice(index, 1, {
                            ...item,
                            ...row,
                            unit: _unitList.filter(unit => unit.label === row.unit)[0].label // 基础物料信息：注意单位这里，需要使用label进行显示
                        });
                    } else if (tableType === 'user') {
                        let newVendor = ''
                        if (typeof row.vendor === 'string') {
                            const vendorString = _vendorList.filter(item => item.value === row.vendor)[0].label
                            newVendor = vendorString + ','
                        } else {
                            row.vendor.forEach(v => {
                                if (v !== '') {
                                    const vendorString = _vendorList.filter(item => item.value === v)[0].label
                                    newVendor += vendorString + ','
                                }
                            })
                        }

                        console.log('newVendor', newVendor)
                        newData.splice(index, 1, {
                            ...item,
                            ...row,
                            vendor: newVendor,
                        });
                    } else {
                        newData.splice(index, 1, {
                            ...item,
                            ...row,

                        });
                    }

                    this.setState({
                        data: newData,
                        editingKey: ''
                    });
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
        const {tableType} = this.props
        form.validateFields(async (error, row) => {
            if (error) {
                return;
            }

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
                    case 'sany_factory':
                        requestUrl = '/factory/addOrUpdateFactory'
                        break
                    case 'vendor':
                        requestUrl = '/supplier/addOrUpdateSupplier'
                        break
                    case 'user':
                        requestUrl = '/user/addOrUpdateUser'
                        break
                    // 基础物料管理的启用停用，不同，单独处理
                    case 'basic_material_type_management':
                        requestUrl = `/material/update/status/${newStatus === 1 ? 'start' : 'stop'}/${item.id}`
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
                    item.status = newStatus
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });

                    this.setState({
                        data: newData,
                        editingKey: ''
                    });
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
        const {tableType} = this.props
        let newData = [...this.state.data];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
            let params = {
                id: newData[index].id,
            }
            let requestUrl = ''
            let requestMethod = 'POST'
            switch (tableType) {
                case 'sany_factory':
                    requestUrl = '/factory/deleteFactory'
                    break
                case 'vendor':
                    requestUrl = '/supplier/deleteSupplier'
                    break
                case 'user':
                    requestUrl = '/user/deleteUser'
                    break
                case 'basic_material_type_management':
                    requestUrl = `/material/delete/${newData[index].id}`
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
                newData.splice(index, 1)
                newData = newData.map((data, index) => ({...data, index: index + 1}))// 删除后，注意修改序号
                this.setState({
                    data: newData,
                    editingKey: ''
                });
            } else {
                message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL})`)
            }

        } else {
            console.log('delete button clicked! error!', key)
            message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_OTHER_ERROR})`)
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


    // 分页导航的监听
    onPageChange = (page, pageSize) => {
        this.cancel()
        // console.log('onPageChange called!', page,pageSize)
    }

    render() {
        const {_unitList, _vendorList, columns: _columns} = this.state
        console.log('_vendorList', _vendorList)
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = _columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    _unitList,
                    _vendorList,
                    inputType: (col.dataIndex === 'status' || col.dataIndex === 'role' || col.dataIndex === 'unit')
                        ? 'selector'
                        : (
                            col.dataIndex === 'vendor'
                                ? (
                                    record.role === 3
                                        ? 'multi_selector'
                                        : (
                                            record.role === 4 || record.role === 5
                                                ? 'selector'
                                                : 'text'
                                        )
                                )
                                : 'text'
                        ),
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
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
                        total: this.state.data.length,
                        // defaultCurrent:this.state.currentPage,
                        onChange: this.onPageChange,
                    }}
                />
            </EditableContext.Provider>
        );
    }
}

const EditableFormTable = Form.create()(_AdminTable);
export const AdminTable = EditableFormTable;

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