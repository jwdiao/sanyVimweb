import React, {Component} from 'react';
import {ReversedInfoList} from "./ReversedInfoList";
import {Tabs} from "antd-mobile";
import styled from "styled-components";

const tabs = [
    {tabIndex: 0, key:'1', title: '收货冲销'},
    {tabIndex: 1, key:'2', title: '其他入库冲销'},
    {tabIndex: 2, key:'3', title: '其他出库冲销'},
    {tabIndex: 3, key:'4', title: '移库冲销'},
];

class _ReversedInfoMobilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTabIndex: 0,
            hidden: false,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.selectedTabIndex !== this.state.selectedTabIndex || nextProps!==this.props) {
            return true
        }
        return false
    }

    handleTabChange = (tab, index) => {
        // console.log('onChange', index, tab);
        this.setState({
            selectedTabIndex: index
        })
    }

    renderTabContent = () => {
        const {selectedTabIndex} = this.state;
        return (
            <ReversedInfoList
                selectedTab={tabs.filter(tab=>tab.tabIndex === selectedTabIndex)[0].key}
            />
        )
    }

    render() {
        // console.log('inventory info page render called', this.state)
        return (
            <RootView>
                <Tabs
                    prefixCls={'tab-common-class'}
                    tabBarInactiveTextColor="#fff"
                    tabBarActiveTextColor="#fff"
                    tabBarUnderlineStyle={{
                        border: 'none',
                        borderRadius: '0.5vh',
                        backgroundColor: 'transparent',
                        marginLeft: '2%',
                        marginRight: '2%',
                        width: '21%',
                        height: '0.6vh',

                    }}
                    tabs={tabs}
                    initialPage={0}
                    onChange={this.handleTabChange}
                    tabBarPosition="top"
                    renderTab={tab => {
                        return (
                            <SubTabWrapperStyle
                                isSelectedItem={tab.tabIndex === this.state.selectedTabIndex}
                            >
                                {tab.title}
                            </SubTabWrapperStyle>
                        )
                    }}
                >
                </Tabs>
                {this.renderTabContent()}
            </RootView>
        );
    }
}

export const ReversedInfoPage = _ReversedInfoMobilePage;

const RootView = styled.div`
    display: flex;
    flex-direction: column;
    flex:1;
`

const SubTabWrapperStyle = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   background: ${p=>p.isSelectedItem ? 'linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1))' : 'transparent'};
   color: ${p=>p.isSelectedItem ? '#fff' : 'rgba(54, 53, 53, 1)'};
   font-size: 12px;
   height: 28px;
   border-radius: 12px;
   width: 90%;
`
