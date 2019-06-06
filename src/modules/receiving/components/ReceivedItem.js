import React, {Component} from 'react';
import styled from "styled-components";
import moment from 'moment';
import freshId from 'fresh-id'
import {receivedItemsMap, receivedMaterialMap, generateRandomColor, http} from "../../../utils";
import {Collapse} from "antd";

const Panel = Collapse.Panel;

const _ = require('lodash')

function callback(key) {
    console.log(key);
}

class _ReceivedItem extends Component {

    constructor (props) {
        super(props);
        this.state = ({
            materials:[]
        });
    }

    async componentWillMount () {
        const { data } = this.props
        const {code } = data
        const dbMat = await http.get(`/orderMaterial/find/ordercode/${code}`);
        let mats = dbMat.data.map(m => {
            return {
                units: m.units,
                material: m.materiaCode,
                materialDescription: m.materiaName,
                quantity:m.materiaNum,
                inInventoryQuantity:m.totalNumber,
                qualifiedQuantity:m.qualifiedNumber,
                receiveName: m.receiveName,
                receiveTime: moment(m.receiveTime).format('YYYY-MM-DD HH:mm:ss'),
            }
        });
        this.setState({
            materials: mats
        })
    }

    render() {
        const { data, rowID } = this.props
        let keys = _.keys(data)
        let index = keys.findIndex(key => key === 'id')
        keys.splice(index,1)
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
                                <ItemWrapper style={{flexDirection:'row'}}>
                                    <ItemView>
                                        <TitleText style={{display:'flex', flex:0.3, textAlign:'justify'}}>{receivedItemsMap['code']}</TitleText>
                                        <HeaderContentText style={{display:'flex', flex:0.7}}>{data['code']}</HeaderContentText>
                                    </ItemView>
                                </ItemWrapper>
                                <ItemWrapper style={{flexDirection:'row'}}>
                                    <ItemView>
                                        <TitleText style={{display:'flex', flex:0.3, textAlign:'justify'}}>{receivedItemsMap['receiveCode']}</TitleText>
                                        <HeaderContentText style={{display:'flex', flex:0.7}}>{data['receiveCode']}</HeaderContentText>
                                    </ItemView>
                                </ItemWrapper>
                                <ItemWrapper style={{flexDirection:'row'}}>
                                    <ItemView>
                                        <TitleText style={{display:'flex', flex:0.3, textAlign:'justify'}}>{receivedItemsMap['receiveTime']}</TitleText>
                                        <HeaderContentText style={{display:'flex', flex:0.7}}>{data['receiveTime']}</HeaderContentText>
                                    </ItemView>
                                </ItemWrapper>
                            </HeaderView>
                        }
                        key="1"
                        showArrow={true}
                    >
                        <ContentView>
                            {
                                this.state.materials.map((material, mIndex)=>{
                                    // console.log('_key, index', _key, index)
                                    const { units } = material;
                                    let _keys = _.keys(material)
                                    _.remove(_keys, i => i === 'units');
                                    let itemStyle = {
                                        display:'flex', 
                                        flex:1, 
                                        flexDirection:'column', 
                                        justifyContent:'center', 
                                        padding:'10px 26px 26px'
                                    }
                                    if (mIndex !== this.state.materials.length-1) {
                                        itemStyle.borderBottom = '1px rgba(216, 215, 215, 1) solid';
                                    }
                                    return (
                                        <div
                                            key={freshId()}
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
                                                                <TitleText>{receivedMaterialMap[key]}</TitleText>
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
    flex-direction: column;
    z-index: 100;
    width: 100%;
    //height: 96px;
    padding: 0 10px 20px 0;
    justify-content: center;
`

const ContentView = styled.div`
    display: flex;
    flex-direction: column;
    z-index: 1;
    width: 100%;
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
const ExpandIcon = styled.div`
    width:16px;
`
const ExpandIconItem = styled.div`
    height:3px;
    border-top:1px solid #333;
`