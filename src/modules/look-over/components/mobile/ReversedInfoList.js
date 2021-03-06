import React, {Component} from 'react';
import moment from "moment";
import styled from "styled-components";
import {ListView, PullToRefresh} from "antd-mobile";
import ReactDOM from "react-dom";
import {ReversedInfoListItem} from "./ReversedInfoListItem";
import { http, Durian } from '../../../../utils'
import { NoContent } from '../../../../components'

const PAGE_SIZE = 5

class _ReversedInfoList extends Component {

    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({  //这个dataSource有cloneWithRows方法
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state={
            rData:[],
            dataSource,
            refreshing: true,
            isLoading: true,
            height: document.documentElement.clientHeight,
            // useBodyScroll: false,
            hasMore: true,
            // 下拉刷新/上拉加载相关state
            currentPage:1,
            totalPages:1,
        }
    }

    componentWillUnmount() {
        console.log('===componentWillUnmount===called')
        if (this.timer) {
            clearTimeout(this.timer);
          }
    }

    async componentDidMount() {
        console.log('in did mount!');
        let { selectedTab } = this.props;
        let data = await this.constructDataSet(selectedTab)
        this.setStates(data)
    }

    async componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps called', nextProps)
        if (nextProps.selectedTab !== this.props.selectedTab) {
            let data = await this.constructDataSet(nextProps.selectedTab)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(data),
                rData: data,
                refreshing: false,
                isLoading: false,
            })

        }
    }

    setStates = (data) => {
        let hei = 0;
        if (this.lv) {
            hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
            rData: data,
            height: hei,
            refreshing: false,
            isLoading: false,
            page: 1,
            pageSize: 4,
        });
    }

    constructDataSet =  async (status) => {

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

        const user = Durian.get('user');
        const supplierCode = user.vendor.value;
        let params = {
            status: status,
            supplierCode: supplierCode,
            page: currentPage,
            pageSize: PAGE_SIZE,
        }
        console.log('report request params:', params);
        const result = await http.post('/statisticalReport/writeOffinforInquiryreport', params)
            console.log('result:', result);
            const {content} = result.data
            if (content.length > 0) {
                data = content.map(i => {
                    return {
                        code: i.code,
                        createTime: moment(i.createTime).format('YYYY-MM-DD HH:mm'),
                        reversedCode: status==='1'?i.offsetCode:
                                        status==='2'?i.otherOffsetCode:
                                        status==='3'?i.otherOutOffsetCode:
                                        status==='4'?i.moveOffsetCode:null,

                        reversedTime: moment(
                                        status==='1'?i.offsetTime:
                                        status==='2'?i.otherOffsetTime:
                                        status==='3'?i.otherOutOffsetDate:
                                        status==='4'?i.moveOffsetDate:null
                                        ).format('YYYY-MM-DD HH:mm'),
                        reversedName: status==='1'?i.offsetName:
                                        status==='2'?i.otherOffsetName:
                                        status==='3'?i.otherOutOffsetName:
                                        status==='4'?i.moveOffsetName:null,
                    }
                })
            }
        return data
    }

    onEndReached = async (event) => {
        console.log('===ReversedInfoList onEndReached===called')
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
            let data = await this.constructDataSet(this.props.selectedTab)
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

    //这里就是个渲染数据，rowData就是每次过来的那一批数据，已经自动给你遍历好了，rouID可以作为key值使用，直接渲染数据即可
    constructRowComponent = () => (rowData, sectionID, rowID) => {
        return (
            <ReversedInfoListItem
                rowID={rowID}
                data={rowData}
                type = {this.props.selectedTab/*报表冲销类型*/}

            />
        )
    }

    render() {
        const { currentPage, rData } = this.state
        return (
            <RootView>
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
                        height: '100%',
                    }}
                    pullToRefresh={<PullToRefresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />}
                    onEndReached={this.onEndReached}
                    pageSize={10}    //每次下拉之后显示的数据条数
                />
            }
            </RootView>
        );
    }
}

export const ReversedInfoList = _ReversedInfoList;

const RootView = styled.div`
    background:#eee;
    height: calc(100vh - 145px);
`