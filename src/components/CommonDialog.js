import React, {Component} from 'react';
import {Checkbox} from "antd";
import {Modal} from "antd-mobile";
import styled from "styled-components";

const _ = require('lodash')

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

class _CommonDialog extends Component {
    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }

    render() {
        const {headerText, contents, funcButton1Text, funcButton2Text, onBtn1Clicked, onBtn2Clicked, onModalCanceled, showModal} = this.props
        let keys = _.keys(contents)
        return (
            <Modal
                visible={showModal}
                transparent
                maskClosable={false}
                closable={true}
                destroyOnClose={true}
                onClose={onModalCanceled}
                // title={headerText}
                wrapProps={{onTouchStart: this.onWrapTouchStart}}
                // afterClose={() => { alert('afterClose'); }}
            >
                <ModalRootContainer>
                    <ModalHeader>{headerText}</ModalHeader>
                    <ModalContent>
                        {
                            keys.map(key=>{
                                return (
                                    <div key={key}>{`${key}: ${contents[key]}`}</div>
                                )
                            })
                        }
                    </ModalContent>
                    <ModalFooter>
                        <StyledButton isEnabled={false} onClick={() => {
                            onBtn1Clicked()
                        }}>{funcButton1Text}</StyledButton>
                        <StyledButton isEnabled={true} onClick={() => {
                            onBtn2Clicked()
                        }}>{funcButton2Text}</StyledButton>
                    </ModalFooter>
                </ModalRootContainer>
            </Modal>
        );
    }
}

export const CommonDialog = _CommonDialog;

const ModalRootContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 210px;
    text-align: center;
    justify-content: center;
    align-items: center;
    // border: 1px red solid;
`

const ModalHeader = styled.div`
    display: flex;
    height: 40px;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: rgba(48, 48, 48, 1);
    font-size: 18px;
    font-weight: bold;
    // border: 1px yellow solid;
`

const ModalContent = styled.div`
    display: flex;
    flex:1;
    flex-direction: column;
    width: 100%;
    height: 100px;
    text-align: start;
    font-size: 14px;
    color: rgba(48, 48, 48, 1);
    overflow: scroll;
    // border: 1px green solid;
`

const NotShowAgainLayout = styled.div`
    display: flex;
    width: 100%;
    height: 30px;
    justify-content: flex-start;
    align-items: center;
    font-weight: bold;
    // border: 1px blue solid;
`

const ModalFooter = styled.div`
    display: flex;
    width: 100%;
    height: 40px;
    justify-content: center;
    align-items: center;
    // border: 1px black solid;
`
const StyledButton = styled.div`
    display: flex;
    height: 26px;
    width: 80px;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-left: 6px;
    margin-right: 6px;
    border-radius: 27px;
    border:${p=>p.isEnabled ?'0' :'1px rgba(55, 149, 243, 1) solid' };
    background: ${p=>p.isEnabled ? 'linear-gradient(90deg,rgba(9,182,253,1),rgba(96,120,234,1))':'white'};
    color: ${p=>p.isEnabled ?'white' :'rgba(55, 149, 243, 1)' };
`