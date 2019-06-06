import React, { Component } from 'react'
import styled from "styled-components";
import {CommonList} from "../../../components";

class _ReceivingList extends Component {
    render() {
        return (
            <RootView>
                <CommonList
                    listType="ReceivingList"
                />
            </RootView>

        );
    }
}

export const ReceivingList = _ReceivingList

const RootView = styled.div`
    display:flex;
    flex:1;
    flex-direction: column;
`