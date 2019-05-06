/**
 *出库-配送出库
 */
import React, {Component} from 'react';
import styled from "styled-components";
import {DispatchList} from "./DispatchList";

class _DeliverDispatchList extends Component {
    render() {
        return (
            <RootView>
                <DispatchList
                    dispatchType="deliver"
                />
            </RootView>
        );
    }
}

export const DeliverDispatchList = _DeliverDispatchList;

const RootView = styled.div`
    background:#eee;
    height: calc(100vh - 60px);
`