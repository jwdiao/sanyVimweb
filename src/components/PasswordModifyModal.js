import React, {Component} from 'react';
import {Form, Input, message, Modal} from "antd";
import {Durian, Encrypt, http} from "../utils";

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

class _PasswordModifyModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmDirty: false,

            visible: false,
            confirmLoading: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.modalVisibility,
        })
    }

    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不一致!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['password_confirm'], { force: true });
        }
        callback();
    };

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
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // 网络请求
                console.log('values', values)
                const user = Durian.get('user')
                console.log('PasswordModifyModal get user', user)
                const {password} = values
                let encryptPassword = Encrypt.encryptBy3DES(password).toString()
                let params = {
                    id:user.id, // 用户 id
                    password: encryptPassword,// 修改的密码
                }

                this.setState({
                    visible: true,
                    confirmLoading: true,
                });

                const result = await this.callNetworkRequest({
                    requestUrl: '/user/addOrUpdateUser',
                    params,
                    requestMethod:'POST'
                })

                if (result.ret === '200') {
                    if (this.props.onOkClickedListener) {
                        this.props.onOkClickedListener()
                    }
                    message.success('密码修改成功！请重新登录。')
                } else {
                    message.error('数据提交失败！请稍候重试。')
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

    // 调用网络请求
    callNetworkRequest = async ({requestUrl, params, requestMethod}) => {
        let result
        if (requestMethod === 'POST') {
            result = await http.post(requestUrl,params)
        } else {
            result = await http.get(requestUrl)
        }
        console.log('request:',requestUrl,'params:',params,'result:',result)
        return result
    }

    render() {
        const {visible, confirmLoading} = this.state;

        const {
            getFieldDecorator, getFieldError, isFieldTouched,
        } = this.props.form;

        const passwordError = isFieldTouched('password') && getFieldError('password');
        const passwordConfirmError = isFieldTouched('password_confirm') && getFieldError('password_confirm');

        return(
            <div>
                <Modal
                    title={'修改用户密码'}
                    visible={visible}
                    onOk={this.handleSubmit}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item
                            label="输入密码:"
                            hasFeedback
                            validateStatus={passwordError ? 'error' : ''}
                            help={passwordError || ''}
                        >
                            {getFieldDecorator('password', {
                                rules: [
                                    {required: true, message: '请输入密码!'},
                                    {pattern: /^[^\s]*$/, message: '密码为数字与字母(区分大小写)组合，不允许包含空格!'},
                                    {
                                        validator: this.validateToNextPassword,
                                    },
                                ],
                                initialValue:'',
                            })(
                                <Input.Password
                                    placeholder="请输入密码"
                                />
                            )}
                        </Form.Item>
                        <Form.Item
                            label="确认密码:"
                            hasFeedback
                            validateStatus={passwordConfirmError ? 'error' : ''}
                            help={passwordConfirmError || ''}
                        >
                            {getFieldDecorator('password_confirm', {
                                rules: [
                                    {required: true, message: '请再次输入密码!'},
                                    {pattern: /^[^\s]*$/, message: '密码为数字与字母(区分大小写)组合，不允许包含空格!'},
                                    {
                                        validator: this.compareToFirstPassword,
                                    },
                                ],
                                initialValue:'',
                            })(
                                <Input.Password
                                    placeholder="请再次输入密码"
                                    onBlur={this.handleConfirmBlur}
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export const PasswordModifyModal = Form.create()(_PasswordModifyModal);