import React, { Component } from 'react';
import styled from "styled-components";
import { Tabs } from 'antd-mobile';
import {withRouter} from 'react-router-dom'

import { CommonHeader } from '../../../components'
import { DeliverDispatchList } from './DeliverDispatchList'
import { OtherDispatchList } from './OtherDispatchList'
import {Icon} from "antd";

const tabs = [
  { title: '配送出库', sub: '1' },
  { title: '其他出库', sub: '2' },
];

class _DispatchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
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

    let comp;
    switch (selectedTab) {
      case 0:
        comp = <DeliverDispatchList />
        break;
      case 1:
        comp = <OtherDispatchList />
        break;
      default:
        comp = 'default';
    }
    return comp;
  }

  render() {
      const {history} = this.props
    return (
      <RootView>
        <CommonHeader navBarTitle="出库" showBackButton={false} />
        <Tabs
          className="tab-common-class"
          tabBarBackgroundColor="#5a8cff"
          tabBarInactiveTextColor="#fff"
          tabBarActiveTextColor="#fff"
          tabBarUnderlineStyle={{
            border: 'none',
            borderRadius: '0.5vh',
            backgroundColor: '#fff',
            marginLeft: '2.66%',
            width: '45%',
            height: '0.6vh',

          }}
          tabs={tabs}
          initialPage={0}
          onChange={this.handleTabChange}
          tabBarPosition="top"
          renderTab={tab => <span>{tab.title}</span>}
        >
          {this.renderTabContent()}
        </Tabs>
          {
              this.state.selectedTab === 0 && (
                  <AddButton
                      onClick={()=>{
                          history.push('/main/add-dispatch')
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

export const DispatchPage = withRouter(_DispatchPage)

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
    background:rgba(40, 160, 246, 1);
    height: 64px;
    width: 64px;
    border-radius: 32px;
    box-shadow:0px 8px 16px 8px rgba(71, 138, 239, 0.1);
    margin-top: -15vh;
    margin-bottom: 5vh;
    margin-right: 10vw;
    //&.am-button > .am-button-icon {
    //     // margin-right: 0;
    //     // }
`
