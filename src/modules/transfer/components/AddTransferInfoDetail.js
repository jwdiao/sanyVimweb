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
import {http, Durian, transferItemsMap, reservoirLibraryList} from "../../../utils";

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

const _ = require('lodash')

class _SelectTransferItem extends Component {

    constructor(props) {
        super(props);
        this.materials = this.props.location.state.materials || [];//已宣物料
        this.selectedMatIds = this.materials.map(i => i.material.value);
        this.material = this.props.location.state.material || {};//待编辑物料
        this.backToParent = this.props.location.state.backToParent || {};
        this.state = {
            inInventoryQuantity:0,
            reasons:[], //原因元数据
            materials:[], //物料元数据
            dataSet: {},
            dataSource: [],//autocomplete
            result: {},
            showModal: false,
            materiaCode: null,
            sourcePosition: null,
            destPosition: null,
            units: null,
            totalSourceNumber: -1,
        }
    }

    async componentWillMount () {
        console.log('material to be edit:', this.material);
        // 初始化数据集和结果集
        if (this.material && this.material.id) {
            const { units, value: materiaCode } = this.material.material;
            const { value:inInventoryQuantity } = this.material.quantity;
            const { value:sourcePosition } = this.material.sourcePosition;
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
                Object.assign(defaultDataset, {[transferItemsMap[k]]: val})
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
                let qualifiedNumber = dbMatNum.data.qualifiedNumber;
                let badNumber = dbMatNum.data.badNumber;
                let totalSourceNumber = sourcePosition === 1 ? qualifiedNumber : badNumber;
                this.setState({
                    totalSourceNumber:totalSourceNumber,
                    inInventoryQuantity,
                    materiaCode,
                });
            }
            this.setState({
                dataSet: defaultDataset,
                result:this.material,
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
                    label: '质量问题',
                    value: 'C001',
                },
            ]
        });
        const user = Durian.get('user');
        const supplierCode = user.vendor.value;
        let params = { supplierCode: supplierCode };
        const dbMat = await http.post('/factorySupplierMaterial/find/all', params);
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
             console.log('this.material', this.material);
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
        console.log(`value from children ${kv.label} ${type}`);
        
        this.setState((prevState) => {
            return {
                dataSet: Object.assign({},prevState.dataSet, {[transferItemsMap[type]]:kv.label}), 
                result: Object.assign({},prevState.result, {[type]:kv})
            }
        });
        // if (type === 'material') {
        //     const materiaCode = kv.value;
        //     this.setState({
        //         units: kv.units,
        //         materiaCode,
        //     }, () => this.tryFetchMatTotalNumber(materiaCode, null))
           
        // }
       
        if (type === 'sourcePosition' || type === 'destPosition') {
            let akval = kv.value===1?[2]:[1];
            console.log('akval', akval);
            let atype = type === 'sourcePosition'?'destPosition':'sourcePosition';
            let val = type === 'sourcePosition'?kv.value:akval[0];
            let akv = this.fromVal(reservoirLibraryList, akval);
            console.log('akv', akv);
            this.setState((prevState) => {
                return {
                    dataSet: Object.assign({},prevState.dataSet, {[transferItemsMap[atype]]:akv.label}), 
                    result: Object.assign({},prevState.result, {[atype]:akv}),
                    [type]: kv.value,
                    [atype]: akval[0],
                }
            }, () => this.tryFetchMatTotalNumber(null, val));
        }
    };

    tryFetchMatTotalNumber = async (materiaCode, sourcePosition) => {
        if (materiaCode === null) {//优先使用传入值，避免state更新延迟
            materiaCode = this.state.materiaCode
        }
        if (sourcePosition === null) {//优先使用传入值，避免state更新延迟
            sourcePosition = this.state.sourcePosition
        }
        if (materiaCode === null || sourcePosition === null) {
            return false;
        }
        const user = Durian.get('user');
        const supplierCode = user.vendor.value;
        let params = { supplierCode, materiaCode };
        console.log('warehouse number request', params);
        const dbMatNum = await http.post('/wareHouse/getWareHouseNum', params);
        console.log('material num', dbMatNum);
        let totalSourceNumber = 0;
        if (dbMatNum && dbMatNum.data) {
            let qualifiedNumber = dbMatNum.data.qualifiedNumber;
            let badNumber = dbMatNum.data.badNumber;
            totalSourceNumber = sourcePosition === 1 ? qualifiedNumber : badNumber;
        }
        this.setState({
            totalSourceNumber:totalSourceNumber,
        });
    }
    onVendorSubmit = () => {
        let {inInventoryQuantity, totalQualifiedNumber, result } = this.state;
        let materialValue = _.get(result, 'material.value') || '';
        let quantityValue = _.get(result, 'quantity.value') || '';
        let sourcePositionValue = _.get(result, 'sourcePosition.value') || '';
        let destPositionValue = _.get(result, 'destPosition.value') || '';
        let reasonValue = _.get(result, 'reason.value') || '';
        if (materialValue === ''
            || quantityValue === ''
            || sourcePositionValue === ''
            || destPositionValue === ''
            || reasonValue === ''
            || inInventoryQuantity === null
        ) {
            Toast.fail('请输入所有必要信息！', 1);
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
            this.props.history.replace('/main/add-transfer', params);
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
             console.log('this.material', this.material);
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
                dataSet: Object.assign({},prevState.dataSet, {[transferItemsMap['material']]:value}), 
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
            materiaCode,
        }, () => this.tryFetchMatTotalNumber(materiaCode, null));
    }
    render() {
        const{dataSet, showModal, inInventoryQuantity, totalSourceNumber, sourcePosition, destPosition} = this.state
        console.log('sourcePosition', sourcePosition);
        console.log('destPosition', destPosition);
        let errorStateInInventory = false;
        if (inInventoryQuantity && +inInventoryQuantity <=0) {
            errorStateInInventory = true;
            Toast.fail('输入数量必须大于0！', 2);
            this.setState({
                inInventoryQuantity: null
            })
        }

        if (+totalSourceNumber >=0 && totalSourceNumber < inInventoryQuantity) {
            errorStateInInventory = true;
            Toast.fail('输入数量不能大于库存数量！', 2);
            this.setState({
                inInventoryQuantity: null
            })
        }
        return (
            <RootView>
                <CommonHeader navBarTitle="选择移库信息" showBackButton={true} />
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
                <ExPicker
                    data={reservoirLibraryList}
                    selectedFirst={false}
                    val={this.material.sourcePosition ? this.material.sourcePosition.value:''}
                    linkage={sourcePosition}
                    cols={1}
                    onOk={(val)=>this.onPickerOk(this.fromVal(reservoirLibraryList, val), 'sourcePosition')}
                    pickerStyle={{
                        borderBottom:'1px solid #eee',
                    }}
                    title="源库位"
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
                    data={reservoirLibraryList}
                    selectedFirst={false}
                    val={this.material.destPosition ? this.material.destPosition.value:''}
                    linkage={destPosition}
                    cols={1}
                    onOk={(val)=>this.onPickerOk(this.fromVal(reservoirLibraryList, val), 'destPosition')}
                    pickerStyle={{
                        borderBottom:'1px solid #eee',
                    }}
                    title="目标库位"
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
                    <ContentTitleText>数量{totalSourceNumber>=0?(<WarehouseNum>（剩余库存为{totalSourceNumber}）</WarehouseNum>):''}</ContentTitleText>
                    <ItemInputView>
                        <InputNumber
                            className={'input-style'}
                            placeholder="请输入数字"
                            type="money"
                            value={this.state.inInventoryQuantity>0?this.state.inInventoryQuantity:null}
                            defaultValue={this.material.quantity ? this.material.quantity.value:''.value}
                            onChange={(v)=>{
                                if (totalSourceNumber === -1) {
                                    Toast.fail('请先选择物料及库位！', 2);
                                    return false;
                                }
                                this.setState((prevState) => {
                                    return {
                                        inInventoryQuantity: v,
                                        dataSet: Object.assign({},prevState.dataSet, {[transferItemsMap.quantity]:`${v} ${this.state.units}`}),
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
                <LoginBtn type="primary" htmlType="submit" onClick={this.onVendorSubmit}>保存</LoginBtn>
                <CommonDialog
                    headerText="保存移库信息"
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
export const AddTransferInfoDetail = withRouter(_SelectTransferItem)

const RootView = styled.div`
  height: calc(100vh - 60px);
  background-color: '#F4F5FA'
`
const LoginBtn = styled(Button)`
    width:64%;margin:0 auto;
    height:40px;
    background:linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1));
    margin-top:200px;
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
const WarehouseNum = styled.span`
    font-size: 10px;
    color:#999;
`







