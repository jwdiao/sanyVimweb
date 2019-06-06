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
            </RootView>
        );
    }
}

export const TransferList = _TransferList

const RootView = styled.div`
    background:#eee;
    height: calc(100vh - 110px);
`