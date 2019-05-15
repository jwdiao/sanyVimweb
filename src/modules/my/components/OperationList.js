import React, { Component } from 'react';
import styled from "styled-components";

class OperationList extends Component {

    render() {
        const {width, data, onClickListener} = this.props
        return (
            <OpList width={width}>
                {
                    data.map(item => (
                        <OpItem key={item.key}
                                onClick={()=>onClickListener({itemKey: item.key})}
                        >
                            <OpLeft>
                                {item.icon}
                                <span style={{ 
                                    marginLeft: '1rem', 
                                    fontSize: '1rem' 
                                    }}
                                >{item.text}</span>
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
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    border-left: 1px solid #D1D1D1;
    border-bottom: 1px solid #D1D1D1;
    -webkit-transform: translate(0,-50%) rotate(-135deg);
    transform: translate(0,-50%) rotate(-135deg);
`