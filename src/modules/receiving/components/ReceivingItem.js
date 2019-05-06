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
        // let index = keys.findIndex(key => key === 'id')
        //keys.splice(index,1)
        return (
            <RootView
                onClick={()=>{
                    history.push('/main/receiving-confirm', {itemData: data, indicatorBarColor})
                }}
            >
                <IndicatorLeftBar color={indicatorBarColor}/>
                <ContentView>
                    {
                        keys.slice(1,keys.length-1).map((_key, index)=>{
                            // console.log('_key, index', _key, index)
                            return (
                                <ItemWrapper
                                    key={_key}>
                                    <ItemView>
                                        <ContentTitleText>{receivingItemsMap[_key]}</ContentTitleText>
                                        <ContentContentText>{data[_key]}</ContentContentText>
                                    </ItemView>
                                    {
                                        index < keys.length-3 && (
                                            <SeparateLine/>
                                        )
                                    }
                                </ItemWrapper>

                            )
                        })
                    }
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
    border-radius: 2px;
    box-shadow:0 20px 37px 13px RGBA(229, 233, 243, 1);
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
    background-color:rgba(210, 209, 209, 1);
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
`

const SeparateLine = styled.div`
    display: flex;
    width: 100%;
    border: rgba(216, 215, 215, 1) dashed 0.5px;
`
const ContentTitleText = styled.div`
    color: rgba(54, 53, 53, 1);
    font-size: 14px;
`
const ContentContentText = styled.div`
    color: rgba(51, 51, 51, 1);
    font-size: 14px;
`
