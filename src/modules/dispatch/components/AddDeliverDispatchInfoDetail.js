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
import { http, Durian, dispatchItemsMap } from '../../../utils'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

const _ = require('lodash')

class _AddDeliverDispatchInfoDetail extends Component {

    constructor(props) {
        super(props);
        this.materials = this.props.location.state.materials || [];//已选物料
        this.selectedMatIds = this.materials.map(i => i.material.value);
        this.material = this.props.location.state.material || {};//待编辑物料
        this.backToParent = this.props.location.state.backToParent || {};
        this.navBarTitle = '选择配送出库信息';
        this.isDeliver = true;
        if (this.backToParent && this.backToParent.tab && this.backToParent.tab === 1) {
            this.navBarTitle = '添加其他出库信息';
            this.isDeliver = false;
        }
        this.state = {
            inInventoryQuantity:0,
            reasons:[], //原因元数据
            materials:[], //物料元数据
            dataSet: {},
            dataSource: [],//autocomplete
            result: {},
            showModal: false,
            units: null,
            totalQualifiedNumber: -1,
        }
    }

    async componentWillMount () {
        console.log('material to be edit:', this.material);
        // 初始化数据集和结果集
        if (this.material && this.material.id) {
            const { value: materiaCode, units } = this.material.material;
            const { value: inInventoryQuantity } = this.material.quantity;
            this.setState({
                units: units,
            })
            let pmat = Object.assign({}, this.material);
            pmat = _.omit(pmat, ['id'])
            console.log('pmat', pmat);
            let defaultDataset = {};
            _.keys(pmat).map(k => {
                let val = pmat[k].label;
                if (_.indexOf(['quantity', 'inInventoryQuantity', 'qualifiedQuantity'], k) >= 0) {
                    val = val + ' ' + units;
                }
                Object.assign(defaultDataset, {[dispatchItemsMap[k]]: val})
                return k;   
            })
            console.log('defaultDataset', defaultDataset);
            const user = Durian.get('user');
            const supplierCode = user.vendor.value;
            let params = { supplierCode, materiaCode };
            console.log('warehouse number request', params);
            const dbMatNum = await http.post('/wareHouse/getWareHouseNum', params);
            console.log('material num', dbMatNum);
            if (dbMatNum && dbMatNum.data) {
                let totalQualifiedNumber = dbMatNum.data.qualifiedNumber;
                this.setState({
                    totalQualifiedNumber,
                    inInventoryQuantity,
                });
            }
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
                    label: '盘盈出库',
                    value: 'B001',
                },
                {
                    label: '零星领料',
                    value: 'B002',
                },
                {
                    label: '返厂出库',
                    value: 'B003',
                },

            ]
        });
        const user = Durian.get('user');
        const supplierCode = user.vendor.value;
        let params = { supplierCode: supplierCode };
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
            //根据传入的已选materials过滤掉基础物料中的值
            console.log('selectedMatIds', this.selectedMatIds);
            let ds = materials.filter(i => _.indexOf(this.selectedMatIds, i.value) === -1)
                                    .map(i=>i.label);
            if (this.material.material) {
                ds.splice(0, 0, this.material.material.label);
            }
            console.log('filtered auto complete data source', ds);
            this.setState({
                materials: materials,
                dataSource: ds,
            })
        }
    }

    onPickerOk = async (kv, type) => {
        console.log('kv', kv);
        console.log(`value from children ${kv.label} ${type}`);
        this.setState((prevState) => {
            return {
                dataSet: Object.assign({},prevState.dataSet, {[dispatchItemsMap[type]]:kv.label}), 
                result: Object.assign({},prevState.result, {[type]:kv})
            }
        });
        // if (type === 'material') {
        //     this.setState({
        //         units: kv.units,
        //     })
        //     const materiaCode = kv.value;
        //     const user = Durian.get('user');
        //     const supplierCode = user.vendor.value;
        //     let params = { supplierCode, materiaCode };
        //     console.log('warehouse number request', params);
        //     const dbMatNum = await http.post('/wareHouse/getWareHouseNum', params);
        //     console.log('material num', dbMatNum);
        //     let totalQualifiedNumber = 0;
        //     if (dbMatNum && dbMatNum.data) {
        //         totalQualifiedNumber = dbMatNum.data.qualifiedNumber;
               
        //     }
        //     this.setState({
        //         totalQualifiedNumber,
        //     });
        // }
    };

    onVendorSubmit = () => {
        let {inInventoryQuantity, totalQualifiedNumber, result } = this.state;
        console.log('submit result', result);
        let materialValue = _.get(result, 'material.value') || '';
        let quantityValue = _.get(result, 'quantity.value') || '';
        let reasonValue = _.get(result, 'reason.value') || '';
        if (materialValue === ''
            || quantityValue === ''
            || inInventoryQuantity === null
        ) {
            Toast.fail('请输入所有必要信息！', 2);
            return false;
        }
        console.log('isDeliver', this.isDeliver);
        if (!this.isDeliver && reasonValue === '') {
            Toast.fail('请输入所有必要信息！', 2);
            return false;
        }
        
        if (+inInventoryQuantity <=0) {
            Toast.fail('输入数量必须大于0！', 2);
            this.setState({
                inInventoryQuantity: null
            })
            return false;
        }
        if (+totalQualifiedNumber >=0 && totalQualifiedNumber < inInventoryQuantity) {
            Toast.fail('输入数量不能大于库存数量！', 2);
            this.setState({
                inInventoryQuantity: null
            })
            return false;
        }
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
            this.props.history.replace('/main/add-dispatch', params);
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
             //根据传入的已选materials过滤掉基础物料中的值
            console.log('selectedMatIds', this.selectedMatIds);
            let ds = materials.filter(i => _.indexOf(this.selectedMatIds, i.value) === -1)
                                    .map(i=>i.label);
            if (this.material.material) {
                ds.splice(0, 0, this.material.material.label);
            }
            this.setState({
                dataSource: ds.filter(i=>i.indexOf(value) > -1),
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
                dataSet: Object.assign({},prevState.dataSet, {[dispatchItemsMap['material']]:value}), 
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
        const{dataSet, showModal, inInventoryQuantity, totalQualifiedNumber} = this.state
        let errorStateInInventory = false;
        if (inInventoryQuantity && +inInventoryQuantity <=0) {
            errorStateInInventory = true;
            Toast.fail('输入数量必须大于0！', 2);
            this.setState({
                inInventoryQuantity: null
            })
        }
        if (+totalQualifiedNumber >=0 && totalQualifiedNumber < inInventoryQuantity) {
            errorStateInInventory = true;
            Toast.fail('输入数量不能大于库存数量！', 2);
            this.setState({
                inInventoryQuantity: null
            })
        }
        return (
            <RootView>
                <CommonHeader navBarTitle={this.navBarTitle} showBackButton={true} />
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
                    <ContentTitleText>数量{totalQualifiedNumber>=0?(<WarehouseNum>（剩余库存为{totalQualifiedNumber}）</WarehouseNum>):''}</ContentTitleText>
                    <ItemInputView>
                        <InputNumber
                            className={'input-style'}
                            placeholder="请输入数字"
                            value={this.state.inInventoryQuantity>0?this.state.inInventoryQuantity:null}
                            type="money"
                            defaultValue={this.material.quantity ? this.material.quantity.value:''.value}
                            onChange={(v)=>{
                                if (totalQualifiedNumber === -1) {
                                    Toast.fail('请先选择物料！', 2);
                                    return false;
                                }
                                this.setState((prevState) => {
                                    return {
                                        inInventoryQuantity: v,
                                        dataSet: Object.assign({},prevState.dataSet, {[dispatchItemsMap.quantity]:`${v} ${this.state.units}`}),
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
                {
                    this.isDeliver?null:
                    (<ExPicker
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
                    />)
                }
                
                <LoginBtn type="primary" htmlType="submit" onClick={this.onVendorSubmit}>确定</LoginBtn>
                <CommonDialog
                    headerText="添加出库信息"
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
const WarehouseNum = styled.span`
    font-size: 10px;
    color:#999;
`

const InputNumber = styled(InputItem)`
    width: 150px;
    &.am-list-line {
    padding-right: 0 !important;
  }
`







