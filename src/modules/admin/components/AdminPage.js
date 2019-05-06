/**
 * 管理员首页
 */

import React, {Component} from 'react';

import {Avatar, Button, Icon, Layout, Menu} from 'antd';
import styled from "styled-components";
import {InputModal} from "./InputModal";
import {TableController} from "./TableController";
import {NewUserModal} from "./NewUserModal";

import {superAdminMenuItems as menuItems} from '../../../utils'

const {
    Header, Sider,
} = Layout;

const SubMenu = Menu.SubMenu;

/**
 * 超级管理员首页
 * PC 端页面
 */
class _AdminPage extends Component {
    state = {
        collapsed: false,
        selectedTabKey: 'sany_factory'
    };

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
                            defaultSelectedKeys={['sany_factory']}
                            selectedKeys={[selectedTabKey]}
                        >
                            <SubMenu
                                key="admin"
                                title={<span><Icon type="team"/><span>基础数据管理</span></span>}
                            >
                                {
                                    menuItems.map(item => {
                                        return (
                                            <Menu.Item
                                                key={item.key}
                                                onClick={({item, key, keyPath}) => {
                                                    console.log('Menu.Item clicked', key)
                                                    this.setState({
                                                        selectedTabKey: key,
                                                        showModal: false,
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
                                <div>{`基础数据管理-${menuItems.filter(item => item.key === selectedTabKey)[0].title}`}</div>
                            </HeaderContainer>
                            <HeaderContainer>
                                <div style={{fontSize: 18, fontWeight: "normal"}}>username，欢迎您</div>
                                <Button
                                    style={{margin: '0 30px 0 20px'}}
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

export const AdminPage = _AdminPage;

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