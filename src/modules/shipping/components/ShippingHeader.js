import React, {Component} from 'react';
import {
    orderStatusList,
    materialDescriptionMap,
    materialTypeMap,
    reservoirLibraryList,
    vendorList, orderMaterialStatusList
} from "../../../utils";
import {Button, DatePicker, Input, Select, Upload} from "antd";
import styled from "styled-components";

const Search = Input.Search;
const Option = Select.Option;

// const {RangePicker} = DatePicker;

class _ShippingHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tab1_obj: {
                vendorName: '',
                status: '',
                material: '',
                sentTime: '',
            },
            tab2_obj: {
                vendorName: '',
                status: '',
                material: '',
                sentTime: '',
            },
            tab3_obj: {
                number: '',
                vendorName: '',
                status: '',
                material: '',
                sentTime: '',
            },
            tab4_obj: {
                number: '',
                vendorName: '',
                status: '',
                material: '',
                sentTime: '',
                receivedTime: '',
            },
            tab5_obj: {
                material: '',
                materialDescription: '',
            },

            tab6_obj: {
                vendorName: '',
                status: '',
                material: '',
                materialDescription: '',
                location: '',
                createdAt: '',
            },
            tab7_obj: {
                material: '',
                materialDescription: '',
                location: '',
                createdAt: '',
            },
            tab8_obj: {
                vendorName: '',
                status: '',
                material: '',
                materialDescription: '',
                generatedNumber: '',
                generatedDate: '',
                reversedNumber: '',
                reversedDate: '',
            },
        }
    }

    render() {
        const {
            selectedTabKey,// 当前选择的Tab页

            uploadProps,
            onSearchButtonClicked,
            onBatchShippingButtonClicked,
            onDeleteButtonClicked,
            onBatchImportButtonClicked,
            onAddButtonClicked,

            editState
        } = this.props

        const {
            tab1_obj,
            tab2_obj,
            tab3_obj,
            tab4_obj,
            tab6_obj,
            tab7_obj,
            tab8_obj,
        } = this.state

        let tableComponent
        switch (selectedTabKey) {
            // 信息管理-待发货信息
            case 'to_be_shipped_infos':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: '600px', justifyContent:'flex-start'}}>
                            {/*<SelectView*/}
                            {/*    key={'tab1_1'}*/}
                            {/*    placeHolder="选择供应商"*/}
                            {/*    options={vendorList}*/}
                            {/*    onChangeCalled={(value = '') => {*/}
                            {/*        this.setState((prevState)=>{*/}
                            {/*            return {*/}
                            {/*                tab1_obj: Object.assign({}, prevState.tab1_obj, {vendorName: value})*/}
                            {/*            }*/}
                            {/*        })*/}
                            {/*    }}*/}
                            {/*/>*/}

                            {/*<SelectView*/}
                            {/*    key={'tab1_2'}*/}
                            {/*    placeHolder="选择货物状态"*/}
                            {/*    options={orderStatusList}*/}
                            {/*    onChangeCalled={(value = '') => {*/}
                            {/*        this.setState((prevState)=>{*/}
                            {/*            return {*/}
                            {/*                tab1_obj: Object.assign({}, prevState.tab1_obj, {status: value})*/}
                            {/*            }*/}
                            {/*        })*/}
                            {/*    }}*/}
                            {/*/>*/}

                            {/*<SelectView*/}
                            {/*    key={'tab1_3'}*/}
                            {/*    placeHolder="选择物料类型"*/}
                            {/*    options={materialTypeMap}*/}
                            {/*    onChangeCalled={(value = '') => {*/}
                            {/*        this.setState((prevState)=>{*/}
                            {/*            return {*/}
                            {/*                tab1_obj: Object.assign({}, prevState.tab1_obj, {material: value})*/}
                            {/*            }*/}
                            {/*        })*/}
                            {/*    }}*/}
                            {/*/>*/}

                            <DatePicker
                                key={'tab1_4'}
                                style={{marginRight: '6px', width:'60%'}}
                                placeholder="请选择暂存日期"
                                onChange={(date, dateString)=>{
                                    this.setState((prevState)=>{
                                        return {
                                            tab1_obj: Object.assign({}, prevState.tab1_obj, {temporaryStoreTime: dateString})
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
                                <TableButtonsView>
                                    <Upload {...uploadProps}
                                            style={{marginRight: '6px'}}
                                    >
                                        <Button
                                            type="primary"
                                            icon="import"
                                            onClick={() => onBatchImportButtonClicked(selectedTabKey)}
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

            // 信息管理-已冲销发货信息
            case 'reversed_infos':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: '100%', justifyContent: 'flex-start'}}>
                            <SelectView
                                key={'tab2_1'}
                                placeHolder="选择供应商"
                                options={vendorList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab2_obj: Object.assign({}, prevState.tab2_obj, {vendorName: value})
                                        }
                                    })
                                }}
                            />

                            <SelectView
                                key={'tab2_2'}
                                placeHolder="选择货物状态"
                                options={orderStatusList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab2_obj: Object.assign({}, prevState.tab2_obj, {status: value})
                                        }
                                    })
                                }}
                            />

                            {/*<SelectView*/}
                            {/*    key={'tab2_3'}*/}
                            {/*    placeHolder="选择物料类型"*/}
                            {/*    options={materialTypeMap}*/}
                            {/*    onChangeCalled={(value = '') => {*/}
                            {/*        this.setState((prevState)=>{*/}
                            {/*            return {*/}
                            {/*                tab2_obj: Object.assign({}, prevState.tab2_obj, {material: value})*/}
                            {/*            }*/}
                            {/*        })*/}
                            {/*    }}*/}
                            {/*/>*/}

                            <DatePicker
                                key={'tab2_4'}
                                style={{marginRight: '6px'}}
                                placeholder="请选择发货日期"
                                onChange={(date, dateString)=>{
                                    this.setState((prevState)=>{
                                        return {
                                            tab2_obj: Object.assign({}, prevState.tab2_obj, {sentTime: dateString})
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab2_5'}
                                style={{marginRight: '6px'}}
                                placeholder="请选择冲销日期"
                                onChange={(date, dateString)=>{
                                    this.setState((prevState)=>{
                                        return {
                                            tab2_obj: Object.assign({}, prevState.tab2_obj, {reversedTime: dateString})
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

            // 信息管理-工厂发货信息
            case 'shipped_infos':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: '100%', justifyContent: 'flex-start'}}>
                            <Input
                                key={'tab3_1'}
                                style={{width: '180px', marginRight: '6px'}}
                                placeholder="请输入号码"
                                onChange={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState)=>{
                                        return {
                                            tab3_obj: Object.assign({}, prevState.tab3_obj, {number: value})
                                        }
                                    })
                                }}
                                onPressEnter={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState)=>{
                                        return {
                                            tab3_obj: Object.assign({}, prevState.tab3_obj, {number: value})
                                        }
                                    }, () => onSearchButtonClicked(selectedTabKey, this.state.tab3_obj))
                                }}
                            />

                            <SelectView
                                key={'tab3_2'}
                                placeHolder="选择供应商"
                                options={vendorList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab3_obj: Object.assign({}, prevState.tab3_obj, {vendorName: value})
                                        }
                                    })
                                }}
                            />

                            <SelectView
                                key={'tab3_3'}
                                placeHolder="选择货物状态"
                                options={orderStatusList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab3_obj: Object.assign({}, prevState.tab3_obj, {status: value})
                                        }
                                    })
                                }}
                            />

                            {/*<SelectView*/}
                            {/*    key={'tab3_4'}*/}
                            {/*    placeHolder="选择物料类型"*/}
                            {/*    options={materialTypeMap}*/}
                            {/*    onChangeCalled={(value = '') => {*/}
                            {/*        this.setState((prevState)=>{*/}
                            {/*            return {*/}
                            {/*                tab3_obj: Object.assign({}, prevState.tab3_obj, {material: value})*/}
                            {/*            }*/}
                            {/*        })*/}
                            {/*    }}*/}
                            {/*/>*/}

                            <DatePicker
                                key={'tab3_5'}
                                style={{marginRight: '6px'}}
                                placeholder="请选择发货日期"
                                onChange={(date, dateString)=>{
                                    this.setState((prevState)=>{
                                        return {
                                            tab3_obj: Object.assign({}, prevState.tab3_obj, {sentTime: dateString})
                                        }
                                    })
                                }}
                            />

                            <SearchButton
                                onClickCalled={() => onSearchButtonClicked(selectedTabKey, tab3_obj)}
                            />

                        </TableSearchView>
                    </TableControllerView>
                )
                break

            // 信息管理-VMI收货信息
            case 'vmi_received_infos':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: '100%', justifyContent: 'flex-start'}}>
                            <Input
                                key={'tab4_1'}
                                style={{width: '180px', marginRight: '6px'}}
                                placeholder="请输入号码"
                                onChange={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState)=>{
                                        return {
                                            tab4_obj: Object.assign({}, prevState.tab4_obj, {number: value})
                                        }
                                    })
                                }}
                                onPressEnter={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState)=>{
                                        return {
                                            tab4_obj: Object.assign({}, prevState.tab4_obj, {number: value})
                                        }
                                    }, () => onSearchButtonClicked(selectedTabKey, this.state.tab4_obj))
                                }}
                            />

                            <SelectView
                                key={'tab4_2'}
                                placeHolder="选择供应商"
                                options={vendorList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab4_obj: Object.assign({}, prevState.tab4_obj, {vendorName: value})
                                        }
                                    })
                                }}
                            />

                            <SelectView
                                key={'tab4_3'}
                                placeHolder="选择货物状态"
                                options={orderStatusList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab4_obj: Object.assign({}, prevState.tab4_obj, {status: value})
                                        }
                                    })
                                }}
                            />

                            {/*<SelectView*/}
                            {/*    key={'tab4_4'}*/}
                            {/*    placeHolder="选择物料类型"*/}
                            {/*    options={materialTypeMap}*/}
                            {/*    onChangeCalled={(value = '') => {*/}
                            {/*        this.setState((prevState)=>{*/}
                            {/*            return {*/}
                            {/*                tab4_obj: Object.assign({}, prevState.tab4_obj, {material: value})*/}
                            {/*            }*/}
                            {/*        })*/}
                            {/*    }}*/}
                            {/*/>*/}

                            <DatePicker
                                key={'tab4_5'}
                                style={{marginRight: '6px'}}
                                placeholder="请选择发货日期"
                                onChange={(date, dateString)=>{
                                    this.setState((prevState)=>{
                                        return {
                                            tab4_obj: Object.assign({}, prevState.tab4_obj, {sentTime: dateString})
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab4_6'}
                                style={{marginRight: '6px'}}
                                placeholder="请选择收货日期"
                                onChange={(date, dateString)=>{
                                    this.setState((prevState)=>{
                                        return {
                                            tab4_obj: Object.assign({}, prevState.tab4_obj, {receivedTime: dateString})
                                        }
                                    })
                                }}
                            />

                            <SearchButton
                                onClickCalled={() => onSearchButtonClicked(selectedTabKey, tab4_obj)}
                            />

                        </TableSearchView>
                    </TableControllerView>
                )
                break

            // 信息管理-物料类型管理
            case 'vendor_material_type_management':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView>
                            <SearchView
                                key={'tab5_1'}
                                placeHolder="请输入物料编号或名称"
                                onSearchCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab5_obj: Object.assign({}, prevState.tab5_obj, {material: value}, {materialDescription: value})
                                        }
                                    }, () => {
                                        onSearchButtonClicked(selectedTabKey, this.state.tab5_obj)
                                    })
                                }}
                            />
                        </TableSearchView>

                        <TableButtonsView>
                            <Upload {...uploadProps}
                                    style={{marginRight: '6px'}}
                            >
                                <Button
                                    type="primary"
                                    icon="import"
                                    onClick={() => onBatchImportButtonClicked(selectedTabKey)}
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
                            <SelectView
                                key={'tab6_1'}
                                placeHolder="选择供应商"
                                options={vendorList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab6_obj: Object.assign({}, prevState.tab6_obj, {vendorName: value})

                                        }
                                    })
                                }}
                            />

                            <SelectView
                                key={'tab6_2'}
                                placeHolder="选择物料状态"
                                options={orderMaterialStatusList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab6_obj: Object.assign({}, prevState.tab6_obj, {status: value})
                                        }
                                    })
                                }}
                            />

                            <SelectView
                                key={'tab6_3'}
                                placeHolder="选择物料类型"
                                options={materialTypeMap}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab6_obj: Object.assign({}, prevState.tab6_obj, {material: value})
                                        }
                                    })
                                }}
                            />

                            <SelectView
                                key={'tab6_4'}
                                placeHolder="选择物料描述"
                                options={materialDescriptionMap}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab6_obj: Object.assign({}, prevState.tab6_obj, {materialDescription: value})
                                        }
                                    })
                                }}
                            />

                            <SelectView
                                key={'tab6_5'}
                                placeHolder="选择所属库区"
                                options={reservoirLibraryList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab6_obj: Object.assign({}, prevState.tab6_obj, {location: value})
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab6_6'}
                                style={{marginRight: '6px'}}
                                placeholder="请选择日期"
                                onChange={(date, dateString)=>{
                                    this.setState((prevState)=>{
                                        return {
                                            tab6_obj: Object.assign({}, prevState.tab6_obj, {createdAt: dateString})
                                        }
                                    })
                                }}
                            />

                            <SearchButton
                                onClickCalled={() => onSearchButtonClicked(selectedTabKey, tab6_obj)}
                            />
                        </TableSearchView>
                    </TableControllerView>
                )
                break

            // 报表管理-库存信息查询
            case 'inventory_infos_query':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: '100%', justifyContent: 'flex-start'}}>
                            <SelectView
                                key={'tab7_1'}
                                placeHolder="选择物料类型"
                                options={materialTypeMap}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab7_obj: Object.assign({}, prevState.tab7_obj, {material: value})
                                        }
                                    })
                                }}
                            />

                            <SelectView
                                key={'tab7_2'}
                                placeHolder="选择物料描述"
                                options={materialDescriptionMap}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab7_obj: Object.assign({}, prevState.tab7_obj, {materialDescription: value})
                                        }
                                    })
                                }}
                            />

                            {/*<SelectView*/}
                            {/*    key={'tab7_3'}*/}
                            {/*    placeHolder="选择所属库区"*/}
                            {/*    options={reservoirLibraryList}*/}
                            {/*    onChangeCalled={(value = '') => {*/}
                            {/*        this.setState((prevState)=>{*/}
                            {/*            return {*/}
                            {/*                tab7_obj: Object.assign({}, prevState.tab7_obj, {location: value})*/}
                            {/*            }*/}
                            {/*        })*/}
                            {/*    }}*/}
                            {/*/>*/}

                            <DatePicker
                                style={{marginRight: '6px'}}
                                placeholder="请选择日期"
                                onChange={(date, dateString)=>{
                                    this.setState((prevState)=>{
                                        return {
                                            tab7_obj: Object.assign({}, prevState.tab7_obj, {createdAt: dateString})
                                        }
                                    })
                                }}
                            />

                            <SearchButton
                                onClickCalled={() => onSearchButtonClicked(selectedTabKey, tab7_obj)}
                            />
                        </TableSearchView>
                    </TableControllerView>
                )
                break

            // 报表管理-冲销信息查询
            case 'reversed_infos_query':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: '100%', justifyContent: 'flex-start'}}>
                            <SelectView
                                key={'tab8_1'}
                                placeHolder="选择供应商"
                                options={vendorList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab8_obj: Object.assign({}, prevState.tab8_obj, {vendorName: value})
                                        }
                                    })
                                }}
                            />

                            <SelectView
                                key={'tab8_2'}
                                placeHolder="选择货物状态"
                                options={orderStatusList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab8_obj: Object.assign({}, prevState.tab8_obj, {status: value})
                                        }
                                    })
                                }}
                            />

                            {/*<SelectView*/}
                            {/*    key={'tab8_3'}*/}
                            {/*    placeHolder="选择物料类型"*/}
                            {/*    options={materialTypeMap}*/}
                            {/*    onChangeCalled={(value = '') => {*/}
                            {/*        this.setState((prevState)=>{*/}
                            {/*            return {*/}
                            {/*                tab8_obj: Object.assign({}, prevState.tab8_obj, {material: value})*/}
                            {/*            }*/}
                            {/*        })*/}
                            {/*    }}*/}
                            {/*/>*/}

                            {/*<SelectView*/}
                            {/*    key={'tab8_4'}*/}
                            {/*    placeHolder="选择物料描述"*/}
                            {/*    options={materialDescriptionMap}*/}
                            {/*    onChangeCalled={(value = '') => {*/}
                            {/*        this.setState((prevState)=>{*/}
                            {/*            return {*/}
                            {/*                tab8_obj: Object.assign({}, prevState.tab8_obj, {materialDescription: value})*/}
                            {/*            }*/}
                            {/*        })*/}
                            {/*    }}*/}
                            {/*/>*/}

                            <DatePicker
                                key={'tab8_5'}
                                style={{marginRight: '6px'}}
                                placeholder="请选择生成日期"
                                onChange={(date, dateString)=>{
                                    this.setState((prevState)=>{
                                        return {
                                            tab8_obj: Object.assign({}, prevState.tab8_obj, {generatedDate: dateString})
                                        }
                                    })
                                }}
                            />

                            <DatePicker
                                key={'tab8_6'}
                                style={{marginRight: '6px'}}
                                placeholder="请选择冲销日期"
                                onChange={(date, dateString)=>{
                                    this.setState((prevState)=>{
                                        return {
                                            tab8_obj: Object.assign({}, prevState.tab8_obj, {reversedDate: dateString})
                                        }
                                    })
                                }}
                            />

                            <Input
                                key={'tab8_7'}
                                style={{width: '180px', marginRight: '6px'}}
                                placeholder="请输入生成号/冲销号"
                                onChange={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState)=>{
                                        return {
                                            tab8_obj: Object.assign({}, prevState.tab8_obj, {generatedNumber: value}, {reversedNumber: value})
                                        }
                                    })
                                }}
                                onPressEnter={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState)=>{
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
                style={{width: '180px', marginRight: '6px'}}
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
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 600px;
  // border: yellow solid 2px;
`
const TableButtonsView = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  height: 80px;
  width: 400px;
  // border: blue solid 2px;
`