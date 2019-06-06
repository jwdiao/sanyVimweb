import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {Button, Form, Input, message, Select} from "antd";
import styled, { keyframes } from "styled-components";

import { Encrypt, http, FACTORIES, Durian} from '../../../utils'

const _ = require('lodash')
const Option = Select.Option

class _LoginPcPage extends Component {
  constructor(props) {
    super(props);
    this.userName = "";
    this.password = "";
    this.state={
      viewIndex:0, // 标记当前是输入用户名/密码布局(0) 还是 选择供应商布局(1)
      vendorList:[], // 供应商列表（当前登录用户的）
      selectedVendor:'',// 选择的供应商
      tempUserInfo:{} // 用户的信息，暂存
    }
  }
  componentDidMount() {
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
        console.log('resp==',resp)
        if (resp && resp.data) {
          console.log('==resp.data==',resp.data)
          let user = _.omit(resp.data, ['page', 'pageSize',]);
          user.factory = FACTORIES[0];
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
              let result = await http.post('/user/userSupplierList', { userName: user.userName })
              if (result && result.data) {
                let vendors = result.data.map(i => {
                  return {
                    key:i.supplierCode,
                    label: i.supplierName,
                    value: i.supplierCode
                  }
                });
                if (vendors.length>0){
                  this.setState({
                    tempUserInfo: user,
                    vendorList: vendors,
                    viewIndex:1,
                  })
                } else {
                  message.error('登录用户所属供应商为空，请联系系统管理员！')
                }
              } else {
                message.error('登录失败，请稍后重试！')
              }
              break;
            case 4: //4:供应商发货员,
              forwardUrl = '/shipping';
              let params = { userName: user.userName };
              let slist = await http.post('/user/userSupplierList', params)
              if (slist && slist.data) {
                console.log('slist', slist)
                let vendors = slist.data.map(i => {
                  return {
                    label: i.supplierName,
                    value: i.supplierCode
                  }
                });
                if (vendors.length === 0) {
                  forwardUrl = '/';
                  message.error('当前用户所属供应商为空，请联系系统管理员！')
                } else {
                  user.vendor = vendors[0];
                }
              }
              break;
            case 5: //5:供应商管理员
              forwardUrl = '/look-over';
              let paramsSupplierAdmin = { userName: user.userName };
              let slistSupplierAdmin = await http.post('/user/userSupplierList', paramsSupplierAdmin)
              if (slistSupplierAdmin && slistSupplierAdmin.data) {
                console.log('slistSupplierAdmin', slistSupplierAdmin)
                let vendors = slistSupplierAdmin.data.map(i => {
                  return {
                    label: i.supplierName,
                    value: i.supplierCode
                  }
                });
                user.vendor = vendors[0];
              }
              break;
            default:
              forwardUrl = '/';
          }
          Durian.set('user', user);
          this.props.history.push(forwardUrl);
        } else {
          // message.error('登录失败。请检查用户名或密码后重试。')
        }
      } else {
        message.error('登录失败。请检查用户名或密码后重试。')
      }
    });
  }

  handleEnter = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return
      const {selectedVendor, tempUserInfo} = this.state
      if (selectedVendor !== ''){
        Durian.set('user', {...tempUserInfo, vendor: selectedVendor});
        this.props.history.push('/look-over');
      } else {
        message.error('请选择供应商！')
      }
    })
  }

  render() {
    const {
      getFieldDecorator, getFieldError
    } = this.props.form;

    const {viewIndex, vendorList} = this.state

    // Only show error after a field is touched.
    const userNameError = getFieldError('userName');
    const passwordError = getFieldError('password');

    const vendorSelectError = getFieldError('vendor');

    return (
      <RootView>
        <BackgroundImage alt="" src={require('../../../assets/images/pcbg.png')} />
        <ContentView>
          <LoginTableView>
            <LoginLogoView>
              <img style={{ width: '48px', height: '48px', marginBottom: '8px' }} src={require('../../../assets/images/logo.png')} alt="" />
              <div>VMI管理系统</div>
            </LoginLogoView>

            {
               viewIndex === 0 && (
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
               )
            }

            {
              viewIndex === 1 && (
                  <Form
                      onSubmit={this.handleEnter}
                      style={{ width: '100%' }}
                  >
                    <Form.Item
                        style={{ marginLeft: '10%', width: '80%' }}
                    >
                      <div style={{color: "white", fontSize:14}}>请选择供应商：</div>
                    </Form.Item>

                    <Form.Item
                        hasFeedback
                        validateStatus={vendorSelectError ? 'error' : ''}
                        help={vendorSelectError || ''}
                        style={{ marginLeft: '10%', width: '80%' }}
                    >
                      {getFieldDecorator('vendor', {
                        rules: [
                          { required: true, message: '请选择供应商!' },
                        ],
                      })(
                          <Select
                              placeholder={'请选择供应商'}
                              onChange={(value)=>{
                                this.setState({
                                  selectedVendor: vendorList.filter(vendor=>vendor.value === value)[0]
                                })
                              }}
                          >
                            {
                              vendorList.map(option => {
                                return (
                                    <Option
                                        key={option.key}
                                        value={option.value}>
                                      {option.label}
                                    </Option>
                                )
                              })
                            }
                          </Select>
                      )}
                    </Form.Item>
                    <Form.Item>
                      <LoginButtonsView>
                        <Button
                            type={"primary"}
                            htmlType="submit"
                            style={{ width: '37%' }}
                        >进入系统</Button>
                        <Button
                            type={"default"}
                            style={{ width: '37%', marginLeft:'6%'}}
                            onClick={()=>this.setState({
                              viewIndex:0, // 标记当前是输入用户名/密码布局(0) 还是 选择供应商布局(1)
                              vendorList:[], // 供应商列表（当前登录用户的）
                              selectedVendor:'',// 选择的供应商
                              tempUserInfo:{} // 用户的信息，暂存
                            })}
                        >取消</Button>
                      </LoginButtonsView>
                    </Form.Item>
                  </Form>
              )
            }

          </LoginTableView>
        </ContentView>
      </RootView >
    );
  }
}

export const LoginPcPage = withRouter(Form.create()(_LoginPcPage));;

const RootView = styled.div`
  display: flex;
  background: -webkit-radial-gradient(circle farthest-corner at 50% 75%, #0C2A55, #000023); /* Safari 5.1 - 6.0 */
  background: -o-radial-gradient(circle farthest-corner at 50% 75%,, #0C2A55, #000023); /* Opera 11.6 - 12.0 */
  background: -moz-radial-gradient(circle farthest-corner at 50% 75%,, #0C2A55, #000023); /* Firefox 3.6 - 15 */
  background: radial-gradient(circle farthest-corner at 50% 75%, #0C2A55, #000023); /* 标准的语法 */
  height: 100vh;
`
const breathe = keyframes`
    0% {
      opacity: .2;
    }

    100% {
      opacity: 1;
    }
`

const BackgroundImage = styled.img`
  width:60%;
  display: flex;
  flex-direction: column;
  animation-timing-function: ease-in-out;
  animation-name: ${breathe};
  animation-duration: 2700ms;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-name: ${breathe};
  -webkit-animation-duration: 2700ms;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
`

const LoginTableView = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 400px;
  border: rgba(63,91,184,0.2) solid 2px;
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
