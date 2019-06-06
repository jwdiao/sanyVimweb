import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from "styled-components";

import {PullToRefresh, ListView, Modal} from 'antd-mobile';
// import { Checkbox } from 'antd';
import {ReceivingConfirmItem} from "./ReceivingConfirmItem";
import {CommonHeader} from "../../../components";
import moment from "moment/moment";
import { http, Durian } from '../../../utils'
function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

const alert = Modal.alert;

class _ReceivingConfirmList extends Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({  //这个dataSource有cloneWithRows方法
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.pageNo = 0 //定义分页信息
        this.state = {
            dataSource,
            refreshing: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            useBodyScroll: false,
            hasMore: true,

            //业务逻辑相关的state
            showModal:false,
            notShowModalAgain: false,
            currentClickedItem: {
                material: '',
                inInventoryQuantity: 0,
                qualifiedQuantity: 0
            },
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        // 点击'不再提示'，下次生效。为了防止立即生效，此处对该状态值的变化进行过滤。
        if (nextState.notShowModalAgain !== this.state.notShowModalAgain) {
            return false
        }
        return true
    }
    componentWillUnmount() {
        console.log('===componentWillUnmount===called')
        if (this.timer) {
            clearTimeout(this.timer);
          }
    }
    componentDidUpdate() {
        if (this.state.useBodyScroll) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }

    async componentDidMount() {
        const {itemData} = this.props.router.location.state
        const code = itemData.code;

        const dbMat = await http.get(`/orderMaterial/find/ordercode/${code}`);
        let materials = dbMat.data.map(m => {
            return {
                id: m.id,
                material: m.materiaCode,
                status: m.status,
                units: m.units,
                materialDescription: m.materiaName,
                quantity:m.materiaNum,
                inInventoryQuantity: m.totalNumber?m.totalNumber:m.materiaNum,//默认填充发货数量
                qualifiedQuantity: m.qualifiedNumber?m.qualifiedNumber:m.materiaNum,//默认填充发货数量
            }
        });
        const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;

        this.rData = materials;//.map((_data) => ({id: freshId(), ..._data})) //retrieving data from server;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            materials: materials,
            height: hei,
            refreshing: false,
            isLoading: false,
        });
    }
    onRefresh = () => {
       
    };

    onEndReached = async (event) => {
        console.log('===ReceivingConfirmList onEndReached===called')
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.setState({
                footerRemoved: true
            });
        }, 2000);
    };

    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }

    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }

    onReceivingButtonClicked = (data, inInventoryQuantity, qualifiedQuantity) => {
        console.log('onReceivingButtonClicked called!',data, inInventoryQuantity, qualifiedQuantity)
        if (!this.state.notShowModalAgain) {
            this.setState((prevState) => {
                return {
                    showModal:true,
                    currentClickedItem: Object.assign({},prevState.currentClickedItem, {id: data.id}, {material:data.material}, {materialDescription:data.materialDescription}, {units:data.units}, {inInventoryQuantity}, {qualifiedQuantity})
                }
            })
        } else {
            this.commitData()
        }

    }

    commitData = async () => {
        const item = this.state.currentClickedItem;
        let notReceivedItems = this.state.materials.filter(m => m.status === 1);
        console.log('notReceivedItems', notReceivedItems);
        const isUpdateOrder = notReceivedItems.length === 1 ? 1 : 0;//如果待收货列表数量为1则收货后需要更新订单状态
        const user = Durian.get('user');
        const supplierCode = user.vendor.value;
        let params = {
            id: item.id,
            totalNumber: item.inInventoryQuantity,
            qualifiedNumber: item.qualifiedQuantity,
            supplierCode:supplierCode,
            isUpdateOrder: isUpdateOrder,
            receiveName: user.userName,
        }
        console.log('order receive params', params);
        const result = await http.post('/orderMaterial/receive', params);
        console.log('result', result);
        if (result.ret === '200' && result.msg === '成功') {
            let materials = this.state.materials;
            materials = materials.map(i => {
                if (i.id === item.id) {
                    i.status = 2;
                    i.inInventoryQuantity = item.inInventoryQuantity;
                    i.qualifiedQuantity = item.qualifiedQuantity;
                }
                return i;
            })
            this.setState({
                materials: materials
            });
        }
    }

    receiveBatch = () => {
        alert('批量收货', '确认提交批量收货？', [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确认', onPress: () => this.batchCommitData() },
            ])
    }
    sinkData = (material) => {
        let materials = this.state.materials;
        materials = materials.map( m => {
            if (m.id === material.id) {
                m.inInventoryQuantity = material.totalNumber;
                m.qualifiedQuantity = material.qualifiedNumber;
            }
            return m;
        })
        this.setState({
            materials,
        })
    }
    batchCommitData = async () => {
        const user = Durian.get('user');
        const supplierCode = user.vendor.value;
        let materials = this.state.materials;
        let values = materials.filter(i => i.status === 1).map(i => {
            return {
                id: i.id,
                totalNumber:i.inInventoryQuantity,
                qualifiedNumber: i.qualifiedQuantity,
                supplierCode,
                isUpdateOrder: 1,
                receiveName: user.userName,
            }
        });
       
        let params = {
            batchOrderMaterialList: values,
        }
        console.log('order batch receive params', params);
        const result = await http.post('/orderMaterial/receiveBatch', params);
        console.log('result', result);
        if (result.ret === '200' && result.msg === '成功') {
            let materials = this.state.materials;
            materials = materials.map(i => {
                i.status = 2;
                return i;
            })
            this.setState({
                materials: materials
            });
        }
    }
   
    render() {
        console.log('_ReceivingConfirmList props', this.props)
        const {itemData, indicatorBarColor} = this.props.router.location.state
        const { currentClickedItem } = this.state
        console.log('currentClickedItem', currentClickedItem);
        const {vmiFactory} = itemData
        //这里就是个渲染数据，rowData就是每次过来的那一批数据，已经自动给你遍历好了，rouID可以作为key值使用，直接渲染数据即可
        const row = (rowData, sectionID, rowID) => {
            return (
                <ReceivingConfirmItem
                    data={rowData}
                    indicatorBarColor={indicatorBarColor}
                    onReceivingButtonClicked={this.onReceivingButtonClicked}
                    sinkData={this.sinkData}
                />
            );
        };
        
        const MenuButton = (props) => {
            return (
                <span style={{marginRight:'20px'}} onClick={this.receiveBatch}>批量收货</span>
            );
        }
        return (
            <RootView>
                <CommonHeader navBarTitle={vmiFactory} showBackButton={true} showMenuButton={true} menuButton={<MenuButton/>}/>
                <ListView
                    key={this.state.useBodyScroll ? '0' : '1'}
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={    //renderFooter就是下拉时候的loading效果，这里的内容可以自己随需求更改
                        () => {
                            if (!this.state.footerRemoved) {
                                 return (
                                 <div style={{ padding: 10, textAlign: 'center' }}>
                                     {this.state.isLoading ? '加载中...' : '加载完毕'}
                                 </div>
                                 )
                            }
                         } 
                    }
                    renderRow={row}   //渲染你上边写好的那个row
                    useBodyScroll={this.state.useBodyScroll}
                    style={this.state.useBodyScroll ? {} : {
                        height: this.state.height,
                        border: 'none',
                    }}
                    pullToRefresh={<PullToRefresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />}
                    onEndReached={this.onEndReached}
                    pageSize={8}    //每次下拉之后显示的数据条数
                />
                <Modal
                    visible={this.state.showModal && !this.state.notShowModalAgain}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose('showModal')}
                    title=""
                    footer={[]}
                    // footer={[{ text: 'Ok', onPress: () => { console.log('ok'); this.onClose('showModal')(); } }]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                    // afterClose={() => { alert('afterClose'); }}
                >
                    <ModalRootContainer>
                        <ModalHeader>确定收货</ModalHeader>
                        <ModalContent>
                            物料编码:{currentClickedItem.material}<br />
                            物料描述:{currentClickedItem.materialDescription}<br />
                            入库:{`${currentClickedItem.inInventoryQuantity} ${currentClickedItem.units}`}<br />
                            合格:{`${currentClickedItem.qualifiedQuantity}  ${currentClickedItem.units}`}<br />
                            入库时间:{moment().format('YYYY-MM-DD HH:mm:ss')}<br />
                        </ModalContent>
                        {/* <NotShowAgainLayout>
                            <Checkbox
                                onChange={(e)=>{
                                    console.log('Checkbox called', e.target.checked)
                                    this.setState((prevState)=>{
                                        return {
                                            notShowModalAgain: e.target.checked
                                        }
                                    })
                                }}
                            >不再提示
                            </Checkbox>
                        </NotShowAgainLayout> */}
                        <ModalFooter>
                            <StyledButton isEnabled={false} onClick={()=>{
                                this.setState({
                                    showModal: false
                                })
                            }}>取消</StyledButton>
                            <StyledButton isEnabled={true} onClick={()=>{
                                this.setState({
                                    showModal: false
                                })
                                this.commitData()
                            }}>确定</StyledButton>
                        </ModalFooter>
                    </ModalRootContainer>
                </Modal>
            </RootView>
        );
    }
}

export const ReceivingConfirmList = _ReceivingConfirmList

const RootView = styled.div`
    background:#eee;
    height: calc(100vh - 60px);
`

const ModalRootContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 210px;
    text-align: center;
    justify-content: center;
    align-items: center;
    // border: 1px red solid;
`

const ModalHeader = styled.div`
    display: flex;
    height: 40px;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: rgba(48, 48, 48, 1);
    font-size: 18px;
    font-weight: bold;
    // border: 1px yellow solid;
`

const ModalContent = styled.div`
    display: flex;
    flex:1;
    width: 100%;
    height: 100px;
    text-align: start;
    font-size: 14px;
    color: rgba(48, 48, 48, 1);
    overflow: scroll;
    // border: 1px green solid;
`

// const NotShowAgainLayout = styled.div`
//     display: flex;
//     width: 100%;
//     height: 30px;
//     justify-content: flex-start;
//     align-items: center;
//     font-weight: bold;
//     // border: 1px blue solid;
// `

const ModalFooter = styled.div`
    display: flex;
    width: 100%;
    height: 40px;
    justify-content: center;
    align-items: center;
    // border: 1px black solid;
`
const StyledButton = styled.div`
    display: flex;
    height: 26px;
    width: 80px;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-left: 6px;
    margin-right: 6px;
    border-radius: 27px;
    border:${p=>p.isEnabled ?'0' :'1px rgba(55, 149, 243, 1) solid' };
    background: ${p=>p.isEnabled ? 'linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1))':'white'};
    color: ${p=>p.isEnabled ?'white' :'rgba(55, 149, 243, 1)' };
`