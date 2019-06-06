import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import {
    InputItem,
    WhiteSpace,
    Toast
} from 'antd-mobile';
import {
    Button,
    AutoComplete,
} from 'antd'
import { CommonHeader, ExPicker } from "../../../components";
import {CommonDialog} from "../../../components/CommonDialog";
import { http, Durian, reservoirLibraryList, otherReceivedItemsMap } from '../../../utils'


const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

const _ = require('lodash')

class _SelectOtherReceivingItem extends Component {

    constructor(props) {
        super(props);
        this.materials = this.props.location.state.materials || [];
        this.material = this.props.location.state.material || {};
        this.backToParent = this.props.location.state.backToParent || {};
        this.state = {
            inInventoryQuantity:0,
            pickerValue: [],
            reasons:[], //原因元数据
            materials:[], //物料元数据
            dataSet: {},
            dataSource: [],//autocomplete
            result: {},
            showModal: false,
            units: null,
        }
    }

    async componentWillMount () {
        console.log('material to be edit:', this.material);
        // 初始化数据集和结果集
        if (this.material && this.material.id) {
            const { units } = this.material.material;
            this.setState({
                units: units,
            })
            let pmat = Object.assign({}, this.material);
            pmat = _.omit(pmat, ['id'])
            let defaultDataset = {};
            _.keys(pmat).map(k => {
                let val = pmat[k].label;
                if (_.indexOf(['quantity', 'inInventoryQuantity', 'qualifiedQuantity'], k) >= 0) {
                    val = val + ' ' + units;
                }
                Object.assign(defaultDataset, {[otherReceivedItemsMap[k]]: val})
                return k;
            })
            this.setState({
                dataSet: defaultDataset,
                result:this.material
            })
        }
        // let type = 'reason';
        // const dbReasons = await http.get(`/dynamicProperty/find/type/${type}`);
        // if (dbReasons && dbReasons.data && dbReasons.data.length > 0) {
        //     let reasons = dbReasons.data.filter(m => m.status === 1).map(m => {
        //         return {
        //             label:m.name,
        //             value:m.code
        //         }
        //     }) ;
        //     this.setState({
        //         reasons:reasons
        //     });
        // }
        this.setState({
            reasons:[
                {
                    label: '盘亏入库',
                    value: 'A001',
                },
                {
                    label: '零星入库',
                    value: 'A002',
                },
                {
                    label: '补发货入库',
                    value: 'A003',
                },

            ]
        });
        const user = Durian.get('user');
        const supplierCode = user.vendor.value;
        let params = { supplierCode: supplierCode };
        console.log('params', params);
        const dbMat = await http.post('/factorySupplierMaterial/find/all', params);
        console.log('material list', dbMat);
        if (dbMat && dbMat.data && dbMat.data.content) {
            let materials = dbMat.data.content.map(i => {
              return {
                label: `${i.materialCode}-${i.materialName}`,
                value: i.materialCode,
                units: i.units,
              }
            });
            this.setState({
                materials: materials,
                dataSource: materials.map(i=>i.label),
            })
        }
    }

    onPickerOk = (kv, type) => {
        console.log(`value from children ${kv}, ${type}`);
        if (kv && kv.value) {
            
            this.setState((prevState) => {
                return {
                    pickerValue: [kv.value],
                    dataSet: Object.assign({},prevState.dataSet, {[otherReceivedItemsMap[type]]:kv.label}), 
                    result: Object.assign({},prevState.result, {[type]:kv}),
                    
                }
            });
            // if (type === 'material') {
            //     this.setState({
            //         units: kv.units,
            //     })
            // }
        }
    };

    onVendorSubmit = () => {
        let result = this.state.result;
        let materialValue = _.get(result, 'material.value') || '';
        let quantityValue = _.get(result, 'quantity.value') || '';
        let inventoryPositionValue = _.get(result, 'inventoryPosition.value') || '';
        let reasonValue = _.get(result, 'reason.value') || '';
        if (materialValue === ''
            || quantityValue === ''
            || inventoryPositionValue === ''
            || reasonValue === ''
        ) {
            Toast.fail('请输入所有必要信息！', 1);
            return false;
        }
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
        console.log('this.state.result', this.state.result);
        this.material.id && _.remove(this.materials, m => m.id.value === this.material.id.value);
        // this.materials.push(Object.assign({}, this.state.result, /* {inInventoryTime:moment().format('YYYY-MM-DD HH:mm:ss')} */));
        this.materials.splice(0, 0, this.state.result);
        this.setState({
            showModal: false
        }, ()=>{
            let params = {materials:this.materials};
            if (this.backToParent) {
                params.backToParent = this.backToParent;
            }
            this.props.history.replace('/main/add-receiving',params);
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

    // AutoComplete组件监听
    handleSearch = async value => {
        const { materials } = this.state;
        
        if (materials.length>0) {
            this.setState({
                dataSource: materials.map(i=>i.label).filter(i=>i.indexOf(value) > -1),
            })
        } else {
            this.setState({
                dataSource: []
            })
        }
    }
    selectMaterial = async (value, option) => {
        console.log('selected value and option', value, option);

        const { materials } = this.state;

        let selectedMat = _.split(value, '-');
        const materiaCode = selectedMat[0];

        const currMat = _.find(materials, i => i.value === materiaCode);
        this.setState((prevState) => {
            return {
                dataSet: Object.assign({},prevState.dataSet, {[otherReceivedItemsMap['material']]:value}), 
                result: Object.assign({},prevState.result, {'material':currMat})
            }
        });
        
        const { units } = currMat;

        const user = Durian.get('user');
        const supplierCode = user.vendor.value;
        let params = { supplierCode, materiaCode };
        console.log('warehouse number request', params);
        const dbMatNum = await http.post('/wareHouse/getWareHouseNum', params);
        console.log('material num', dbMatNum);
        let totalQualifiedNumber = 0;
        if (dbMatNum && dbMatNum.data) {
            totalQualifiedNumber = dbMatNum.data.qualifiedNumber;
           
        }
        this.setState({
            units, 
            totalQualifiedNumber,
        });
    }

    render() {
        const{dataSet, showModal, inInventoryQuantity} = this.state
        let errorStateInInventory = false;
        if (inInventoryQuantity && +inInventoryQuantity <=0) {
            errorStateInInventory = true;
        }

        return (
            <RootView>
                <CommonHeader navBarTitle="选择其他入库信息" showBackButton={true} />
                <WhiteSpace size='lg' />
                {/* <ExPicker
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
                /> */}
                <ItemView>
                    <ContentTitleText>物料</ContentTitleText>
                    <AutoComplete
                        className="common-auto-complete"
                        allowClear={true}
                        dataSource={this.state.dataSource}
                        defaultValue={this.material.material ? this.material.material.label:''}
                        placeholder="请输入物料信息"
                        style={{
                            width: '80%',
                            marginRight:'5px',
                        }}
                        onSearch={this.handleSearch}
                        onSelect={this.selectMaterial}
                    />
                </ItemView>
                <SeparateLine />
                <ItemView>
                    <ContentTitleText>数量</ContentTitleText>
                    <ItemInputView>
                    <InputNumber
                        className={'input-style'}
                        placeholder="请输入数字"
                        type="money"
                        defaultValue={this.material.quantity ? this.material.quantity.value:''.value}
                        onChange={(v)=>{
                            this.setState((prevState) => {
                                return {
                                    inInventoryQuantity: v,
                                    dataSet: Object.assign({},prevState.dataSet, {[otherReceivedItemsMap.quantity]:`${v} ${this.state.units}`}),
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
                    {this.state.units}
                    </ItemInputView>
                </ItemView>
                <SeparateLine />
                <ExPicker
                    data={reservoirLibraryList}
                    selectedFirst={false}
                    val={this.material.inventoryPosition ? this.material.inventoryPosition.value:''}
                    cols={1}
                    onOk={(val)=>this.onPickerOk(this.fromVal(reservoirLibraryList, val), 'inventoryPosition')}
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
    margin: 200px auto 0;
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
const ItemInputView = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: right;
    padding-right:5px;
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







