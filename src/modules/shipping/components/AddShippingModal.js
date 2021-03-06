import React, {Component} from 'react';
import {
    Modal,
    Table,
    Button,
    Popconfirm,
    Form, Select, InputNumber, message, DatePicker, AutoComplete,
} from 'antd';
import styled from "styled-components";
import freshId from 'fresh-id'
import moment from 'moment'
import {
    http, isEmpty,
} from "../../../utils";
import {TableButton} from "../../admin/components/TableButton";

const _ = require('lodash')

const modalTitleMap = {
    'to_be_shipped_infos': '新增待发货信息',
}

const FormItem = Form.Item;
const EditableContext = React.createContext();

const Option = Select.Option

class EditableCell extends React.Component {
    state = {
        // AutoComplete 组件所需数据源
        dataSource: [],
    }

    materialCodeListener = ({materialCode, materialObject}) => {
        const {record, handleMaterialCodeChanged} = this.props
        handleMaterialCodeChanged({record, materialCode, materialObject})
    }

    materialQuantityListener = (quantity) => {
        const {record, handleMaterialQuantityChanged} = this.props
        handleMaterialQuantityChanged(record, quantity)
    }

    getInput = (columnId) => {
        if (this.props.inputType === 'selector') {
            let options = []
            switch (columnId) {
                case 'vendorName':
                    options = []
                    break
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
                    // filterOption={(inputValue, option) => {
                    //     console.log('filterOption =' , inputValue, option)
                    //     return true
                    // }}
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
        // console.log('handleSearch userSpecifiedVendor', this.props.userSpecifiedVendor)
        const result = await http.post('/factorySupplierMaterial/find/all', {
            // materialCode: value,
            supplierCode: this.props.userSpecifiedVendor.value
        })
        console.log('handleSearch', result)
        if (!isEmpty(value)) {
            if (result.ret === '200' && result.data.content.length > 0) {
                this.setState({
                    dataSource: !value ? [] : _.uniq(result.data.content.map(content => content.materialCode).filter(content => content.indexOf(value) > -1)),
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
        const result = await http.post('/factorySupplierMaterial/find/all', {
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
                                        title="确定删除吗?"
                                        onConfirm={() => this.delete(record.key)}
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
        const index = dataSource.findIndex(data => data.key === key)
        const data = dataSource[index]
        // console.log('cancel data',data)
        // 取消的话，如果data中的物料信息是空的，那么要把这条记录删除掉
        if (isEmpty(data.material)) {
            dataSource.splice(index, 1)
            this.setState({
                dataSource,
                editingKey: '',
            })
        } else {
            this.setState({
                editingKey: '',
            })
        }
    };

    // 编辑
    edit = (key) => {
        // console.log('edit ', key)
        this.setState({editingKey: key});
    }

    // 删除
    delete = (key) => {
        const {onMaterialListChangedListener} = this.props
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
            newData.splice(index, 1)
            this.setState({
                dataSource: newData.map((data,index)=>({...data, rowIndex: index+1})),
                editingKey: ''
            });

            // 传递给外层父组件物料列表
            if (onMaterialListChangedListener) {
                onMaterialListChangedListener(newData)
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
            unit: '--',
            quantity: 1,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            editingKey: newDataKey,
        });
    }

    // 点击保存事件
    save = (form, record) => {
        console.log('handleSave called', record)
        const {onMaterialListChangedListener} = this.props
        form.validateFields(async (error, row) => {
            console.log('save error', error, row)
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
        })
    }

    // 当物料编号变化时，更新数据集（要动态设置物料名称）
    handleMaterialCodeChanged = ({record, materialCode, materialObject}) => {
        // // console.log('handleMaterialCodeChanged called', record, description)
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
            userSpecifiedVendor,
            _vendorList,
            _factoryList,
            onVendorSelectChangedCalled,
            onFactorySelectChangedCalled,
            onExpectedDateChangedCalled,
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
                    userSpecifiedVendor: userSpecifiedVendor,
                }),
            };
        });
        return (
            <EditableContext.Provider value={this.props.form}>
                <InputContainerView style={{padding: '6px'}}>
                    <TitleContainerView>
                        <TitleInputContainerView>
                            <Select
                                style={{width: '32%'}}
                                placeholder="请选择供应商"
                                onBlur={onVendorSelectChangedCalled}
                                onChange={onVendorSelectChangedCalled}
                                defaultValue={_vendorList.length > 0 ? _vendorList[0].value : null}
                            >
                                {
                                    _vendorList.map(option => {
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
                            <Select
                                style={{width: '32%', marginLeft: '2%'}}
                                placeholder="请选择工厂"
                                onBlur={onFactorySelectChangedCalled}
                                onChange={onFactorySelectChangedCalled}
                                defaultValue={_factoryList.length > 0 ? _factoryList[0].value : null}
                            >
                                {
                                    _factoryList.map(option => {
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
                            {/*<InputNumber*/}
                            {/*    style={{width: '32%', marginLeft: '2%'}}*/}
                            {/*    placeholder="请输入运输周期"*/}
                            {/*    min={1}*/}
                            {/*    formatter={value => `${value}天`}*/}
                            {/*    parser={value => value.replace('天', '')}*/}
                            {/*    onChange={onTPTextChangedCalled}*/}
                            {/*    onBlur={onTPTextChangedCalled}*/}
                            {/*    onPressEnter={onTPTextChangedCalled}*/}
                            {/*/>*/}
                            <DatePicker
                                style={{width: '45%', marginLeft: '2%'}}
                                placeholder="请选择预到日期"
                                disabledDate={disabledDate}
                                onChange={onExpectedDateChangedCalled}
                            />
                            {/*<Input*/}
                            {/*    style={{width: '15%', marginLeft: '2%'}}*/}
                            {/*    placeholder="请输入操作人"*/}
                            {/*    defaultValue={name}*/}
                            {/*    onChange={onOperatorTextChangedCalled}*/}
                            {/*    onBlur={onOperatorTextChangedCalled}*/}
                            {/*    onPressEnter={onOperatorTextChangedCalled}*/}
                            {/*/>*/}
                        </TitleInputContainerView>
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

class _AddShippingModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            confirmLoading: false,

            //
            _vendorList: [],// 从后端获取的供应商列表
            _factoryList: [],// 从后端获取的工厂列表
            materialList: [],// 选择增加的物料列表
            selectedFactory: '', // 选择的工厂
            selectedVendor: '',// 选择的供应商
            expectReachDate: '',// 输入的运输周期
            operator: props.userInfo.userName,// 操作人(默认为当前登录的用户)
        }
    }

    async componentDidMount() {
        const {userInfo} = this.props
        const userSpecifiedVendor = _.get(userInfo, 'vendor')

        //获取列表数据：供应商列表
        const result = await http.post('/supplier/supplierList', {})
        if (result.ret === '200') {
            let _vendorList = result.data.content.map(item => ({
                key: `vendor_${item.code}`,
                value: item.code,
                label: item.name
            }))
            this.setState({
                selectedVendor: _vendorList.filter(vendor => vendor.value === userSpecifiedVendor.value)[0].value,
                _vendorList,
            })
        } else {
            message.error('获取供应商列表失败！请稍候重试。')
        }

        //获取列表数据：工厂列表
        const result2 = await http.post('/factory/factoryList', {})
        if (result2.ret === '200') {
            let _factoryList = result2.data.content.map(item => ({
                    key: `factory_${item.code}`,
                    value: item.code,
                    label: item.name
                }))
            this.setState({
                selectedFactory: _factoryList[0].value,
                _factoryList,
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

    // 供应商选择列表监听
    onFactorySelectChangedCalled = (value) => {
        this.setState({
            selectedFactory: value,
        })
    }

    // 供应商选择列表监听
    onVendorSelectChangedCalled = (value) => {
        this.setState({
            selectedVendor: value,
        })
    }

    // 预到日期选择监听
    onExpectedDateChangedCalled = (date, dateString) => {
        this.setState({
            expectReachDate: dateString,
        })
    }

    // 操作人输入框监听
    onOperatorTextChangedCalled = (event) => {
        const {value} = event.target
        this.setState({
            operator: value
        })
    }

    // 物料列表变化的监听
    onMaterialListChangedListener = (materialList) => {
        // console.log('onMaterialListChangedListener called', materialList)
        this.setState({
            materialList
        })
    }

    handleOk = async (e) => {
        e.preventDefault();
        const {selectedVendor, selectedFactory, expectReachDate, operator, materialList} = this.state

        console.log('handleOk called', this.state)

        // 校验规则
        if (isEmpty(selectedVendor) || isEmpty(expectReachDate) || isEmpty(operator)) {
            message.error('请填写完整信息再提交！')
            return
        }

        if (materialList.length === 0) {
            message.error('请添加物料信息！')
            return
        }

        this.setState({
            visible: true,
            confirmLoading: true,
        });

        // 网络请求
        let params = {
            factoryCode: selectedFactory,
            supplierCode: selectedVendor,
            transportTime: expectReachDate,
            materialList: materialList.map(material => ({
                materiaCode: material.material,
                materiaNum: material.quantity
            })),
            saveName: operator.trim(),
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
            //注意清空变量
            materialList: [],// 选择增加的物料列表
            // selectedFactory: '', // 选择的工厂
            // selectedVendor: '',// 选择的供应商
            expectReachDate: '',// 输入的运输周期
            operator: this.props.userInfo.userName,// 操作人(默认为当前登录的用户)
        });
    }

    handleCancel = () => {
        // console.log('Clicked cancel button');
        this.setState({
            visible: false,
            confirmLoading: false,

            // 注意清空state变量
            materialList: [],// 选择增加的物料列表
            // selectedFactory: '', // 选择的工厂
            // selectedVendor: '',// 选择的供应商
            expectReachDate: '',// 输入的运输周期
            operator: this.props.userInfo.userName,// 操作人(默认为当前登录的用户)
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
        const {modalType, userInfo} = this.props
        const {visible, confirmLoading, _vendorList, _factoryList} = this.state
        const userSpecifiedVendor = _.get(userInfo, 'vendor')
        // console.log('userSpecifiedVendor',userSpecifiedVendor)
        const name = _.get(userInfo, 'name')
        return (
            <div>
                <Modal
                    title={modalTitleMap[modalType]}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    width='70%'
                    bodyStyle={{width: '100%'}}
                >
                    <FormWrappedTable
                        _vendorList={userSpecifiedVendor ? _vendorList.filter(vendor => vendor.value === userSpecifiedVendor.value) : _vendorList}
                        _factoryList={_factoryList}
                        userSpecifiedVendor={userSpecifiedVendor}
                        name={name}
                        onVendorSelectChangedCalled={this.onVendorSelectChangedCalled}
                        onFactorySelectChangedCalled={this.onFactorySelectChangedCalled}
                        onExpectedDateChangedCalled={this.onExpectedDateChangedCalled}
                        onOperatorTextChangedCalled={this.onOperatorTextChangedCalled}
                        onMaterialListChangedListener={this.onMaterialListChangedListener}
                    />
                </Modal>
            </div>
        );
    }
}

function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
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

const TitleInputContainerView = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 70%;
  height: 20%;
  // border: #48b2f7 2px solid;
`

const OperationArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`