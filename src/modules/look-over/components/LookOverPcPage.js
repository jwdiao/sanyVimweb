import React, {Component} from 'react';
import {shippingMenuItems as menuItems} from "../../../utils";
import {Avatar, Button, Icon, Layout, Menu} from "antd";
import {TableController} from "../../shipping/containers/TableController";
import styled from "styled-components";

const {
    Header, Sider,
} = Layout;

const SubMenu = Menu.SubMenu;

class _LookOverPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            collapsed: false,
            selectedTabKey: 'goods_transfer_query'
        };
    }

    toggleSideBar = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    logout = () => {
        console.log('logout button clicked!')
    }

    render() {
        const {selectedTabKey, collapsed} = this.state
        const selectedMenuItem = menuItems.filter(item => item.key === selectedTabKey)[0]
        return (
            <RootView>
                <Layout>
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                    >
                        <LogoIconView>
                            <Avatar
                                size={40}
                                src={require('../../../assets/images/logo.png')}/>
                        </LogoIconView>
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={['goods_transfer_query']}
                            selectedKeys={[selectedTabKey]}
                        >
                            <SubMenu
                                key="reports_management"
                                title={<span><Icon type="team"/><span>报表管理</span></span>}
                            >
                                {
                                    menuItems.slice(5).map(item => {
                                        return (
                                            <Menu.Item
                                                key={item.key}
                                                onClick={({item, key, keyPath}) => {
                                                    console.log('reports_management Menu.Item clicked', key)
                                                    this.setState({
                                                        selectedTabKey: key,
                                                    })
                                                }}
                                            >
                                                <Icon type={item.iconType}/>
                                                <span>{item.title}</span>
                                            </Menu.Item>
                                        )
                                    })
                                }
                            </SubMenu>

                        </Menu>
                    </Sider>
                    <Layout>
                        <StyledHeader>
                            <HeaderContainer>
                                <Icon
                                    className="trigger"
                                    type={collapsed ? 'menu-unfold' : 'menu-fold'}
                                    onClick={this.toggleSideBar}
                                />
                                <div>{`${selectedMenuItem.parentTitle}-${selectedMenuItem.title}`}</div>
                            </HeaderContainer>
                            <HeaderContainer>
                                <div style={{fontSize: 18, fontWeight: "normal"}}>username，欢迎您</div>
                                <Button
                                    style={{margin:'0 30px 0 20px'}}
                                    type="primary" icon="logout" size="default">退出</Button>
                            </HeaderContainer>
                        </StyledHeader>
                        <StyledContent>
                            <TableController
                                selectedTabKey={selectedTabKey}
                            />
                        </StyledContent>
                        {/*<Footer>Footer</Footer>*/}
                    </Layout>
                </Layout>
            </RootView>
        );
    }
}

export const LookOverPcPage = _LookOverPage

const RootView = styled.div`
  height: calc(100vh);
  // border: aqua 2px solid;
`
const LogoIconView = styled(Avatar)`
  height: 80px;
  width: 100%;
  background: transparent;
  margin-top: 16px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
`
const StyledHeader = styled(Header)`
  display: flex;
  flex-direction: row;
  background-color: white;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  height: 60px;
  color: #292929;
  font-size: 26px;
  font-weight: bold;
`
const HeaderContainer = styled.div`
  display:flex;
   flex-direction:row; 
   justify-content:space-between;
   align-items:center;
`
const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  padding: 10px;
  background-color: white;
  height: calc(100vh - 82px);
`