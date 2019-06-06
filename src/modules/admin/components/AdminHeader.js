import React, {Component} from 'react';
import {
    http, PRIMARY_COLOR,
    validStateList,
} from "../../../utils";
import {Button, Icon, Input, message, Select, Upload} from "antd";
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

            vendorList:[],
        }
    }

    async componentDidMount() {
        let params = {
            // page: 1,
            // pageSize:10,
        }
        let requestUrl = '/supplier/supplierList'
        const result = await http.post(requestUrl,params)
        const {data: _data} = result
        let originalContent =  _data.content
        this.setState((prevState)=>{
            return {
                vendorList: originalContent.map(content=>{
                    return {
                        key: content.id,
                        value: content.name,
                        label: content.name
                    }
                })
            }
        })
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.selectedTabKey !== this.props.selectedTabKey) {
            // 点击切换了侧边栏后，要清空筛选条件
            this.setState({
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
            })
        }
    }

    downLoadTemplateFile = (type) => {
        let requestUrl = ''
        let fileName = ''
        switch (type) {
            case 'basic_material_type_management':
                requestUrl = 'download/template/materialtempalte.xls' // Todo:配置下载地址
                fileName = '基础物料模板'
                break
            default:
                break
        }
        http.downloadFile(requestUrl, fileName).then(result=>{
            message.success('开始下载...')
        }).catch(e=>{
            message.error('文件下载失败！请稍后重试。', e)
        })
    }

    render() {
        const {
            selectedTabKey,// 当前选择的Tab页

            uploadProps,
            onSearchButtonClicked,
            onAddButtonClicked,

        } = this.props

        console.log('==uploadProps==',uploadProps)
        const {
            tab3_obj,
            vendorList
        } = this.state

        let tableComponent
        switch (selectedTabKey) {
            case 'sany_factory':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView>
                            <SearchView
                                key={'tab1_1'}
                                placeHolder="请输入SANY工厂编号或名称"
                                onSearchCalled={(value = '') => {
                                    this.setState((prevState) => {
                                        return {
                                            tab1_obj: Object.assign({}, prevState.tab1_obj, {sanyId: value}, {sanyName: value})
                                        }
                                    }, () => {
                                        onSearchButtonClicked(selectedTabKey, this.state.tab1_obj)
                                    })
                                }}
                            />
                        </TableSearchView>

                        <TableButtonsView>
                            {/*<Button*/}
                            {/*    type="primary"*/}
                            {/*    style={{marginRight: '6px'}}*/}
                            {/*    onClick={() => onAddButtonClicked()}*/}
                            {/*>新增</Button>*/}
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
                                placeHolder="请输入供应商编号或名称"
                                onSearchCalled={(value = '') => {
                                    this.setState((prevState) => {
                                        return {
                                            tab2_obj: Object.assign({}, prevState.tab2_obj, {vendorId: value}, {vendorName: value})
                                        }
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
                        <TableSearchView style={{justifyContent: 'flex-start'}}>
                            <SelectView
                                key={'tab3_1'}
                                placeHolder="选择供应商"
                                options={vendorList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState) => {
                                        return {
                                            tab3_obj: Object.assign({}, prevState.tab3_obj, {vendor: value})
                                        }
                                    })
                                }}
                            />

                            <SelectView
                                key={'tab3_2'}
                                placeHolder="选择状态"
                                options={validStateList}
                                onChangeCalled={(value = '') => {
                                    this.setState((prevState) => {
                                        return {
                                            tab3_obj:
                                                Object.assign(
                                                    {},
                                                    prevState.tab3_obj,
                                                    {status:
                                                        value !== ''
                                                            ? validStateList.filter(state=>state.value === value)[0].value
                                                            : ''
                                                    })
                                        }
                                    })
                                }}
                            />

                            <Input
                                key={'tab3_3'}
                                style={{width: '30%', marginRight: '6px'}}
                                placeholder="请输入用户名/姓名/手机号"
                                onChange={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState) => {
                                        return {
                                            tab3_obj: Object.assign({}, prevState.tab3_obj, {userName: value}, {name: value}, {mobile: value})
                                        }
                                    }, () => onSearchButtonClicked(selectedTabKey, this.state.tab3_obj))
                                }}
                                onPressEnter={(e) => {
                                    const {value} = e.target
                                    this.setState((prevState) => {
                                        return {
                                            tab3_obj: Object.assign({}, prevState.tab3_obj, {userName: value}, {name: value}, {mobile: value})
                                        }
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

            case 'basic_material_type_management':
                tableComponent = (
                    <TableControllerView>
                        <TableSearchView>
                            <SearchView
                                key={'tab4_1'}
                                placeHolder="请输入物料编号或名称"
                                onSearchCalled={(value = '') => {
                                    this.setState((prevState)=>{
                                        return {
                                            tab4_obj: Object.assign({}, prevState.tab4_obj, {material: value}, {materialDescription: value})
                                        }
                                    }, () => {
                                        onSearchButtonClicked(selectedTabKey, this.state.tab4_obj)
                                    })
                                }}
                            />
                        </TableSearchView>

                        <TableButtonsView style={{width: '50%'}}>
                            <Button
                                type="link"
                                style={{color: PRIMARY_COLOR}}
                            >
                                <Icon type="file-excel" theme="filled"/>
                                <a href={`${http.baseUrl}/download/template/materialtempalte.xls`}  style={{marginLeft: '6px', textDecoration:'underline'}} >点此下载批量导入模板</a>
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
                                        marginRight:'2%',
                                        color:'#fff',
                                        backgroundColor: '#59e37a',
                                        borderRadius:4,
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
                style={{width: '70%', marginRight: '6px'}}
                placeholder={placeHolder}
                enterButton="搜索"
                size="default"
                onSearch={onSearchCalled}
                onChange={(e)=>{
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
                style={{width: '30%', marginRight: '6px'}}
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
  flex-wrap: wrap;
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