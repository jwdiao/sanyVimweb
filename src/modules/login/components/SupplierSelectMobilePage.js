import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import {
  WhiteSpace
} from 'antd-mobile';

import {
  Button
} from 'antd'
import { CommonHeader, ExPicker } from "../../../components";

const vendor = [
  {
    label: '供应商1',
    value: 'vendor1',
  },
  {
    label: '供应商2',
    value: 'vendor2',
  },
  {
    label: '供应商3',
    value: 'vendor3',
  },
];
class _SupplierSelectPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pickerValue: []
    }
  }

  onPickerOk = (val) => {
    console.log(`value from children ${val}`);
    this.setState({
      pickerValue: val,
    });
  };

  onVendorSubmit = () => {
    let vendor = this.state.pickerValue;
    //submit vendor value
    console.log(`selected vendor is ${vendor}`);
    //route to main page
    this.props.history.push('/main');
  }

  render() {

    return (
      <RootView>
        <CommonHeader navBarTitle="供应商" showBackButton={false} />
        <WhiteSpace size='lg' />
        <ExPicker
          data={vendor}
          selectedFirst={true}
          cols={1}
          showShadow={true}
          showIcon={true}
          onOk={this.onPickerOk.bind(this)}
          title="请选择供应商"
          titleStyle={{
            fontSize: '1rem',
            color: '#888'
          }}
          titleIcon="&#xe616;"
          titleIconStyle={{
            color: '#09B6FD',
            fontSize: '1.6rem'
          }}
        />
        <LoginBtn type="primary" htmlType="submit" onClick={this.onVendorSubmit}>确定</LoginBtn>
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







