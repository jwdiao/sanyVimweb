import React, {Component} from 'react';
import {CommonList} from "../../../../components";
import styled from "styled-components";
import { SearchBar, WhiteSpace } from 'antd-mobile'

class _InventoryInfoMobilePage extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            material: '',
        }
    }

    submitSearch = (material) => {
        this.setState({
            material: material,
        })
    }
    render() {
        let condition = {
            material: this.state.material,
        }
        return (
            <RootView>
                <WhiteSpace />
                <SearchBar 
                    className="ii-searchbar"
                    placeholder="物料" 
                    onSubmit={this.submitSearch}
                    style={{
                        width:'93%',
                        marginLeft:'3.5%',
                    }} 
                />
                <CommonList
                    listType="InventoryInfoList"
                    condition={condition}
                />
            </RootView>
        );
    }
}

export const InventoryInfoPage = _InventoryInfoMobilePage;

const RootView = styled.div`
    background:#eee;
    height: calc(100vh - 60px);
`