/**
 * 管理员首页
 */

import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import {Avatar, Button, Icon, Layout, Menu, Popover} from 'antd';
import styled from "styled-components";
import {TableController} from "./TableController";

import {
    superAdminMenuItems as menuItems,
    Durian,
    SIDE_BAR_BACKGROUND_COLOR,
    PRIMARY_TEXT_COLOR,
    SIDE_BAR_BACKGROUND_COLOR_DARKER
} from '../../../utils'
import {PasswordModifyModal} from "../../../components";

const {
    Header, Sider,
} = Layout;

const SubMenu = Menu.SubMenu;

const PopOverContent = ({onModifyPasswordCalled, onLogoutCalled}) => {
    return (
        <div style={{display:'flex', flexDirection: "column"}}>
            <Button
                type={'link'}
                style={{color:PRIMARY_TEXT_COLOR}}
                onClick={onModifyPasswordCalled}
            >
                修改密码
            </Button>
            <Button
                type={'link'}
                style={{color:PRIMARY_TEXT_COLOR}}
                onClick={onLogoutCalled}
            >
                退出登录
            </Button>
        </div>
    )
}

/**
 * 超级管理员首页
 * PC 端页面
 */
class _AdminPage extends Component {
    loginUser = Durian.get('user');
    state = {
        collapsed: false,
        selectedTabKey: 'sany_factory',

        showModal: false,
    };

    toggleSideBar = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    // 修改密码
    onModifyPasswordCalled = () => {
        this.setState({
            showModal: true
        })
    }

    // Modal 确定按钮点击事件监听
    onModalOkButtonClickedListener = () => {
        Durian.clear();
        this.props.history.push('/');
    }

    // Modal 取消按钮点击事件监听
    onModalCancelButtonClickedListener = () => {
        this.setState({
            showModal: false
        })
    }

    // 退出登录
    onLogoutCalled = () => {
        Durian.clear();
        this.props.history.push('/');
    }

    render() {
        const {selectedTabKey, collapsed} = this.state
        return (
            <RootView>
                <Layout>
                    <Sider
                        trigger={null}
                        collapsible={false}
                        collapsed={collapsed}
                        style={{backgroundColor: SIDE_BAR_BACKGROUND_COLOR}}
                    >
                        <LogoContainer>
                            <LogoIconView>
                                <Avatar
                                    size={26}
                                    src={require('../../../assets/images/logo.png')}/>
                            </LogoIconView>
                            {
                                !collapsed && (
                                    <div style={{color: '#8094ac', fontSize:'20px', marginLeft:'10px'}}>VMI管理系统</div>
                                )
                            }
                        </LogoContainer>
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={['sany_factory']}
                            selectedKeys={[selectedTabKey]}
                            style={{backgroundColor: 'transparent'}}
                        >
                            <SubMenu
                                key="admin"
                                title={
                                    <span>
                                        <span className="iconfont" style={{fontSize:'1rem', color:'#8094ac', marginRight: '0.6rem'}}>&#xe618;</span>
                                        {
                                            !collapsed && (
                                                <span>基础数据管理</span>
                                            )
                                        }
                                    </span>
                                }
                                style={{backgroundColor: 'transparent'}}
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
                                                {/*<Icon type={item.iconType}/>*/}
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
                                <div style={{fontSize: 18, fontWeight: "normal"}}>{this.loginUser?this.loginUser.name:''}，欢迎您</div>
                                <Popover content={
                                    <PopOverContent
                                        onModifyPasswordCalled={this.onModifyPasswordCalled}
                                        onLogoutCalled={this.onLogoutCalled}
                                    />
                                }>
                                    <Button
                                        style={{margin: '0 30px 0 20px', color: PRIMARY_TEXT_COLOR}}
                                        type="link"
                                        icon="setting"
                                        size="large"
                                    >
                                        设置
                                    </Button>
                                </Popover>
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
                <PasswordModifyModal
                    modalVisibility={this.state.showModal}
                    onOkClickedListener={this.onModalOkButtonClickedListener}
                    onCancelClickedListener={this.onModalCancelButtonClickedListener}
                />
            </RootView>
        );
    }
}

export const AdminPage = withRouter(_AdminPage);

const RootView = styled.div`
  height: calc(100vh);
  // border: aqua 2px solid;
`
const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: ${SIDE_BAR_BACKGROUND_COLOR_DARKER};
`
const LogoIconView = styled.div`
  display: flex;
  height: 50px;
  // width: 100%;
  background: transparent;
  justify-content: center;
  align-items: center;
  // border: #b3d4fc 2px solid;
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
  font-size: 22px;
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