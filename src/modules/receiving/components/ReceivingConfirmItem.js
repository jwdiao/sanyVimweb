import React, {Component} from 'react';
import styled from "styled-components";
import {InputItem, Toast} from 'antd-mobile'
import {receivedMaterialMap} from "../../../utils";

const _ = require('lodash')

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

class _ReceivingConfirmItem extends Component {

    constructor(props) {
        super(props);
        const { quantity } = this.props.data
        this.state = {
            inInventoryQuantity: quantity,
            qualifiedQuantity: quantity
        }
    }
    

    render() {
        const {data, indicatorBarColor, onReceivingButtonClicked, sinkData} = this.props
        console.log('receiving confirm item data', data);
        const {id, quantity,status, units} = data

        let keys = _.keys(data)
        let index = keys.findIndex(key => key === 'id')
        keys.splice(index,1)
        _.remove(keys, i => i === 'status' || i === 'units');
        status === 1 && _.remove(keys, i => _.indexOf(['inInventoryQuantity', 'qualifiedQuantity'], i) !== -1);

        const {inInventoryQuantity, qualifiedQuantity} = this.state

        let errorStateInInventory = false, errorStateQualified = false;
        if (+inInventoryQuantity) {
            if (+inInventoryQuantity <= 0) {
                errorStateInInventory = true;
            }
            if (+inInventoryQuantity > +quantity) {
                errorStateInInventory = true;
            }
        }
 
        if (+qualifiedQuantity) {
            if (+qualifiedQuantity <= 0) {
                errorStateQualified = true;
            }
            if (+qualifiedQuantity > +quantity) {
                errorStateQualified = true;
            }
        }
        if (+inInventoryQuantity && +qualifiedQuantity) {
            if (+qualifiedQuantity > +inInventoryQuantity) {
                errorStateQualified = true;
            }
        }
        
        console.log('error:', errorStateInInventory, errorStateQualified);
        return (
            <RootView>
                <IndicatorLeftBar color={indicatorBarColor}/>
                <ContentView>
                    <ReverseButton
                        isEnabled={status===1 && inInventoryQuantity && qualifiedQuantity && !errorStateInInventory && !errorStateQualified}
                        onClick={() => {
                            if (status === 1) {
                                if (inInventoryQuantity && qualifiedQuantity && !errorStateInInventory && !errorStateQualified) {
                                    console.log('Enabled: ReverseButton clicked! data =  ', data)
                                    onReceivingButtonClicked(data, inInventoryQuantity, qualifiedQuantity)
                                } else {
                                    if (+qualifiedQuantity > +inInventoryQuantity) {
                                        Toast.fail('合格数量不能大于入库数量！', 3);
                                    } else {
                                        Toast.fail('请输入正确的数值！', 1);
                                    }
                                    console.log('Disabled: ReverseButton clicked! data id = ', id)
                                }
                            }
                        }}
                    >
                        {status === 1 ? '收货' : '已收货'}
                    </ReverseButton>
                    {
                        keys.map((_key, index) => {
                            let val = data[_key];
                            if (_.indexOf(['quantity', 'inInventoryQuantity', 'qualifiedQuantity'], _key) >= 0) {
                                val = val + ' ' + units;
                            }
                            return (
                                <ItemWrapper
                                    key={_key}>
                                    <ItemView>
                                        <ContentTitleText>{receivedMaterialMap[_key]}</ContentTitleText>
                                        <ContentContentText>{val}</ContentContentText>
                                    </ItemView>
                                    <SeparateLine/>
                                </ItemWrapper>
                            )
                        })
                    }
                    {status === 1 ?
                        <ItemWrapper>
                            <ItemView>
                                <ContentTitleText>入库数量</ContentTitleText>
                                <ItemInputView>
                                    <InputNumber
                                        className={'input-style'}
                                        placeholder="请输入数字"
                                        type="money"
                                        defaultValue={quantity}
                                        onChange={(v) => {
                                            this.setState({
                                                inInventoryQuantity: v,
                                            })
                                        }}
                                        clear={false}
                                        onBlur={(v) => {
                                            this.setState({
                                                inInventoryQuantity: v,
                                            })
                                            sinkData({
                                                id, 
                                                totalNumber:v,
                                                qualifiedNumber: this.state.qualifiedQuantity,
                                            });
                                        }}
                                        // moneyKeyboardAlign="right"
                                        moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                                        error={errorStateInInventory}
                                    />{units}
                                    </ItemInputView>
                            </ItemView>
                        </ItemWrapper> : null}
                    {status === 1 ?
                        <ItemWrapper>
                            <SeparateLine/>
                            <ItemView>
                                <ContentTitleText>合格数量</ContentTitleText>
                                <ItemInputView>
                                <InputNumber
                                    className={'input-style'}
                                    placeholder="请输入数字"
                                    type="money"
                                    defaultValue={quantity}
                                    onChange={(v) => {
                                        this.setState({
                                            qualifiedQuantity: v,
                                        })
                                    }}
                                    clear={false}
                                    onBlur={(v) => {
                                        this.setState({
                                            qualifiedQuantity: v,
                                        })
                                        sinkData({
                                            id, 
                                            totalNumber:this.state.inInventoryQuantity,
                                            qualifiedNumber: v,
                                        });
                                    }}
                                    // moneyKeyboardAlign="right"
                                    moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                                    error={errorStateQualified}
                                />{units}</ItemInputView>
                            </ItemView>
                        </ItemWrapper> : null}
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
const ItemInputView = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: right;
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
    background: ${p => p.isEnabled ? 'linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1))' : 'rgba(206, 208, 214, 1)'};
    color: white;
`

const InputNumber = styled(InputItem)`
    width: 120px;
    &.am-list-line {
    padding-right: 0 !important;
  }
`
