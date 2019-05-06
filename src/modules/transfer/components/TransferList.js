import React, { Component } from 'react'
import styled from "styled-components";
import {CommonList} from "../../../components";

class _TransferList extends Component {
    state = {
        isEditState: false
    }
    render() {
        const {isEditState} = this.state
        return (
            <RootView>
                <CommonList
                    listType="TransferList"
                    isEditState={isEditState}
                />
                <OperationBar
                    onClick={()=>{
                        console.log('OperationBar onClick called!')
                        this.setState((previousState) => ({
                            isEditState: !previousState.isEditState
                        }))
                    }}
                >
                    <ContentTitleText>{isEditState ? '取消冲销' : '全选冲销'}</ContentTitleText>
                </OperationBar>
            </RootView>
        );
    }
}

export const TransferList = _TransferList

const RootView = styled.div`
    background:#eee;
    height: calc(100vh - 110px);
`

const OperationBar = styled.div`
    display: flex;
    position: absolute;
    z-index: 1000;
    top:70px;
    align-self: flex-start;
    justify-content: center;
    align-items: center;
    background:linear-gradient(0deg,rgba(9,182,253,1),rgba(96,120,234,1));
    height: 90px;
    width: 26px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
`

const ContentTitleText = styled.div`
    color: #fff;
    width: 26px;
    text-align: center;
    font-size: 14px;
`