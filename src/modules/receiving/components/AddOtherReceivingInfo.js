import React, {Component} from 'react';
import {Durian, http, ORDER_STATUS} from "../../../utils";
import styled from "styled-components";
import freshId from 'fresh-id'

import {CommonHeader} from "../../../components";
import {Icon} from "antd";
import {ListView, Toast, Modal} from 'antd-mobile'
import ReactDOM from "react-dom";
import {withRouter} from "react-router-dom";
import {AddOtherReceivingInfoItem} from "./AddOtherReceivingInfoItem";

const _ = require('lodash')
const alert = Modal.alert;

class _AddOtherReceivingInfo extends Component {

    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({  //这个dataSource有cloneWithRows方法
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const from = this.props.location.state?this.props.location.state.from:'';
        let backToParent = null;
        if (from && from !== '') {
            let { tab } = this.props.location.state;
            backToParent = {selectedTab: from};
            if (tab === undefined) {
                tab = 0;
            }
            backToParent.tab = tab;
        }
        this.state = {
            dataSource,
            refreshing: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            useBodyScroll: false,
            hasMore: true,
            backToParent: backToParent,

            data: {
                titleContents: {
                    vmiFactory: '',
                    inventoryState: '',
                },

                materials:[],
            }
        }
    }

    componentWillMount() {
      
        const user = Durian.get('user');
        const vendor = user.vendor;
        let { materials, backToParent } = this.props.location.state || [];
        if (!materials) {
            materials = [];
        }
        if (backToParent) {
            this.setState({
                backToParent,
            });
        }
        console.log('materials', materials);
        materials = materials.map((_data) => {
            let rid = freshId();
            return {
                id: {label:rid, value:rid},
                ..._data
            }
        })
        this.setState((prevState) => {
            return {
                data: {
                    titleContents: Object.assign({}, prevState.titleContents, /* {number}, */ {vmiFactory: vendor.label}, {inventoryState: ORDER_STATUS[5]}),
                    materials: materials
                }
            }
        })
        if (materials.length !== 0) {
            this.props.history.goBack();
        }
    }

    async componentDidMount() {
        let {materials} = this.state.data
        if (materials.length === 0) return
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        this.rData = materials.map(m => {
            let newMat = {};
            _.keys(m).map(k => Object.assign(newMat, {[k]: m[k]}));
            return newMat;
        });
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
        _.remove(materials, m => m.id.value === material.id.value);
        this.rData = materials.map(m => {
            let newMat = {};
            _.keys(m).map(k => Object.assign(newMat, {[k]: m[k].label}));
            return newMat;
        });
        this.setState((prevState) => {
            return {
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                data: {
                    titleContents: Object.assign({}, prevState.data.titleContents),
                    materials: materials
                }
            }
        }, () => {
        })
       
    }

    handleItemEdit(material) {
        let { materials } = this.state.data;
        this.props.history.push('/main/add-receiving/detail', {backToParent:this.state.backToParent, materials: materials, material: _.find(materials, m => m.id.value === material.id.value)})
    }

    saveOtherOrder = () => {
        console.log('save other order...');
        const { data, backToParent } = this.state;
        const { materials } = data;
        const user = Durian.get('user');
        const vendor = user.vendor;

        let materialList = materials.map( m => {
            return {
                materiaCode: m.material.value, 
                materiaName: m.material.label,
                wareHouseType: m.inventoryPosition.value,
                materiaNum: m.quantity.value, 
                totalNumber: m.quantity.value,
                qualifiedNumber: m.inventoryPosition.value===1?m.quantity.value:0, 
                badNumber:m.inventoryPosition.value===2?m.quantity.value:0,
                reason: m.reason.label,//不传值，传文本 
            }
        });
        let params = {
            supplierCode: vendor.value,
            otherReceiveName: user.userName,
            materialList
        };
        console.log('other order save params:', params);
        http.post('/order/save/other', params)
            .then(result => {
                console.log(result);
                if (result.ret === '200' && result.msg === '成功') {
                    console.log('receiving list add success will forward to:', backToParent);
                    if (backToParent) {
                        this.props.history.push('/main', backToParent)
                    } else {
                        this.props.history.goBack();
                    }
                }
            })
            .catch(error => {
                Toast.fail(error.msg, 1);
                console.error(`Error from server:${error.msg}`);
            });
    }

    render() {
        const {data} = this.state
        const { materials} = data

        //这里就是个渲染数据，rowData就是每次过来的那一批数据，已经自动给你遍历好了，rouID可以作为key值使用，直接渲染数据即可
        const row = (rowData, sectionID, rowID) => {
            return (
                <AddOtherReceivingInfoItem
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
                <CommonHeader navBarTitle={'添加其他入库信息'} showBackButton={true}/>
                <RootContentView isLargeSize={materials.length > 0}>

                    <AddNewItemPanel 
                        onClick={()=>{
                            let params =  {materials: materials};
                            params.backToParent = this.state.backToParent;
                            console.log('jump to add receiving info with params:', params);
                            this.props.history.push('/main/add-receiving/detail', params)
                        }}
                    >
                        <Icon type={'plus'} style={{
                            color: 'rgba(65, 126, 210, 1)',
                            fontSize: '40px',
                            fontWeight: 'lighter'
                        }}/>
                    </AddNewItemPanel>

                    {
                        materials.length > 0 && (
                        <ListView
                            key={this.state.useBodyScroll ? '0' : '1'}
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}
                            renderRow={row}   //渲染你上边写好的那个row
                            renderSeparator={separator}
                            useBodyScroll={this.state.useBodyScroll}
                            height={this.state.height}
                            style={this.state.useBodyScroll ? {} : {
                                height: this.state.height,
                                // border: 'yellow 1px solid',
                                width: '100%',
                                paddingBottom: '10px',
                            }}
                        />)
                    }
                </RootContentView>
                {
                    materials.length > 0 && (
                        <FootView onClick={
                            () => {
                                alert('提交入库信息', '确认提交？', [
                                { text: '取消', onPress: () => console.log('cancel') },
                                { text: '确认', onPress: () => this.saveOtherOrder() },
                                ])
                            }
                        }>
                            提交
                        </FootView>
                    )
                }
            </RootView>
        )
    }
}

export const AddOtherReceivingInfo = withRouter(_AddOtherReceivingInfo);

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
    height:${p => p.isLargeSize ? 'calc(100vh - 120px)' : '90px'};
    margin:16px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    box-shadow:0 10px 16px 8px RGBA(229, 233, 243, 1);
   //  border: 2px black solid;
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
const AddNewItemPanel = styled.div`
    display: flex;
    flex-direction: column;
    height: 20vh;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding-bottom:16px;
    box-shadow: inset 0 -15px 24px -15px #d4ddf5;
`




