import React, {Component} from 'react';
import styled from "styled-components";
import freshId from 'fresh-id'
import {receivedItemsMap, generateRandomColor} from "../../../utils";

const _ = require('lodash')

class _ReceivedItem extends Component {

    render() {
        const { data, rowID } = this.props
        const { id, materials } = data
        let keys = _.keys(data)
        let index = keys.findIndex(key => key === 'id')
        keys.splice(index,1)
        return (
            <RootView>
                <IndicatorLeftBar color={generateRandomColor(rowID)}/>
                <HeaderView>
                    {
                        keys.slice(0,3).map((_key, index)=>{
                            // console.log('_key, index', _key, index)
                            return (
                                <ItemWrapper
                                    key={_key}
                                    style={{flexDirection:'row'}}>
                                    <ItemView>
                                        <TitleText style={{display:'flex', flex:0.3, textAlign:'justify'}}>{receivedItemsMap[_key]}</TitleText>
                                        <HeaderContentText style={{display:'flex', flex:0.7}}>{data[_key]}</HeaderContentText>
                                    </ItemView>
                                </ItemWrapper>

                            )
                        })
                    }
                </HeaderView>
                <ContentView>
                    {
                        materials.map((material)=>{
                            // console.log('_key, index', _key, index)
                            let _keys = _.keys(material)
                            return (
                                <div
                                    key={freshId()}
                                    style={{display:'flex', flex:1, flexDirection:'column', justifyContent:'center', borderBottom:'1px rgba(216, 215, 215, 1) solid', padding:'10px'}}>
                                    {
                                        _keys.map((key,index)=>{
                                            return (
                                                <ItemWrapper
                                                    key={key}>
                                                    <ItemView>
                                                        <TitleText>{receivedItemsMap[key]}</TitleText>
                                                        <ContentContentText>{material[key]}</ContentContentText>
                                                    </ItemView>
                                                    {
                                                        index < _keys.length-1 && (
                                                            <SeparateLine/>
                                                        )
                                                    }
                                                </ItemWrapper>

                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </ContentView>
            </RootView>
        );
    }
}

export const ReceivedItem = _ReceivedItem;

const RootView = styled.div`
    background: #fff;
    display: flex;
    flex: 1;
    //height:322px;
    flex-direction: column;
    margin:16px 16px -3px 16px;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    box-shadow:0 20px 37px 13px RGBA(229, 233, 243, 1);
    border-bottom: 6px dotted RGBA(229, 233, 243, 1);
`

const IndicatorLeftBar = styled.div`
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
    flex-direction: column;
    z-index: 100;
    width: 100%;
    height: 96px;
    padding: 10px;
    justify-content: center;
    // border: 1px red solid;
    box-shadow:0 0 30px 0 RGBA(229, 233, 243, 1) inset;

`

const ContentView = styled.div`
    display: flex;
    flex-direction: column;
    z-index: 1;
    width: 100%;
    // height: 226px;
    // padding: 10px 0;
    justify-content: center;
    border-top: 1px rgba(216, 215, 215, 1) solid;
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