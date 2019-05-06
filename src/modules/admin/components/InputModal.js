/**
 * 通用的 输入框Modal
 */
import React, {Component} from 'react';
import {
    Modal,
    Input
} from 'antd';
import styled from "styled-components";

const modalTitleMap = {
    'sany_factory': '新增SANY工厂信息',
    'vendor': '新增供应商工厂信息',
    'materials': '新增物料类型'
}

const getModalContent = ({modalType}) => {
    switch (modalType) {
        case 'sany_factory':
            return (
                <InputContainerView>
                    <InputButtonView>
                        <TitleView>
                            工厂编号:
                        </TitleView>
                        <Input/>
                    </InputButtonView>
                    <InputButtonView style={{marginTop: '10px'}}>
                        <TitleView>
                            工厂名称:
                        </TitleView>
                        <Input/>
                    </InputButtonView>
                </InputContainerView>
            )
        case 'vendor':
            return (
                <InputContainerView>
                    <InputButtonView>
                        <TitleView>
                            供应商编号:
                        </TitleView>
                        <Input/>
                    </InputButtonView>
                    <InputButtonView style={{marginTop: '10px'}}>
                        <TitleView>
                            供应商名称:
                        </TitleView>
                        <Input/>
                    </InputButtonView>
                </InputContainerView>
            )
        default:
            return null
    }
}

class _InputModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ModalText: 'Content of the modal',
            visible: false,
            confirmLoading: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.modalVisibility,
        })
    }

    handleOk = () => {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
            if (this.props.onOkClickedListener) {
                this.props.onOkClickedListener()
            }
        }, 2000);
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
        if (this.props.onCancelClickedListener) {
            this.props.onCancelClickedListener()
        }
    }

    render() {
        const {modalType, onOkClickedListener, onCancelClickedListener} = this.props
        const {visible, confirmLoading} = this.state;

        console.log('InputModal this.state', this.state)
        return (
            <div>
                <Modal
                    title={modalTitleMap[modalType]}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    {getModalContent({modalType})}
                </Modal>
            </div>
        );
    }
}

export const InputModal = _InputModal;

const InputContainerView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 10px 10px;
`

const InputButtonView = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 4px 4px;
`
const TitleView = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
`