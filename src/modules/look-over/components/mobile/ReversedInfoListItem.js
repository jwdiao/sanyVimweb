import React, {Component} from 'react';
import styled from "styled-components";
import {generateRandomColor} from "../../../../utils";
import {reversedInfoListItemsMap} from "../../../../utils/ReportsRelatedConstants";

const _ = require('lodash')

class _ReversedInfoListItem extends Component {
    render() {
        const { data, rowID } = this.props
        // // console.log('this.props = ',this.props)
        let keys = _.keys(data)
        // let index = keys.findIndex(key => key === 'id')
        // keys.splice(index,1)
        return (
            <RootView>
                <IndicatorTopBar color={generateRandomColor(rowID)}/>
                <ContentView>
                    {
                        keys.map((_key, index)=>{
                            return (
                                <ItemWrapper
                                    key={_key}>
                                    <ItemView>
                                        <TitleText>{reversedInfoListItemsMap[_key]}</TitleText>
                                        <ContentContentText>{data[_key]}</ContentContentText>
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

export const ReversedInfoListItem = _ReversedInfoListItem;

const RootView = styled.div`
    background: #fff;
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 16px 16px 16px 20px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    box-shadow:0 10px 16px 8px RGBA(229, 233, 243, 1);
    // border: #9a6e3a 2px solid;
    height:215px;
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
    color: rgba(54, 53, 53, 1);
    font-size: 14px;
`

const ContentContentText = styled.div`
    color: rgba(51, 51, 51, 1);
    font-size: 14px;
`
