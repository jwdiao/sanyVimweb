/**
 *出库-其他出库
 */
import React, {Component} from 'react';
import {DispatchList} from "./DispatchList";
import styled from "styled-components";

class _OtherDispatchList extends Component {
    render() {
        return (
            <RootView>
                <DispatchList
                    dispatchType="others"
                />
            </RootView>
        );
    }
}

export const OtherDispatchList = _OtherDispatchList;

const RootView = styled.div`
    background:#eee;
    height: calc(100vh - 60px);
`