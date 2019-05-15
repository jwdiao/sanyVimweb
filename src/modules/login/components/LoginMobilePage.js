import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import {
    Button,
    Input,
    Form,
} from 'antd';
import { Toast } from 'antd-mobile';
import { message } from 'antd';
import { Encrypt, http, Durian, FACTORIES, isPcBrowser } from '../../../utils'

const ispc = isPcBrowser();
const alert = ispc ? message.error : Toast.fail;

const mismatchWarning = (device) => {
    let label = '';
    switch (device) {
        case 1:
            label = 'PC端'; 
            break;
        case 0:
            label = '移动端';
            break;
        default:
            label = '';
    }

    if (device !== 2) {
        console.log('ispc', ispc);
        console.log('devince', device);
        (ispc !== ((device === 1) ? true : false)) && alert(`为了更好的系统体验，请使用${label}访问！`);
    }
    
}
const _ = require('lodash')

class _LoginPage extends Component {
    constructor(props) {
        super(props);
        this.userName = "";
        this.password = "";
    }
    componentDidMount() {
        //this.props.form.validateFields();
    }

    handleLoginSubmit = async (e) => {
        e.preventDefault();
        this.props.form.validateFields( async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let userName = values.userName;
                let password = values.password;
                password = Encrypt.encryptBy3DES(password).toString();
                let params = { userName: userName, password: password };
                let resp = await http.post('/user/login', params)
                if (resp && resp.data) {
                let user = _.omit(resp.data, ['page', 'pageSize',]);
                user.factory = FACTORIES[0];
                let type = user.type;
                let forwardUrl = '/';
                let device = 0;//2:both,1:pc,0:mobile
                switch (type) {
                    case 1: //1:系统管理员(PC),
                        forwardUrl = '/admin'
                        device = 1;
                        break;
                    case 2: //2:VMI工厂管理员,
                        forwardUrl = '/look-over';
                        device = 2;
                        break;
                    case 3: //3:供应商仓管员,
                        forwardUrl = '/supplierselect';
                        device = 0;
                        break;
                    case 4: //4:供应商发货员,
                        forwardUrl = '/shipping';
                        device = 1;

                        let params = { userName: user.userName };
                        let slist = http.post('/user/userSupplierList', params)
                        if (slist && slist.data) {
                            let vendors = slist.data.map(i => {
                            return {
                                label: i.supplierName,
                                value: i.supplierCode
                            }
                            });
                            user.vendor = vendors[0];
                        }
                        break;
                    case 5: //5:供应商管理员
                        forwardUrl = '/look-over';
                        device = 2;
                        break;
                    default:
                        forwardUrl = '/';
                        device = 2;
                }
                mismatchWarning(device);
                Durian.set('user', user);
                this.props.history.push(forwardUrl);
                } else {
                    Toast.fail(resp.msg, 1);
                }
            } else {
                Toast.fail(err, 1);
            }

        });
    }
    render() {
        const {
            getFieldDecorator, getFieldError,
        } = this.props.form;

        // Only show error after a field is touched.
        const userNameError = getFieldError('userName');
        const passwordError = getFieldError('password');

        return (
            <RootView>
                <BackgroundImage alt="" src={require('../../../assets/images/mLogin_bg.png')} />
                <BackgroundContent>
                    <BackroundPanel>
                        <SanyLogoWrapper>
                            <img src={require('../../../assets/svg/sanyLogoWhite.svg')} 
                                alt="vmi" 
                                style={{ width: '34vh' }} />
                        </SanyLogoWrapper>
                        <AppNameText>VMI管理系统</AppNameText>
                    </BackroundPanel>
                </BackgroundContent>
                <Form onSubmit={this.handleLoginSubmit}>
                    <ContentView>
                        <LoginTitle>登录</LoginTitle>
                        <Form.Item
                            validateStatus={userNameError ? 'error' : ''}
                            help={userNameError || ''}
                            style={{ width: '90%' }}
                        >
                            {getFieldDecorator('userName', {
                                rules: [
                                    { required: true, message: '请输入您的用户名!' },
                                ],
                            })(
                                <Input
                                    placeholder="输入您的用户名，姓名拼音"
                                    prefix={<span className="iconfont" style={{ color: '#09B6FD' }}>&#xe613;</span>}
                                    allowClear
                                    className="mob-login-input"

                                />
                            )}
                        </Form.Item>
                        <Form.Item
                            hasFeedback
                            validateStatus={passwordError ? 'error' : ''}
                            help={passwordError || ''}
                            style={{ width: '90%' }}
                        >
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input.Password
                                    placeholder="输入您的密码"
                                    prefix={<span className="iconfont" style={{ color: '#09B6FD' }}>&#xe615;</span>}
                                    style={{ marginTop: '5px' }}
                                    className="mob-login-input"
                                />
                            )}
                        </Form.Item>
                    </ContentView>
                    <Form.Item>
                        <LoginBtn type="primary" htmlType="submit">登录</LoginBtn>
                    </Form.Item>
                </Form>
            </RootView>
        );
    }
}

export const LoginMobilePage = withRouter(Form.create()(_LoginPage));

const RootView = styled.div`
    height: calc(100vh - 60px);
    background-color: '#F4F5FA'
`
const BackgroundImage = styled.img`
    width: 100%;
`
const BackgroundContent = styled.div`
    position: absolute;
    width: 100%;
    top: 8vh;
    left: 0;
`
const BackroundPanel = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
const SanyLogoWrapper = styled.div`
    text-align: center;
`
const AppNameText = styled.p`
    font-size: 1rem;
    color: #fff;
    text-align: center;
    width: 100%;
    letter-spacing: 0.8rem;
    font-family: 'Microsoft Yahei Light';
`
const ContentView = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    margin-left: 6%;
    margin-right: 6%;
    transform: translateY(-20px);
    padding-bottom: 60px;
    box-shadow:0px 10px 16px 8px rgba(4,192,211,0.1);
    border-radius:0.3rem;
`

const LoginTitle = styled.div`
    font-size:1.5rem;
    font-weight:bold;
    color:rgba(62,74,89,1);
    line-height:72px;
    display: flex;
    justify-content: flex-start;
    width:100%;
    padding-left: 8%;
    padding-top: 2%;
    font-family: 'Microsoft Yahei Light';
`

const LoginBtn = styled(Button)`
    width:70%;
    margin:0 auto;
    height:40px;
    background:linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1));
    border-radius:40px;
    color:#fff;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(-40px);
`




