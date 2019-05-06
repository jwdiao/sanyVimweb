import React, {Component} from 'react';
import {ListView, PullToRefresh} from "antd-mobile";
import ReactDOM from "react-dom";
import freshId from "fresh-id";
import styled from "styled-components";
import moment from "moment/moment";
import {ReceivedItem} from "../modules/receiving/components/ReceivedItem";
import {ReceivingItem} from "../modules/receiving/components/ReceivingItem";
import {OtherReceivedItem} from "../modules/receiving/components/OtherReceivedItem";
import {TransferItem} from "../modules/transfer/components/TransferItem";
import {DispatchItem} from "../modules/dispatch/components/DispatchItem";

class _CommonList extends Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({  //这个dataSource有cloneWithRows方法
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.pageNo = 0 //定义分页信息
        this.state = {
            rData:[],
            dataSource,
            refreshing: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            useBodyScroll: false,
            hasMore: true,

            // 业务逻辑相关的state
            isEditState: false,
        };
    }

    async componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
        let data = await this.constructDataSet()
        let rData = data.map((_data) => ({id: freshId(), ..._data})) //retrieving data from server;
        // console.log(this.rData)
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(rData),
            rData,
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

    //Todo: 根据不同的模块，调用各自的接口构建数据
    constructDataSet = async () => {
        const {listType} = this.props

        let data = []
        let materials = []

        switch (listType) {
            case 'ReceivedList':
                for (let i = 0; i < 6; i++) {
                    materials.push({
                        material:'支重轮',
                        materialDescription: 'NEW2019-3009纯钢',
                        quantity:120,
                        sentTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        sender: i%2 === 0 ? '李四' :'张三',
                        inInventoryQuantity: 120,
                        qualifiedQuantity: 120,
                    })
                }

                for (let i = 0; i < 3; i++) {
                    data.push({
                        number: `101-k/12232${Math.floor(Math.random()*100)}`,
                        vmiFactory: i%2 === 0 ? '供应商工厂A' :'供应商工厂B',
                        inventoryState: '已收货',
                        materials: materials
                    })
                }
                break

            case 'ReceivingList':
                for (let i = 0; i < 6; i++) {
                    materials.push({
                        // 待收货确认页面所需数据
                        material:'支重轮',
                        materialDescription: 'NEW2019-3009纯钢',
                        quantity:120,
                    })
                }
                for (let i = 0; i < 10; i++) {
                    data.push({
                        number: `101-k/12232${Math.floor(Math.random()*100)}`,
                        vmiFactory: i%2 === 0 ? '供应商工厂A' :'供应商工厂B',
                        inventoryState: '待收货',
                        sender: i%2 === 0 ? '李四' :'张三',
                        sentTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        materials: materials
                    })
                }
                break

            case 'OtherReceivedList':
                for (let i = 0; i < 10; i++) {
                    data.push({
                        number: `101-k/12232${Math.floor(Math.random()*100)}`,
                        vmiFactory: i%2 === 0 ? '供应商工厂A' :'供应商工厂B',
                        inventoryState: '待收货',

                        material:'支重轮',
                        materialDescription: 'NEW2019-3009纯钢',
                        quantity:120,
                        inventoryPosition: i%2 === 0 ? '合格品库' :'不合格品库',
                        inInventoryTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        reason:'其它入库原因'
                    })
                }
                break

            case 'TransferList':
                for (let i = 0; i < 10; i++) {
                    data.push({
                        number: `101-k/12232${Math.floor(Math.random()*100)}`,
                        vmiFactory: i%2 === 0 ? '供应商工厂A' :'供应商工厂B',
                        inventoryState: '待收货',

                        material:'支重轮',
                        materialDescription: 'NEW2019-3009纯钢',
                        quantity:120,
                        sourcePosition: i%2 === 0 ? '合格品库' :'不合格品库',
                        destPosition: i%2 !== 0 ? '合格品库' :'不合格品库',
                        time: moment().format('YYYY-MM-DD HH:mm:ss'),
                        reason:'其它原因'
                    })
                }
                break

            case 'DispatchList':
                for (let i = 0; i < 6; i++) {
                    materials.push({
                        material:'支重轮',
                        materialDescription: 'NEW2019-3009纯钢',
                        quantity:120,
                        time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    })
                }

                for (let i = 0; i < 3; i++) {
                    data.push({
                        number: `101-k/12232${Math.floor(Math.random()*100)}`,
                        vmiFactory: i%2 === 0 ? '供应商工厂A' :'供应商工厂B',
                        inventoryState: '已收货',
                        materials: materials
                    })
                }
                break

            default:
                break
        }

        return data
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
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }   //如果this.state.hasMore为false，说明没数据了，直接返回
        console.log('reach end', event);
        this.setState({ isLoading: true });
        let data = await this.constructDataSet()
        let rData = this.state.rData.concat(data.map((_data, index) => ({id: freshId(), ..._data})));  //每次下拉之后将新数据装填过来
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(rData),
            rData,
            isLoading: false,
        });
    };

    //这里就是个渲染数据，rowData就是每次过来的那一批数据，已经自动给你遍历好了，rouID可以作为key值使用，直接渲染数据即可
    constructRowComponent = () => (rowData, sectionID, rowID) => {
        const {listType, isEditState = false, dispatchType = 'deliver'} = this.props
        let rowComponent
        switch (listType) {
            case 'ReceivedList':
                rowComponent =  (
                    <ReceivedItem
                        rowID={rowID}
                        data={rowData}
                    />
                )
                break

            case 'ReceivingList':
                rowComponent =  (
                    <ReceivingItem
                        rowID={rowID}
                        data={rowData}
                    />
                )
                break

            case 'OtherReceivedList':
                rowComponent = (
                    <OtherReceivedItem
                        rowID={rowID}
                        isEditState={isEditState}
                        data={rowData}
                    />
                )
                break

            case 'TransferList':
                rowComponent = (
                    <TransferItem
                        rowID={rowID}
                        isEditState={isEditState}
                        data={rowData}
                    />
                )
                break

            case 'DispatchList':
                rowComponent = (
                    <DispatchItem
                        dispatchType={dispatchType}
                        rowID={rowID}
                        data={rowData}
                    />
                )
                break

            default:
                rowComponent = null
                break
        }
        return rowComponent
    }

    render() {
        return (
            <RootView>
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
                    renderRow={this.constructRowComponent()}   //渲染你上边写好的那个row
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
                    pageSize={5}    //每次下拉之后显示的数据条数
                />
            </RootView>
        );
    }
}

export const CommonList = _CommonList;

const RootView = styled.div`
    background:#eee;
    height: calc(100vh - 60px);
`