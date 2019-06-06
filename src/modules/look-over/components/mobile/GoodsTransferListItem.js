import React, {Component} from 'react';
import styled from "styled-components";
import {generateRandomColor, goodsTransferListItemsMap} from "../../../../utils";

const _ = require('lodash')

class _GoodsTransferListItem extends Component {
    render() {
        const { data, rowID } = this.props
        const { units } = data;
        let keys = _.keys(data)
        _.remove(keys, i => i === 'units');
        return (
            <RootView>
                <IndicatorTopBar color={generateRandomColor(rowID)}/>
                <ContentView>
                    {
                        keys.map((_key, index)=>{
                            let val = data[_key];
                            if (_.indexOf(['quantity', 'inInventoryQuantity', 'qualifiedQuantity', 'unqualifiedQuantity'], _key) >= 0) {
                                val = val + ' ' + units;
                            }
                            return (
                                <ItemWrapper
                                    key={_key}>
                                    <ItemView>
                                        <TitleText>{goodsTransferListItemsMap[_key]}</TitleText>
                                        <ContentContentText>{val}</ContentContentText>
                                    </ItemView>
                                    {
                                        index < keys.length-1 && (
                                            <SeparateLine/>
                                        )
                                    }
                                </ItemWrapper>
                            )
                        })
                    }
                </ContentView>
            </RootView>
        );
    }
}

export const GoodsTransferListItem = _GoodsTransferListItem;

const RootView = styled.div`
    background: #fff;
    display: flex;
    flex: 1;
    height:250px;
    flex-direction: column;
    margin: 0 16px 16px 16px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    box-shadow:0 10px 16px 8px RGBA(229, 233, 243, 1);
    // border: #9a6e3a 2px solid;
`

const IndicatorTopBar = styled.div`
    display: flex;
    // position: relative;
    align-self: flex-start;
    background-color:${p => p.color};
    height: 4px;
    width: 100%;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
`

const ContentView = styled.div`
    display: flex;
    flex:1;
    flex-direction: column;
    z-index: 1;
    width: 100%;
    // height: 226px;
    padding: 10px;
    margin-bottom: -3px;
    justify-content: center;
    border-bottom: 6px dotted RGBA(229, 233, 243, 1);
    // box-shadow:15px 0px 37px 13px RGBA(229, 233, 243, 1);
`

const ItemWrapper = styled.div`
    display:flex;
    flex:1;
    flex-direction:column;
    justify-content:center;
`

const ItemView = styled.div`
    display: flex;
    flex:1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const SeparateLine = styled.div`
    display: flex;
    width: 100%;
    border: rgba(216, 215, 215, 1) dashed 0.5px;
`

const TitleText = styled.div`
    color: #333;
    font-size: 14px;
`

const ContentContentText = styled.div`
    color: #333;
    font-size: 14px;
    font-weight:bold;
`
