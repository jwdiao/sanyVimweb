import React, {Component} from 'react';
import styled from "styled-components";
import { InputItem } from 'antd-mobile'
import {receivedItemsMap} from "../../../utils";

const _ = require('lodash')

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

class _ReceivingConfirmItem extends Component {
    state = {
        inInventoryQuantity:0,
        qualifiedQuantity:0
    }

    render() {
        const { data, indicatorBarColor, onReceivingButtonClicked } = this.props
        const { id, quantity } = data
        let keys = _.keys(data)
        let index = keys.findIndex(key => key === 'id')
        keys.splice(index,1)

        const { inInventoryQuantity, qualifiedQuantity } = this.state
        const errorStateInInventory = (inInventoryQuantity>quantity || inInventoryQuantity <=0) // 为true时 表示有error
        const errorStateQualified = (qualifiedQuantity>quantity|| qualifiedQuantity <=0) // 为true时 表示有error
        return (
            <RootView>
                <IndicatorLeftBar color={indicatorBarColor}/>
                <ContentView>
                    <ReverseButton
                        isEnabled={!errorStateInInventory && !errorStateQualified}
                        onClick={()=>{
                            if (!errorStateInInventory && !errorStateQualified) {
                                console.log('Enabled: ReverseButton clicked! data =  ',data)
                                onReceivingButtonClicked(data, inInventoryQuantity, qualifiedQuantity)
                            } else {
                                console.log('Disabled: ReverseButton clicked! data id = ',id)
                            }
                        }}
                    >
                        收货
                    </ReverseButton>
                    {
                        keys.map((_key, index)=>{
                            // console.log('_key, index', _key, index)
                            return (
                                <ItemWrapper
                                    key={_key}>
                                    <ItemView>
                                        <ContentTitleText>{receivedItemsMap[_key]}</ContentTitleText>
                                        <ContentContentText>{data[_key]}</ContentContentText>
                                    </ItemView>
                                    <SeparateLine/>
                                </ItemWrapper>
                            )
                        })
                    }
                    <ItemView>
                        <ContentTitleText>入库数量</ContentTitleText>
                        <InputNumber
                            className={'input-style'}
                            placeholder="请输入数字"
                            type="money"
                            onChange={(v)=>{
                                this.setState({
                                    inInventoryQuantity: v,
                                })
                            }}
                            clear={false}
                            onBlur={(v) => { console.log('onBlur', v); }}
                            // moneyKeyboardAlign="right"
                            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                            error={errorStateInInventory}
                        />
                    </ItemView>
                    <SeparateLine/>
                    <ItemView>
                        <ContentTitleText>合格数量</ContentTitleText>
                        <InputNumber
                            className={'input-style'}
                            placeholder="请输入数字"
                            type="money"
                            onChange={(v)=>{
                                this.setState({
                                    qualifiedQuantity: v,
                                })
                            }}
                            clear={false}
                            onBlur={(v) => { console.log('onBlur', v); }}
                            // moneyKeyboardAlign="right"
                            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                            error={errorStateQualified}
                        />
                    </ItemView>
                </ContentView>
            </RootView>
        );
    }
}

export const ReceivingConfirmItem = _ReceivingConfirmItem;

const RootView = styled.div`
    background: #fff;
    display: flex;
    flex: 1;
    height:200px;
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
    color: rgba(154, 152, 152, 1);
    font-size: 14px;
`
const ContentContentText = styled.div`
    color: rgba(154, 152, 152, 1);
    font-size: 14px;
`
const ReverseButton = styled.div`
    display: flex;
    height: 26px;
    width: 54px;
    margin-bottom: 10px;
    align-self: flex-end;
    justify-content: center;
    align-items: center;
    border-radius: 27px;
    background: ${p=>p.isEnabled ? 'linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1))':'rgba(206, 208, 214, 1)'};
    color: white;
`

const InputNumber = styled(InputItem)`
    width: 120px;
    &.am-list-line {
    padding-right: 0 !important;
  }
`
