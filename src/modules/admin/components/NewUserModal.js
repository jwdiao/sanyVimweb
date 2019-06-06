/**
 * 新增用户的Modal
 */
import React, {Component} from 'react';
import {
    Modal,
    Input,
    Form,
    Select, message
} from 'antd';
import {roleList, http, isEmpty, Encrypt} from "../../../utils";

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

class _NewUserModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            confirmLoading: false,

            _vendorList:[],

            currentSelectedRole:'',
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.modalVisibility,
        })
    }

    async componentDidMount() {
        this.props.form.validateFields();
        const result = await http.post('/supplier/supplierList',{status:1})
        if (result.ret === '200') {
            this.setState({
                _vendorList: result.data.content.map(item => ({key: `vendor_${item.code}`, value: item.code, label: item.name}))
            })
        } else {
            message.error('获取供应商列表失败！请稍候重试。')
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

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // 网络请求
                console.log('values', values)
                const {userName,name,mobile,password,role} = values
                console.log('encrypt', Encrypt.encryptBy3DES(password).toString())
                let params = {
                    status:1, // 默认启用状态
                    userName:userName.trim(),// 用户名
                    name:name.trim(),// 姓名
                    phone:mobile.trim(),// 电话
                    password:Encrypt.encryptBy3DES(password).toString(),// 密码
                    type:role,// 角色
                }

                this.setState({
                    visible: true,
                    confirmLoading: true,
                });

                // 系统管理员、工厂管理员不需要选择供应商
                // 收货员可以多选供应商
                if (role === 3){
                    let vendorStr = ''
                    values.vendor.forEach(v=>{
                        if (v !== '') {
                            vendorStr += v+','
                        }
                    })
                    params = Object.assign({}, params, {
                        supplierCode:vendorStr,
                    })
                }
                // 发货员、供应商管理员可以单选供应商
                else if (role === 4 || role === 5) {
                    params = Object.assign({}, params, {
                        supplierCode:values.vendor,
                    })
                }

                const result = await this.callNetworkRequest({
                    requestUrl: '/user/addOrUpdateUser',
                    params,
                    requestMethod:'POST'
                })

                if (result.ret === '200') {
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

    nameUniqueValidator = async (rule, value, callback, source, options) => {
        const result = await this.callNetworkRequest({
            requestUrl:'/user/validateUser',
            params:{
                userName: value,
            },
            requestMethod:'POST',
        })
        console.log('nameUniqueValidator', result)
        if (!isEmpty(value) && result.ret === '208'){
            callback('用户名已被使用！')
        }
        callback()
    }

    mobileValidValidator = (rule, value, callback, source, options) => {
        if (!isEmpty(value)) {
            if (/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value)) {
                callback()
            } else {
                callback('请输入有效的手机号码！')
            }
        }
        callback()
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
        const {_vendorList, visible, confirmLoading, currentSelectedRole} = this.state;

        const {
            getFieldDecorator, getFieldError, isFieldTouched,
        } = this.props.form;

        // Only show error after a field is touched.
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const nameError = isFieldTouched('name') && getFieldError('name');
        const mobileError = isFieldTouched('mobile') && getFieldError('mobile');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const vendorError = isFieldTouched('vendor') && getFieldError('vendor');
        const roleError = isFieldTouched('role') && getFieldError('role');

        console.log('InputModal this.state', this.state)
        return (
            <div>
                <Modal
                    title={'新增用户信息'}
                    visible={visible}
                    onOk={this.handleSubmit}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item
                            label="用户名:"
                            validateStatus={userNameError ? 'error' : ''}
                            help={userNameError || ''}
                        >
                            {getFieldDecorator('userName', {
                                rules: [
                                    {required: true, message: '请输入您的用户名!'},
                                    {pattern: /^[^\s]*$/, message: '用户名不允许输入空格!'},
                                    {validator: this.nameUniqueValidator}
                                ],
                                initialValue:'',
                            })(
                                <Input
                                    placeholder="请输入用户名"
                                />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="姓名:"
                            validateStatus={nameError ? 'error' : ''}
                            help={nameError || ''}
                        >
                            {getFieldDecorator('name', {
                                rules: [
                                    {required: true, message: '请输入您的姓名!'},
                                    {pattern: /^[^\s]*$/, message: '姓名不允许输入空格!'}
                                    ],
                                initialValue:'',
                            })(
                                <Input
                                    placeholder="请输入姓名"/>
                            )}
                        </Form.Item>

                        <Form.Item
                            label="手机号:"
                            validateStatus={mobileError ? 'error' : ''}
                            help={mobileError || ''}
                        >
                            {getFieldDecorator('mobile', {
                                rules: [
                                    {required: true, message: '请输入手机号!'},
                                    {pattern: /^[^\s]*$/, message: '手机号码不允许输入空格!'},
                                    {max: 11, message: '手机号位数不正确!'},
                                    {validator: this.mobileValidValidator}
                                ],
                                initialValue:'',
                            })(
                                <Input
                                    placeholder="请输入手机号"
                                    type="mobile"
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
                                rules: [
                                    {required: true, message: '请输入密码!'},
                                    {pattern: /^[^\s]*$/, message: '密码为数字与字母(区分大小写)组合，不允许包含空格!'}
                                    ],
                                initialValue:'',
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
                                rules: [{required: true, message: '请选择角色类型!'}],
                                // initialValue: '发货员',
                            })(
                                <Select
                                    placeholder="请选择角色"
                                    onChange={(value)=>{
                                        console.log('selected role', value)
                                        this.setState({
                                            currentSelectedRole: value
                                        })
                                    }}
                                >
                                    {
                                        roleList.map(role => {
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

                        {
                            currentSelectedRole !== 1 && currentSelectedRole !== 2
                            && (<Form.Item
                                label="供应商:"
                                hasFeedback
                                validateStatus={vendorError ? 'error' : ''}
                                help={vendorError || ''}
                            >
                                {getFieldDecorator('vendor', {
                                    rules: [{required: true, message: '请选择工厂!'}],
                                    // initialValue: '工厂-1',
                                })(
                                    <Select
                                        mode={currentSelectedRole === 3 ? "multiple" :null}
                                        placeholder="请选择供应商"
                                        autoClearSearchValue={true}
                                    >
                                        {
                                            _vendorList.map(role => {
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
                            </Form.Item>)
                        }
                    </Form>
                </Modal>
            </div>
        );
    }
}

export const NewUserModal = Form.create()(_NewUserModal);