import React, {Component} from 'react';
import {
    validStateMap,
    vendorList
} from "../../../utils";
import {Button, DatePicker, Icon, Input, Select} from "antd";
import styled from "styled-components";

const Search = Input.Search;
const Option = Select.Option;

// const {RangePicker} = DatePicker;

class _AdminHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tab1_obj: {
                sanyId: '',
                sanyName: '',
            },
            tab2_obj: {
                vendorId: '',
                vendorName: '',
            },
            tab3_obj: {
                userName: '',
                name: '',
                mobile: '',
                vendor: '',
                status: '',
            },
        }
    }

    render() {
        const {
            selectedTabKey,// 当前选择的Tab页

            onSearchButtonClicked,
            onAddButtonClicked,

            editState
        } = this.props

        const {
            tab1_obj,
            tab2_obj,
            tab3_obj,
        } = this.state

        let tableComponent
        switch (selectedTabKey) {
            // 信息管理-待发货信息
            case 'sany_factory':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView>
                            <SearchView
                                key={'tab1_1'}
                                placeHolder="请输入SANY工厂编号或名称"
                                onSearchCalled={(value = '') => {
                                    this.setState({
                                        tab1_obj: Object.assign({}, this.state.tab1_obj, {sanyId: value}, {sanyName: value})
                                    }, () => {
                                        onSearchButtonClicked(selectedTabKey, this.state.tab1_obj)
                                    })
                                }}
                            />
                        </TableSearchView>

                        <TableButtonsView>
                            <Button
                                type="primary"
                                style={{marginRight: '6px'}}
                                onClick={() => onAddButtonClicked()}
                            >新增</Button>
                        </TableButtonsView>
                    </TableControllerView>
                )
                break

            case 'vendor':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView>
                            <SearchView
                                key={'tab2_1'}
                                placeHolder="请输入供应商工厂编号或名称"
                                onSearchCalled={(value = '') => {
                                    this.setState({
                                        tab2_obj: Object.assign({}, this.state.tab2_obj, {vendorId: value}, {vendorName: value})
                                    }, () => {
                                        onSearchButtonClicked(selectedTabKey, this.state.tab2_obj)
                                    })
                                }}
                            />
                        </TableSearchView>

                        <TableButtonsView>
                            <Button
                                type="primary"
                                style={{marginRight: '6px'}}
                                onClick={() => onAddButtonClicked()}
                            >新增</Button>
                        </TableButtonsView>
                    </TableControllerView>
                )
                break

            case 'user':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView style={{width: '100%', justifyContent: 'flex-start'}}>
                            <SelectView
                                key={'tab3_1'}
                                placeHolder="选择供应商"
                                options={vendorList}
                                onChangeCalled={(value = '') => {
                                    this.setState({
                                        tab3_obj: Object.assign({}, this.state.tab3_obj, {vendor: value})
                                    })
                                }}
                            />

                            <SelectView
                                key={'tab3_2'}
                                placeHolder="选择状态"
                                options={validStateMap}
                                onChangeCalled={(value = '') => {
                                    this.setState({
                                        tab3_obj: Object.assign({}, this.state.tab3_obj, {status: value})
                                    })
                                }}
                            />

                            <Input
                                key={'tab3_3'}
                                style={{width: '250px', marginRight: '6px'}}
                                placeholder="请输入用户名/姓名/手机号"
                                onChange={(e) => {
                                    const {value} = e.target
                                    this.setState({
                                        tab3_obj: Object.assign({}, this.state.tab3_obj, {userName: value}, {name: value}, {mobile: value})
                                    })
                                }}
                                onPressEnter={(e) => {
                                    const {value} = e.target
                                    this.setState({
                                        tab3_obj: Object.assign({}, this.state.tab3_obj, {userName: value}, {name: value}, {mobile: value})
                                    }, () => onSearchButtonClicked(selectedTabKey, this.state.tab3_obj))
                                }}
                            />

                            <SearchButton
                                onClickCalled={() => onSearchButtonClicked(selectedTabKey, tab3_obj)}
                            />
                        </TableSearchView>

                        <TableButtonsView>
                            <Button
                                type="primary"
                                style={{marginRight: '6px'}}
                                onClick={() => onAddButtonClicked()}
                            >新增</Button>
                        </TableButtonsView>
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

export const AdminHeader = _AdminHeader;

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
                style={{width: '160px', marginRight: '6px'}}
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