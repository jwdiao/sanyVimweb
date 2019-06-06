import React, {Component} from 'react';
import styled from "styled-components";
import {otherReceivedItemsMap} from "../../../utils";

const _ = require('lodash')

class _AddDeliverDispatchInfoItem extends Component {
    render() {
        const material = this.props.data
        const { units } = material.material;
        console.log('_AddDeliverDispatchInfoItem material', material);
        console.log('_AddDeliverDispatchInfoItem units', units);
        let materialKeys = _.keys(material)
        _.remove(materialKeys, i => i === 'units');
        // let index = materialKeys.findIndex(material=>material === 'id')
        // materialKeys.splice(index,1)
        return (
            <RootView>
                <OperationHeader>
                    <StyledButton isEnabled={false} onClick={() => this.props.onDelete(material)}>删除</StyledButton>
                    <StyledButton isEnabled={true} onClick={() => this.props.onEdit(material)}>修改</StyledButton>
                </OperationHeader>
                <ContentView>
                    {
                        materialKeys.slice(1,materialKeys.length).map((materialKey, index) => {
                            let val = material[materialKey].label;
                            if (_.indexOf(['quantity', 'inInventoryQuantity', 'qualifiedQuantity'], materialKey) >= 0) {
                                val = val + ' ' + units;
                            }
                            return (
                                <ItemWrapper
                                    key={materialKey}>
                                    <ItemView>
                                        <TitleText>{otherReceivedItemsMap[materialKey]}</TitleText>
                                        <ContentContentText>{val}</ContentContentText>
                                    </ItemView>
                                    {
                                        index < materialKeys.length-2 && (
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

export const AddDeliverDispatchInfoItem = _AddDeliverDispatchInfoItem;

const RootView = styled.div`
    background:#fff;
    height: 138px;
    // border: 1px red solid;
`
const ContentView = styled.div`
    display: flex;
    flex:1;
    flex-direction: column;
    z-index: 1;
    width: 100%;
    height: 98px;
    padding: 10px;
    justify-content: center;
    //border-top: 1px rgba(216, 215, 215, 1) solid;
    //border-bottom: 6px dotted RGBA(229, 233, 243, 1);
    // box-shadow:15px 0px 37px 13px RGBA(229, 233, 243, 1);
    // border: 2px green solid;
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

const OperationHeader = styled.div`
    display: flex;
    width: 100%;
    height: 40px;
    justify-content: flex-end;
    align-items: center;
    // border: 1px black solid;
`

const StyledButton = styled.div`
    display: flex;
    height: 26px;
    width: 80px;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-left: 6px;
    margin-right: 6px;
    border-radius: 27px;
    border:${p=>p.isEnabled ?'0' :'1px rgba(55, 149, 243, 1) solid' };
    background: ${p=>p.isEnabled ? 'linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1))':'white'};
    color: ${p=>p.isEnabled ?'white' :'rgba(55, 149, 243, 1)' };
`