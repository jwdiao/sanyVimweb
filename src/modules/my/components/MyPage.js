import React, { Component } from 'react';
import styled from "styled-components";
import { WhiteSpace } from 'antd-mobile';
import {withRouter} from 'react-router-dom'
import { Modal } from "antd-mobile";

import OperationList from './OperationList'
import { Durian } from '../../../utils'

const alert = Modal.alert;

class _MyPage extends Component {

  constructor (props) {
    super(props);
    this.user = null;
  }

  componentWillMount () {
    this.user = Durian.get('user');
    console.log(this.user);
  }

  onClickListener =({itemKey})=> {
    console.log('onClickListener called', itemKey)
    switch (itemKey) {
      case 'change_vendor':
        this.props.history.push('/supplierselect', {from: 'my'});
        break
      case 'view_report':
        this.props.history.push('/look-over', {from: 'my'})
        break
      case 'change_password':
        this.props.history.push('/changepwd', {from: 'my'})
        break
      case 'log_off':
        alert('退出确认', '确认退出登录？', [
          { text: '取消', onPress: () => console.log('cancel') },
          { text: '确认', onPress: () => this.logOff() },
      ])
        break
      default:
        break
    }
  }

  logOff = () => {
    Durian.clear();
    this.props.history.push('/');
  }
  render() {
    const data = [
      {
        key: "change_vendor",
        icon:<span className='iconfont' style={{ fontSize: '1rem', color: '#fff', padding:'0.3rem', borderRadius:'0.2rem',  backgroundColor:'#4EC7FF' }}>&#xe611;</span>,
        text:"供应商切换"
      },
      {
        key: "view_report",
        icon:<span className='iconfont' style={{ fontSize: '1rem', color: '#fff', padding:'0.3rem', borderRadius:'0.2rem',  backgroundColor:'#47F3A0' }}>&#xe610;</span>,
        text:"查询报表信息"
      },
      {
        key: "change_password",
        icon:<span className='iconfont' style={{ fontSize: '1.2rem', color: '#fff', padding:'0.3rem', borderRadius:'0.2rem',  backgroundColor:'#FFC64D' }}>&#xe647;</span>,
        text:"修改密码"
      },
      {
        key: "log_off",
        icon:<span className='iconfont' style={{ fontSize: '1.2rem', color: '#fff', padding:'0.3rem', borderRadius:'0.2rem',  backgroundColor:'#FF7E7E' }}>&#xe657;</span>,
        text:"退出"
      },
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
              <ProfileName>{this.user.name}</ProfileName>
              <ProfileVendor>{this.user.vendor.label}</ProfileVendor>
            </ProfileContent>
          </ProfilePanel>
          <WhiteSpace size="lg" />
          <OperationPanel>
            <OperationTitle>
              <IndicatorLeftBar color="rgba(233, 106, 161, 1)" />
              <OperationTitleText>切换设置</OperationTitleText>
            </OperationTitle>
            <WhiteSpace size="lg" />
            <OperationList
                width="90%"
                data = {data}
                onClickListener={this.onClickListener}
            />
          </OperationPanel>
        </MainPanel>
       
      </RootView>
    );
  }
}

export const MyPage = withRouter(_MyPage)

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
  padding-top:1vh;
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
