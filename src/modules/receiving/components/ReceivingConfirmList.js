import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from "styled-components";
import freshId from 'fresh-id'

import {PullToRefresh, ListView, Modal} from 'antd-mobile';
import { Checkbox } from 'antd';
import {ReceivingItem} from "./ReceivingItem";
import {ReceivingConfirmItem} from "./ReceivingConfirmItem";
import {CommonHeader} from "../../../components";
import moment from "moment/moment";

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
            }
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        // 点击'不再提示'，下次生效。为了防止立即生效，此处对该状态值的变化进行过滤。
        if (nextState.notShowModalAgain !== this.state.notShowModalAgain) {
            return false
        }
        return true
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
        const {materials} = itemData
        const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;

        this.rData = materials.map((_data) => ({id: freshId(), ..._data})) //retrieving data from server;
        console.log(this.rData)
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            height: hei,
            refreshing: false,
            isLoading: false,
        });
    }
    onRefresh = () => {
        // this.setState({ refreshing: true, isLoading: true });
        // // simulate initial Ajax
        // setTimeout(() => {
        //   this.rData = genData();
        //   this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(this.rData),
        //     refreshing: false,
        //     isLoading: false,
        //   });
        // }, 600);
    };

    onEndReached = async (event) => {
        const {itemData} = this.props.router.location.state
        const {materials} = itemData
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }   //如果this.state.hasMore为false，说明没数据了，直接返回
        console.log('reach end', event);
        this.setState({ isLoading: true });
        this.rData = this.rData.concat(materials.map((_data) => ({id: freshId(), ..._data})));  //每次下拉之后将新数据装填过来
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            isLoading: false,
        });
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
                    currentClickedItem: Object.assign({},prevState.currentClickedItem,{material:data.material}, {inInventoryQuantity}, {qualifiedQuantity})
                }
            })
        } else {
            this.commitData()
        }

    }

    commitData = () => {
        //TODO:提交数据至后端
        console.log('commitData called!')
    }

    render() {
        console.log('_ReceivingConfirmList props', this.props)
        const {itemData, indicatorBarColor} = this.props.router.location.state
        const { currentClickedItem } = this.state
        const {vmiFactory, materials} = itemData
        //这里就是个渲染数据，rowData就是每次过来的那一批数据，已经自动给你遍历好了，rouID可以作为key值使用，直接渲染数据即可
        const row = (rowData, sectionID, rowID) => {
            return (
                <ReceivingConfirmItem
                    data={rowData}
                    indicatorBarColor={indicatorBarColor}
                    onReceivingButtonClicked={this.onReceivingButtonClicked}
                />
            );
        };

        return (
            <RootView>
                <CommonHeader navBarTitle={vmiFactory} showBackButton={true} />
                <ListView
                    key={this.state.useBodyScroll ? '0' : '1'}
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={    //renderFooter就是下拉时候的loading效果，这里的内容可以自己随需求更改
                        () => (
                            <div style={{ padding: 30, textAlign: 'center' }}>
                                {this.state.isLoading ? 'Loading...' : 'Loaded'}
                            </div>
                        )
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
                            {currentClickedItem.material}<br />
                            入库:{currentClickedItem.inInventoryQuantity}<br />
                            合格:{currentClickedItem.qualifiedQuantity}<br />
                            入库时间:{moment().format('YYYY-MM-DD HH:mm:ss')}<br />
                        </ModalContent>
                        <NotShowAgainLayout>
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
                        </NotShowAgainLayout>
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

const NotShowAgainLayout = styled.div`
    display: flex;
    width: 100%;
    height: 30px;
    justify-content: flex-start;
    align-items: center;
    font-weight: bold;
    // border: 1px blue solid;
`

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