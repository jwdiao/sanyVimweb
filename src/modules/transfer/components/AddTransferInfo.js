import React, {Component} from 'react';
import styled from "styled-components";
import freshId from 'fresh-id'

import {CommonHeader} from "../../../components";
import {Checkbox, Icon} from "antd";
import {ListView, Modal, PullToRefresh} from 'antd-mobile'
import moment from "moment/moment";
import ReactDOM from "react-dom";
import {withRouter} from "react-router-dom";
import {transferItemsMap} from "../../../utils";
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
                    vmiFactory: '供应商工厂-1',
                    inventoryState: '供应商发货',
                },

                materials:[{
                    material: '物料1',
                    materialDescription:'物料描述1',
                    quantity:'1',
                    sourcePosition:'合格品库',
                    destPosition:'不合格品库',
                    time:moment().format('YYYY-MM-DD HH:mm:ss'),
                    reason:'原因1'
                },{
                    material: '物料2',
                    materialDescription:'物料描述2',
                    quantity:'2',
                    sourcePosition:'合格品库',
                    destPosition:'不合格品库',
                    time:moment().format('YYYY-MM-DD HH:mm:ss'),
                    reason:'原因2'
                },{
                    material: '物料3',
                    materialDescription:'物料描述3',
                    quantity:'3',
                    sourcePosition:'合格品库',
                    destPosition:'不合格品库',
                    time:moment().format('YYYY-MM-DD HH:mm:ss'),
                    reason:'原因3'
                },{
                    material: '物料4',
                    materialDescription:'物料描述4',
                    quantity:'4',
                    sourcePosition:'合格品库',
                    destPosition:'不合格品库',
                    time:moment().format('YYYY-MM-DD HH:mm:ss'),
                    reason:'原因4'
                },{
                    material: '物料5',
                    materialDescription:'物料描述5',
                    quantity:'5',
                    sourcePosition:'合格品库',
                    destPosition:'不合格品库',
                    time:moment().format('YYYY-MM-DD HH:mm:ss'),
                    reason:'原因5'
                },{
                    material: '物料6',
                    materialDescription:'物料描述6',
                    quantity:'6',
                    sourcePosition:'合格品库',
                    destPosition:'不合格品库',
                    time:moment().format('YYYY-MM-DD HH:mm:ss'),
                    reason:'原因6'
                },{
                    material: '物料7',
                    materialDescription:'物料描述7',
                    quantity:'7',
                    sourcePosition:'合格品库',
                    destPosition:'不合格品库',
                    time:moment().format('YYYY-MM-DD HH:mm:ss'),
                    reason:'原因7'
                },{
                    material: '物料8',
                    materialDescription:'物料描述8',
                    quantity:'8',
                    sourcePosition:'合格品库',
                    destPosition:'不合格品库',
                    time:moment().format('YYYY-MM-DD HH:mm:ss'),
                    reason:'原因8'
                }],

               //  materials:[],
            }
        }
    }

    componentWillMount() {
        const {data} = this.props
        if (data) {
            const {number, vmiFactory, inventoryState} = data
            this.setState((prevState) => {
                return {
                    titleContents: Object.assign({}, prevState.titleContents, {number}, {vmiFactory}, {inventoryState})
                }
            })
        }
    }

    async componentDidMount() {
        //const {itemData} = this.props.router.location.state
        //const {materials} = itemData
        const {materials} = this.state.data

        if (materials.length === 0) return
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;

        this.rData = materials.map((_data) => ({id: freshId(), ..._data})) //retrieving data from server;
        console.log(this.rData)
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

    render() {
        const {data, dataSource} = this.state
        const {titleContents, materials} = data
        let keys = _.keys(titleContents)

        console.log('dataSource', dataSource)

        //这里就是个渲染数据，rowData就是每次过来的那一批数据，已经自动给你遍历好了，rouID可以作为key值使用，直接渲染数据即可
        const row = (rowData, sectionID, rowID) => {
            return (
                <AddTransferInfoItem
                    rowID={rowID}
                    data={rowData}
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
                            this.props.history.push('/main/add-transfer/detail')
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
                        <FootView onClick={()=>{

                        }}>
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
    border-radius: 2px;
    box-shadow:0 20px 37px 13px RGBA(229, 233, 243, 1);
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
