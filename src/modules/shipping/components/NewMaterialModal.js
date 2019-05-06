/**
 * 新增用户的Modal
 */
import React, {Component} from 'react';
import {
    Modal,
    Input,
    Form,
    Select
} from 'antd';
import {vendorList, factoryList, unitMap} from "../../../utils";

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

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class _NewMaterialModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ModalText: 'Content of the modal',
            visible: false,
            confirmLoading: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.modalVisibility,
        })
    }

    componentDidMount() {
        this.props.form.validateFields();
    }

    handleOk = () => {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
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

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const {visible, confirmLoading} = this.state;

        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;

        // Only show error after a field is touched.
        const materialIdError = isFieldTouched('materialId') && getFieldError('materialId');
        const materialNameError = isFieldTouched('materialName') && getFieldError('materialName');
        const unitError = isFieldTouched('unit') && getFieldError('unit');
        const vendorError = isFieldTouched('vendor') && getFieldError('vendor');
        const factoryError = isFieldTouched('factory') && getFieldError('factory');

        return (
            <div>
                <Modal
                    title={'新增物料类型'}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item
                            label="物料编号:"
                            validateStatus={materialIdError ? 'error' : ''}
                            help={materialIdError || ''}
                        >
                            {getFieldDecorator('materialId', {
                                rules: [{ required: true, message: '请输入物料编号!' }],
                            })(
                                <Input
                                    placeholder="请输入物料编号" />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="物料名称:"
                            validateStatus={materialNameError ? 'error' : ''}
                            help={materialNameError || ''}
                        >
                            {getFieldDecorator('materialName', {
                                rules: [{ required: true, message: '请输入物料名称!' }],
                            })(
                                <Input
                                    placeholder="请输入物料名称" />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="物料单位:"
                            hasFeedback
                            validateStatus={unitError ? 'error' : ''}
                            help={unitError || ''}
                        >
                            {getFieldDecorator('unit', {
                                rules: [{ required: true, message: '请选择物料单位!' }],
                                initialValue: 'kg',
                            })(
                                <Select>
                                    {
                                        unitMap.map(unit=>{
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

                        <Form.Item
                            label="供应商:"
                            hasFeedback
                            validateStatus={vendorError ? 'error' : ''}
                            help={vendorError || ''}
                        >
                            {getFieldDecorator('vendor', {
                                rules: [{ required: true, message: '请选择供应商!' }],
                                initialValue: '供应商-1',
                            })(
                                <Select
                                    mode="multiple"
                                >
                                    {
                                        vendorList.map(vendor=>{
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

                        <Form.Item
                            label="客户工厂:"
                            hasFeedback
                            validateStatus={factoryError ? 'error' : ''}
                            help={factoryError || ''}
                        >
                            {getFieldDecorator('factory', {
                                rules: [{ required: true, message: '请选择客户工厂!' }],
                                initialValue: '工厂-1',
                            })(
                                <Select
                                    mode="multiple"
                                >
                                    {
                                        factoryList.map(factory=>{
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

                    </Form>
                </Modal>
            </div>
        );
    }
}

export const NewMaterialModal = Form.create()(_NewMaterialModal);
