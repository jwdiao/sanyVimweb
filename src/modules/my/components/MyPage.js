import React, { Component } from 'react';
import styled from "styled-components";
import { WhiteSpace } from 'antd-mobile';

import OperationList from './OperationList'

class _MyPage extends Component {

  render() {
    const data = [
      {
        key: "1",
        icon:<span className='iconfont' style={{ fontSize: '1rem', color: '#fff', padding:'0.5rem', borderRadius:'0.2rem',  backgroundColor:'#4EC7FF' }}>&#xe611;</span>,
        text:"供应商切换"
      },
      {
        key: "2",
        icon:<span className='iconfont' style={{ fontSize: '1rem', color: '#fff', padding:'0.5rem', borderRadius:'0.2rem',  backgroundColor:'#47F3A0' }}>&#xe610;</span>,
        text:"查询报表信息"
      }
    ];
    return (
      <RootView>
        <HeaderBackGroundWrapper>
          <HeaderBackGround />
          <HeaderTitle>我的</HeaderTitle>
        </HeaderBackGroundWrapper>
        <MainPanel>
          <ProfilePanel>
            <ProfileImage src={require('../../../assets/images/avatar.png')} alt="vmi" />
            <ProfileContent>
              <ProfileName>WANG XIAOLIU</ProfileName>
              <ProfileVendor>供应商A</ProfileVendor>
            </ProfileContent>
          </ProfilePanel>
          <WhiteSpace size="lg" />
          <OperationPanel>
            <OperationTitle>
              <IndicatorLeftBar color="rgba(233, 106, 161, 1)" />
              <OperationTitleText>切换设置</OperationTitleText>
            </OperationTitle>
            <WhiteSpace size="lg" />
            <OperationList width="90%" data = {data} />
          </OperationPanel>
        </MainPanel>
      </RootView>
    );
  }
}

export const MyPage = _MyPage

const RootView = styled.div`
  width:100%;
  height: calc(100vh - 60px);
`
const HeaderBackGroundWrapper = styled.div`
  width: 100%;
  height:50vw;
  position:relative;
  overflow:hidden;
`
const HeaderBackGround = styled.div`
  width: 120vw;
  height: 70vw;
  background: #3D73CC;
  border-radius: 50% / 50%;
  position:absolute;
  left:-10vw;
  top:-20vw;
`
const HeaderTitle = styled.p`
  position: relative;
  color: #fff;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 3vh;
`
const MainPanel = styled.div`
  width: 100vw;
  position:relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const ProfilePanel = styled.div`
  width: 88vw;
  height:20vh;
  border-radius:0.2rem;
  margin-top:-12vh;
  background-color: #fff;
  box-shadow: 7px 0px 10px 0px rgba(53,116,250,0.2);
`
const ProfileImage = styled.img`
  width: 6rem;
  height:6rem;
  border-radius:50%;
  display:flex;
  position:relative;
  margin:0 auto;
  margin-top:-3rem;
  background:#fff;
`
const ProfileContent = styled.div`
  width: 100%;
  padding-top:3vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const ProfileName = styled.div`
  font-weight:bold;
  font-size:1.2rem;
`
const ProfileVendor = styled.div`
  font-size:1rem;
  color:#aaa;
`
const OperationPanel = styled.div`
  width: 88vw;
  border-radius:0.2rem;
  background-color: #fff;
  padding-top:3vh;
  box-shadow: 7px 4px 18px 0px rgba(53,116,250,0.2);
`
const OperationTitle = styled.div`
  width:100%;
  height:22px;
`
const OperationTitleText = styled.div`
  font-size:1rem;
  color:#7B7B7B;
  float:left;
  text-indent:0.6rem;
`
const IndicatorLeftBar = styled.div`
    display: flex;
    float:left;
    // position: relative;
    align-self: flex-start;
    background-color:${p => p.color};
    height: 22px;
    width: 4px;
    border-top-left-radius: 2px;
`