/**
 * 发货相关的Table 类型A:
 * 此类Table具备批量操作的功能、且可以编辑行
 * 如：[信息管理-待发货信息]页面的table
 */
import React, {Component} from 'react';
import {Table, Button, Form, Select, Input, Popconfirm, InputNumber} from 'antd';
import {
    goodsStatusMap,
    materialTypeMap,
    PRIMARY_COLOR,
    toBeShippedTableColumns
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
                case 'goodsStatus':
                    options = goodsStatusMap
                    break
                case 'materialType':
                    options = materialTypeMap
                    break
                default:
                    break
            }
            return <Select>
                {
                    options.map(option => {
                        return (
                            <Option
                                key={option.key}
                                value={option.value}>
                                {option.label}
                            </Option>
                        )
                    })
                }
            </Select>
        } else if (this.props.inputType === 'number_input') {
            return <InputNumber min={1}/>
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
                                            message: `请输入${title}!`,
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

class _ShippingTableTypeA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [],
            editingKey: '',
            //
            selectedRowKeys: [], // Check here to configure the default column
            loading: false,
        };
    }

    start = () => {
        this.setState({loading: true});
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeys});
        const {onTableItemsSelectedListener} = this.props
        if (onTableItemsSelectedListener) {
            onTableItemsSelectedListener(selectedRowKeys)
        }
    }

    componentWillMount() {
        console.log('shippingtableA componentWillMount called', this.props)
        //Todo:For test only
        const {tableType, dataSet,selectedRowKeys} = this.props
        let tableFields = this.constructTableFields(tableType)
        this.setState({
            data: dataSet,
            columns: tableFields,
            selectedRowKeys
        })
    }

    componentWillReceiveProps(nextProps, nextState) {
        console.log('componentWillReceiveProps called', nextProps, this.props)
        const {tableType: tableTypeThis, selectedRowKeys: selectedRowKeysThis, dataSet: dataSetThis} = this.props
        const {tableType: tableTypeNext, selectedRowKeys: selectedRowKeysNext, dataSet: dataSetNext} = nextProps
        if (tableTypeThis !== tableTypeNext) {
            console.log('componentWillReceiveProps entered')
            let tableFields = this.constructTableFields(tableTypeNext)
            this.setState({
                columns: tableFields,
            })
        }

        if (dataSetThis !== dataSetNext) {
            this.setState({
                data: dataSetNext,
            })
        }

        if (selectedRowKeysThis !== selectedRowKeysNext) {
            this.setState({
                selectedRowKeys: selectedRowKeysNext
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
            case 'to_be_shipped_infos':
                baseColumnsArray = toBeShippedTableColumns
                break
            default:
                break
        }
        return baseColumnsArray.concat(this.getOperationFields())
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
                                    <OperationButton
                                        disabled={editingKey !== ''}
                                        color={PRIMARY_COLOR}
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
                                            color="#ff404a"
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
    save = (form, key) => {
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

    // 停用
    freeze = (key) => {
        console.log('changeStatus button clicked!', key)
    }

    // 编辑
    edit = (key) => {
        this.setState({
            editingKey: key,
            selectedRowKeys:[]
        },()=>{
            const {onTableItemsSelectedListener} = this.props
            if (onTableItemsSelectedListener) {
                onTableItemsSelectedListener(this.state.selectedRowKeys)
            }
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
                editingKey: '',
                selectedRowKeys:[]
            }, ()=>{
                const {onTableItemsSelectedListener,onTableItemDeletedListener} = this.props
                if (onTableItemsSelectedListener) {
                    onTableItemsSelectedListener(this.state.selectedRowKeys)
                }
                if (onTableItemDeletedListener) {
                    onTableItemDeletedListener(this.props.tableType, item)
                }
            });
        } else {
            console.log('delete button clicked! error!', key)
        }
    }

    render() {
        const {loading, selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        // const hasSelected = selectedRowKeys.length > 0;

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
                    inputType:
                        (col.dataIndex === 'goodsStatus' || col.dataIndex === 'materialType')
                            ? 'selector'
                            : (col.dataIndex === 'materialAmount'
                                ? 'number_input'
                                : 'text'),
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
                    rowSelection={rowSelection}
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

const EditableFormTable = Form.create()(_ShippingTableTypeA);
export const ShippingTableTypeA = EditableFormTable;

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