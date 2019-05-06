import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import {
    InputItem,
    WhiteSpace
} from 'antd-mobile';

import {
    Button
} from 'antd'
import { CommonHeader, ExPicker } from "../../../components";
import {CommonDialog} from "../../../components/CommonDialog";

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

const vendor = [
    {
        label: '供应商1',
        value: 'vendor1',
    },
    {
        label: '供应商2',
        value: 'vendor2',
    },
    {
        label: '供应商3',
        value: 'vendor3',
    },
];
class _SelectOtherReceivingItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inInventoryQuantity:0,
            pickerValue: [],
            dataSet:{},
            showModal: false,
        }
    }

    onPickerOk = (val, type) => {
        console.log(`value from children ${val} ${type}`);
        this.setState((prevState) => {
            return {
                pickerValue: val,
                dataSet: Object.assign({},prevState.dataSet, {[type]:val[0]})
            }
        });
    };

    onVendorSubmit = () => {
        let vendor = this.state.pickerValue;
        //submit vendor value
        console.log(`selected vendor is ${vendor}`);
        //route to main page
        this.setState({
            showModal: true
        })
    }

    onBtn1Clicked = () => {
        this.setState({
            showModal: false
        })
    }

    onBtn2Clicked = () => {
        this.setState({
            showModal: false
        }, ()=>{
            this.props.history.replace('/main/add-receiving', {});
        })
    }

    onModalCanceled = () => {
        this.setState({
            showModal: false
        })
    }

    render() {
        const{dataSet, showModal, inInventoryQuantity} = this.state
        const errorStateInInventory = (inInventoryQuantity <=0) // 为true时 表示有error

        return (
            <RootView>
                <CommonHeader navBarTitle="选择其他入库信息" showBackButton={true} />
                <WhiteSpace size='lg' />
                <ExPicker
                    data={vendor}
                    selectedFirst={true}
                    cols={1}
                    onOk={(val)=>this.onPickerOk(val, '物料')}
                    pickerStyle={{
                        borderBottom:'1px solid #eee',
                    }}
                    title="物料"
                    titleStyle={{
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        color: '#303030'
                    }}
                    titleIcon="&#xe66b;"
                    titleIconStyle={{
                        color: '#09B6FD',
                        fontSize: '1.6rem'
                    }}
                    extraStyle={{
                        color: '#303030'
                    }}
                />
                <ExPicker
                    data={vendor}
                    selectedFirst={true}
                    cols={1}
                    onOk={(val)=>this.onPickerOk(val, '描述')}
                    pickerStyle={{
                        borderBottom:'1px solid #eee',
                    }}
                    title="描述"
                    titleStyle={{
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        color: '#303030'
                    }}
                    titleIcon="&#xe66b;"
                    titleIconStyle={{
                        color: '#09B6FD',
                        fontSize: '1.6rem'
                    }}
                    extraStyle={{
                        color: '#303030'
                    }}
                />
                <ItemView>
                    <ContentTitleText>数量</ContentTitleText>
                    <InputNumber
                        className={'input-style'}
                        placeholder="请输入数字"
                        type="money"
                        onChange={(v)=>{
                            this.setState((prevState) => {
                                return {
                                    inInventoryQuantity: v,
                                    dataSet: Object.assign({},prevState.dataSet, {'数量':v})
                                }
                            });
                        }}
                        clear={false}
                        onBlur={(v) => { console.log('onBlur', v); }}
                        // moneyKeyboardAlign="right"
                        moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                        error={errorStateInInventory}
                    />
                </ItemView>
                <SeparateLine />
                <ExPicker
                    data={vendor}
                    selectedFirst={true}
                    cols={1}
                    onOk={(val)=>this.onPickerOk(val, '库位')}
                    pickerStyle={{
                        borderBottom:'1px solid #eee',
                    }}
                    title="库位"
                    titleStyle={{
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        color: '#303030'
                    }}
                    titleIcon="&#xe66b;"
                    titleIconStyle={{
                        color: '#09B6FD',
                        fontSize: '1.6rem'
                    }}
                    extraStyle={{
                        color: '#303030'
                    }}
                />
                <ExPicker
                    data={vendor}
                    selectedFirst={true}
                    cols={1}
                    onOk={(val)=>this.onPickerOk(val, '原因')}
                    pickerStyle={{
                        borderBottom:'1px solid #eee',
                    }}
                    title="原因"
                    titleStyle={{
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        color: '#303030'
                    }}
                    titleIcon="&#xe66b;"
                    titleIconStyle={{
                        color: '#09B6FD',
                        fontSize: '1.6rem'
                    }}
                    extraStyle={{
                        color: '#303030'
                    }}
                />
                <LoginBtn type="primary" htmlType="submit" onClick={this.onVendorSubmit}>确定</LoginBtn>
                <CommonDialog
                    headerText="保存入库信息"
                    contents={dataSet}
                    funcButton1Text="修改"
                    funcButton2Text="确定"
                    onBtn1Clicked={this.onBtn1Clicked}
                    onBtn2Clicked={this.onBtn2Clicked}
                    onModalCanceled={this.onModalCanceled}
                    showModal={showModal}
                />
            </RootView>
        )
    }
}
export const AddOtherReceivingInfoDetail = withRouter(_SelectOtherReceivingItem)

const RootView = styled.div`
  height: calc(100vh - 60px);
  background-color: #F4F5FA;
`
const LoginBtn = styled(Button)`
    width:64%;
    height:40px;
    background:linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1));
    margin: 300px auto 0;
    border-radius:40px;
    color:#fff;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
`
const ItemView = styled.div`
    display: flex;
    flex:1;
    flex-direction: row;
    height: 45px;
    padding-left: 15px;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    color: #303030;
    font-size: 1rem; 
`
const SeparateLine = styled.div`
    display: flex;
    width: 100%;
    border: rgb(238, 238, 238) solid 0.5px;
`

const ContentTitleText = styled.div`
    margin-left: 0.5rem;
    font-weight: bold;
`

const InputNumber = styled(InputItem)`
    width: 150px;
    &.am-list-line {
    padding-right: 0 !important;
  }
`







