import React, {Component} from 'react';
import {ListView, PullToRefresh, Toast} from "antd-mobile";
import ReactDOM from "react-dom";
import styled from "styled-components";
import moment from "moment";
import {ReceivedItem} from "../modules/receiving/components/ReceivedItem";
import {ReceivingItem} from "../modules/receiving/components/ReceivingItem";
import {OtherReceivedItem} from "../modules/receiving/components/OtherReceivedItem";
import {TransferItem} from "../modules/transfer/components/TransferItem";
import {DispatchItem} from "../modules/dispatch/components/DispatchItem";
import {GoodsTransferListItem} from "../modules/look-over/components/mobile/GoodsTransferListItem";
import {InventoryInfoListItem} from "../modules/look-over/components/mobile/InventoryInfoListItem";
import {ReversedInfoListItem} from "../modules/look-over/components/mobile/ReversedInfoListItem";
import { http, INVENTORY_STATUS, dispatchStatusList, reservoirLibraryList, Durian } from '../utils'
import { NoContent } from './NoContent'

const PAGE_SIZE = 5

const _ = require('lodash');
class _CommonList extends Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({  //这个dataSource有cloneWithRows方法
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            rData:[],
            dataSource,
            refreshing: true,
            isLoading: true,
            // page: 1,
            // pageSize: 4,
            height: document.documentElement.clientHeight,
            hasMore: true,
            footerRemoved: false,

            // 下拉刷新/上拉加载相关state
            currentPage:1,
            totalPages:1,

            // 业务逻辑相关的state
            isEditState: false,
        };
    }


    componentWillMount() {
        console.log('===componentWillMount===called')
    }
    componentWillUnmount() {
        console.log('===componentWillUnmount===called')
        if (this.timer) {
            clearTimeout(this.timer);
          }
    }

    async componentDidMount() {
        console.log('===componentDidMount===called')
        let hei = 0;
        if (this.lv) {
            hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
        }
        
        let { condition } = this.props;
        this.setState({
            currentPage:1,
        })
        let data = await this.constructDataSet(condition)
        let rData = data;//.map((_data) => ({id: freshId(), ..._data})) //retrieving data from server;
        // console.log(this.rData)
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(rData),
            rData,
            height: hei,
            refreshing: false,
            isLoading: false,
        });
    }

    async componentWillReceiveProps(nextProps) {
        console.log('===componentWillReceiveProps===called')
        let { condition } = nextProps;
        this.setState({
            currentPage:1,
        })
        let data = await this.constructDataSet(condition)
        let rData = data;//.map((_data) => ({id: freshId(), ..._data})) //retrieving data from server;
        // console.log(this.rData)
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(rData),
            rData,
            refreshing: false,
            isLoading: false,
        });
    }


    //Todo: 根据不同的模块，调用各自的接口构建数据
    constructDataSet = async (condition = {}) => {// condition 用来传递列表过滤条件
        const user = Durian.get('user');
        const supplierCode = user.vendor.value;
        // 首先检查是否到达最后一页，是则直接返回空数组
        let data = []
        const {currentPage, totalPages} = this.state
        if (currentPage > totalPages){
            this.setState({
                hasMore: false,
            })
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.setState({
                    footerRemoved: true
                });
            }, 2000);
            return data
        }

        // 否则，开始调用接口
        const {listType, dispatchType} = this.props

        const { material , status } = condition;

        // 接口请求参数
        let params = {}
        let requestUrl = ''

        let orderStatus = 0;
        switch (listType) {
            // 入库-已收货
            case 'ReceivedList':
                orderStatus = 4;
                break

            // 入库-待收货
            case 'ReceivingList':
                orderStatus = 2;
                break

            // 入库-其它入库
            case 'OtherReceivedList':
                orderStatus = 5;
                break

            // 移库
            case 'TransferList':
                params = {
                    style:3,// 1: 配送出库 2: 其他出库 3：移库
                    supplierCode: supplierCode,
                    page:currentPage,
                    pageSize:PAGE_SIZE,
                }
                requestUrl = '/warehouseOut/warehouseOutList'
                console.log('warehouse out request params', params);
                const resultTransferList = await http.post(requestUrl,params)
                const {
                    content: contentTransferList,
                    totalElements: totalElementsTransferList
                } = resultTransferList.data
                if (contentTransferList.length > 0) {
                    data = contentTransferList.map(originalData => {
                        const materials = originalData.warehouseOutMateriaList.map(warehouseOutMaterial=>{
                            return {
                                id: warehouseOutMaterial.id,
                                material:warehouseOutMaterial.materiaCode,
                                materialDescription: warehouseOutMaterial.materialName,
                                quantity: warehouseOutMaterial.materiaNumber,
                                sourcePosition:reservoirLibraryList.filter(library=>library.value === warehouseOutMaterial.sourceWarehouse)[0].label,
                                destPosition:reservoirLibraryList.filter(library=>library.value === warehouseOutMaterial.targetWarehouse)[0].label,
                                units: warehouseOutMaterial.units,
                                reason:warehouseOutMaterial.reason,
                            }
                        })
                        return {
                            id: originalData.id,
                            code: originalData.code,
                            status: originalData.status,
                            number: originalData.status === 4 ? originalData.moveQualifiedCode : originalData.moveBadCode,
                            moveName: originalData.status === 4 ? originalData.moveQualifiedName : originalData.moveBadName,
                            createTime: moment(originalData.createTime).format('YYYY-MM-DD HH:mm'),
                            inventoryState: dispatchStatusList.filter(status=>status.value === originalData.status)[0].label,
                            materials
                        }
                    })
                }
                console.log('---request---')
                this.setState((prevState) => {
                    return {
                        totalPages: totalElementsTransferList/PAGE_SIZE+1,
                    }
                })
                break

            // 出库
            case 'DispatchList':
                params = {
                    style:dispatchType === 'deliver'?1:2,// 1: 配送出库 2: 其他出库 3：移库
                    supplierCode: supplierCode,
                    page:currentPage,
                    pageSize:PAGE_SIZE,
                }
                requestUrl = '/warehouseOut/warehouseOutList'
                console.log('warehouse out request params', params);
                const resultDispatchList = await http.post(requestUrl,params)
                const {
                    content: contentDispatchList,
                    totalElements: totalElementsDispatchList
                } = resultDispatchList.data
                if (contentDispatchList.length > 0) {
                    data = contentDispatchList.map(originalData => {
                        const materials = originalData.warehouseOutMateriaList.map(warehouseOutMaterial=>{
                            console.log('warehouseOutMaterial', warehouseOutMaterial);
                            return {
                                id: warehouseOutMaterial.id,
                                material:warehouseOutMaterial.materiaCode,
                                materialDescription: warehouseOutMaterial.materialName,
                                quantity: warehouseOutMaterial.materiaNumber,
                                units: warehouseOutMaterial.units,
                            }
                        })
                        return {
                            id: originalData.id,
                            code: originalData.code,
                            status: originalData.status,
                            number: dispatchType === 'deliver' ? originalData.outCode : originalData.otherOutCode,
                            outName: dispatchType === 'deliver' ? originalData.outName : originalData.otherOutName,
                            createTime: moment(originalData.createTime).format('YYYY-MM-DD HH:mm'),
                            inventoryState: dispatchStatusList.filter(status=>status.value === originalData.status)[0].label,
                            materials
                        }
                    })
                }
                console.log('---request---')
                this.setState((prevState) => {
                    return {
                        totalPages: totalElementsDispatchList/PAGE_SIZE+1,
                    }
                })
            break

            // 我的-报表信息-货物移动
            case 'GoodsTransferList':
                params = {
                    supplierCode: supplierCode,
                    page:currentPage,
                    pageSize:PAGE_SIZE,
                }
                if (material && material !== '') {
                    params.materiaName = material
                }
                if (status && status > 0) {
                    params.status = status
                }

                console.log('gtlist params:', params);

                requestUrl = '/statisticalReport/mobileQueryReport'
                const gtlist = await http.post(requestUrl,params)
                const {
                    content: gtReports,
                    totalElements: gtTotalElements
                } = gtlist.data
                console.log('reports', gtReports);
                if (gtReports.length > 0) {
                    data = gtReports.map(report => {
                        return {
                            code: report.code,
                            material: report.materiaCode,
                            materialDescription: report.materialName,
                            units: report.units,
                            qualifiedQuantity: report.qualifiedNumber,
                            unqualifiedQuantity: report.badNumber,
                            // onTheWayQuantity: report.,
                            reason: report.reason,
                            status: INVENTORY_STATUS[report.status],
                            createdAt: moment(report.createTime).format('YYYY-MM-DD HH:mm'),
                        }
                    })
                }
                console.log('---request---')
                this.setState((prevState) => {
                    return {
                        totalPages: gtTotalElements/PAGE_SIZE+1,
                    }
                })
                break

            // 我的-报表信息-库存信息
            case 'InventoryInfoList':
                params = {
                    supplierCode: supplierCode,
                    page:currentPage,
                    pageSize:PAGE_SIZE,
                }
                if (material && material !== '') {
                    params.materiaName = material
                }
                console.log('iilist params', params);
                requestUrl = '/statisticalReport/inventoryInforQueryReport'
                const iilist = await http.post(requestUrl,params)
                const {
                    content: iiReports,
                    totalElements: iiTotalElements
                } = iilist.data
                console.log('reports', iiReports);
                if (iiReports.length > 0) {
                    data = iiReports.map(report => {
                        return {
                            material: report.materiaCode,
                            materialDescription: report.materialName,
                            units: report.units,
                            qualifiedQuantity: report.qualifiedNumber,
                            unqualifiedQuantity: report.badNumber,
                            onTheWayQuantity: report.onTheWayNum,
                            // createdAt: moment(report.createTime).format('YYYY-MM-DD HH:mm'),
                        }
                    })
                }
                console.log('---request---')
                this.setState((prevState) => {
                    return {
                        totalPages: iiTotalElements/PAGE_SIZE+1,
                    }
                })
                break

            // 我的-报表信息-冲销信息
            case 'ReversedInfoList':
                // for (let i = 0; i < 10; i++) {
                //     data.push({
                //         vmiFactory: i%2 === 0 ? '供应商A' :'供应商B',
                //         inventoryState: '待收货',
                //         material:'支重轮',
                //         materialDescription: 'NEW2019-3009纯钢',
                //         quantity:120,
                //         generatedNumber: `SC-${i + 1}`,//生成号码
                //         generatedDate: moment().format('YYYY-MM-DD HH:mm'),// 生成日期
                //         reversedNumber: `CX-${i + 1}`,//冲销号码
                //         reversedDate: moment().format('YYYY-MM-DD HH:mm'),// 冲销号日期
                //     })
                // }
                break

            default:
                break
        }
        if (orderStatus > 0) {
            
            let params =  {
                status:orderStatus, 
                supplierCode: supplierCode,
                page:currentPage, 
                pageSize:PAGE_SIZE
            }
            const result = await http.post('/order/find/all', params)
            // console.log('result:', result);
            const {content, totalElements} = result.data
            if (content.length > 0) {
                data = content.map(i => {
                    return {
                        id: i.id,
                        code: i.code,
                        receiveCode:i.receiveCode,
                        otherReceiveCode:i.otherReceiveCode,
                        deliveryName: i.deliveryName,
                        otherReceiveName: i.otherReceiveName,
                        transportTime: moment(i.transportTime).format('YYYY-MM-DD'),
                        receiveTime: moment(i.receiveTime).format('YYYY-MM-DD HH:mm:ss'),
                        otherReceiveTime: moment(i.otherReceiveTime).format('YYYY-MM-DD HH:mm:ss'),
                    }
                })
            }
            this.setState((prevState) => {
                return {
                    totalPages: totalElements/PAGE_SIZE+1,
                }
            })
        }

        return data || [];
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
        console.log('===CommonList onEndReached===called')
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }   //如果this.state.hasMore为false，说明没数据了，直接返回

        this.setState((prevState) => {
            return {
                currentPage: prevState.currentPage+1,
                isLoading: true
            }
        }, async ()=>{
            let { condition } = this.props;
            let data = await this.constructDataSet(condition)
            console.log('reach end ::: data = ', data);
            // let rData = this.state.rData.concat(data.map((_data, index) => ({id: freshId(), ..._data})));  //每次下拉之后将新数据装填过来
            let rData = this.state.rData.concat(data);  //每次下拉之后将新数据装填过来
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(rData),
                rData,
                isLoading: false,
            });
        })
    };

    reverseOrder = (id) => {
        console.log(`reverse order item ${id}`);
        const user = Durian.get('user');
        let params = {
            id: id,
            otherOffsetName: user.userName,
        }
        console.log('order offset update params', params);
        http.post('/order/update/offset/other', params)
            .then(result => {
                console.log(result);
                if (result.ret === '200' && result.msg === '成功') {
                    Toast.success('冲销成功！', 1);
                    let rData = this.state.rData;//.map((_data) => ({id: freshId(), ..._data})) //retrieving data from server;
                    
                    console.log('before', rData)
                    _.remove(rData, r => r.id === id)
                    console.log('after', this.rData)
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(rData),
                        rData,
                    });
                }
            })
            .catch(error => {
                Toast.fail(error.msg, 1);
                console.error(`Error from server:${error.msg}`);
            });

    }
    reverseWarehouseout = (id) => {
        console.log(`reverse warehouse out item ${id}`);

        const user = Durian.get('user');
        const supplierCode = user.vendor.value;
        const { dispatchType } = this.props
        console.log('is dispatch?' + dispatchType);
        const style = dispatchType === 'others' ? 1:2;//目前只有其他出库有冲销，普通出库不显示冲销按钮，不会执行该方法,如需增加普通出库冲销，需重新设计style值的获取方法。

        const reverseItem = _.find(this.state.rData, r => r.id === id);
        console.log('reverseItem', reverseItem); 
        let params = {
            style: style,
            id: id,
            code: reverseItem.code,
            status: reverseItem.status,
            supplierCode:supplierCode,
            operatorName: user.userName,
        }
        console.log('params:', params);
        http.post('/warehouseOut/warehouseOutOffSet', params)
            .then(result => {
                console.log(result);
                if (result.ret === '200' && result.msg === '成功') {
                    Toast.success('冲销成功！', 1);
                    let rData = this.state.rData;//.map((_data) => ({id: freshId(), ..._data})) //retrieving data from server;
                    
                    console.log('before', rData)
                    _.remove(rData, r => r.id === id)
                    console.log('after', rData)
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(rData),
                        rData,
                    });
                }
            })
            .catch(error => {
                Toast.fail(error.msg, 1);
                console.error(`Error from server:${error.msg}`);
            });

    }
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
                        isEditState={isEditState}
                        rowID={rowID}
                        data={rowData}
                        onReverse={this.reverseOrder}
                    />
                )
                break

            case 'TransferList':
                rowComponent = (
                    <TransferItem
                        isEditState={isEditState}
                        rowID={rowID}
                        data={rowData}
                        onReverse={this.reverseWarehouseout}
                    />
                )
                break

            case 'DispatchList':
                rowComponent = (
                    <DispatchItem
                        dispatchType={dispatchType}
                        rowID={rowID}
                        data={rowData}
                        onReverse={this.reverseWarehouseout}
                    />
                )
                break

            case 'GoodsTransferList':
                rowComponent = (
                    <GoodsTransferListItem
                        rowID={rowID}
                        data={rowData}
                    />
                )
                break

            case 'InventoryInfoList':
                rowComponent = (
                    <InventoryInfoListItem
                        rowID={rowID}
                        data={rowData}
                    />
                )
                break

            case 'ReversedInfoList':
                rowComponent = (
                    <ReversedInfoListItem
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
        const {listType} = this.props
        
        const { currentPage, rData } = this.state
        return (
            <RootView style={this.props.style} withSearchBar={this.props.withSearchBar} withSubTabBar={listType !== 'TransferList'}>
            {(currentPage===1 && rData.length === 0) ? 
                <NoContent /> : 
                <ListView
                    className={'refresh-list-view-style'}
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={    //renderFooter就是下拉时候的loading效果，这里的内容可以自己随需求更改
                        () => {
                           if (!this.state.footerRemoved) {
                                return (
                                <div style={{ padding: 10, textAlign: 'center' }}>
                                    {this.state.isLoading ? '加载中...' : ''}
                                </div>
                                )
                           }
                        } 
                        
                    }
                    renderRow={this.constructRowComponent()}   //渲染你上边写好的那个row
                    style={{
                        height: '100%'
                    }}
                    pullToRefresh={<PullToRefresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />}
                    onEndReached={this.onEndReached}
                    pageSize={PAGE_SIZE}    //每次下拉之后显示的数据条数
                />
            }
            </RootView>
        );
    }
}

export const CommonList = _CommonList;

const RootView = styled.div`
    background:#eee;
    height: ${p=> p.withSearchBar? 'calc(100vh - 190px)' : (p=> p.withSubTabBar? 'calc(100vh - 150px)' : 'calc(100vh - 106px)')};
`