import React, {Component} from 'react';
import styled from "styled-components";
import {transferItemsMap, generateRandomColor} from "../../../utils";

const _ = require('lodash')

class _TransferItem extends Component {

    render() {
        const { data, isEditState, rowID } = this.props
        // console.log('this.props = ',this.props)
        const { id } = data
        let keys = _.keys(data)
        let index = keys.findIndex(key => key === 'id')
        keys.splice(index,1)
        return (
            <RootView>
                <IndicatorTopBar color={generateRandomColor(rowID)}/>
                <HeaderView>
                    <HeaderTextView>
                        {
                            keys.slice(0,3).map((_key, index)=>{
                                // console.log('_key, index', _key, index)
                                return (
                                    <ItemWrapper
                                        key={_key}
                                        style={{flexDirection:'row'}}>
                                        <ItemView>
                                            <TitleText style={{display:'flex', flex:0.3, textAlign:'justify'}}>{transferItemsMap[_key]}</TitleText>
                                            <HeaderContentText style={{display:'flex', flex:0.7}}>{data[_key]}</HeaderContentText>
                                        </ItemView>
                                    </ItemWrapper>

                                )
                            })
                        }
                    </HeaderTextView>
                    { true && (
                        <ReverseButton
                            onClick={()=>{
                                console.log('ReverseButton clicked! data id = ',id)
                            }}
                        >
                            冲销
                        </ReverseButton>
                    )}
                </HeaderView>
                <ContentView>
                    {
                        keys.slice(3,keys.length).map((_key, index)=>{
                            // console.log('_key, index', _key, index)
                            return (
                                <ItemWrapper
                                    key={_key}>
                                    <ItemView>
                                        <TitleText>{transferItemsMap[_key]}</TitleText>
                                        <ContentContentText>{data[_key]}</ContentContentText>
                                    </ItemView>
                                    {
                                        index < keys.length-4 && (
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

export const TransferItem = _TransferItem;

const RootView = styled.div`
    background: #fff;
    display: flex;
    flex: 1;
    height:317px;
    flex-direction: column;
    margin: 16px 16px 16px 20px;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    box-shadow:0 20px 37px 13px RGBA(229, 233, 243, 1);
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

const HeaderView = styled.div`
    display: flex;
    flex:0.3;
    flex-direction: row;
    z-index: 100;
    width: 100%;
    // height: 96px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    // border: 1px yellow solid;
    box-shadow:0 0 30px 0 RGBA(229, 233, 243, 1) inset;
`

const HeaderTextView = styled.div`
    display: flex;
    flex:1;
    flex-direction: column;
    z-index: 100;
    width: 100%;  
    height: 100%;  
    justify-content: center;
    // border: 1px red solid;
`

const ContentView = styled.div`
    display: flex;
    flex:0.7;
    flex-direction: column;
    z-index: 1;
    width: 100%;
    // height: 226px;
    padding: 10px;
    margin-bottom: -3px;
    justify-content: center;
    border-top: 1px rgba(216, 215, 215, 1) solid;
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

const HeaderContentText = styled.div`
    color: rgba(160, 157, 157, 1);
    font-size: 14px;
`

const ReverseButton = styled.div`
    display: flex;
    z-index: 1000;
    height: 26px;
    width: 54px;
    justify-content: center;
    align-items: center;
    border-radius: 27px;
    background:linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1));
    color: white;
`