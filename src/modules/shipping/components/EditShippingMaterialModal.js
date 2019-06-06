/**
 * 修改待发货物料信息的Modal
 * 因为比较特殊，单独写一个Component
 */
import React, {Component} from 'react';
import {
    Modal,
    Table,
    Button,
    Popconfirm,
    Form, Select, InputNumber, message, AutoComplete,
} from 'antd';
import styled from "styled-components";
import freshId from 'fresh-id'
import {
    http, isEmpty,
} from "../../../utils";
import {TableButton} from "../../admin/components/TableButton";

const modalTitleMap = {
    'to_be_shipped_infos': '查看和修改待发货信息',
}

const FormItem = Form.Item;
const EditableContext = React.createContext();

const Option = Select.Option
const _ = require('lodash')

class EditableCell extends React.Component {
    state={
        // AutoComplete 组件所需数据源
        dataSource:[],
    }
    materialCodeListener = ({materialCode, materialObject}) => {
        const {record, handleMaterialCodeChanged} = this.props
        // // console.log('materialCodeListener called', record)
        handleMaterialCodeChanged({record, materialCode, materialObject})
    }

    materialQuantityListener = (quantity) => {
        const {record, handleMaterialQuantityChanged} = this.props
        // // console.log('materialQuantityListener called', record)
        handleMaterialQuantityChanged(record, quantity)
    }

    getInput = (columnId) => {
        if (this.props.inputType === 'selector') {
            let options = []
            switch (columnId) {
                case 'vendorName':
                    options = []
                    break
                // case 'material':
                //     options = materialTypeMap
                //     break
                default:
                    break
            }
            return (
                <Select>
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
            )
        } else if (this.props.inputType === 'number_input') {
            return (
                <InputNumber
                    style={{width: '100%'}}
                    placeholder="请输入数值"
                    min={1}
                />
            )
        } else if (this.props.inputType === 'input') {
            return (
                <AutoComplete
                    dataSource={this.state.dataSource}
                    style={{width: '100%'}}
                    onSearch={this.handleSearch}
                    placeholder="请输入物料编号"
                />
            )
        } else {
            return null
        }

    };

    // AutoComplete组件监听
    handleSearch = async value => {
        if (value.length < 3) {
            this.setState({
                dataSource: []
            })
            return
        }
        const result = await http.post('/factorySupplierMaterial/find/all',{
            // materialCode: value,
            supplierCode: this.props.userSpecifiedVendor.value
        })
        console.log('handleSearch', result)
        if (!isEmpty(value)) {
            if (result.ret === '200' && result.data.content.length>0) {
                this.setState({
                    dataSource: !value ? [] : _.uniq(result.data.content.map(content=>content.materialCode).filter(content=>content.indexOf(value) > -1)),
                })
            } else {
                this.setState({
                    dataSource: []
                })
            }
        }
    };

    // 根据物料获取物料名
    getVendorMaterialNameValidator = async (rule, value, callback, source, options) => {
        // let errors = [];
        const result = await http.post('/factorySupplierMaterial/find/all ', {
            materialCode: value,
        })
        // // console.log('getMaterialNameValidator', result)
        if (!isEmpty(value)) {
            if (result.ret === '200' && result.data.content.length > 0) {
                this.materialCodeListener({materialCode: value, materialObject: result.data.content[0]})
                callback()
            } else {
                // this.materialCodeListener(value,'--')
                callback('未找到该编号对应的物料！')
            }
        } else {
            callback('请输入物料编号！')
        }
    }

    // 物料数量的校验器
    getVendorMaterialNumValidator = (rule, value, callback, source, options) => {
        if (!isEmpty(value)) {
            if (/^[0-9]*$/.test(value)) {
                if (value <= 0) {
                    callback('数量不能小于1！')
                } else {
                    this.materialQuantityListener(value)
                    callback()
                }
            } else {
                callback('请输入整数！')
            }
        }
        callback()
    }

    render() {
        const {
            userSpecifiedVendor,
            inputType,
            editing,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            handleMaterialCodeChanged,
            handleMaterialQuantityChanged,
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
                                            rules: [
                                                {required: true, message: `${title}必填`},
                                                {validator: dataIndex === 'material' ? this.getVendorMaterialNameValidator : this.getVendorMaterialNumValidator}
                                            ],
                                            initialValue: record[dataIndex],
                                        })(this.getInput(dataIndex))}
                                    </FormItem>
                                ) : (
                                    restProps.children
                                )
                            }
                        </td>

                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

class EditableTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editingKey: '',

            columns: this.constructTableColumns(),
            dataSource: [],
        };
    }

    async componentDidMount() {
        const {order, onMaterialListChangedListener} = this.props
        if (_.isEmpty(order)) return
        let oData = await this.getMaterialList(order)
        this.setState({
            dataSource: oData.map((material, index) => {
                return {
                    key: freshId(),
                    rowIndex: index +1,
                    id:material.id,
                    material: material.materiaCode,
                    description: material.materiaName,
                    unit: material.units,
                    quantity: material.materiaNum,
                    state: material.status,
                }
            })
        }, () => {
            // 传递给外层父组件物料列表
            if (onMaterialListChangedListener) {
                onMaterialListChangedListener(this.state.dataSource)
            }
        })
    }

    getMaterialList = async (order) => {
        let orderId = order.number ? order.number : order.generatedNumber // TODO：对于报表管理-冲销信息查询，没有number这个字段，使用生成号码来查询，但是查不出来
        let result = await http.get(
            `/orderMaterial/find/ordercode/${orderId}`,
        )
        if (result) {
            const materialList = result.data
            // console.log('materialList', materialList)
            return materialList
        }
        return []
    }

    constructTableColumns = () => {
        return [
            {
                title: '序号',
                dataIndex: 'rowIndex',
                width: '10%',
                editable: false,
            },
            {
                title: '物料编码',
                dataIndex: 'material',
                width: '22%',
                editable: true,
            }, {
                title: '物料描述',
                dataIndex: 'description',
                width: '23%',
                editable: false,
            }, {
                title: '单位',
                dataIndex: 'unit',
                width: '10%',
                editable: false,
            }, {
                title: '数量',
                dataIndex: 'quantity',
                width: '15%',
                editable: true,
            }, {
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
                                                type='save'
                                                onClick={() => this.save(form, record)}
                                            />
                                        )}
                                    </EditableContext.Consumer>
                                    <Popconfirm
                                        title="确定取消吗?"
                                        onConfirm={() => this.cancel(record.key)}
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
                                        onClick={() => this.edit(record.key)}
                                    />

                                    <Popconfirm
                                        title="该物料将立即被删除，确定吗?"
                                        onConfirm={() => {
                                            this.delete(record.key)
                                        }}
                                    >
                                        <TableButton
                                            disabled={editingKey !== ''}
                                            type='delete'
                                        />
                                    </Popconfirm>

                                </OperationArea>
                            )}
                        </div>
                    )
                }
            }]
    }


    isEditing = record => record.key === this.state.editingKey;

    // 取消
    cancel = (key) => {
        const {dataSource} = this.state;
        const index = dataSource.findIndex(data=> data.key === key)
        const data = dataSource[index]
        // console.log('cancel data',data)
        // 取消的话，如果data中的物料信息是空的，那么要把这条记录删除掉
        if (isEmpty(data.material)) {
            dataSource.splice(index,1)
            this.setState({
                dataSource,
                editingKey: '',
            })
        } else {
            this.setState({
                editingKey: '',
            })
        }

        // 传递给父组件的行编辑状态
        const {onRowEditStateChangedListener} = this.props
        if (onRowEditStateChangedListener) {
            onRowEditStateChangedListener(false)
        }
    };

    // 编辑
    edit = (key) => {
        // console.log('edit ', key)
        this.setState({editingKey: key});

        // 传递给父组件的行编辑状态
        const {onRowEditStateChangedListener} = this.props
        if (onRowEditStateChangedListener) {
            onRowEditStateChangedListener(true)
        }
    }

    // 删除
    delete = async (key) => {
        if (this.state.dataSource.length <= 1) {
            message.error('删除失败！发货单必须包含至少一条物料记录。')
            return
        }
        const {onMaterialListChangedListener, onRowEditStateChangedListener} = this.props
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => key === item.key);

        if (index > -1) {
            // 如果数据是原始数据，点击删除即 调用接口删除了
            if (newData[index].id) {
                const result = await http.get(`/orderMaterial/delete/${newData[index].id}`, {})
                if (result.ret === '200') {
                    newData.splice(index, 1)
                    this.setState({
                        dataSource: newData.map((data,index)=>({...data, rowIndex: index+1})),
                        editingKey: ''
                    });

                    // 传递给外层父组件物料列表
                    if (onMaterialListChangedListener) {
                        onMaterialListChangedListener(newData)
                    }

                    // 传递给父组件的行编辑状态
                    if (onRowEditStateChangedListener) {
                        onRowEditStateChangedListener(false)
                    }
                } else {
                    message.error('物料删除失败！请重试。')
                }
            } else {
                // 否则，数据是新建数据尚未提到数据库中，点击删除不调用接口，只从暂存物料列表删除
                newData.splice(index, 1)
                this.setState({
                    dataSource: newData.map((data,index)=>({...data, rowIndex: index+1})),
                    editingKey: ''
                });

                // 传递给外层父组件物料列表
                if (onMaterialListChangedListener) {
                    onMaterialListChangedListener(newData)
                }

                // 传递给父组件的行编辑状态
                if (onRowEditStateChangedListener) {
                    onRowEditStateChangedListener(false)
                }
            }

        } else {
            message.error('物料删除失败！请重试。')
        }
    }

    // 点击增加物料信息按钮事件
    handleAddButtonClicked = () => {
        const {dataSource} = this.state;
        const newDataKey = freshId()
        const newData = {
            key: newDataKey,
            rowIndex: dataSource.length+1,
            material: '',
            description: '--',
            unit:'--',
            quantity: 1,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            editingKey: newDataKey,
        });

        // 传递给父组件的行编辑状态
        const {onRowEditStateChangedListener} = this.props
        if (onRowEditStateChangedListener) {
            onRowEditStateChangedListener(true)
        }
    }

    // 点击保存事件
    save = (form, record) => {
        // // console.log('handleSave called', row)
        const {onMaterialListChangedListener, onRowEditStateChangedListener} = this.props
        form.validateFields(async (error, row)=>{
            if (error) return
            const newData = [...this.state.dataSource];
            const index = newData.findIndex(item => record.key === item.key);
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...row,
            });

            this.setState({
                dataSource: newData,
                editingKey: ''
            });

            // 传递给外层父组件物料列表
            if (onMaterialListChangedListener) {
                onMaterialListChangedListener(newData)
            }

            // 传递给父组件的行编辑状态
            if (onRowEditStateChangedListener) {
                onRowEditStateChangedListener(false)
            }
        })
    }

    // 当物料编号变化时，更新数据集（要动态设置物料名称）
    handleMaterialCodeChanged = ({record, materialCode, materialObject}) => {
        // // console.log('handleMaterialCodeChanged called', record, materialCode, materialObject)
        // const {onMaterialListChangedListener} = this.props
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => record.key === item.key);
        const item = Object.assign({}, newData[index], {id: record.id}, {material: materialCode}, {description: materialObject.materialName}, {unit: materialObject.units});
        newData.splice(index, 1, item);
        // // console.log('handleMaterialCodeChanged', newData)
        this.setState({dataSource: newData}, () => {
            // 传递给外层父组件物料列表
            // if (onMaterialListChangedListener) {
            //     onMaterialListChangedListener(newData)
            // }
        });
    }

    // 当物料数量变化时，更新数据集（要动态设置物料数量）
    handleMaterialQuantityChanged = (record, quantity) => {
        // // console.log('handleMaterialQuantityChanged called', record, quantity)
        // const {onMaterialListChangedListener} = this.props
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => record.key === item.key);
        const item = Object.assign({}, newData[index], {quantity});
        newData.splice(index, 1, item);
        // // console.log('handleMaterialQuantityChanged', newData)
        this.setState({dataSource: newData}, () => {
            // 传递给外层父组件物料列表
            // if (onMaterialListChangedListener) {
            //     onMaterialListChangedListener(newData)
            // }
        });
    }

    render() {
        const {dataSource, columns: _columns, editingKey} = this.state;
        const {
            order,
            userSpecifiedVendor
        } = this.props
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
                    inputType: (col.dataIndex === 'vendorName')
                        ? 'selector'
                        : (col.dataIndex === 'quantity'
                            ? 'number_input'
                            : (col.dataIndex === 'material' ? 'input'
                                : 'text')),
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                    handleSave: this.handleSave,
                    handleMaterialCodeChanged: this.handleMaterialCodeChanged,
                    handleMaterialQuantityChanged: this.handleMaterialQuantityChanged,
                    userSpecifiedVendor: userSpecifiedVendor
                }),
            };
        });
        return (
            <EditableContext.Provider value={this.props.form}>
            <InputContainerView style={{padding: '6px'}}>
                <TitleContainerView>
                    <div
                        style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            marginLeft: '10px',
                            marginBottom: '10px',
                            alignSelf: 'flex-start'
                        }}
                    >{`系统ID：${order.number}`}</div>
                    <Button
                        disabled={editingKey !== ''}
                        onClick={this.handleAddButtonClicked}
                        type="primary"
                        style={{alignSelf: 'center'}}>
                        增加物料信息
                    </Button>
                </TitleContainerView>
                <Table
                    className="data-board-mini-table"
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered={false}
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    scroll={{y: 244}}
                />
            </InputContainerView>
            </EditableContext.Provider>
        );
    }
}

const FormWrappedTable = Form.create()(EditableTable)

class _EditShippingMaterialModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            confirmLoading: false,
            rowEditState: false, // 列是否处于编辑状态

            //
            materialList: [],// 选择增加的物料列表
        }
    }

    async componentDidMount() {
        //获取列表数据：工厂列表
        const result = await http.post('/factory/factoryList', {})
        if (result.ret === '200') {
            this.setState({
                _factoryList: result.data.content.map(item => ({
                    key: `factory_${item.code}`,
                    value: item.code,
                    label: item.name
                }))
            })
        } else {
            message.error('获取工厂列表失败！请稍候重试。')
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.modalVisibility,
        })
    }

    // 物料列表变化的监听
    onMaterialListChangedListener = (materialList) => {
        console.log('onMaterialListChangedListener called', materialList)
        this.setState({
            materialList
        })
    }

    // 行 编辑状态 切换的监听
    onRowEditStateChangedListener = (rowEditState) => {
        this.setState({
            rowEditState,
        })
    }

    // Modal 点击确定按钮事件
    handleOk = async (e) => {
        e.preventDefault();
        const {order} = this.props
        const {materialList} = this.state

        // console.log('order === ', order)

        // 校验规则
        if (materialList.length === 0) {
            message.error('请添加物料信息！')
            return
        }

        this.setState({
            visible: true,
            confirmLoading: true,
        });

        // 网络请求: 更新
        let params = {
            id: order.id,
            materialList: materialList.map(material => ({
                id: material.id,
                materiaCode: material.material,
                materiaNum: material.quantity
            }))
        }
        let requestUrl = '/order/save'

        const result = await this.callNetworkRequest({
            requestUrl,
            params,
            requestMethod: 'POST'
        })

        if (!!result) {
            if (this.props.onOkClickedListener) {
                this.props.onOkClickedListener('to_be_shipped_infos', {})
            }
            message.success('操作成功！')
        } else {
            message.error('数据提交失败！请稍候重试。')
        }

        this.setState({
            visible: false,
            confirmLoading: false,
            rowEditState: false, // 列是否处于编辑状态

            //注意清空变量
            materialList: [],// 选择增加的物料列表
        });
    }

    // Modal 点击取消按钮事件
    handleCancel = () => {
        // // console.log('Clicked cancel button');
        this.setState({
            visible: false,
            confirmLoading: false,
            rowEditState: false, // 列是否处于编辑状态

            // 注意清空state变量
            materialList: [],// 选择增加的物料列表
        });
        if (this.props.onCancelClickedListener) {
            this.props.onCancelClickedListener()
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
        const {modalType, order, userInfo} = this.props
        const {visible, confirmLoading, rowEditState, materialList} = this.state;
        const userSpecifiedVendor = _.get(userInfo, 'vendor')
        return (
            <div>
                <Modal
                    title={modalTitleMap[modalType]}
                    visible={visible}
                    onOk={this.handleOk}
                    // okButtonProps={{disabled: rowEditState}}
                    // confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    cancelButtonProps={{disabled: materialList.length === 0}}
                    destroyOnClose={true}
                    width='50%'
                    bodyStyle={{width: '100%'}}
                    keyboard={false}
                    maskClosable={false}
                    closable={false}
                    footer={<FooterView>
                        <Button
                            type="primary"
                            style={{marginRight: '6px'}}
                            disabled={rowEditState}
                            onClick={this.handleOk}
                            loading={confirmLoading}
                        >确定</Button>
                    </FooterView>}
                >
                    <FormWrappedTable
                        order={order}
                        userSpecifiedVendor={userSpecifiedVendor}
                        onMaterialListChangedListener={this.onMaterialListChangedListener}
                        onRowEditStateChangedListener={this.onRowEditStateChangedListener}
                    />
                </Modal>
            </div>
        );
    }
}

export const EditShippingMaterialModal = _EditShippingMaterialModal;

const InputContainerView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 10px 10px;
  // border: #48b2f7 2px solid;
`
const TitleContainerView = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 20%;
  padding: 10px 10px;
  margin: 0px 10px 10px 10px;
  // border: #48b2f7 2px solid;
`
const OperationArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const FooterView = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 5%;
  padding: 0% 2%;
  // margin: 0px 10px 10px 10px;
  // border: #48b2f7 2px solid;
`