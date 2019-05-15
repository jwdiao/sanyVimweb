/**
 * 通用的 输入框Modal
 */
import React, {Component} from 'react';
import {
    Modal,
    Input,
} from 'antd';
import styled from "styled-components";

const modalTitleMap = {
    'reversed_infos': '复制发货信息',
}

const getModalContent = ({modalType}) => {
    switch (modalType) {
        case 'reversed_infos':
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
        const {modalType} = this.props
        const {visible, confirmLoading} = this.state;

        return (
            <div>
                <Modal
                    title={modalTitleMap[modalType]}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    width='50%'
                    bodyStyle={{width:'100%'}}
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
  // border: #5a8cff 2px solid;
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