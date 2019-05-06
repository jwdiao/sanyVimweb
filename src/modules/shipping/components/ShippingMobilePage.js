import React, {Component} from 'react';
import {CommonHeader} from "../../../components";
import {Tabs} from "antd-mobile";
import {Button} from "antd";
import styled from "styled-components";

const tabs = [
    {title: '工厂发货信息', sub: '1'},
    {title: 'VMI收货信息', sub: '2'},
    {title: '待发货信息', sub: '3'},
];

class _ShippingMobilePage extends Component {
    render() {
        return (
            <RootView>
                <CommonHeader navBarTitle="发货" showBackButton={false}/>
                <Tabs
                    tabs={tabs}
                    initialPage={0}
                    tabBarPosition="top"
                    renderTab={tab => <span>{tab.title}</span>}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        backgroundColor: '#fff'
                    }}>
                        工厂发货信息
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#fff'
                    }}>
                        VMI收货信息
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        backgroundColor: '#fff'
                    }}>
                        待发货信息
                    </div>
                </Tabs>
                <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon="plus"
                    style={{
                        display:'flex',
                        position:'absolute',
                        bottom:'40px',
                        right:'40px',
                        flexDirection:'column',
                        justifyContent:'center',
                        alignItems:'center',
                        marginTop:'-100px'
                    }}
                >
                </Button>

            </RootView>
        );
    }
}

export const ShippingMobilePage = _ShippingMobilePage;

const RootView = styled.div`
  height: calc(100vh - 60px);
`