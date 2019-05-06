import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import {
    Button,
    Input,
    Form,
} from 'antd';
import './LoginMobile.css';


class _LoginPage extends Component {
    constructor(props) {
        super(props);
        this.userName = "";
        this.password = "";
    }
    componentDidMount() {
        //this.props.form.validateFields();
    }

    handleLoginSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            console.log(values);
            this.props.history.push('/supplierselect');

        });
        console.log(`login as ${this.userName} with password ${this.password}`);
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
                            <img src={require('../../../assets/svg/sanyLogoWhite.svg')} alt="vmi" style={{ width: '30vh' }} />
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
                                    className="login_input"

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
                                    className="login_input"
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
    top: 7vh;
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
    font-size: 1.5rem;
    color: #fff;
    text-align: center;
    width: 100%;
    letter-spacing: 1.4rem;
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
    box-shadow:0px 20px 37px 13px rgba(4,192,211,0.1);
    border-radius:10px;
`

const LoginTitle = styled.div`
    font-size:24px;
    font-weight:bold;
    color:rgba(62,74,89,1);
    line-height:72px;
    display: flex;
    justify-content: flex-start;
    width:100%;
    padding-left: 6%;
    padding-top: 5%;
`

const LoginBtn = styled(Button)`
    width:64%;margin:0 auto;
    height:40px;
    background:linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1));
    border-radius:40px;
    color:#fff;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(-40px);
`




