/**
 * 发货相关的Table 类型B:
 * 此类Table不具备批量操作的功能，但可以编辑行
 * 如：[信息管理-工厂发货信息]页面的table
 */
import React, {Component} from 'react';
import {Form, Input, Popconfirm, Select, Table} from "antd";
import {
    materialTypeTableColumns,
    shippedTableColumns,
    TABLE_OPERATION_DELETE,
    TABLE_OPERATION_DUPLICATE,
    TABLE_OPERATION_EDIT,
    TABLE_OPERATION_REVERSE, TABLE_OPERATION_STATUS,
    toBeShippedTableColumns,
    unitMap,
    validStateMap
} from "../../../utils";
import styled from "styled-components";

const FormItem = Form.Item;
const EditableContext = React.createContext();

const Option = Select.Option

class EditableCell extends React.Component {
    getInput = (columnId) => {
        if (this.props.inputType === 'selector') {
            let options = []
            switch (columnId) {
                case 'unit':
                    options = unitMap
                    break
                case 'status':
                    options = validStateMap
                    break
                default:
                    break
            }
            return <Select>
                {
                    options.map(option => {
                        return (
                            <Option
                                value={
                                    columnId==='status'
                                        ? validStateMap.filter(state=> state.label === option.label)[0].label
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
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{margin: 0}}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `请输入 ${title}!`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(this.getInput(dataIndex))}
                                </FormItem>
                            ) : restProps.children}
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
                baseColumnsArray = toBeShippedTableColumns
                break
            case 'shipped_infos':
                baseColumnsArray = shippedTableColumns
                break
            case 'material_type_management':
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
                                            onClick={() => this.duplicate(record.key)}
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
                                        onConfirm={() => this.reverseRecord(record.key)}
                                    >
                                        <OperationButton
                                            disabled={editingKey !== ''}
                                            color={TABLE_OPERATION_REVERSE}
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
            case 'material_type_management':
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
                                                        onClick={() => this.save(form, record.key)}
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
                                                            title={record.status === '停用'? "确定启用吗?" : "确定停用吗?" }
                                                            onConfirm={() => this.changeStatus(form, record)}
                                                        >
                                                            <OperationButton
                                                                disabled={editingKey !== ''}
                                                                color={TABLE_OPERATION_STATUS}
                                                            >
                                                                {record.status === '启用'? "停用" : "启用" }
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
    duplicate = (key) => {
        console.log('duplicate button called!',key)
        const {tableType, onTableItemDuplicatedListener} = this.props
        // Todo: 调用后台接口，复制数据至待发货
        if (onTableItemDuplicatedListener) {
            let newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.key);
            const item = newData[index];
            onTableItemDuplicatedListener(tableType, item)
        }
    }

    // 冲销
    reverseRecord = (key) => {
        console.log('reverseRecord button called!',key)
    }

    // 保存
    save = (form, key) => {
        console.log('save button clicked!', key)
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            let newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({
                    data: newData,
                    editingKey: ''
                });
                const {tableType, onTableItemEditedListener} = this.props
                if (onTableItemEditedListener) {
                    onTableItemEditedListener(tableType, newData)
                }
            } else {
                newData.push(row);
                this.setState({data: newData, editingKey: ''});
            }
        });
    }

    // 状态：停用/启用 切换
    changeStatus = (form, record) => {
        console.log('changeStatus button clicked!', record)
        form.validateFields((error, row) => {
            // if (error) {
            //     return;
            // }
            let newData = [...this.state.data];
            const index = newData.findIndex(item => record.key === item.key);
            if (index > -1) {
                let item = newData[index];
                const validState = validStateMap.filter(state=> state.label === item.status)[0]
                item.status = validStateMap.filter(state=> state.value === (!validState.value))[0].label
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({
                    data: newData,
                    editingKey: ''
                });
                const {tableType, onTableItemStateChangedListener} = this.props
                if (onTableItemStateChangedListener) {
                    onTableItemStateChangedListener(tableType, newData)
                }
            } else {
                newData.push(row);
                this.setState({data: newData, editingKey: ''});
            }
        });
    }

    // 编辑
    edit = (key) => {
        console.log('edit button clicked!', key)
        this.setState({
            editingKey: key,
        });
    }

    // 删除
    delete = (key) => {
        console.log('delete button clicked!', key)
        let newData = [...this.state.data];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1);
            this.setState({
                data: newData,
                editingKey: ''
            }, ()=>{
                const {onTableItemDeletedListener} = this.props
                if (onTableItemDeletedListener) {
                    onTableItemDeletedListener(this.props.tableType, item)
                }
            });
        } else {
            console.log('delete button clicked! error!',key)
        }
    }

    render() {
        const {tableType} = this.props

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
                    record,
                    inputType: (col.dataIndex === 'unit' || col.dataIndex === 'status') ? 'selector' : 'text',
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
                        onChange: this.cancel,
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