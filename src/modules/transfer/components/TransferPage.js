import React, {Component} from 'react';
import styled from "styled-components";
import {withRouter} from 'react-router-dom'

import {CommonHeader} from '../../../components'
import {Icon} from "antd";
import {TransferList} from "./TransferList";

class _TransferPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0,
            hidden: false,
        };
    }

    render() {
        const {history} = this.props
        return (
            <RootView>
                <CommonHeader navBarTitle="移库" showBackButton={false}/>
                <div style={{
                    display:'flex',
                    flex:1,
                    flexDirection:'column',
                    background:'green'
                }}>
                    <TransferList/>
                </div>
                <AddButton
                    onClick={() => {
                        history.push('/main/add-transfer', {from: 'transfer'})
                    }}
                >
                    <Icon type={'plus'} style={{color: 'white', fontSize: '24px', fontWeight: 'bolder'}}/>
                </AddButton>

            </RootView>
        );
    }
}

export const TransferPage = withRouter(_TransferPage)

const RootView = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
//   border: red 1px solid;
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
