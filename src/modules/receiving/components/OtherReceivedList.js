import React, { Component } from 'react'
import styled from "styled-components";
import {CommonList} from "../../../components";

class _OtherReceivedList extends Component {
    state = {
        isEditState: false
    }
    render() {
        const {isEditState} = this.state
        return (
            <RootView>
                <CommonList
                    listType="OtherReceivedList"
                    isEditState={isEditState}
                />
            </RootView>
        );
    }
}

export const OtherReceivedList = _OtherReceivedList

const RootView = styled.div`
    display:flex;
    flex:1;
    flex-direction: column;
`