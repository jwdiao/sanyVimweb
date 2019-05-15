import React, {Component} from 'react';
import styled from "styled-components";

import { Collapse } from 'antd';
import {dispatchItemsMap, generateRandomColor} from "../../../utils";

const Panel = Collapse.Panel;

const _ = require('lodash')

function callback(key) {
    console.log(key);
}

class _DispatchItem extends Component {

    render() {
        const { data, rowID, dispatchType } = this.props
        const { id, materials } = data
        let keys = _.keys(data)
        console.log('data:', data);
        // let index = keys.findIndex(key => key === 'id')
        // keys.splice(index,1)
        return (
            <RootView>
                <IndicatorLeftBar color={generateRandomColor(rowID)}/>
                <Collapse
                    accordion
                    className="collapse-common-class"
                    bordered={false}
                    onChange={callback}
                    expandIcon={ (panelProps) => {
                        return (
                            <ExpandIcon>
                                <ExpandIconItem></ExpandIconItem>
                                <ExpandIconItem></ExpandIconItem>
                                <ExpandIconItem></ExpandIconItem>
                            </ExpandIcon>
                        )
                        }
                    }
                    style={{
                        width:'100%', 
                    }}
                >
                    <Panel
                        header={
                        <HeaderView>
                            <HeaderTextView>
                                {
                                    keys.slice(3,6).map((_key, index)=>{//1: id, 2: status ignore
                                        // console.log('_key, index', _key, index)
                                        return (
                                            <ItemWrapper
                                                key={_key}
                                                style={{flexDirection:'row'}}>
                                                <ItemView>
                                                    <TitleText style={{display:'flex', flex:0.3, textAlign:'justify'}}>{dispatchItemsMap[_key]}</TitleText>
                                                    <HeaderContentText style={{display:'flex', flex:0.7}}>{data[_key]}</HeaderContentText>
                                                </ItemView>
                                            </ItemWrapper>

                                        )
                                    })
                                }
                            </HeaderTextView>
                            { dispatchType === 'others' && true && (
                                <ReverseButton
                                    onClick={(event)=>{
                                        event.stopPropagation();
                                        console.log('ReverseButton clicked! data id = ',id)
                                        this.props.onReverse(id);
                                    }}
                                >
                                    冲销
                                </ReverseButton>
                            )}
                        </HeaderView>
                    }
                           key="1"
                           showArrow={true}
                    >
                        <ContentView>
                            {
                                materials.map((material, mIndex)=>{
                                    let _keys = _.keys(material)
                                    let id = material.id;
                                    let index = _keys.findIndex(key => key === 'id')
                                    _keys.splice(index,1)
                                    let itemStyle = {
                                        display:'flex', 
                                        flex:1, 
                                        flexDirection:'column', 
                                        justifyContent:'center', 
                                        padding:'10px 26px 26px'
                                    }
                                    if (mIndex !== materials.length-1) {
                                        itemStyle.borderBottom = '1px rgba(216, 215, 215, 1) solid';
                                    }
                                    return (
                                        <div
                                            key={id}
                                            style={itemStyle}
                                        >
                                            {
                                                _keys.map((key,index)=>{
                                                    return (
                                                        <ItemWrapper
                                                            key={key}>
                                                            <ItemView>
                                                                <TitleText>{dispatchItemsMap[key]}</TitleText>
                                                                <ContentContentText>{material[key]}</ContentContentText>
                                                            </ItemView>
                                                            <SeparateLine/>
                                                        </ItemWrapper>

                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </ContentView>
                    </Panel>
                </Collapse>
            </RootView>
        );
    }
}

export const DispatchItem = _DispatchItem;

const RootView = styled.div`
    background: #fff;
    display: flex;
    flex: 1;
    //height:322px;
    flex-direction: column;
    margin:16px 16px -3px 16px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    position:relative;
    overflow:hidden;
    padding-bottom:16px;
    ::before {
        content: ' ';
        width: 100%;
        height: 0;
        position: absolute;
        bottom: -4px;
        border-bottom: 8px dotted #eee;
        left: 4px;
        right: 4px;
    }
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
    flex-direction: row;
    z-index: 100;
    width: 100%;
    height: 96px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    // border: 1px red solid;
    // box-shadow:0 0 30px 0 RGBA(229, 233, 243, 1) inset;
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
    flex-direction: column;
    z-index: 1;
    width: 100%;
    // height: 226px;
    // padding: 10px 0;
    justify-content: center;
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
    padding:5px 0;
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
const ExpandIcon = styled.div`
    width:16px;
`
const ExpandIconItem = styled.div`
    height:3px;
    border-top:1px solid #bbb;
`