import React, { Component } from 'react';
import styled from "styled-components";
import {
  Button
} from 'antd'
import { CommonHeader } from './components'

class NotFound extends Component {
  render() {
    return (
      <RootView>
        <CommonHeader navBarTitle="页面不存在" showBackButton={true} />
        <PageContent>
          <NotFoundImage alt="" src={require('./assets/images/404.png')} />
          <p>您访问的页面不存在！</p>
          <ReturnBtn>返回</ReturnBtn>
        </PageContent>
      </RootView>
    );
  }
}

export default NotFound;

const RootView = styled.div`
  width:100%;
  background:#fff;
  height: 100vh;
`
const PageContent = styled.div`
  display:flex;
  width:100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const NotFoundImage = styled.img`
  width:34%;
  margin:0 auto;
  margin-top:30%;
`
const ReturnBtn = styled(Button)`
    width:36%;
    margin:0 auto;
    height:36px;
    background:linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1));
    border-radius:40px;
    color:#fff;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
`
