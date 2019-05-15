import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import {
  WhiteSpace,
  Toast
} from 'antd-mobile';

import {
  Button
} from 'antd'
import { CommonHeader, ExPicker } from "../../../components";
import { http, Durian } from '../../../utils'

const _find = require('lodash/find');
class _SupplierSelectPage extends Component {

  constructor(props) {
    super(props);
    this.from = this.props.location.state?this.props.location.state.from:'';
    this.state = {
      vendors: [],
      pickerValue: []
    }
  }

  componentWillMount() {
    const user = Durian.get('user');
    console.log(`user in Durian`);
    console.log(user);
    if (!user) {
      console.log('user not login redirect to login page!');
      this.props.history.push('/');
    }
    let params = { userName: user.userName };
    http.post('/user/userSupplierList', params)
      .then(resp => {
        console.log(resp);
        if (resp && resp.data) {
          let vendors = resp.data.map(i => {
            return {
              label: i.supplierName,
              value: i.supplierCode
            }
          });
          console.log(vendors);
          this.setState({
            vendors: vendors
          })
        }
      })
      .catch(error => {
        console.error(`SupplierSelectMobilePage:Error from server:${error.msg}`);
      });
  }
  onPickerOk = (val) => {
    console.log(`value from children ${val}`);
    this.setState({
      pickerValue: val,
    });
  };

  onVendorSubmit = () => {
    let vendorCode = this.state.pickerValue;
    //submit vendor value
    console.log(`selected vendor is '${vendorCode}'`);
    if (vendorCode.length === 0) {
      Toast.fail('请选择供应商', 1);
      return false;
    }
    // set vendor to user
    let vendor = _find(this.state.vendors, i => i.value === vendorCode[0]);
    const user = Durian.get('user');
    user.vendor = vendor;
    Durian.set('user', user);
    console.log(user);
    //route to main page
    this.props.history.push('/main');

  }

  render() {

    return (
      <RootView>
        <CommonHeader navBarTitle="供应商" showBackButton={this.from==='my'?true:false} />
        <WhiteSpace size='lg' />
        <ExPicker
          data={this.state.vendors}
          selectedFirst={false}
          cols={1}
          showShadow={true}
          showIcon={true}
          onOk={this.onPickerOk.bind(this)}
          title="请选择供应商"
          titleStyle={{
            fontSize: '0.8rem',
            color: '#bbb'
          }}
          titleIcon="&#xe616;"
          titleIconStyle={{
            color: '#09B6FD',
            fontSize: '1rem'
          }}
        />
        <LoginBtn type="primary" onClick={this.onVendorSubmit}>确定</LoginBtn>
      </RootView>
    )
  }
}
export const SupplierSelectMobilePage = withRouter(_SupplierSelectPage)

const RootView = styled.div`
  height: calc(100vh - 60px);
  background-color: '#F4F5FA'
`
const LoginBtn = styled(Button)`
    width:64%;margin:0 auto;
    height:40px;
    background:linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1));
    margin-top:300px;
    border-radius:40px;
    color:#fff;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
`







