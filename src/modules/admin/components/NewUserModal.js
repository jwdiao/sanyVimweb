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
import {roleMap, factoryList} from "../../../utils";

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

class _NewUserModal extends Component {
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
        }, 2000);
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
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
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const nameError = isFieldTouched('name') && getFieldError('name');
        const mobileError = isFieldTouched('mobile') && getFieldError('mobile');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const factoryError = isFieldTouched('factory') && getFieldError('factory');
        const roleError = isFieldTouched('role') && getFieldError('role');

        console.log('InputModal this.state', this.state)
        return (
            <div>
                <Modal
                    title={'新增用户信息'}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item
                            label="用户名:"
                            validateStatus={userNameError ? 'error' : ''}
                            help={userNameError || ''}
                        >
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入您的用户名!' }],
                            })(
                                <Input
                                    placeholder="请输入用户名" />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="姓名:"
                            validateStatus={nameError ? 'error' : ''}
                            help={nameError || ''}
                        >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入您的姓名!' }],
                            })(
                                <Input
                                    placeholder="请输入姓名" />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="手机号:"
                            validateStatus={mobileError ? 'error' : ''}
                            help={mobileError || ''}
                        >
                            {getFieldDecorator('mobile', {
                                rules: [
                                    {required: true, message: '请输入有效的手机号!' },
                                    {max:11, message: '手机号位数不正确!' },
                                    ],
                            })(
                                <Input
                                    placeholder="请输入手机号"
                                    type="number"
                                />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="密码:"
                            hasFeedback
                            validateStatus={passwordError ? 'error' : ''}
                            help={passwordError || ''}
                        >
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input
                                    placeholder="请输入密码"
                                    type="password"
                                />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="角色:"
                            hasFeedback
                            validateStatus={roleError ? 'error' : ''}
                            help={roleError || ''}
                        >
                            {getFieldDecorator('role', {
                                rules: [{ required: true, message: '请选择角色类型!' }],
                                initialValue: '发货员',
                            })(
                                <Select>
                                    {
                                        roleMap.map(role=>{
                                            return (
                                                <Option
                                                    key={role.key}
                                                    value={role.value}
                                                >{role.label}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>

                        <Form.Item
                            label="供应商:"
                            hasFeedback
                            validateStatus={factoryError ? 'error' : ''}
                            help={factoryError || ''}
                        >
                            {getFieldDecorator('factory', {
                                rules: [{ required: true, message: '请选择工厂!' }],
                                initialValue: '工厂-1',
                            })(
                                <Select
                                    mode="multiple"
                                >
                                    {
                                        factoryList.map(role=>{
                                            return (
                                                <Option
                                                    key={role.key}
                                                    value={role.value}
                                                >{role.label}</Option>
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

export const NewUserModal = Form.create()(_NewUserModal);
