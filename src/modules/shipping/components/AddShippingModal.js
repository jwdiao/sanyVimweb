/**
 * 增加待发货的Modal
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
import {goodsStatusMap, materialDescriptionMap, materialTypeMap, vendorList} from "../../../utils";

const modalTitleMap = {
    'to_be_shipped_infos': '新增待发货信息',
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
            return(
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
            handleSave,
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

        this.state = {
            columns: this.constructTableColumns(true),
            dataSource: [{
                key: '0',
                vendorName: '供应商-1',
                transferPeriod: '5',
                material: '物料-1',
                description: '物料描述-1',
                quantity: '10',
            }],
        };
    }

    constructTableColumns = (vendorFieldEditable) => {
        return [{
            title: '供应商',
            dataIndex: 'vendorName',
            width: '15%',
            editable: vendorFieldEditable,
        }, {
            title: '运输周期',
            dataIndex: 'transferPeriod',
            width: '10%',
            editable: true,
        }, {
            title: '物料',
            dataIndex: 'material',
            width: '20%',
            editable: true,
        }, {
            title: '描述',
            dataIndex: 'description',
            width: '25%',
            editable: true,
        }, {
            title: '数量',
            dataIndex: 'quantity',
            width: '15%',
            editable: true,
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                this.state.dataSource.length >= 1
                    ? (
                        <Popconfirm title="确认删除吗?" onConfirm={() => this.handleDelete(record.key)}>
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
                    ) : null
            ),
        }]
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter(item => item.key !== key)
        },()=>{
            if (this.state.dataSource.length <= 1) {
                this.setState({
                    columns: this.constructTableColumns(true),
                })
            }
        });
    }

    handleAdd = () => {
        const {dataSource} = this.state;
        const newData = {
            key: `${dataSource.length+1}`,
            vendorName: dataSource[0].vendorName,
            transferPeriod: '5',
            material: '物料-1',
            description: '物料描述-1',
            quantity: '10',
        };
        this.setState({
            dataSource: [...dataSource, newData],
            columns: this.constructTableColumns(false),
        });
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
        const {dataSource, columns:_columns} = this.state;
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
                <Button onClick={this.handleAdd} type="primary"
                        style={{marginLeft: '10px', marginBottom: '10px', alignSelf: 'flex-start'}}>
                    增加
                </Button>
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

class _AddShippingModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            confirmLoading: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.modalVisibility,
        })
    }

    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
            if (this.props.onOkClickedListener) {
                this.props.onOkClickedListener()
            }
        }, 2000);
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
        const {modalType, onOkClickedListener, onCancelClickedListener} = this.props
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
                    width='80%'
                    bodyStyle={{width: '100%'}}
                >
                    <EditableTable/>
                </Modal>
            </div>
        );
    }
}

export const AddShippingModal = _AddShippingModal;

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

const InputButtonView = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 4px 4px;
`
const TitleView = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
`