import React, { Component } from 'react'
import styled from "styled-components";
import {CommonList} from "../../../components";

class _ReceivedList extends Component {
    render() {
        return (
            <RootView>
                <CommonList
                    listType="ReceivedList"
                />
            </RootView>
        );
    }
}

export const ReceivedList = _ReceivedList

const RootView = styled.div`
    display:flex;
    flex:1;
    flex-direction: column;
`