import React, {Component} from 'react';
import styled from "styled-components";
import {TabBar, Tabs} from 'antd-mobile';
import {CommonHeader} from "../../../components";
import {GoodsTransferPage} from "./mobile/GoodsTransferPage";
import {InventoryInfoPage} from "./mobile/InventoryInfoPage";
import {ReversedInfoPage} from "./mobile/ReversedInfoPage";

const tabs = [
    {title: '货物移动', sub: '1'},
    {title: '库存信息', sub: '2'},
    {title: '冲销信息', sub: '3'},
];

class _LookOverMobilePage extends Component {
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
        const {selectedTab} = this.state;

        let comp;
        switch (selectedTab) {
            case 0:
                comp = <GoodsTransferPage/>
                break;
            case 1:
                comp = <InventoryInfoPage/>;
                break;
            case 2:
                comp = <ReversedInfoPage/>;
                break;
            default:
                comp = 'default';
        }
        return comp;
    }

    render() {
        return (
            <RootView>
                <CommonHeader navBarTitle={'查询报表'} showBackButton={true}/>
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
                    initialPage={0}
                    onChange={this.handleTabChange}
                    tabBarPosition="top"
                    renderTab={tab => <span>{tab.title}</span>}
                >
                    {this.renderTabContent()}
                </Tabs>
            </RootView>
        );
    }
}

export const LookOverMobilePage = _LookOverMobilePage;

const RootView = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh);
    overflow: hidden;
    justify-content: flex-start;
`

const RootContentView = styled.div`
    background: #fff;
    display: flex;
    flex-direction: column;
    flex: 1;
    height:calc(100vh - 92px);
    margin:16px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    box-shadow:0 10px 16px 8px RGBA(229, 233, 243, 1);
   //  border: 2px black solid;
`