import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import {
    InputItem,
    WhiteSpace
} from 'antd-mobile';
import moment from "moment/moment";
import {
    Button
} from 'antd'
import { CommonHeader, ExPicker } from "../../../components";
import {CommonDialog} from "../../../components/CommonDialog";
import { http, Durian, dispatchItemsMap } from '../../../utils'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

const _ = require('lodash')

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
class _AddDeliverDispatchInfoDetail extends Component {

    constructor(props) {
        super(props);
        this.materials = this.props.location.state.materials || [];
        this.material = this.props.location.state.material || {};
        this.state = {
            inInventoryQuantity:0,
            pickerValue: [],
            reasons:[], //原因元数据
            materials:[], //物料元数据
            dataSet: {},
            result: {},
            showModal: false,
        }
    }

    async componentWillMount () {
        console.log('material to be edit:', this.material);
        // 初始化数据集和结果集
        if (this.material && this.material.id) {
            let pmat = Object.assign({}, this.material);
            pmat = _.omit(pmat, ['id'])
            console.log('pmat', pmat);
            let defaultDataset = {};
            _.keys(pmat).map(k => Object.assign(defaultDataset, {[dispatchItemsMap[k]]: pmat[k].label}))
            console.log('defaultDataset', defaultDataset);
            this.setState({
                dataSet: defaultDataset,
                result:this.material
            })
        }
        let type = 'reason';
        const dbReasons = await http.get(`/dynamicProperty/find/type/${type}`);
        if (dbReasons && dbReasons.data && dbReasons.data.length > 0) {
            let reasons = dbReasons.data.filter(m => m.status === 1).map(m => {
                return {
                    label:m.name,
                    value:m.code
                }
            }) ;
            this.setState({
                reasons:reasons
            });
        }
        const user = Durian.get('user');
        const supplierCode = user.vendor.value;
        let params = { supplierCode: supplierCode };
        const dbMat = await http.post('/factorySupplierMaterial/find/all', params);
        if (dbMat && dbMat.data && dbMat.data.content) {
            let materials = dbMat.data.content.map(i => {
              return {
                label: i.materialName,
                value: i.materialCode
              }
            });
            this.setState({
                materials: materials
            })
        }
    }

    onPickerOk = (kv, type) => {
        console.log(`value from children ${kv.label} ${type}`);
        this.setState((prevState) => {
            return {
                pickerValue: [kv.value],
                dataSet: Object.assign({},prevState.dataSet, {[dispatchItemsMap[type]]:kv.label}), 
                result: Object.assign({},prevState.result, {[type]:kv})
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
        this.material.id && _.remove(this.materials, m => m.id.value === this.material.id.value);
        this.materials.push(Object.assign({}, this.state.result, /* {inInventoryTime:moment().format('YYYY-MM-DD HH:mm:ss')} */));
        this.setState({
            showModal: false
        }, ()=>{
            this.props.history.replace('/main/add-dispatch', {materials:this.materials});
        })
    }

    onModalCanceled = () => {
        this.setState({
            showModal: false
        })
    }

    fromVal = (list, val) => {
        return _.find(list, i => i.value === val[0]);
    }

    render() {
        const{dataSet, showModal, inInventoryQuantity} = this.state
        const errorStateInInventory = (inInventoryQuantity <=0) // 为true时 表示有error

        return (
            <RootView>
                <CommonHeader navBarTitle="选择其他入库信息" showBackButton={true} />
                <WhiteSpace size='lg' />
                <ExPicker
                    data={this.state.materials}
                    selectedFirst={false}
                    val={this.material.material ? this.material.material.value:''}
                    cols={1}
                    onOk={(val)=>this.onPickerOk(this.fromVal(this.state.materials, val), 'material')}
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
                {/* <ExPicker
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
                /> */}
                <ItemView>
                    <ContentTitleText>数量</ContentTitleText>
                    <InputNumber
                        className={'input-style'}
                        placeholder="请输入数字"
                        type="money"
                        defaultValue={this.material.quantity ? this.material.quantity.value:''.value}
                        onChange={(v)=>{
                            this.setState((prevState) => {
                                return {
                                    inInventoryQuantity: v,
                                    dataSet: Object.assign({},prevState.dataSet, {[dispatchItemsMap.quantity]:v}),
                                    result: Object.assign({},prevState.result, {quantity:{label:v, value:v}})
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
                    data={this.state.reasons}
                    selectedFirst={false}
                    val={this.material.reason ? this.material.reason.value:''}
                    cols={1}
                    onOk={(val)=>this.onPickerOk(this.fromVal(this.state.reasons, val), 'reason')}
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
                    headerText="保存出库信息"
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
export const AddDeliverDispatchInfoDetail = withRouter(_AddDeliverDispatchInfoDetail)

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







