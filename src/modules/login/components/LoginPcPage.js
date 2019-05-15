import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, Input, Icon } from "antd";
import styled from "styled-components";

import { Toast } from 'antd-mobile';
import { Encrypt, http, Durian, FACTORIES} from '../../../utils'

const _ = require('lodash')

class _LoginPcPage extends Component {
  constructor(props) {
    super(props);
    this.userName = "";
    this.password = "";
  }
  componentDidMount() {
    //this.props.form.validateFields();
  }
  clearFormFields = () => {
    console.log('clear input fields');
    this.props.form.resetFields();
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
          console.log('==resp.data==',resp.data)
          let user = _.omit(resp.data, ['page', 'pageSize',]);
          let type = user.type;
          let forwardUrl = '/';
          switch (type) {
            case 1: //1:系统管理员,
              forwardUrl = '/admin';
              break;
            case 2: //2:VMI工厂管理员,
              forwardUrl = '/look-over';
              break;
            case 3: //3:供应商仓管员,
              forwardUrl = '/supplierselect';
              break;
            case 4: //4:供应商发货员,
              forwardUrl = '/shipping';
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
              break;
            default:
              forwardUrl = '/';
          }
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
        <BackgroundImage alt="" src={require('../../../assets/images/bg_login.png')} />
        <ContentView>
          <LoginTableView>
            <LoginLogoView>
              <img style={{ width: '48px', height: '48px', marginBottom: '8px' }} src={require('../../../assets/images/logo.png')} alt="" />
              <div>VMI管理系统</div>
            </LoginLogoView>
            <Form
              onSubmit={this.handleLoginSubmit}
              style={{ width: '100%' }}
            >
              <Form.Item
                validateStatus={userNameError ? 'error' : ''}
                help={userNameError || ''}
                style={{ marginLeft: '10%', width: '80%' }}
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
                style={{ marginLeft: '10%', width: '80%' }}
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
              <Form.Item>
                <LoginButtonsView>
                  <Button type={"primary"} htmlType="submit" style={{ width: '80%' }}>登陆</Button>
                </LoginButtonsView>
              </Form.Item>
            </Form>
          </LoginTableView>
        </ContentView>
      </RootView >
    );
  }
}

export const LoginPcPage = withRouter(Form.create()(_LoginPcPage));;

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

const LoginButtonsView = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  // border: #1DA57A solid 2px;
  justify-content: center;
  align-items: center;
  z-index: 100;
`
