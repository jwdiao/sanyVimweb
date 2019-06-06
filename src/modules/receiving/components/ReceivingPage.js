import React, { Component } from 'react';
import styled from "styled-components";
import { Tabs } from 'antd-mobile';
import {withRouter} from 'react-router-dom'

import { CommonHeader } from '../../../components'
import { ReceivingList } from './ReceivingList'
import { ReceivedList } from './ReceivedList'
import { OtherReceivedList } from './OtherReceivedList'
import {Icon} from "antd";

const tabs = [
  { title: '待入库', sub: '1' },
  { title: '已入库', sub: '2' },
  { title: '其他入库', sub: '3' },
];

class _ReceivingPage extends Component {
  constructor(props) {
    super(props);
    console.log('receiving page props', props);
    this.state = {
      selectedTab: this.props.location.state?this.props.location.state.tab:0,
      hidden: false,
    };
  }

  handleTabChange = (tab, index) => {
    console.log('onChange', index, tab);
    this.setState({
      selectedTab: index
    })
  }

  renderTabContent() {
    const { selectedTab } = this.state;
    console.log('selectedTab', selectedTab);
    let comp;
    switch (selectedTab) {
      case 0:
        comp = <ReceivingList />
        break;
      case 1:
        comp = <ReceivedList />
        break;
      case 2:
        comp = <OtherReceivedList />
        break;
      default:
        comp = <ReceivingList />
    }
    return comp;
  }

  render() {
      const {history} = this.props
    return (
      <RootView>
        <CommonHeader navBarTitle="入库" showBackButton={false} showMenuButton={true} />
        <Tabs
          tabBarInactiveTextColor="#fff"
          tabBarActiveTextColor="#fff"
          tabBarUnderlineStyle={{
            border: 'none',
            borderRadius: '0.5vh',
            backgroundColor: '#fff',
            marginLeft: '2.66%',
            width: '28%',
            height: '0.6vh',

          }}
          tabs={tabs}
          initialPage={this.state.selectedTab}
          onChange={this.handleTabChange}
          tabBarPosition="top"
          renderTab={tab => <span>{tab.title}</span>}
          prerenderingSiblingsNumber={0}
        >
          {this.renderTabContent()}
        </Tabs>
          {
              this.state.selectedTab === 2 && (
                  <AddButton
                      onClick={()=>{
                          history.push('/main/add-receiving', {from: 'receive', tab:2})
                      }}
                  >
                      <Icon type={'plus'} style={{color:'white', fontSize:'24px', fontWeight:'bolder'}}/>
                  </AddButton>
              )
          }

      </RootView>
    );
  }
}

export const ReceivingPage = withRouter(_ReceivingPage)

const RootView = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
  // border: red 1px solid;
  overflow: hidden;
  justify-content: flex-start;
`

const AddButton = styled.div`
    display: flex;
    z-index: 1000;
    align-self: flex-end;
    justify-content: center;
    align-items: center;
    background:rgba(40, 160, 246, .7);
    height: 64px;
    width: 64px;
    border-radius: 32px;
    box-shadow:0px 8px 16px 8px rgba(71, 138, 239, 0.1);
    margin-top: -15vh;
    margin-bottom: 5vh;
    margin-right: 10vw;
`