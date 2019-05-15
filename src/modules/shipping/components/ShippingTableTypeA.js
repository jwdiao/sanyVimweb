/**
 * 发货相关的Table 类型A:
 * 此类Table具备批量操作的功能、且可以编辑行
 * 如：[信息管理-待发货信息]页面的table
 */
import React, {Component} from 'react';
import {Table, Form, Select, Input, Popconfirm, InputNumber, message} from 'antd';
import {
    orderStatusList,
    materialTypeMap,
    PRIMARY_COLOR,
    toBeShippedTableColumns,
    ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL,
    ERROR_CODE_ADMIN_SANY_FACTORY_OTHER_ERROR,
    http
} from "../../../utils";
import styled from "styled-components";

const FormItem = Form.Item;
const EditableContext = React.createContext();

const Option = Select.Option

class EditableCell extends React.Component {
    getInput = (columnId) => {
        const {factoryList} = this.props
        if (this.props.inputType === 'selector') {
            let options = []
            switch (columnId) {
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
                                key={option.key}
                                value={option.value}
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
            tableType,
            factoryList,
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;

        // 防止factoryList数据尚未返回时，undefined
        if (dataIndex === 'clientFactory' && tableType === 'to_be_shipped_infos' && isEmpty(factoryList)) return null
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
                                    dataIndex === 'status' && tableType === 'to_be_shipped_infos' && record[dataIndex] !== ''
                                        ? orderStatusList.filter(status => status.value === parseInt(record[dataIndex]))[0].label //避免使用字面量作为value: 如 value为1,2,3...，显示的是'待发货/待发货'
                                        : (
                                            dataIndex === 'clientFactory' && tableType === 'to_be_shipped_infos' && record[dataIndex] !== ''
                                                ? factoryList.filter(factory => factory.value === record[dataIndex])[0].label
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

            //
            factoryList: []
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
        // console.log('shippingtableA componentWillMount called', this.props)
        //Todo:For test only
        const {tableType, dataSet, selectedRowKeys} = this.props
        let tableFields = this.constructTableFields(tableType)
        this.setState({
            data: dataSet,
            columns: tableFields,
            selectedRowKeys
        })
    }

    async componentDidMount() {
        const result = await http.post('/factory/factoryList', {})
        if (result.ret === '200') {
            this.setState({
                factoryList: result.data.content.map(item => ({
                    key: `factory_${item.code}`,
                    value: item.code,
                    label: item.name
                }))
            })
        } else {
            message.error('获取工厂列表失败！请稍候重试。')
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        // console.log('componentWillReceiveProps called', nextProps, this.props)
        const {tableType: tableTypeThis, selectedRowKeys: selectedRowKeysThis, dataSet: dataSetThis} = this.props
        const {tableType: tableTypeNext, selectedRowKeys: selectedRowKeysNext, dataSet: dataSetNext} = nextProps
        if (tableTypeThis !== tableTypeNext) {
            // console.log('componentWillReceiveProps entered')
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
                                                onClick={(event) => {
                                                    this.save(form, record)
                                                    event.stopPropagation()
                                                }}
                                                style={{marginRight: 8}}
                                            >
                                                保存
                                            </a>
                                        )}
                                    </EditableContext.Consumer>
                                    <Popconfirm
                                        title="确定取消吗?"
                                        onConfirm={(event) => {
                                            this.cancel(record.key)
                                            event.stopPropagation()
                                        }}
                                        onCancel={(event) => {
                                            event.stopPropagation()
                                        }}
                                    >
                                        <a>取消</a>
                                    </Popconfirm>
                                </OperationArea>
                            ) : (
                                <OperationArea>
                                    <OperationButton
                                        disabled={editingKey !== ''}
                                        color={PRIMARY_COLOR}
                                        onClick={(event) => {
                                            this.edit(record.key)
                                            // 防止与行点击事件冲突
                                            event.stopPropagation()
                                        }}
                                    >
                                        编辑
                                    </OperationButton>

                                    <Popconfirm
                                        title="确定删除吗?"
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
                                            color="#ff404a"
                                            onClick={event => {
                                                event.stopPropagation()
                                            }}
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
        this.setState({
            editingKey: '',
        });
    };

    // 保存
    save = (form, record) => {
        const {tableType, onTableItemEditedListener} = this.props
        const {factoryList} = this.state
        // console.log('save === factoryList =', factoryList)
        form.validateFields(async (error, row) => {
            if (error) {
                return;
            }
            let newData = [...this.state.data];
            const index = newData.findIndex(item => record.key === item.key);
            if (index > -1) {
                const item = newData[index];
                // console.log('item=', item, 'row=', row)

                let params = {
                    id: item.id,
                    // status:row.status,
                }
                let requestUrl = ''
                switch (tableType) {
                    case 'to_be_shipped_infos':
                        requestUrl = '/order/save'
                        params = Object.assign({}, params, {
                            factoryCode: row.clientFactory,// 修改客户工厂
                            transportTime: row.transportPeriod,// 修改运输周期
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
                        editingKey: '',
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

    // 编辑
    edit = (key) => {
        this.setState({
            editingKey: key,
            selectedRowKeys: [],
        }, () => {
            const {onTableItemsSelectedListener} = this.props
            if (onTableItemsSelectedListener) {
                onTableItemsSelectedListener(this.state.selectedRowKeys)
            }
        });
    }

    // 删除
    delete = async (key) => {
        const {tableType, onTableItemsSelectedListener, onTableItemDeletedListener} = this.props
        let newData = [...this.state.data];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
            let params = {
                id: newData[index].id,
            }

            let requestUrl = `/order/delete/code/${newData[index].number}`
            let requestMethod = 'GET'

            const result = await this.callNetworkRequest({
                requestUrl,
                params,
                requestMethod
            })

            if (result) {
                const item = newData[index];
                newData.splice(index, 1);
                this.setState({
                    data: newData,
                    editingKey: '',
                    selectedRowKeys: [],
                }, () => {
                    if (onTableItemsSelectedListener) {
                        onTableItemsSelectedListener(this.state.selectedRowKeys)
                    }
                    if (onTableItemDeletedListener) {
                        onTableItemDeletedListener(tableType, item)
                    }
                });
            } else {
                message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL})`)
            }
        } else {
            // console.log('delete button clicked! error!', key)
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
        const {selectedRowKeys, factoryList} = this.state;
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
                    tableType,
                    record,
                    inputType:
                        (col.dataIndex === 'clientFactory')
                            ? 'selector'
                            : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                    factoryList: factoryList,
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

function isEmpty(testString) {
    return !testString || testString.length === 0 || testString === ''
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