import React, {Component} from 'react';
import {
    reversedInfoStatusList,
    http, goodsTransferStatusList, PRIMARY_COLOR,
    Durian,
} from "../../../utils";
import {Button, DatePicker, Input, message, Select, Upload} from "antd";
import styled from "styled-components";
import moment from 'moment'

const dateFormat = 'YYYY-MM-DD HH:mm:ss'
const Search = Input.Search;
const Option = Select.Option;

const {RangePicker} = DatePicker;

function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}

function disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf('d');
}

function disabledRangeTime(_, type) {
    if (type === 'start') {
        return {
            disabledHours: () => range(0, 60).splice(4, 20),
            disabledMinutes: () => range(30, 60),
            disabledSeconds: () => [55, 56],
        };
    }
    return {
        disabledHours: () => range(0, 60).splice(20, 4),
        disabledMinutes: () => range(0, 31),
        disabledSeconds: () => [55, 56],
    };
}

class _ShippingHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // Session中存的用户信息
            userInfo: {},
            // 从后端获取的工厂列表和供应商列表
            factoryList: [],
            vendorList: [],

            // 筛选器State
            // 发货管理
            tab1_obj: {
                recordNumber: '',// 号码(模糊查询)
                clientFactory: '',// 客户工厂
                temporaryStoreTime: '',// 暂存时间
                expectReachDate: '',// 预到日期
            },
            // 冲销管理
            tab2_obj: {
                recordNumber: '',// 号码(模糊查询)
                clientFactory: '',// 客户工厂
                reversedTime: '',// 冲销时间
                expectReachDate: '',// 预到日期
            },
            // 在途管理
            tab3_obj: {
                recordNumber: '',// 号码(模糊查询)
                clientFactory: '',// 客户工厂
                sentTime: '',// 发货时间
                expectReachDate: '',// 预到日期
            },
            // 收货信息查询
            tab4_obj: {
                recordNumber: '',// 号码(模糊查询)
                clientFactory: '',// 客户工厂
                sentTime: '',// 发货时间
                receivedTime: '',// 收货时间
                expectReachDate: '',// 预到日期
            },
            // 物料管理
            tab5_obj: {
                material: '',
                materialDescription: '',
            },
            // 货物移动
            tab6_obj: {
                vendorName: '',
                status: '',
                material: '',
                materialDescription: '',
                // createdAt: '',
                dateRange: [moment(moment().subtract(3, 'days'), dateFormat), moment(moment(), dateFormat)],
            },
            // 库存信息
            tab7_obj: {
                material: '',
                materialDescription: '',
                createdAt: '',
            },
            // 冲销信息
            tab8_obj: {
                vendorName: '',
                status: '',
                generatedNumber: '',
                generatedDate: '',
                reversedNumber: '',
                reversedDate: '',
            },
        }
    }

    async componentDidMount() {
        //获取列表数据：工厂列表
        const result = await http.post('/factory/factoryList', {})
        if (result.ret === '200') {
            this.setState({
                factoryList: result.data.content.map(item => ({
                    key: `factory_${item.code}`,
                    value: item.code,
                    label: item.name
                }))
            })
        } else {
            message.error('获取工厂列表失败！请稍候重试。')
        }

        // 获取列表数据：供应商列表
        const result2 = await http.post('/supplier/supplierList', {})
        if (result2.ret === '200') {
            this.setState({
                vendorList: result2.data.content.map(item => ({
                    key: `vendor_${item.code}`,
                    value: item.code,
                    label: item.name
                }))
            })
        } else {
            message.error('获取供应商列表失败！请稍候重试。')
        }

    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.selectedTabKey !== this.props.selectedTabKey) {
            // 点击切换了侧边栏后，要清空筛选条件
            this.setState({
                // 筛选器State
                // 发货管理
                tab1_obj: {
                    recordNumber: '',// 号码(模糊查询)
                    clientFactory: '',// 客户工厂
                    temporaryStoreTime: '',// 暂存时间
                    expectReachDate: '',// 预到日期
                },
                // 冲销管理
                tab2_obj: {
                    recordNumber: '',// 号码(模糊查询)
                    clientFactory: '',// 客户工厂
                    reversedTime: '',// 冲销时间
                    expectReachDate: '',// 预到日期
                },
                // 在途管理
                tab3_obj: {
                    recordNumber: '',// 号码(模糊查询)
                    clientFactory: '',// 客户工厂
                    sentTime: '',// 发货时间
                    expectReachDate: '',// 预到日期
                },
                // 收货信息查询
                tab4_obj: {
                    vendorName: '', // 供应商
                    recordNumber: '',// 号码(模糊查询)
                    clientFactory: '',// 客户工厂
                    sentTime: '',// 发货时间
                    receivedTime: '',// 收货时间
                    expectReachDate: '',// 预到日期
                },
                // 物料管理
                tab5_obj: {
                    material: '',
                    materialDescription: '',
                },
                // 货物移动
                tab6_obj: {
                    vendorName: '',
                    status: '',
                    material: '',
                    materialDescription: '',
                    // createdAt: '',
                    dateRange: [moment(moment().subtract(3, 'days'), dateFormat), moment(moment(), dateFormat)],
                },
                // 库存信息
                tab7_obj: {
                    material: '',
                    materialDescription: '',
                    createdAt: '',
                },
                // 冲销信息
                tab8_obj: {
                    vendorName: '',
                    status: '',
                    generatedNumber: '',
                    generatedDate: '',
                    reversedNumber: '',
                    reversedDate: '',
                },
            })
        }
    }

    downLoadTemplateFile = (type) => {
        let requestUrl = ''
        let fileName = ''
        switch (type) {
            case 'to_be_shipped_infos':
                requestUrl = 'download/template/ordertemplate.xls' // Todo:配置下载地址
                fileName = '发货单模板'
                break
            case 'vendor_material_type_management':
                requestUrl = 'download/template/suppliermaterialtempalte.xls' // Todo:配置下载地址
                fileName = '供应商物料模板'
                break
            default:
                break
        }
        console.log('downLoadTemplateFile called', requestUrl, fileName)
        http.downloadFile(requestUrl, fileName).then(result => {
            message.success('开始下载...')
        }).catch(e => {
            message.error('文件下载失败！请稍后重试。', e)
        })
    }

    render() {
        const {
            userInfo, // 存储在session中的用户信息
            selectedTabKey,// 当前选择的Tab页

            uploadProps,
            onSearchButtonClicked,
            onBatchShippingButtonClicked,
            onDeleteButtonClicked,
            onAddButtonClicked,

            editState
        } = this.props

        const {
            factoryList,
            vendorList,
            tab1_obj,
            tab2_obj,
            tab3_obj,
            tab4_obj,
            tab8_obj,
        } = this.state

        console.log('ShippingHeader render called', userInfo)

        let shouldShowSupplierSelector = userInfo && userInfo.type !== 4 && userInfo.type !== 5 && userInfo.type !== 3
        let shouldShowBatchUpload = userInfo && userInfo.type === 3 // 库存信息查询页面显示批量上传按钮

        let tableComponent
        switch (selectedTabKey) {
            // 信息管理-发货管理
            case 'to_be_shipped_infos':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{justifyContent: 'flex-start'}}>
                            <Input
                                key={'tab1_1'}
                                style={{width: '30%', marginRight: '6px'}}
                                placeholder="请输入号码"
                                onChange={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState) => {
                                        return {
                                            tab1_obj: Object.assign({}, prevState.tab1_obj, {recordNumber: value})
                                        }
                                    }, () => onSearchButtonClicked(selectedTabKey, this.state.tab1_obj))
                                }}
                                onPressEnter={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState) => {
                                        return {
                                            tab1_obj: Object.assign({}, prevState.tab1_obj, {recordNumber: value})
                                        }
                                    }, () => onSearchButtonClicked(selectedTabKey, this.state.tab1_obj))
                                }}
                            />
                            <SelectView
                                key={'tab1_2'}
                                placeHolder="选择客户工厂"
                                options={factoryList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState) => {
                                        const factory = factoryList.filter(factory => factory.value === value)[0]
                                        if (factory) {
                                            return {
                                                tab1_obj: Object.assign({}, prevState.tab1_obj,
                                                    {clientFactory: factory.value}
                                                )
                                            }
                                        }
                                        return {
                                            tab1_obj: Object.assign({}, prevState.tab1_obj,
                                                {clientFactory: ''}
                                            )
                                        }
                                    })
                                }}
                            />
                            <DatePicker
                                key={'tab1_3'}
                                style={{marginRight: '6px', width: '20%'}}
                                placeholder="请选择暂存日期"
                                onChange={(date, dateString) => {
                                    this.setState((prevState) => {
                                        return {
                                            tab1_obj: Object.assign({}, prevState.tab1_obj, {temporaryStoreTime: dateString})
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab1_4'}
                                style={{marginRight: '6px', width: '20%'}}
                                placeholder="请选择预到日期"
                                onChange={(date, dateString) => {
                                    this.setState((prevState) => {
                                        return {
                                            tab1_obj: Object.assign({}, prevState.tab1_obj, {expectReachDate: dateString})
                                        }
                                    })
                                }}
                            />
                            <SearchButton
                                onClickCalled={() => onSearchButtonClicked(selectedTabKey, tab1_obj)}
                            />
                        </TableSearchView>

                        {
                            editState && (
                                <TableButtonsView>
                                    <Button
                                        type="primary"
                                        style={{marginRight: '6px'}}
                                        onClick={() => onBatchShippingButtonClicked()}
                                    >
                                        批量发货
                                    </Button>
                                    <Button
                                        type="danger"
                                        style={{marginRight: '6px'}}
                                        onClick={() => onDeleteButtonClicked()}
                                    >删除</Button>
                                </TableButtonsView>
                            )
                        }

                        {
                            !editState && (
                                <TableButtonsView style={{width: '40%'}}>
                                    <Button
                                        type="link"
                                        style={{color: PRIMARY_COLOR}}
                                    >
                                        <span className="iconfont"
                                              style={{fontSize: '1.2rem', color: '#187445'}}>&#xe619;</span>
                                        <a href={`${http.baseUrl}/download/template/ordertemplate.xls`}
                                           style={{marginLeft: '6px', textDecoration: 'underline'}}>点此下载批量导入模板</a>
                                    </Button>

                                    <Upload {...uploadProps}
                                            style={{marginRight: '6px'}}
                                    >
                                        <Button
                                            className={'table-button-style'}
                                            type="primary"
                                            icon="import"
                                            // onClick={() => onBatchImportButtonClicked(selectedTabKey)}
                                            style={{
                                                marginLeft: '2%',
                                                marginRight: '2%',
                                                color: '#fff',
                                                backgroundColor: '#59e37a',
                                                borderRadius: 4,
                                                borderColor: 'transparent'
                                            }}
                                        >批量导入</Button>
                                    </Upload>
                                    <Button
                                        type="primary"
                                        style={{marginRight: '6px'}}
                                        onClick={() => onAddButtonClicked()}
                                    >新增</Button>
                                </TableButtonsView>
                            )
                        }
                    </TableControllerView>
                )
                break

            // 信息管理-冲销管理
            case 'reversed_infos':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: '100%', justifyContent: 'flex'}}>
                            <InputView
                                key={'tab2_1'}
                                placeholder={"请输入冲销单号"}
                                onCalled={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState) => {
                                        return {
                                            tab2_obj: Object.assign({}, prevState.tab2_obj, {recordNumber: value})
                                        }
                                    }, () => onSearchButtonClicked(selectedTabKey, this.state.tab2_obj))
                                }}
                            />

                            <SelectView
                                key={'tab2_2'}
                                placeHolder="选择客户工厂"
                                options={factoryList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState) => {
                                        const factory = factoryList.filter(factory => factory.value === value)[0]
                                        if (factory) {
                                            return {
                                                tab2_obj: Object.assign({}, prevState.tab2_obj,
                                                    {clientFactory: factory.label}
                                                )
                                            }
                                        }
                                        return {
                                            tab2_obj: Object.assign({}, prevState.tab2_obj,
                                                {clientFactory: ''}
                                            )
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab2_3'}
                                style={{marginRight: '6px', width: '20%'}}
                                placeholder="请选择冲销日期"
                                onChange={(date, dateString) => {
                                    this.setState((prevState) => {
                                        return {
                                            tab2_obj: Object.assign({}, prevState.tab2_obj, {reversedTime: dateString})
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab2_4'}
                                style={{marginRight: '6px', width: '20%'}}
                                placeholder="请选择预到日期"
                                onChange={(date, dateString) => {
                                    this.setState((prevState) => {
                                        return {
                                            tab2_obj: Object.assign({}, prevState.tab2_obj, {expectReachDate: dateString})
                                        }
                                    })
                                }}
                            />

                            <SearchButton
                                onClickCalled={() => onSearchButtonClicked(selectedTabKey, tab2_obj)}
                            />
                        </TableSearchView>
                        <TableButtonsView/>
                    </TableControllerView>
                )
                break

            // 信息管理-在途管理
            case 'shipped_infos':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: '100%', justifyContent: 'flex-start'}}>
                            <InputView
                                key={'tab3_1'}
                                placeholder={"请输入发货单号"}
                                onCalled={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState) => {
                                        return {
                                            tab3_obj: Object.assign({}, prevState.tab3_obj, {recordNumber: value})
                                        }
                                    }, () => onSearchButtonClicked(selectedTabKey, this.state.tab3_obj))
                                }}
                            />

                            <SelectView
                                key={'tab3_2'}
                                placeHolder="选择客户工厂"
                                options={factoryList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState) => {
                                        const factory = factoryList.filter(factory => factory.value === value)[0]
                                        if (factory) {
                                            return {
                                                tab3_obj: Object.assign({}, prevState.tab3_obj,
                                                    {clientFactory: factory.label}
                                                )
                                            }
                                        }
                                        return {
                                            tab3_obj: Object.assign({}, prevState.tab3_obj,
                                                {clientFactory: ''}
                                            )
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab3_3'}
                                style={{marginRight: '6px', width: '20%'}}
                                placeholder="请选择发货日期"
                                onChange={(date, dateString) => {
                                    this.setState((prevState) => {
                                        return {
                                            tab3_obj: Object.assign({}, prevState.tab3_obj, {sentTime: dateString})
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab3_4'}
                                style={{marginRight: '6px', width: '20%'}}
                                placeholder="请选择预到日期"
                                onChange={(date, dateString) => {
                                    this.setState((prevState) => {
                                        return {
                                            tab3_obj: Object.assign({}, prevState.tab3_obj, {expectReachDate: dateString})
                                        }
                                    })
                                }}
                            />

                            <SearchButton
                                onClickCalled={() => onSearchButtonClicked(selectedTabKey, tab3_obj)}
                            />

                        </TableSearchView>
                        <TableButtonsView/>
                    </TableControllerView>
                )
                break

            // 报表管理-收货信息查询
            case 'vmi_received_infos':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: '100%', justifyContent: 'flex-start'}}>
                            {/*{
                                shouldShowSupplierSelector && (
                                    <SelectView
                                        key={'tab4_1'}
                                        placeHolder="选择供应商"
                                        options={vendorList}
                                        onChangeCalled={(value = '') => {
                                            this.setState((prevState) => {
                                                const vendor = vendorList.filter(factory => factory.value === value)[0]
                                                if (vendor) {
                                                    return {
                                                        tab4_obj: Object.assign({}, prevState.tab4_obj,
                                                            {vendorName: vendor.label}
                                                        )
                                                    }
                                                }
                                                return {
                                                    tab4_obj: Object.assign({}, prevState.tab4_obj,
                                                        {vendorName: ''}
                                                    )
                                                }
                                            })
                                        }}
                                    />
                                )
                            }*/}

                            <InputView
                                key={'tab4_2'}
                                placeholder={"请输入收货单号"}
                                onCalled={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState) => {
                                        return {
                                            tab4_obj: Object.assign({}, prevState.tab4_obj, {recordNumber: value})
                                        }
                                    }, () => onSearchButtonClicked(selectedTabKey, this.state.tab4_obj))
                                }}
                            />

                            <SelectView
                                key={'tab4_3'}
                                placeHolder="选择客户工厂"
                                options={factoryList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState) => {
                                        const factory = factoryList.filter(factory => factory.value === value)[0]
                                        if (factory) {
                                            return {
                                                tab4_obj: Object.assign({}, prevState.tab4_obj,
                                                    {clientFactory: factory.label}
                                                )
                                            }
                                        }
                                        return {
                                            tab4_obj: Object.assign({}, prevState.tab4_obj,
                                                {clientFactory: ''}
                                            )
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab4_4'}
                                style={{marginRight: '6px', width: '20%'}}
                                placeholder="请选择发货日期"
                                onChange={(date, dateString) => {
                                    this.setState((prevState) => {
                                        return {
                                            tab4_obj: Object.assign({}, prevState.tab4_obj, {sentTime: dateString})
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab4_5'}
                                style={{marginRight: '6px', width: '20%'}}
                                placeholder="请选择收货日期"
                                onChange={(date, dateString) => {
                                    this.setState((prevState) => {
                                        return {
                                            tab4_obj: Object.assign({}, prevState.tab4_obj, {receivedTime: dateString})
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab4_6'}
                                style={{marginRight: '6px', width: '20%'}}
                                placeholder="请选择预到日期"
                                onChange={(date, dateString) => {
                                    this.setState((prevState) => {
                                        return {
                                            tab4_obj: Object.assign({}, prevState.tab4_obj, {expectReachDate: dateString})
                                        }
                                    })
                                }}
                            />

                            <SearchButton
                                onClickCalled={() => onSearchButtonClicked(selectedTabKey, tab4_obj)}
                            />

                        </TableSearchView>
                        <TableButtonsView/>
                    </TableControllerView>
                )
                break

            // 信息管理-货源清单管理
            case 'vendor_material_type_management':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: '50%'}}>
                            <SearchView
                                key={'tab5_1'}
                                placeHolder="请输入物料编号或名称"
                                onSearchCalled={(value = '') => {
                                    console.log('onSearchCalled called!', value)
                                    this.setState((prevState) => {
                                        return {
                                            tab5_obj: Object.assign({}, prevState.tab5_obj, {material: value}, {materialDescription: value})
                                        }
                                    }, () => {
                                        onSearchButtonClicked(selectedTabKey, this.state.tab5_obj)
                                    })
                                }}
                            />
                        </TableSearchView>

                        <TableButtonsView style={{width: '50%'}}>
                            <Button
                                type="link"
                                style={{color: PRIMARY_COLOR}}
                            >
                                <span className="iconfont"
                                      style={{fontSize: '1.2rem', color: '#187445'}}>&#xe619;</span>
                                <a href={`${http.baseUrl}/download/template/suppliermaterialtempalte.xls`}
                                   style={{marginLeft: '6px', textDecoration: 'underline'}}>点此下载批量导入模板</a>
                            </Button>
                            <Upload {...uploadProps}
                                    style={{marginRight: '6px'}}
                            >
                                <Button
                                    className={'table-button-style'}
                                    type="primary"
                                    icon="import"
                                    // onClick={() => onBatchImportButtonClicked(selectedTabKey)}
                                    style={{
                                        marginLeft: '2%',
                                        marginRight: '2%',
                                        color: '#fff',
                                        backgroundColor: '#59e37a',
                                        borderRadius: 4,
                                        borderColor: 'transparent'
                                    }}
                                >批量导入</Button>
                            </Upload>
                            <Button
                                type="primary"
                                style={{marginRight: '6px'}}
                                onClick={() => onAddButtonClicked()}
                            >新增</Button>
                        </TableButtonsView>
                    </TableControllerView>
                )
                break

            // 报表管理-货物移动查询
            case 'goods_transfer_query':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: '100%', justifyContent: 'flex-start'}}>
                            {
                                shouldShowSupplierSelector && (
                                    <SelectView
                                        key={'tab6_1'}
                                        placeHolder="选择供应商"
                                        options={vendorList}
                                        onChangeCalled={(value = '') => {
                                            this.setState((prevState) => {
                                                const vendor = vendorList.filter(factory => factory.value === value)[0]
                                                if (vendor) {
                                                    return {
                                                        tab6_obj: Object.assign({}, prevState.tab6_obj,
                                                            {vendorName: vendor.label}
                                                        )
                                                    }
                                                }
                                                return {
                                                    tab6_obj: Object.assign({}, prevState.tab6_obj,
                                                        {vendorName: ''}
                                                    )
                                                }
                                            })
                                        }}
                                    />
                                )
                            }

                            <SelectView
                                key={'tab6_2'}
                                placeHolder="选择移动类型"
                                options={goodsTransferStatusList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState) => {
                                        return {
                                            tab6_obj: Object.assign({}, prevState.tab6_obj, {status: value})
                                        }
                                    })
                                }}
                            />

                            {/*<DatePicker*/}
                            {/*    key={'tab6_3'}*/}
                            {/*    style={{marginRight: '6px'}}*/}
                            {/*    placeholder="请选择日期"*/}
                            {/*    onChange={(date, dateString)=>{*/}
                            {/*        this.setState((prevState)=>{*/}
                            {/*            return {*/}
                            {/*                tab6_obj: Object.assign({}, prevState.tab6_obj, {createdAt: dateString})*/}
                            {/*            }*/}
                            {/*        })*/}
                            {/*    }}*/}
                            {/*/>*/}

                            <RangePicker
                                style={{marginRight: '6px'}}
                                allowClear={false}
                                placeholder={['开始日期', '结束日期']}
                                defaultValue={[moment(moment().subtract(3, 'days')).startOf('d'), moment().endOf('d')]}
                                disabledDate={disabledDate}
                                disabledTime={disabledRangeTime}
                                // showTime={{
                                //     hideDisabledOptions: true,
                                //     defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                // }}
                                showTime={false}
                                // format="YYYY-MM-DD"
                                onChange={(dates, dateStrings) => {
                                    this.setState((prevState) => {
                                        let startDate = moment(dates[0]).startOf('d')
                                        let endDate = moment(dates[1]).endOf('d')
                                        return {
                                            tab6_obj: Object.assign({}, prevState.tab6_obj, {dateRange: [startDate, endDate]})
                                        }
                                    })
                                }}
                            />

                            <div
                                style={{width: '30%'}}
                            >
                                <SearchView
                                    key={'tab6_4'}
                                    placeHolder="请输入物料编号或名称"
                                    onSearchCalled={(value = '') => {
                                        this.setState((prevState) => {
                                            return {
                                                tab6_obj: Object.assign({}, prevState.tab6_obj, {material: value}, {materialDescription: value})
                                            }
                                        }, () => {
                                            onSearchButtonClicked(selectedTabKey, this.state.tab6_obj)
                                        })
                                    }}
                                />
                            </div>
                        </TableSearchView>

                        <TableButtonsView>
                            <Button
                                type="primary"
                                style={{
                                    color: '#fff', 
                                    alignItems:'center',
                                }}
                                onClick={()=>{
                                    const user = Durian.get('user');
                                    const vendor = user.vendor;
                                    let { material:materiaCode } = this.state.tab6_obj;
                                    
                                    let params = {}

                                    if (vendor && vendor.value) {
                                        params.supplierCode = vendor.value
                                    }
                                    if (materiaCode &&  materiaCode === '') {
                                        params.materiaCode = materiaCode;
                                    }
                                    // http.post('/statisticalReport/exportInventoryInforQueryReport', params)
                                    // .then(result => {
                                    //     console.log(result);
                                    //     if (result.ret === '200' && result.msg === '成功') {
                                    //         let url = result.url;
                                    //         console.log('url', url);
                                    //         http.get(`${http.baseUrl}${url}`)
                                    //     }
                                    // })
                                    // .catch(error => {
                                    //     message.error(error.msg);
                                    //     console.error(`Error from server:${error.msg}`);
                                    // });
                                    http.download('/statisticalReport/exportMobileQueryReport', params)
                                    
                                    .then(result => {
                                        var blob = new Blob([result], { type: "application/vnd.ms-excel" })
                                        const fileName =  `货物移动报表-${moment().format('YYYYMMDDHHmmss')}.xlsx`;
                                        if ('download' in document.createElement('a')) { // 非IE下载
                                            const elink = document.createElement('a')
                                            elink.download = fileName
                                            elink.style.display = 'none'
                                            elink.href = URL.createObjectURL(blob)
                                            document.body.appendChild(elink)
                                            elink.click()
                                            URL.revokeObjectURL(elink.href) // 释放URL 对象
                                            document.body.removeChild(elink)
                                        } else { // IE10+下载
                                            navigator.msSaveBlob(blob, fileName)
                                        }
                                    })
                                    .catch(error => {
                                        message.error(error.msg);
                                        console.error(`Error from server:${error.msg}`);
                                    });
                                }}
                            >
                                <span className="iconfont"
                                      style={{fontSize: '1rem', color: 'white', marginRight:'5px'}}>&#xe619;</span>
                                {/*<a href={`${http.baseUrl}/download/template/warehouseoutmateria.xls?`}*/}
                                {/*   style={{marginLeft: '6px', color: 'white' }}>批量导出</a>*/}

                               批量导出
                            </Button>
                        </TableButtonsView>
                    </TableControllerView>
                )
                break

            // 报表管理-库存信息查询
            case 'inventory_infos_query':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: shouldShowBatchUpload?'30%':'50%', justifyContent: 'flex-start'}}>
                            {/*<DatePicker*/}
                            {/*    style={{marginRight: '6px'}}*/}
                            {/*    placeholder="请选择日期"*/}
                            {/*    onChange={(date, dateString)=>{*/}
                            {/*        this.setState((prevState)=>{*/}
                            {/*            return {*/}
                            {/*                tab7_obj: Object.assign({}, prevState.tab7_obj, {createdAt: dateString})*/}
                            {/*            }*/}
                            {/*        })*/}
                            {/*    }}*/}
                            {/*/>*/}

                            <SearchView
                                key={'tab7_1'}
                                placeHolder="请输入物料编号或名称"
                                onSearchCalled={(value = '') => {
                                    this.setState((prevState) => {
                                        return {
                                            tab7_obj: Object.assign({}, prevState.tab7_obj, {material: value}, {materialDescription: value})
                                        }
                                    }, () => {
                                        onSearchButtonClicked(selectedTabKey, this.state.tab7_obj)
                                    })
                                }}
                            />
                        </TableSearchView>

                        <TableButtonsView>
                            {
                                shouldShowBatchUpload && (
                                    <div>
                                        <Button
                                            type="link"
                                            style={{color: PRIMARY_COLOR}}
                                        >
                                                    <span className="iconfont"
                                                          style={{fontSize: '1.2rem', color: '#187445'}}>&#xe619;</span>
                                            <a href={`${http.baseUrl}/download/template/warehouseoutmateria.xls`}
                                               style={{
                                                   marginLeft: '6px',
                                                   textDecoration: 'underline'
                                               }}>点此下载批量出库模板</a>
                                        </Button>
                                        <Upload {...uploadProps}
                                                style={{marginRight: '6px'}}
                                        >
                                            <Button
                                                className={'table-button-style'}
                                                type="primary"
                                                icon="import"
                                                // onClick={() => onBatchImportButtonClicked(selectedTabKey)}
                                                style={{
                                                    marginLeft: '2%',
                                                    marginRight: '2%',
                                                    color: '#fff',
                                                    backgroundColor: '#59e37a',
                                                    borderRadius: 4,
                                                    borderColor: 'transparent'
                                                }}
                                            >批量出库</Button>
                                        </Upload>
                                    </div>
                                )
                            }
                            <Button
                                type="primary"
                                style={{
                                    color: '#fff', 
                                    alignItems:'center',
                                }}
                                onClick={()=>{
                                    const user = Durian.get('user');
                                    const vendor = user.vendor;
                                    let { material:materiaCode } = this.state.tab7_obj;
                                    
                                    let params = {}

                                    if (vendor && vendor.value) {
                                        params.supplierCode = vendor.value
                                    }
                                    if (materiaCode &&  materiaCode === '') {
                                        params.materiaCode = materiaCode;
                                    }
                                    // http.post('/statisticalReport/exportInventoryInforQueryReport', params)
                                    // .then(result => {
                                    //     console.log(result);
                                    //     if (result.ret === '200' && result.msg === '成功') {
                                    //         let url = result.url;
                                    //         console.log('url', url);
                                    //         http.get(`${http.baseUrl}${url}`)
                                    //     }
                                    // })
                                    // .catch(error => {
                                    //     message.error(error.msg);
                                    //     console.error(`Error from server:${error.msg}`);
                                    // });
                                    http.download('/statisticalReport/exportInventoryInforQueryReport', params)
                                    .then(result => {
                                        var blob = new Blob([result], { type: "application/vnd.ms-excel" })
                                        const fileName =  `库存信息报表-${moment().format('YYYYMMDDHHmmss')}.xlsx`;
                                        if ('download' in document.createElement('a')) { // 非IE下载
                                            const elink = document.createElement('a')
                                            elink.download = fileName
                                            elink.style.display = 'none'
                                            elink.href = URL.createObjectURL(blob)
                                            document.body.appendChild(elink)
                                            elink.click()
                                            URL.revokeObjectURL(elink.href) // 释放URL 对象
                                            document.body.removeChild(elink)
                                        } else { // IE10+下载
                                            navigator.msSaveBlob(blob, fileName)
                                        }
                                    })
                                    .catch(error => {
                                        message.error(error.msg);
                                        console.error(`Error from server:${error.msg}`);
                                    });
                                }}
                            >
                                <span className="iconfont"
                                      style={{fontSize: '1rem', color: 'white', marginRight:'5px'}}>&#xe619;</span>
                               批量导出
                            </Button>
                        </TableButtonsView>

                    </TableControllerView>
                )
                break

            // 报表管理-冲销信息查询
            case 'reversed_infos_query':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: '100%', justifyContent: 'flex-start'}}>
                            {
                                shouldShowSupplierSelector && (
                                    <SelectView
                                        key={'tab8_1'}
                                        placeHolder="选择供应商"
                                        options={vendorList}
                                        onChangeCalled={(value = '') => {
                                            this.setState((prevState) => {
                                                const vendor = vendorList.filter(factory => factory.value === value)[0]
                                                if (vendor) {
                                                    return {
                                                        tab8_obj: Object.assign({}, prevState.tab8_obj,
                                                            {vendorName: vendor.value}
                                                        )
                                                    }
                                                }
                                                return {
                                                    tab8_obj: Object.assign({}, prevState.tab8_obj,
                                                        {vendorName: ''}
                                                    )
                                                }
                                            })
                                        }}
                                    />
                                )
                            }

                            <SelectView
                                key={'tab8_2'}
                                placeHolder="选择货物状态"
                                // options={reversedInfoStatusList.filter(orderStatus => orderStatus.value === 3 || orderStatus.value === 6)}
                                options={reversedInfoStatusList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState) => {
                                        return {
                                            tab8_obj: Object.assign({}, prevState.tab8_obj, {status: value})
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab8_3'}
                                style={{marginRight: '6px'}}
                                placeholder="请选择生成日期"
                                onChange={(date, dateString) => {
                                    this.setState((prevState) => {
                                        return {
                                            tab8_obj: Object.assign({}, prevState.tab8_obj, {generatedDate: dateString})
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab8_4'}
                                style={{marginRight: '6px'}}
                                placeholder="请选择冲销日期"
                                onChange={(date, dateString) => {
                                    this.setState((prevState) => {
                                        return {
                                            tab8_obj: Object.assign({}, prevState.tab8_obj, {reversedDate: dateString})
                                        }
                                    })
                                }}
                            />

                            <InputView
                                key={'tab8_5'}
                                placeholder={"请输入生成号/冲销号"}
                                onCalled={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState) => {
                                        return {
                                            tab8_obj: Object.assign({}, prevState.tab8_obj, {generatedNumber: value}, {reversedNumber: value})
                                        }
                                    }, () => onSearchButtonClicked(selectedTabKey, this.state.tab8_obj))
                                }}
                            />

                            <SearchButton
                                onClickCalled={() => onSearchButtonClicked(selectedTabKey, tab8_obj)}
                            />
                        </TableSearchView>
                    </TableControllerView>
                )
                break
            default:
                tableComponent = null
        }
        return (
            <div>
                {tableComponent}
            </div>
        )
    }
}

export const ShippingHeader = _ShippingHeader;

class SearchView extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.key !== this.props.key;
    }

    render() {
        const {placeHolder, onSearchCalled} = this.props
        return (
            <Search
                placeholder={placeHolder}
                enterButton="搜索"
                size="default"
                onSearch={onSearchCalled}
                onChange={(e) => {
                    const {value} = e.target
                    onSearchCalled(value)
                }}
            />
        )
    }
}

class SelectView extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.key !== this.props.key) {
            return true
        }

        return false
    }

    render() {
        const {placeHolder, options, onChangeCalled} = this.props
        return (
            <Select
                allowClear={true}
                style={{width: '15%', marginRight: '6px'}}
                placeholder={placeHolder}
                onChange={onChangeCalled}
            >
                {
                    options.map(option => {
                        return (
                            <Option
                                key={option.key}
                                value={option.value}>
                                {option.label}
                            </Option>
                        )
                    })
                }
            </Select>
        )
    }
}

const SearchButton = ({onClickCalled}) => {
    return (
        <Button
            type="primary"
            onClick={onClickCalled}
        >搜索</Button>
    )
}

const InputView = ({key, placeholder, onCalled}) => {
    return (
        <Input
            key={key}
            style={{width: '30%', marginRight: '6px'}}
            placeholder={placeholder}
            onChange={onCalled}
            onPressEnter={onCalled}
        />
    )
}

const TableControllerView = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  // border: red solid 2px;
  padding: 0 6px;
`

const TableSearchView = styled.div`
  display: flex;
  flex-direction: row;
  // flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 70%;
  // border: yellow solid 2px;
`
const TableButtonsView = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  height: 80px;
  width: 30%;
  // border: blue solid 2px;
`