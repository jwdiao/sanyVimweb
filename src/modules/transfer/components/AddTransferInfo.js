import React, {Component} from 'react';
import styled from "styled-components";
import freshId from 'fresh-id'

import {CommonHeader} from "../../../components";
import {Icon} from "antd";
import {ListView, Toast} from 'antd-mobile'
import moment from "moment/moment";
import ReactDOM from "react-dom";
import {withRouter} from "react-router-dom";
import {transferItemsMap, Durian, http, INVENTORY_STATUS} from "../../../utils";
import {AddTransferInfoItem} from "./AddTransferInfoItem";

const _ = require('lodash')

class _AddTransferInfo extends Component {

    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({  //这个dataSource有cloneWithRows方法
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            refreshing: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            useBodyScroll: false,
            hasMore: true,

            data: {
                titleContents: {
                    // number: 'WU-001',
                    vmiFactory: '',
                    inventoryState: '',
                },

                // materials:[{
                //     material: 'WU-001',
                //     materialDescription:'物料描述1',
                //     quantity:'1',
                //     sourcePosition:'合格品库',
                //     destPosition:'不合格品库',
                //     time:moment().format('YYYY-MM-DD HH:mm:ss'),
                //     reason:'原因1'
                // },{
                //     material: 'WU-002',
                //     materialDescription:'物料描述2',
                //     quantity:'2',
                //     sourcePosition:'合格品库',
                //     destPosition:'不合格品库',
                //     time:moment().format('YYYY-MM-DD HH:mm:ss'),
                //     reason:'原因2'
                // },{
                //     material: 'WU-003',
                //     materialDescription:'物料描述3',
                //     quantity:'3',
                //     sourcePosition:'合格品库',
                //     destPosition:'不合格品库',
                //     time:moment().format('YYYY-MM-DD HH:mm:ss'),
                //     reason:'原因3'
                // },{
                //     material: 'WU-004',
                //     materialDescription:'物料描述4',
                //     quantity:'4',
                //     sourcePosition:'合格品库',
                //     destPosition:'不合格品库',
                //     time:moment().format('YYYY-MM-DD HH:mm:ss'),
                //     reason:'原因4'
                // },{
                //     material: 'WU-005',
                //     materialDescription:'物料描述5',
                //     quantity:'5',
                //     sourcePosition:'合格品库',
                //     destPosition:'不合格品库',
                //     time:moment().format('YYYY-MM-DD HH:mm:ss'),
                //     reason:'原因5'
                // },{
                //     material: 'WU-006',
                //     materialDescription:'物料描述6',
                //     quantity:'6',
                //     sourcePosition:'合格品库',
                //     destPosition:'不合格品库',
                //     time:moment().format('YYYY-MM-DD HH:mm:ss'),
                //     reason:'原因6'
                // },{
                //     material: 'WU-007',
                //     materialDescription:'物料描述7',
                //     quantity:'7',
                //     sourcePosition:'合格品库',
                //     destPosition:'不合格品库',
                //     time:moment().format('YYYY-MM-DD HH:mm:ss'),
                //     reason:'原因7'
                // },{
                //     material: 'WU-008',
                //     materialDescription:'物料描述8',
                //     quantity:'8',
                //     sourcePosition:'合格品库',
                //     destPosition:'不合格品库',
                //     time:moment().format('YYYY-MM-DD HH:mm:ss'),
                //     reason:'原因8'
                // }],

                materials:[],
            }
        }
    }

    componentWillMount() {
        // const {data} = this.props
        // if (data) {
        //     const {number, vmiFactory, inventoryState} = data
        //     this.setState((prevState) => {
        //         return {
        //             titleContents: Object.assign({}, prevState.titleContents, {number}, {vmiFactory}, {inventoryState})
        //         }
        //     })
        // }
        const user = Durian.get('user');
        const vendor = user.vendor;
        let { materials } = this.props.location.state || [];
        if (!materials) {
            materials = [];
        }
        materials = materials.map((_data) => {
            let rid = freshId();
            return {
                id: {label:rid, value:rid},
                ..._data
            }
        })
        console.log('materials', materials);
        this.setState((prevState) => {
            return {
                data: {
                    titleContents: Object.assign({}, prevState.titleContents, /* {number}, */ {vmiFactory: vendor.label}, {inventoryState: INVENTORY_STATUS[5]}),
                    materials: materials
                }
            }
        })
    }

    async componentDidMount() {
        //const {itemData} = this.props.location.state
        //const {materials} = itemData
        let {materials} = this.state.data
        if (materials.length === 0) return
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        this.rData = materials.map(m => {
            let newMat = {};
            _.keys(m).map(k => Object.assign(newMat, {[k]: m[k].label}));
            return newMat;
        });
        console.log('rData', this.rData)
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            height: hei,
            refreshing: false,
            isLoading: false,
        });
    }

    componentDidUpdate() {
        if (this.state.useBodyScroll) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }

    handleItemDelete(material) {
        let { materials } = this.state.data;
        console.log('material.id' , material.id);
        _.remove(materials, m => m.id.value === material.id);
        this.rData = materials.map(m => {
            let newMat = {};
            _.keys(m).map(k => Object.assign(newMat, {[k]: m[k].label}));
            return newMat;
        });
        console.log('rData', this.rData)
        this.setState((prevState) => {
            return {
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                data: {
                    titleContents: Object.assign({}, prevState.data.titleContents),
                    materials: materials
                }
            }
        }, () => {
            console.log('data', this.state.dataSource);
            console.log('data', this.state.data.materials);
        })
       
    }

    handleItemEdit(material) {
        let { materials } = this.state.data;
        this.props.history.push('/main/add-transfer/detail', {materials: materials, material: _.find(materials, m => m.id.value === material.id)})
    }

    saveOtherOrder = () => {
        const { data } = this.state;
        const { materials } = data;
        const user = Durian.get('user');
        const vendor = user.vendor;
        const factory = user.factory;

        let warehouseOutMateriaList = materials.map( m => {
            return {
                materiaCode: m.material.value, 
                // materialName: m.material.label,
                materiaNumber: m.quantity.value, 
                sourceWarehouse: m.sourcePosition.value,
                targetWarehouse: m.destPosition.value,
                reason: m.reason.label, //不传值，传文本
            }
        });
        let params = {
            style: 3, // 1: 配送出库 2: 其他出库 3：移库
            factoryCode: factory.code,
            supplierCode: vendor.value,
            warehouseOutMateriaList
        };
        console.log('ware house out save params:', params);
        http.post('/warehouseOut/addWarehouseOut', params)
            .then(result => {
                console.log(result);
                if (result.ret === '200' && result.msg === '成功') {
                    this.props.history.goBack()
                }
            })
            .catch(error => {
                Toast.fail(error.msg, 1);
                console.error(`Error from server:${error.msg}`);
            });
    }

    render() {
        const {data} = this.state
        const {titleContents, materials} = data
        let keys = _.keys(titleContents)

        //这里就是个渲染数据，rowData就是每次过来的那一批数据，已经自动给你遍历好了，rouID可以作为key值使用，直接渲染数据即可
        const row = (rowData, sectionID, rowID) => {
            return (
                <AddTransferInfoItem
                    rowID={rowID}
                    data={rowData}
                    onDelete={(material) => this.handleItemDelete(material)}
                    onEdit={(material) => this.handleItemEdit(material)}
                    // indicatorBarColor={indicatorBarColor}
                    // onReceivingButtonClicked={this.onReceivingButtonClicked}
                />
            );
        };

        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: 'RGBA(241, 241, 242, 1)',
                    height: 2,
                }}
            />
        );

        return (
            <RootView showSubmitButton={materials.length > 0}>
                <CommonHeader navBarTitle={'添加移库信息'} showBackButton={true}/>
                <RootContentView isLargeSize={materials.length > 0}>
                    <IndicatorBar color={'rgba(159, 144, 241, 1)'}/>
                    <HeaderView>
                        {
                            keys.map((_key, index) => {
                                // console.log('_key, index', _key, index)
                                return (
                                    <div
                                        key={_key}
                                        style={{
                                            display: 'flex',
                                            flex: 1,
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}>
                                        <ItemView>
                                            <TitleText style={{
                                                display: 'flex',
                                                flex: 0.3,
                                                textAlign: 'justify'
                                            }}>{transferItemsMap[_key]}</TitleText>
                                            <HeaderContentText style={{
                                                display: 'flex',
                                                flex: 0.7
                                            }}>{titleContents[_key]}</HeaderContentText>
                                        </ItemView>
                                    </div>
                                )
                            })
                        }
                    </HeaderView>

                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            height:'20vh',
                            width:'100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderBottom:'2px RGBA(241, 241, 242, 1) solid'
                        }}
                        onClick={()=>{
                            this.props.history.push('/main/add-transfer/detail', {materials: materials})
                        }}
                    >
                        <Icon type={'plus'} style={{
                            color: 'rgba(65, 126, 210, 1)',
                            fontSize: '40px',
                            fontWeight: 'lighter'
                        }}/>
                    </div>

                    {
                        materials.length > 0 && (
                        <ListView
                            key={this.state.useBodyScroll ? '0' : '1'}
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}
                            renderRow={row}   //渲染你上边写好的那个row
                            renderSeparator={separator}
                            useBodyScroll={this.state.useBodyScroll}
                            style={this.state.useBodyScroll ? {} : {
                                height: this.state.height,
                                // border: 'yellow 1px solid',
                                width: '100%',
                            }}
                        />)
                    }
                </RootContentView>
                {
                    materials.length > 0 && (
                        <FootView onClick={this.saveOtherOrder}>
                            提交
                        </FootView>
                    )
                }
            </RootView>
        )
    }
}

export const AddTransferInfo = withRouter(_AddTransferInfo);

const RootView = styled.div`
    background:#eee;
    height: ${p=>p.showSubmitButton? 'calc(100vh - 60px)': 'calc(100vh)'};
    // border: 1px green solid;
`
const RootContentView = styled.div`
    background: #fff;
    display: flex;
    flex-direction: column;
    flex: 1;
    height:${p => p.isLargeSize ? 'calc(100vh - 120px)' : '232px'};
    margin:16px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    box-shadow:0 10px 16px 8px RGBA(229, 233, 243, 1);
   //  border: 2px black solid;
`
const IndicatorBar = styled.div`
    display: flex;
    align-self: flex-start;
    background-color:${p => p.color};
    height: 4px;
    width: 100%;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
`
const HeaderView = styled.div`
    display: flex;
    height: 20vh;
    flex-direction: column;
    z-index: 100;
    width: 100%;
    padding: 10px;
    justify-content: center;
    // border: 2px brown solid;
    box-shadow:0 0 30px 0 RGBA(229, 233, 243, 1) inset;
`
const FootView = styled.div`
    display: flex;
    position: absolute;
    bottom: 0;
    flex-direction: column;
    z-index: 1001;
    width: 100%;
    height: 44px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    background: linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1));
    color: #fff;
`
const ItemView = styled.div`
    display: flex;
    flex:1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
const TitleText = styled.div`
    color: rgba(54, 53, 53, 1);
    font-size: 14px;
`
const HeaderContentText = styled.div`
    color: rgba(160, 157, 157, 1);
    font-size: 14px;
`
