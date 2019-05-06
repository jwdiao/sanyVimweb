import React, { Component } from 'react';
import styled from "styled-components";
import { WhiteSpace } from 'antd-mobile';

class OperationList extends Component {

    render() {
        const data = this.props.data;
        return (
            <OpList width={this.props.width}>
                {
                    this.props.data.map(item => (
                        <OpItem key={item.key}>
                            <OpLeft>
                                {item.icon}
                                <span style={{ marginLeft: '1rem', fontSize: '1.2rem' }}>{item.text}</span>
                            </OpLeft>
                            <OpRight><Gt /></OpRight>
                        </OpItem>
                    ))
                }
            </OpList>
        );
    }
}

export default OperationList;

const OpList = styled.div`
  width:${p => p.width};
  margin: 0 auto;
`
const OpItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom:1px solid #eee;
`
const OpLeft = styled.div`
`
const OpRight = styled.div`
    padding-right:1rem;
`
const Gt = styled.div`
    width: 1rem;
    height: 1rem;
    position: absolute;
    border-left: 1px solid #999;
    border-bottom: 1px solid #999;
    -webkit-transform: translate(0,-50%) rotate(-135deg);
    transform: translate(0,-50%) rotate(-135deg);
`