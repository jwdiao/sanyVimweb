/**
 * 增加显示物料详情的Modal
 * 因为比较特殊，单独写一个Component
 */
import React, {Component} from 'react';
import {
    Modal,
    Input,
    Table,
    Button,
    Popconfirm,
    Form, Select, InputNumber,
} from 'antd';
import styled from "styled-components";
import freshId from "fresh-id";
import {http, materialDescriptionMap, materialTypeMap, vendorList} from "../../../utils";

const _ = require('lodash')
const modalTitleMap = {
    'to_be_shipped_infos': '待发货订单物料列表',
    'shipped_infos': '工厂发货订单物料列表',
    'reversed_infos': '已冲销发货订单物料列表',
    'vmi_received_infos': 'VMI收货订单物料列表',
    'reversed_infos_query': '冲销信息物料列表',
}

const FormItem = Form.Item;
const EditableContext = React.createContext();

const Option = Select.Option

const EditableRow = ({form, index, ...props}) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    state = {
        editing: false,
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({editing}, () => {
            // if (editing) {
            //     this.input.focus();
            // }
        });
    }

    save = (e) => {
        const {record, handleSave} = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({...record, ...values});
        });
    }

    getInput = (columnId) => {
        if (this.props.inputType === 'selector') {
            let options = []
            switch (columnId) {
                case 'vendorName':
                    options = vendorList
                    break
                case 'material':
                    options = materialTypeMap
                    break
                case 'description':
                    options = materialDescriptionMap
                    break
                default:
                    break
            }
            return (
                <Select onBlur={this.save}>
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
                    onBlur={this.save}
                    onPressEnter={this.save}
                    min={1}
                />
            )
        }
        return (
            <Input
                onBlur={this.save}
                onPressEnter={this.save}
            />
        )
    };

    render() {
        const {editing} = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                editing ? (
                                    <FormItem style={{margin: 0}}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `${title}必填`,
                                            }],
                                            initialValue: record[dataIndex],
                                        })(this.getInput(dataIndex))}
                                    </FormItem>
                                ) : (
                                    <div
                                        className="editable-cell-value-wrap"
                                        style={{paddingRight: 24}}
                                        onClick={this.toggleEdit}
                                    >
                                        {restProps.children}
                                    </div>
                                )
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        const {modalType}=props
        this.state = {
            columns: this.constructTableColumns(modalType === 'vmi_received_infos'),
            dataSource: [],
        };
    }

    async componentDidMount() {
        const {order} = this.props
        if (_.isEmpty(order)) return
        let oData = await this.getMaterialList(order)
        this.setState({
            dataSource: oData.map(material => {
                return {
                    material: material.materiaCode,
                    materialDescription: 'Todo:物料描述',
                    materialQuantity: material.materiaNum,
                    totalNumber: material.totalNumber,
                    qualifiedQuantity: material.qualifiedNumber,
                    unqualifiedQuantity: material.badNumber,
                    state: material.status,
                }
            })
        })
    }

    async componentWillReceiveProps(nextProps) {
        const {order} = nextProps
        if (_.isEmpty(order)) return

        let oData = await this.getMaterialList(order)
        this.setState({
            dataSource: oData.map(material => {
                return {
                    key: freshId(),
                    material: material.materiaCode,// 物料（也就是物料ID）
                    materialDescription: 'Todo:物料描述',// Todo:物料描述，需要接口增加
                    materialQuantity: material.materiaNum,// 物料数量
                    totalNumber: material.totalNumber,// 收货时数量
                    qualifiedQuantity: material.qualifiedNumber,// 合格数量
                    unqualifiedQuantity: material.badNumber,// 不合格数量
                    state: material.status,// 状态
                }
            })
        })
    }

    getMaterialList = async (order) => {
        let orderId = order.number ? order.number : order.generatedNumber // TODO：对于报表管理-冲销信息查询，没有number这个字段，使用生成号码来查询，但是查不出来
        let result = await http.get(
            `/orderMaterial/find/ordercode/${orderId}`,
        )
        if (result) {
            const materialList = result.data
            console.log('materialList', materialList)
            return materialList
        }
        return []
    }

    constructTableColumns = (shouldDisplayRestColumns) => {
        if (shouldDisplayRestColumns) {
            return [{
                title: '物料',
                dataIndex: 'material',
                width: '17%',
                editable: false,
            }, {
                title: '物料描述',
                dataIndex: 'materialDescription',
                width: '20%',
                editable: false,
            }, {
                title: '物料数量',
                dataIndex: 'materialQuantity',
                width: '12%',
                editable: false,
            }, {
                title: '收货时总数',
                dataIndex: 'totalNumber',
                width: '17%',
                editable: false,
            }, {
                title: '合格品数量',
                dataIndex: 'qualifiedQuantity',
                width: '17%',
                editable: false,
            }, {
                title: '不合格品数量',
                dataIndex: 'unqualifiedQuantity',
                width: '17%',
                editable: false,
            }
            // , {
            //     title: '状态',
            //     dataIndex: 'state',
            //     width: '15%',
            //     editable: false,
            // }
            ]
        } else {
            return [{
                title: '物料',
                dataIndex: 'material',
                width: '15%',
                editable: false,
            }, {
                title: '物料描述',
                dataIndex: 'materialDescription',
                width: '20%',
                editable: false,
            }, {
                title: '物料数量',
                dataIndex: 'materialQuantity',
                width: '15%',
                editable: false,
            }
            // , {
            //     title: '状态',
            //     dataIndex: 'state',
            //     width: '15%',
            //     editable: false,
            // }
            ]
        }
    }

    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({dataSource: newData});
    }

    render() {
        const {order} = this.props
        const {dataSource, columns: _columns} = this.state;
        const components = {
            body: {
                row: EditableFormRow,
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
                    editable: col.editable,
                    inputType: (col.dataIndex === 'vendorName' || col.dataIndex === 'material' || col.dataIndex === 'description')
                        ? 'selector'
                        : (col.dataIndex === 'transferPeriod' || col.dataIndex === 'quantity'
                            ? 'number_input'
                            : 'text'),
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <InputContainerView style={{padding: '6px'}}>
                {/*<Button onClick={this.handleAdd} type="primary"*/}
                {/*        style={{marginLeft: '10px', marginBottom: '10px', alignSelf: 'flex-start'}}>*/}
                {/*    增加*/}
                {/*</Button>*/}
                <div
                    style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginLeft: '10px',
                        marginBottom: '10px',
                        alignSelf: 'flex-start'
                    }}
                >{`订单号：${order.number}`}</div>
                <Table
                    className="data-board-mini-table"
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    scroll={{y: 244}}
                />
            </InputContainerView>
        );
    }
}

class _MaterialListModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            confirmLoading: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.modalVisibility,
        })
    }

    handleOk = () => {
        this.setState({
            visible: false,
        });
        if (this.props.onOkClickedListener) {
            this.props.onOkClickedListener()
        }
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
        if (this.props.onCancelClickedListener) {
            this.props.onCancelClickedListener()
        }
    }

    render() {
        const {modalType, order} = this.props
        const {visible, confirmLoading} = this.state;

        return (
            <div>
                <Modal
                    title={modalTitleMap[modalType]}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    width={modalType === 'vmi_received_infos'?'60%':'40%'}
                    bodyStyle={{width: '100%'}}
                >
                    <EditableTable
                        order={order}
                        modalType={modalType}
                    />
                </Modal>
            </div>
        );
    }
}

export const MaterialListModal = _MaterialListModal;

const InputContainerView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 10px 10px;
  // border: #5a8cff 2px solid;
`