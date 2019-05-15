import React, { Component } from 'react';
import { CommonList } from "../../../../components";
import styled from "styled-components";
import { Form } from 'antd'
import { InputItem, WhiteSpace, Picker, List } from 'antd-mobile';
import { INVENTORY_STATUS } from '../../../../utils'

class _GoodsTransferMobilePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            material: '',
            status: 1,
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
                <WhiteSpace />
                <GoodsTransferSearchBar onSearch={this.queryDataWithConditions} />
                <CommonList
                    listType="GoodsTransferList"
                    condition={condition}
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
statusFilter.splice(0, 1);
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
    render() {
        return (
            <BarRootView>
                <Form style={{
                    width: '90%',
                    marginLeft: '5%',
                    display: 'flex',
                }}
                >
                    <Form.Item style={{ width: '45%' }} >
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
                                    minHeight:'36px',
                                    fontSize: '16px',
                                    borderRadius:'18px',
                                    backgroundColor: '#E0DFDF',
                                }}
                            ></List.Item>
                        </Picker>
                    </Form.Item>
                    <Form.Item style={{ width: '5%', marginLeft: '2%' }} >
                    <span onClick={this.submitSearch} className='iconfont' style={{ fontSize: '1.2rem', color: '#ccc',}}>&#xe605;</span>
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
    height: 40px;
    width:100%;
`