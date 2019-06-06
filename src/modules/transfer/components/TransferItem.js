import React, {Component} from 'react';
import styled from "styled-components";
import {transferItemsMap, generateRandomColor} from "../../../utils";
import {Collapse} from "antd";
import {Modal} from "antd-mobile";
const Panel = Collapse.Panel;

const alert = Modal.alert;
const _ = require('lodash')

function callback(key) {
    console.log(key);
}

class _TransferItem extends Component {

    render() {
        const { data, rowID } = this.props
        // console.log('this.props = ',this.props)
        const { id, materials } = data
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
                                    <ItemWrapper style={{flexDirection:'row'}}>
                                        <ItemView>
                                            <TitleText style={{display:'flex', flex:0.3, textAlign:'justify'}}>{transferItemsMap['number']}</TitleText>
                                            <HeaderContentText style={{display:'flex', flex:0.7}}>{data['number']}</HeaderContentText>
                                        </ItemView>
                                    </ItemWrapper>
                                    <ItemWrapper style={{flexDirection:'row'}}>
                                        <ItemView>
                                            <TitleText style={{display:'flex', flex:0.3, textAlign:'justify'}}>{transferItemsMap['moveName']}</TitleText>
                                            <HeaderContentText style={{display:'flex', flex:0.7}}>{data['moveName']}</HeaderContentText>
                                        </ItemView>
                                    </ItemWrapper>
                                    <ItemWrapper style={{flexDirection:'row'}}>
                                        <ItemView>
                                            <TitleText style={{display:'flex', flex:0.3, textAlign:'justify'}}>{transferItemsMap['createTime']}</TitleText>
                                            <HeaderContentText style={{display:'flex', flex:0.7}}>{data['createTime']}</HeaderContentText>
                                        </ItemView>
                                    </ItemWrapper>
                                </HeaderTextView>
                                {
                                    true && <ReverseButton
                                        onClick={(event)=>{
                                            event.stopPropagation();
                                            console.log('ReverseButton clicked! data id = ',id)
                                            alert('冲销确认', '是否冲销该条记录？', [
                                                { text: '取消', onPress: () => console.log('cancel') },
                                                { text: '确认', onPress: () => this.props.onReverse(id) },
                                            ])
                                        }}
                                    >
                                        冲销
                                    </ReverseButton>

                                }
                            </HeaderView>
                        }
                        key="1"
                        showArrow={true}
                    >
                        <ContentView>
                            {
                                materials.map((material, mIndex)=>{
                                    const { units } = material;
                                    let _keys = _.keys(material)
                                    _.remove(_keys, i => i === 'units');
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
                                                    let val = material[key];
                                                    if (_.indexOf(['quantity', 'inInventoryQuantity', 'qualifiedQuantity'], key) >= 0) {
                                                        val = val + ' ' + units;
                                                    }
                                                    return (
                                                        <ItemWrapper
                                                            key={key}>
                                                            <ItemView>
                                                                <TitleText>{transferItemsMap[key]}</TitleText>
                                                                <ContentContentText>{val}</ContentContentText>
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

export const TransferItem = _TransferItem;

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
    //height: 96px;
    padding: 0 10px 20px 0;
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
    color: #333;
    font-size: 14px;
`

const ContentContentText = styled.div`
    color: #333;
    font-size: 14px;
    font-weight:bold;
`

const HeaderContentText = styled.div`
    color: #333;
    font-size: 14px;
    font-weight:bold;
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
    border-top:1px solid #333;
`