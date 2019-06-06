import React, { Component } from 'react';
import { CommonList } from "../../../../components";
import styled from "styled-components";
import { 
    Form, 
    // AutoComplete,
 } from 'antd'
import { InputItem, Picker, List } from 'antd-mobile';
import { INVENTORY_STATUS, isEmpty, http, Durian } from '../../../../utils'

class _GoodsTransferMobilePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            material: '',
            status: 0,
            dataSource: [],
        }
    }
    queryDataWithConditions = (material, status) => {
        this.setState({
            material: material,
            status: status,
        })
    }
    render() {
        let condition = {
            material: this.state.material,
            status: this.state.status,
        }
        console.log('sending condition:', condition);
        return (
            <RootView>
                <GoodsTransferSearchBar onSearch={this.queryDataWithConditions} />
                <CommonList
                    listType="GoodsTransferList"
                    condition={condition}
                    withSearchBar={true}
                />
            </RootView>
        );
    }
}
let statusFilter = INVENTORY_STATUS.map((item, index) => {
    return {
        label: item,
        value: index
    }
});
statusFilter.splice(0, 1, {label: '全部', value:0});
class GoodsTransferSearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            material: '',
            pickerValue: [statusFilter[0].value]
        }
    }

    onPickerOk = (val) => {
        console.log(`value from children ${val}`);
        this.setState({
            pickerValue: val,
        });
    };
    
    submitSearch = () => {
        const { material, pickerValue } = this.state;
        const status = pickerValue[0];
        this.props.onSearch(material, status)
    }
    // AutoComplete组件监听
    handleSearch = async value => {
        const user = Durian.get('user');
        const supplierCode = user.vendor.value;

        const result = await http.post('/factorySupplierMaterial/find/all',{
            materialCode: value,
            supplierCode: supplierCode,
        })
        if (!isEmpty(value)) {
            if (result.ret === '200' && result.data.content.length>0) {
                console.log('handleSearch', result.data)
                this.setState({
                    dataSource: !value ? [] : result.data.content.map(content=>content.materialCode).filter(content=>content.indexOf(value) > -1),
                })
            } else {
                this.setState({
                    dataSource: []
                })
            }
        }
    };
    render() {
        return (
            <BarRootView>
                <Form style={{
                    width: '90%',
                    marginLeft: '5%',
                    display: 'flex',
                }}
                >
                    <Form.Item style={{ width: '45%', marginBottom: '0', height:'42px' }} >
                        <InputItem placeholder="输入物料" 
                                clear 
                                className="searchbar-input"
                                onBlur={(v) => {
                                    console.log('input value:', v)
                                    this.setState({
                                        material: v,
                                    })
                                }}
                        />
                        {/* <AutoComplete
                            dataSource={this.state.dataSource}
                            style={{width: '100%'}}
                            onSearch={this.handleSearch}
                            placeholder="请输入物料编号"
                        /> */}
                    </Form.Item>
                    <Form.Item style={{ width: '45%', marginLeft: '2%' }} >
                        <Picker
                            data={statusFilter}
                            value={this.state.pickerValue}
                            cols={1}
                            onChange={this.onPickerOk}
                        >
                            <List.Item 
                                className="gt-picker-item"
                                style={{
                                    minHeight:'26px',
                                    fontSize: '16px',
                                    borderRadius:'18px',
                                    backgroundColor: '#E0DFDF',
                                }}
                            ></List.Item>
                        </Picker>
                    </Form.Item>
                    <Form.Item style={{ width: '5%', marginLeft: '2%' }} >
                    <span onClick={this.submitSearch} className='iconfont' style={{ fontSize: '1.6rem', color: '#ccc',}}>&#xe605;</span>
                    </Form.Item>
                </Form>
            </BarRootView>
        );
    }
}
export const GoodsTransferPage = _GoodsTransferMobilePage;

const RootView = styled.div`
    background:#eee;
    height: calc(100vh - 60px);
`
const BarRootView = styled.div`
    background:#eee;
    height: 50px;
    width:100%;
    padding-top:5px;
`