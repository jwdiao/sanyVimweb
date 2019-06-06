/**
 * 发货相关的Table 类型A:
 * 此类Table具备批量操作的功能、且可以编辑行
 * 如：[信息管理-发货管理]页面的table
 */
import React, {Component} from 'react';
import {Table, Form, Select, Input, Popconfirm, message, DatePicker} from 'antd';
import {
    orderStatusList,
    toBeShippedTableColumns,
    ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL,
    ERROR_CODE_ADMIN_SANY_FACTORY_OTHER_ERROR,
    http, isEmpty
} from "../../../utils";
import styled from "styled-components";
import {TableButton} from "../../admin/components/TableButton";
import moment from "moment";

const FormItem = Form.Item;
const EditableContext = React.createContext();

const Option = Select.Option

function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
}

class EditableCell extends React.Component {
    getInput = (columnId) => {
        const {factoryList, inputType} = this.props
        if (inputType === 'selector') {
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
        } else if (inputType === 'date_picker') {
            return <DatePicker
                style={{width: '100%'}}
                placeholder="请选择预到日期"
                disabledDate={disabledDate}
                // onChange={onExpectedDateChangedCalled}
            />
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

        // if(dataIndex && record){
        //     console.log('dataIndex', dataIndex, 'record[dataIndex]', record[dataIndex])
        // }

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
                                            initialValue: dataIndex === 'expectReachDate'? moment(record[dataIndex]): record[dataIndex],
                                        })(this.getInput(dataIndex))}
                                    </FormItem>
                                ) : (
                                    dataIndex === 'status' && tableType === 'to_be_shipped_infos' && record[dataIndex] !== ''
                                        ? orderStatusList.filter(status => status.value === parseInt(record[dataIndex]))[0].label //避免使用字面量作为value: 如 value为1,2,3...，显示的是'待发货/待发货'
                                        : (
                                            dataIndex === 'clientFactory' && tableType === 'to_be_shipped_infos' && record[dataIndex] !== ''
                                                ? factoryList.filter(factory => factory.value === record[dataIndex])[0].label
                                                : (
                                                    dataIndex === 'expectReachDate' && tableType === 'to_be_shipped_infos' && record[dataIndex] !== ''
                                                        ? moment(record[dataIndex]).format('YYYY-MM-DD')
                                                        : restProps.children
                                                )
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
            data: null,
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
                                            <TableButton
                                                type={'save'}
                                                onClick={(event) => {
                                                    this.save(form, record)
                                                    event.stopPropagation()
                                                }}
                                            />
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
                                        <TableButton
                                            type='cancel'
                                        />
                                    </Popconfirm>
                                </OperationArea>
                            ) : (
                                <OperationArea>
                                    <TableButton
                                        disabled={editingKey !== ''}
                                        type='edit'
                                        onClick={(event) => {
                                            this.edit(record.key)
                                            // 防止与行点击事件冲突
                                            event.stopPropagation()
                                        }}
                                    />

                                    <TableButton
                                        disabled={editingKey !== ''}
                                        type='duplicate'
                                        onClick={(event) => {
                                            this.duplicate(record.key)
                                            event.stopPropagation()
                                        }}
                                    />

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
                                        <TableButton
                                            disabled={editingKey !== ''}
                                            type='delete'
                                            onClick={event => {
                                                event.stopPropagation()
                                            }}
                                        />
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
        // console.log('save === factoryList =', factoryList)
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
                    case 'to_be_shipped_infos':
                        requestUrl = '/order/save'
                        params = Object.assign({}, params, {
                            factoryCode: row.clientFactory,// 修改客户工厂
                            transportTime: row.expectReachDate,// 修改运输周期
                            // saveName: row.operator,// 修改操作员
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
                    if (result.ret === '200') {
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
                        message.success('操作成功！')
                    } else {
                        message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL})`)
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

    // 复制
    duplicate = async (key) => {
        const {tableType, userInfo} = this.props
        let newData = [...this.state.data];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
            const result = await this.callNetworkRequest({
                requestUrl:'/order/copy',
                params:{ id:newData[index].id, operatorName: userInfo.userName },
                requestMethod:'POST'
            })

            if (result && result.ret === '200') {
                message.success('发货单复制成功！')
                if (this.props.onTableItemDuplicatedListener) {
                    this.props.onTableItemDuplicatedListener(tableType)
                }
            } else {
                message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_SUBMIT_FAIL})`)
            }
        } else {
            console.log('delete button clicked! error!', key)
            message.error(`数据提交失败！请稍候重试。(${ERROR_CODE_ADMIN_SANY_FACTORY_OTHER_ERROR})`)
        }
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

            console.log('rrrrrr', result)

            if (result) {
                if (result.ret === '200'){
                    const item = newData[index];
                    newData.splice(index, 1);
                    newData = newData.map((data, index) => ({...data, index: index + 1}))// 删除后，注意修改序号
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
                    message.success('操作成功！')
                } else {
                    message.error(`删除失败！${result.msg}`)
                }
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
        return result
    }

    render() {
        const {tableType} = this.props
        const {data, selectedRowKeys, factoryList} = this.state;
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
                        (
                            col.dataIndex === 'clientFactory')
                            ? 'selector'
                            : (
                                col.dataIndex === 'expectReachDate'
                                    ? 'date_picker'
                                    : 'text'
                            ),
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
                    bordered={false}
                    dataSource={data}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={{
                        showQuickJumper: true,
                        onChange: this.cancel,
                    }}
                    loading={data===null}
                    onRow={(record) => {
                        return {
                            onClick: (event) => {
                                // 点击行: 只有在非编辑状态并且没有点击编辑按钮，才可以响应行点击事件
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

const EditableFormTable = Form.create()(_ShippingTableTypeA);
export const ShippingTableTypeA = EditableFormTable;

const OperationArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`