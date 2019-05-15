import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';

import { ReceivingPage } from '../receiving'
import { DispatchPage } from '../dispatch';
import { TransferPage } from '../transfer';
import { MyPage } from '../my';

class _MainBoard extends Component {
    constructor(props) {
        super(props);
        console.log('props', props);
        this.state = {
            selectedTab: this.props.router.location.state?this.props.router.location.state.selectedTab:'receive',
            hidden: false,
        };
    }

    renderContent() {
        const { selectedTab } = this.state;

        let comp;
        switch (selectedTab) {
            case 'receive':
                comp = <ReceivingPage />
                break;
            case 'dispatch':
                comp = <DispatchPage />;
                break;
            case 'transfer':
                comp = <TransferPage />;
                break;
            case 'my':
                comp = <MyPage />;
                break;
            default:
                comp = <ReceivingPage />
        }
        return comp;
    }

    render() {
        return (
            <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
                <TabBar
                    unselectedTintColor="#949494"
                    tintColor="#33A3F4"
                    barTintColor="white"
                    tabBarPosition="bottom"
                    hidden={this.state.hidden}
                    prerenderingSiblingsNumber={0}
                >
                    <TabBar.Item
                        title="入库"
                        key="receive"
                        icon={<span className="iconfont" style={{fontSize:'1.2rem', color:'#ccc'}}>&#xe601;</span>}
                        selectedIcon={<span className="iconfont" style={{fontSize:'1.2rem', color:'#35A8FF'}}>&#xe601;</span>}
                        selected={this.state.selectedTab === 'receive'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'receive',
                            });
                        }}
                        data-seed="logId"
                    >
                        {this.renderContent()}
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<span className="iconfont" style={{fontSize:'1.2rem', color:'#ccc'}}>&#xe602;</span>}
                        selectedIcon={<span className="iconfont" style={{fontSize:'1.2rem', color:'#35A8FF'}}>&#xe602;</span>}
                        title="出库"
                        key="dispatch"
                        selected={this.state.selectedTab === 'dispatch'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'dispatch',
                            });
                        }}
                        data-seed="logId1"
                    >
                        {this.renderContent()}
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<span className="iconfont" style={{fontSize:'1.2rem', color:'#ccc'}}>&#xe603;</span>}
                        selectedIcon={<span className="iconfont" style={{fontSize:'1.2rem', color:'#35A8FF'}}>&#xe603;</span>}
                        title="移库"
                        key="transfer"
                        selected={this.state.selectedTab === 'transfer'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'transfer',
                            });
                        }}
                    >
                        {this.renderContent()}
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<span className="iconfont" style={{fontSize:'1.2rem', color:'#ccc'}}>&#xe604;</span>}
                        selectedIcon={<span className="iconfont" style={{fontSize:'1.2rem', color:'#35A8FF'}}>&#xe604;</span>}
                        title="我的"
                        key="my"
                        selected={this.state.selectedTab === 'my'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'my',
                            });
                        }}
                    >
                        {this.renderContent()}
                    </TabBar.Item>
                </TabBar>
            </div>
        );
    }
}

export const MainPage = _MainBoard;