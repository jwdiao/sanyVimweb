/**
 *出库-配送出库
 */
import React, {Component} from 'react';
import styled from "styled-components";
import {CommonList} from "../../../components";

class _DispatchList extends Component {
    render() {
        const {dispatchType} = this.props
        return (
            <RootView>
                <CommonList
                    listType="DispatchList"
                    dispatchType={dispatchType}
                />
            </RootView>
        );
    }
}

export const DispatchList = _DispatchList;

const RootView = styled.div`
    background:#eee;
    height: calc(100vh - 60px);
`