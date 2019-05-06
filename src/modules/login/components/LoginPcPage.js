import React, {Component} from 'react';
import {CommonHeader} from "../../../components";
import {Button, Input, Icon} from "antd";
import styled from "styled-components";
import {PRIMARY_COLOR} from "../../../utils";

class _LoginPcPage extends Component {
    render() {
        return (
            <RootView>
                <BackgroundImage src={require('../../../assets/images/bg_login.png')}/>
                <ContentView>
                    <LoginTableView>
                        <LoginLogoView>
                            <img style={{width:'48px',height:'48px', marginBottom:'8px'}} src={require('../../../assets/images/logo.png')} alt=""/>
                            <div>VMI管理系统</div>
                        </LoginLogoView>

                        <LoginLogoView>
                            <Input
                                placeholder="输入用户名"
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.35)' }} />}
                            />
                            <Input.Password
                                placeholder="输入密码"
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.35)' }} />}
                                style={{marginTop:'16px'}}/>
                        </LoginLogoView>

                        <LoginButtonsView>
                            <Button type={"primary"} style={{marginRight:'20px'}}>登陆</Button>
                            <Button type={"danger"}>重置</Button>
                        </LoginButtonsView>

                    </LoginTableView>
                </ContentView>
            </RootView>
        );
    }
}

export const LoginPcPage = _LoginPcPage;

const RootView = styled.div`
  height: calc(100vh - 60px);
`

const BackgroundImage = styled.img`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`

const LoginLogoView = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 100px;
  // border: red solid 2px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  color: white;
  font-size: xx-large;
  z-index: 100;
`

const ContentView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: white;
  padding-left: 10%;
  padding-right: 10%;
  z-index: 100;
`

const LoginTableView = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 400px;
  border: rgba(63,91,184,0.5) solid 2px;
  border-radius: 4px;
  align-self: flex-end;
  justify-content: center;
  align-items: center;
  background-color: rgba(2,11,40,0.5);
  z-index: 100;
`

const LoginButtonsView = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  // border: #1DA57A solid 2px;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  z-index: 100;
`
