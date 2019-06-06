import React, {Component} from 'react';
import styled from "styled-components";
import {withRouter} from 'react-router-dom'
import {receivingItemsMap, generateRandomColor} from "../../../utils";

const _ = require('lodash')
class _ReceivingItem extends Component {

    render() {
        const { data, history, rowID } = this.props
        // console.log('this.props',this.props)
        const { id } = data
        let keys = _.keys(data)
        const indicatorBarColor = generateRandomColor(rowID)
        let index = keys.findIndex(key => key === 'id')
        keys.splice(index,1)
        return (
            <RootView
                onClick={()=>{
                    history.push('/main/receiving-confirm', {itemData: data, indicatorBarColor, from:'receive', tab:0})
                }}
            >
                <IndicatorLeftBar color={indicatorBarColor}/>
                <ContentView>
                    <ItemWrapper>
                        <ItemView>
                            <ContentTitleText>{receivingItemsMap['code']}</ContentTitleText>
                            <ContentContentText>{data['code']}</ContentContentText>
                        </ItemView>
                    </ItemWrapper>
                    <SeparateLine/>
                    <ItemWrapper>
                        <ItemView>
                            <ContentTitleText>{receivingItemsMap['deliveryName']}</ContentTitleText>
                            <ContentContentText>{data['deliveryName']}</ContentContentText>
                        </ItemView>
                    </ItemWrapper>
                    <SeparateLine/>
                    <ItemWrapper>
                        <ItemView>
                            <ContentTitleText>{receivingItemsMap['transportTime']}</ContentTitleText>
                            <ContentContentText>{data['transportTime']}</ContentContentText>
                        </ItemView>
                    </ItemWrapper>
                </ContentView>
                <IndicatorRightBar color={generateRandomColor(id)}>
                    <IndicatorRightBarLine height={'16px'}/>
                    <IndicatorRightBarLine height={'11px'}/>
                </IndicatorRightBar>
            </RootView>
        );
    }
}

export const ReceivingItem = withRouter(_ReceivingItem);

const RootView = styled.div`
    background: #fff;
    display: flex;
    flex: 1;
    height:160px;
    flex-direction: row;
    margin:16px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    box-shadow:0 10px 16px 8px RGBA(229, 233, 243, 1);
`

const IndicatorLeftBar = styled.div`
    display: flex;
    // position: relative;
    align-self: flex-start;
    background-color:${p => p.color};
    height: 31px;
    width: 4px;
    border-top-left-radius: 2px;
`

const IndicatorRightBar = styled.div`
    display: flex;
    flex-direction: row;
    align-self: center;
    justify-content: center;
    align-items: center;
`
const IndicatorRightBarLine = styled.div`
    display: flex;
    align-self: center;
    background-color:#666;
    height: ${p => p.height};
    width: 1px;
    margin-right: 3px;
`

const ContentView = styled.div`
    display: flex;
    flex:1;
    flex-direction: column;
    height: 100%;
    padding: 10px;
    justify-content: center;
    // border: 1px red solid;
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
    color: #333;
`

const SeparateLine = styled.div`
    display: flex;
    width: 100%;
    border: rgba(216, 215, 215, 1) dashed 0.5px;
`
const ContentTitleText = styled.div`
    color: #333;
    font-size: 14px;
`
const ContentContentText = styled.div`
    color: #333;
    font-weight:bold;
    font-size: 14px;
`
