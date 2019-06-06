import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import {
    InputItem,
    WhiteSpace,
    Toast,
    Modal,
} from 'antd-mobile';
import {
    Button,
} from 'antd'
import { CommonHeader } from "../../../components";
import { http, Durian, Encrypt } from '../../../utils'

const alert = Modal.alert;
class _ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.user = Durian.get("user");
        this.state = {
            showModal:false,
            password: null,
            newpwd: null,
            pwdcfm: null,
        }
    }

    onChangePassword = async () => {
        const { password, newpwd, pwdcfm } = this.state;
        const { password:origin } = this.user;
        console.log(password, newpwd, pwdcfm);
        console.log(origin);
        if (!password  
            || !newpwd 
            || !pwdcfm
            || password === ''
            || newpwd === ''
            || pwdcfm === ''
            ) {
            Toast.fail('请输入所有项！', 1);
            return false;
        }
        if (Encrypt.encryptBy3DES(password).toString() !== origin) {
            Toast.fail('原密码输入不正确！', 1);
            return false;
        }
        if (newpwd !== pwdcfm) {
            Toast.fail('新密码两次输入不一致！', 1);
            return false;
        }
        let params = {
            id: this.user.id,
            password: Encrypt.encryptBy3DES(newpwd).toString(),
        }
        const result = await http.post("/user/addOrUpdateUser", params);
        if (result && result.ret === "200") {
            alert('密码修改成功', '即将跳转到登录页', [
                {   
                    text: '确认', 
                    onPress: () => {
                        Durian.clear();
                        this.props.history.push('/');
                    } 
                },
            ])
        }
    }
    render() {
        if (this.user === null) {
            this.props.history.push('/');
            return;
        }
        return (
            <RootView>
                <CommonHeader navBarTitle="修改密码" showBackButton={true} />
                <WhiteSpace size='lg' />
                <ItemView>
                    <ContentTitleText>原始密码</ContentTitleText>
                    <InputItem
                        className="common-input"
                        type="password"
                        placeholder="请输入原始密码"
                        style={{
                            textAlign: 'right'
                        }}
                        onBlur={(val) => {
                            this.setState({
                                password:val,
                            })
                        }}
                    />
                </ItemView>
                <SeparateLine />
                <ItemView>
                    <ContentTitleText>新密码</ContentTitleText>
                    <InputItem
                        className="common-input"
                        type="password"
                        placeholder="请输入新密码至少6位"
                        style={{
                            textAlign: 'right'
                        }}
                        onBlur={(val) => {
                            this.setState({
                                newpwd:val,
                            })
                        }}
                    />
                </ItemView>
                <SeparateLine />
                <ItemView>
                    <ContentTitleText>新密码确认</ContentTitleText>
                    <InputItem
                        className="common-input"
                        type="password"
                        placeholder="请再次输入新密码"
                        style={{
                            textAlign: 'right'
                        }}
                        onBlur={(val) => {
                            this.setState({
                                pwdcfm:val,
                            })
                        }}
                        
                    />
                </ItemView>
                <SeparateLine />
                <LoginBtn type="primary" htmlType="submit" onClick={this.onChangePassword}>确定</LoginBtn>
            </RootView>
        )
    }
}

export const ChangePassword = withRouter(_ChangePassword);


const RootView = styled.div`
  height: calc(100vh - 60px);
  background-color: #F4F5FA;
`
const LoginBtn = styled(Button)`
    width:64%;
    height:40px;
    background:linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1));
    margin: 200px auto 0;
    border-radius:40px;
    color:#fff;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
`
const ItemView = styled.div`
    display: flex;
    flex:1;
    flex-direction: row;
    height: 45px;
    padding-left: 15px;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    color: #303030;
    font-size: 1rem; 
`
const SeparateLine = styled.div`
    display: flex;
    width: 100%;
    border: rgb(238, 238, 238) solid 0.5px;
`
const ContentTitleText = styled.div`
    margin-left: 0.5rem;
    font-weight: bold;
`