/**
 * 新增用户的Modal
 */
import React, {Component} from 'react';
import {
    message,
    Modal,
    Input,
    Form,
    Select,
    AutoComplete
} from 'antd';
import {http, isEmpty} from "../../../utils";

const _ = require('lodash')

const {Option} = Select;

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
    },
};

// function hasErrors(fieldsError) {
//     return Object.keys(fieldsError).some(field => fieldsError[field]);
// }

class _NewMaterialModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            materialDescriptionText: '未找到该编号对应的物料！',
            visible: false,
            confirmLoading: false,
            //
            _unitList: [],
            _vendorList: [],
            _factoryList: [],

            // AutoComplete 组件所需数据源
            dataSource:[],
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.modalVisibility,
        })
    }

    async componentDidMount() {
        this.props.form.validateFields();
        //获取列表数据：1、单位列表 2、供应商列表 3、工厂列表
        const result1 = await http.get('/dynamicProperty/find/type/units')
        if (result1.ret === '200') {
            this.setState({
                _unitList: result1.data.map(item => ({key: `unit_${item.code}`, value: item.code, label: item.name}))
            })
        } else {
            message.error('获取物料单位失败！请稍候重试。')
        }

        const result2 = await http.post('/supplier/supplierList',{status:1})
        if (result2.ret === '200') {
            this.setState({
                _vendorList: result2.data.content.map(item => ({key: `vendor_${item.code}`, value: item.code, label: item.name}))
            })
        } else {
            message.error('获取供应商列表失败！请稍候重试。')
        }

        const result3 = await http.post('/factory/factoryList',{})
        if (result3.ret === '200') {
            this.setState({
                _factoryList: result3.data.content.map(item => ({key: `factory_${item.code}`, value: item.code, label: item.name}))
            })
        } else {
            message.error('获取工厂列表失败！请稍候重试。')
        }
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
            // 重置状态
            materialDescriptionText: '未找到该编号对应的物料！',
        });
        if (this.props.onCancelClickedListener) {
            this.props.onCancelClickedListener()
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {modalType, form} = this.props
        const {_unitList} = this.state
        form.validateFields(async (err, values) => {
            if (!err) {
                // 网络请求
                let params = {}
                let requestUrl = ''

                this.setState({
                    visible: true,
                    confirmLoading: true,
                });

                // 基础物料 和 供应商物料 传递不同参数，调用不同接口
                if (modalType === 'basic_material_type_management') {
                    requestUrl = '/material/save '
                    params = Object.assign({}, params, {
                        code: values.material.trim(),
                        name: values.materialDescription.trim(),
                        units: _unitList.filter(unit => unit.value === values.unit)[0].label,
                    })
                } else {
                    console.log('values', values)
                    requestUrl = '/factorySupplierMaterial/save'
                    params = Object.assign({}, params, {
                        materialCode: values.material.trim(), // 传参时只传递物料号，物料名称等其他参数只做界面展示之用，不传递
                        supplierCode: values.vendor.trim(),
                        factoryCode: values.factory.trim(),
                    })
                }
                const result = await this.callNetworkRequest({
                    requestUrl,
                    params,
                    requestMethod: 'POST'
                })

                console.log('handleSubmit result',result)
                if (result && result.ret === '200') {
                    const addedData = {
                        // key: freshId(),
                        // // id: content.id,
                        // sanyId: factoryCode,
                        // sanyName: factoryName,
                        // status: 1,
                        // // createdAt: formatDate(content.createTime),
                    }
                    if (this.props.onOkClickedListener) {
                        this.props.onOkClickedListener(this.props.modalType, addedData)
                    }
                    message.success('操作成功！')
                } else {
                    message.error(`数据提交失败！${result.msg}[${result.ret}]`)
                }
                this.setState({
                    visible: false,
                    confirmLoading: false,
                });
            } else {
                message.error('请检查输入内容后再提交！')
            }
        });
    }

    // 供应商物料添加时的校验器，校验物料是否存在
    getMaterialNameValidator = async (rule, value, callback, source, options) => {
        const result = await http.post('/material/find/all',{
            code: value,
        })
        console.log('getMaterialNameValidator', result)
        if (!isEmpty(value)) {
            if (result.ret === '200' && result.data.content.length>0) {
                const valueIndex = result.data.content.findIndex(content=>content.code === value)
                if (valueIndex > -1) {
                    this.setState({
                        materialDescriptionText:result.data.content[valueIndex].name
                    })
                    callback()
                } else {
                    callback('未找到该编号对应的物料！')
                }
            } else {
                this.setState({
                    materialDescriptionText:'未找到该编号对应的物料！'
                })
                callback('未找到该编号对应的物料！')
            }
        }
        callback()
    }

    // 基础物料添加时的校验器，校验物料编号唯一
    getMaterialNameUniqueValidator = async (rule, value, callback, source, options) => {
        const result = await http.post('/material/find/all',{
            code: value,
        })
        console.log('getMaterialNameUniqueValidator', result)
        if (!isEmpty(value)) {
            if (result.ret === '200' && result.data.content.length>0) {
                const valueIndex = result.data.content.findIndex(content=>content.code === value)
                if (valueIndex > -1) {
                    callback('该编号对应的物料已存在！')
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        callback()
    }

    // 调用网络请求
    callNetworkRequest = async ({requestUrl, params, requestMethod}) => {
        let result
        if (requestMethod === 'POST') {
            result = await http.post(requestUrl, params)
        } else {
            result = await http.get(requestUrl)
        }
        console.log(`request: ${requestUrl}`,'params:',params,'result:',result)
        return result
    }

    // AutoComplete组件监听
    handleSearch = async value => {
        if (value.length < 5) {
            this.setState({
                dataSource: []
            })
            return
        }
        const result = await http.post('/material/find/all',{
            code: value,
        })
        if (!isEmpty(value)) {
            if (result.ret === '200' && result.data.content.length>0) {
                this.setState({
                    dataSource: !value ? [] : _.uniq(result.data.content.map(content=>content.code).filter(content=>content.indexOf(value) > -1)),
                })
            } else {
                this.setState({
                    dataSource: []
                })
            }
        }
    };

    render() {
        const {visible, confirmLoading, _vendorList, _factoryList, _unitList, materialDescriptionText} = this.state;
        const {modalType, form, userInfo} = this.props

        const {
            getFieldDecorator, getFieldError, isFieldTouched,
        } = form;

        const userSpecifiedVendor = _.get(userInfo, 'vendor')

        // Only show error after a field is touched.
        const materialIdError = isFieldTouched('material') && getFieldError('material');
        const materialNameError = isFieldTouched('materialDescription') && getFieldError('materialDescription');
        const unitError = isFieldTouched('unit') && getFieldError('unit');
        const vendorError = isFieldTouched('vendor') && getFieldError('vendor');
        const factoryError = isFieldTouched('factory') && getFieldError('factory');

        const { dataSource } = this.state;

        return (
            <div>
                <Modal
                    title={'新增物料类型'}
                    visible={visible}
                    onOk={this.handleSubmit}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item
                            label="物料编号:"
                            validateStatus={materialIdError ? 'error' : ''}
                            help={materialIdError || ''}
                        >
                            {getFieldDecorator('material', {
                                rules: [
                                    {required: true, message: '请输入物料编号!'},
                                    modalType === 'vendor_material_type_management'? {validator: this.getMaterialNameValidator} : {validator: this.getMaterialNameUniqueValidator}
                                ],
                            })(
                                modalType === 'vendor_material_type_management'? (
                                    <AutoComplete
                                        dataSource={dataSource}
                                        style={{ width: '100%' }}
                                        // onSelect={this.onSelect}
                                        onSearch={this.handleSearch}
                                        placeholder="请输入物料编号"
                                        // filterOption={(inputValue, option) =>
                                        //     option.props.children.indexOf(inputValue) !== -1
                                        // }
                                    />
                                    ) : (
                                        <Input
                                            placeholder="请输入物料编号"
                                        />
                                )
                            )}
                        </Form.Item>

                        {
                            modalType === 'basic_material_type_management' && (
                                <Form.Item
                                    label="物料编码:"
                                    validateStatus={materialNameError ? 'error' : ''}
                                    help={materialNameError || ''}
                                >
                                    {getFieldDecorator('materialDescription', {
                                        rules: [{required: true, message: '请输入物料描述!'}],
                                    })(
                                        <Input
                                            placeholder="请输入物料描述"/>
                                    )}
                                </Form.Item>
                            )
                        }

                        {
                            modalType === 'vendor_material_type_management' && (
                                <Form.Item
                                    label="物料编码:"
                                    validateStatus={materialNameError ? 'error' : ''}
                                    help={materialNameError || ''}
                                >
                                    {getFieldDecorator('materialDescription', {
                                        rules: [{required: false, message: '请输入物料名称!'}],
                                    })(
                                        <div>{materialDescriptionText}</div>
                                    )}
                                </Form.Item>
                            )
                        }

                        {
                            modalType === 'basic_material_type_management' && (
                                <Form.Item
                                    label="物料单位:"
                                    hasFeedback
                                    validateStatus={unitError ? 'error' : ''}
                                    help={unitError || ''}
                                >
                                    {getFieldDecorator('unit', {
                                        rules: [{required: true, message: '请选择物料单位!'}],
                                    })(
                                        <Select
                                            placeholder="请选择"
                                        >
                                            {
                                                _unitList.map(unit => {
                                                    return (
                                                        <Option
                                                            key={unit.key}
                                                            value={unit.value}>
                                                            {unit.label}
                                                        </Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            )
                        }

                        {
                            modalType === 'vendor_material_type_management' && (
                                <Form.Item
                                    label="供应商:"
                                    hasFeedback
                                    validateStatus={vendorError ? 'error' : ''}
                                    help={vendorError || ''}
                                >
                                    {getFieldDecorator('vendor', {
                                        rules: [{required: true, message: '请选择供应商!'}],
                                        // initialValue: _vendorList.length > 0 ? _vendorList[0].value : null
                                    })(
                                        <Select
                                            // mode="multiple"
                                            placeholder="请选择供应商"
                                        >
                                            {
                                                userSpecifiedVendor && _vendorList.filter(vendor=>vendor.value === userSpecifiedVendor.value).map(vendor => {
                                                    return (
                                                        <Option
                                                            key={vendor.key}
                                                            value={vendor.value}>
                                                            {vendor.label}
                                                        </Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            )
                        }

                        {
                            modalType === 'vendor_material_type_management' && (
                                <Form.Item
                                    label="客户工厂:"
                                    hasFeedback
                                    validateStatus={factoryError ? 'error' : ''}
                                    help={factoryError || ''}
                                >
                                    {getFieldDecorator('factory', {
                                        rules: [{required: true, message: '请选择客户工厂!'}],
                                        // initialValue: _factoryList.length > 0 ? _factoryList[0].value : null
                                    })(
                                        <Select
                                            // mode="multiple"
                                            placeholder="请选择客户工厂"
                                        >
                                            {
                                                _factoryList.map(factory => {
                                                    return (
                                                        <Option
                                                            key={factory.key}
                                                            value={factory.value}>
                                                            {factory.label}
                                                        </Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            )
                        }

                    </Form>
                </Modal>
            </div>
        );
    }
}

export const NewMaterialModal = Form.create()(_NewMaterialModal);
