import React, {Component} from 'react';
import styled from "styled-components";
import {withRouter} from 'react-router-dom'

class _NoContent extends Component {

    render() {
        return (
            <RootView>
                <ImageWrapper>
                    <img src={require('../assets/svg/no_content.svg')} 
                        alt="vmi" 
                        style={{ width: '34vh' }} />
                    <Tips>暂无数据</Tips>
                </ImageWrapper>
            </RootView>
        );
    }
}

export const NoContent = withRouter(_NoContent);

const RootView = styled.div`
    display: flex;
    flex-direction: column;
    flex:1;
`
const ImageWrapper = styled.div`
    text-align: center;
`
const Tips = styled.div`
    text-align: center;
`