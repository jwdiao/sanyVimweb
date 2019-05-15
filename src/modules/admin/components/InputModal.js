/**
 * 通用的 输入框Modal
 */
import React, {Component} from 'react';
import {
    Modal,
    Input,
    message, Tooltip, Icon
} from 'antd';
import styled from "styled-components";
import {formatDate, http, validStateList} from "../../../utils";
import freshId from "fresh-id";

const modalTitleMap = {
    'sany_factory': '新增SANY工厂信息',
    'vendor': '新增供应商信息',
    'materials': '新增物料类型'
}

const getModalContent = ({
                             modalType,
                             onFactoryCodeChangedListener, factoryCodeValid,
                             onFactoryNameChangedListener,factoryNameValid,
                             onVendorCodeChangedListener, vendorCodeValid,
                             onVendorNameChangedListener,vendorNameValid,
}) => {
    switch (modalType) {
        case 'sany_factory':
            return (
                <InputContainerView>
                    <InputButtonView>
                        <TitleView>
                            工厂编号:
                        </TitleView>
                        <Input
                            onChange={onFactoryCodeChangedListener}
                            addonAfter={
                                <ExtraComponent contentValid={factoryCodeValid} tipContent={"输入的工厂编号为空或已存在！"}/>
                            }
                        />
                    </InputButtonView>
                    <InputButtonView style={{marginTop: '10px'}}>
                        <TitleView>
                            工厂名称:
                        </TitleView>
                        <Input
                            onChange={onFactoryNameChangedListener}
                            addonAfter={
                                <ExtraComponent contentValid={factoryNameValid} tipContent={"输入的工厂名称为空或已存在！"}/>
                            }
                        />
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
                        <Input
                            onChange={onVendorCodeChangedListener}
                            addonAfter={
                                <ExtraComponent contentValid={vendorCodeValid} tipContent={"输入的供应商编号为空或已存在！"}/>
                            }
                        />
                    </InputButtonView>
                    <InputButtonView style={{marginTop: '10px'}}>
                        <TitleView>
                            供应商名称:
                        </TitleView>
                        <Input
                            onChange={onVendorNameChangedListener}
                            addonAfter={
                                <ExtraComponent contentValid={vendorNameValid} tipContent={"输入的供应商名称为空或已存在！"}/>
                            }
                        />
                    </InputButtonView>
                </InputContainerView>
            )
        default:
            return null
    }
}

const ExtraComponent = ({contentValid, tipContent}) => {
    if (contentValid) {
        return (
            <Icon type="check-circle" style={{ color: 'green' }} />
        )
    }
    return (
        <Tooltip title={tipContent} >
            <Icon type="warning" style={{ color: 'red' }} />
        </Tooltip>
    )
}

class _InputModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            confirmLoading: false,

            //
            factoryCode:'',
            factoryCodeValid:false,
            factoryName:'',
            factoryNameValid:false,
            vendorCode:'',
            vendorCodeValid:false,
            vendorName:'',
            vendorNameValid:false,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.modalVisibility,
        })
    }


    handleOk = async () => {
        const {
            factoryCode,factoryCodeValid,
            factoryName, factoryNameValid,
            vendorCode,vendorCodeValid,
            vendorName,vendorNameValid,
        } = this.state
        const { modalType } = this.props

        // 校验字段是否填写完整
        if (
            (modalType === 'sany_factory' && (!factoryCodeValid || !factoryNameValid ))
            ||(modalType === 'vendor' && (!vendorCodeValid || !vendorNameValid ))){
            message.error('请检查输入内容后再提交！')
            return
        }

        // 网络请求
        let params = {
            status:1, // 默认启用状态
        }

        this.setState({
            visible: true,
            confirmLoading: true,
        });

        if (modalType === 'sany_factory') {
            const result = await this.callNetworkRequest({
                requestUrl: '/factory/addOrUpdateFactory',
                params: Object.assign({}, params, {
                    code:factoryCode,
                    name:factoryName,
                }),
                requestMethod:'POST'
            })

            if (!!result) {
                const addedData = {
                    key: freshId(),
                    // id: content.id,
                    sanyId: factoryCode,
                    sanyName: factoryName,
                    status: 1,
                    // createdAt: formatDate(content.createTime),
                }
                if (this.props.onOkClickedListener) {
                    this.props.onOkClickedListener(this.props.modalType, addedData)
                }
            } else {
                message.error('数据提交失败！请稍候重试。')
            }
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        } else if (modalType === 'vendor') {
            const result = await this.callNetworkRequest({
                requestUrl: '/supplier/addOrUpdateSupplier',
                params: Object.assign({}, params, {
                    code:vendorCode,
                    name:vendorName,
                }),
                requestMethod:'POST'
            })

            if (!!result) {
                const addedData = {
                    key: freshId(),
                    // id: content.id,
                    vendorId: factoryCode,
                    vendorName: factoryName,
                    status: 1,
                    // createdAt: formatDate(content.createTime),
                }
                if (this.props.onOkClickedListener) {
                    this.props.onOkClickedListener(this.props.modalType, addedData)
                }
            } else {
                message.error('数据提交失败！请稍候重试。')
            }
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
            factoryCode:'',
            factoryCodeValid:false,
            factoryName:'',
            factoryNameValid:false,
            vendorCode:'',
            vendorCodeValid:false,
            vendorName:'',
            vendorNameValid:false,
        });
        if (this.props.onCancelClickedListener) {
            this.props.onCancelClickedListener()
        }
    }

    // 调用网络请求
    callNetworkRequest = async ({requestUrl, params, requestMethod}) => {
        let result
        if (requestMethod === 'POST') {
            result = await http.post(requestUrl,params)
        } else {
            result = await http.get(requestUrl)
        }
        console.log(`request: ${requestUrl}',params:${params},'result:${result}`)
        return result && result.ret === '200'
    }

    onFactoryCodeChangedListener = async (event) => {
        const {value} = event.target
        // console.log('onFactoryCodeChangedListener called', value)
        const result = await this.callNetworkRequest({
            requestUrl:'factory/validateFactory',
            params:{
                code: value,
            },
            requestMethod:'POST',
        })
        this.setState({
            factoryCodeValid: result && !isEmpty(value),
            factoryCode: value,
        })
    }

    onFactoryNameChangedListener = async (event) => {
        const {value} = event.target
        // console.log('onFactoryNameChangedListener called', value)
        const result = await this.callNetworkRequest({
            requestUrl:'factory/validateFactory',
            params:{
                name: value,
            },
            requestMethod:'POST',
        })
        this.setState({
            factoryNameValid: result && !isEmpty(value),
            factoryName: value,
        })
    }

    onVendorCodeChangedListener = async (event) => {
        const {value} = event.target
        // console.log('onVendorCodeChangedListener called', value )
        const result = await this.callNetworkRequest({
            requestUrl:'/supplier/validateSupplier',
            params:{
                code: value,
            },
            requestMethod:'POST',
        })
        this.setState({
            vendorCodeValid: result && !isEmpty(value),
            vendorCode: value,
        })
    }

    onVendorNameChangedListener = async (event) => {
        const {value} = event.target
        // console.log('onVendorNameChangedListener called', value)
        const result = await this.callNetworkRequest({
            requestUrl:'/supplier/validateSupplier',
            params:{
                name: value,
            },
            requestMethod:'POST',
        })
        this.setState({
            vendorNameValid: result && !isEmpty(value),
            vendorName: value,
        })
    }

    render() {
        const {modalType} = this.props
        const {visible, confirmLoading, factoryCodeValid, factoryNameValid, vendorCodeValid, vendorNameValid} = this.state;

        // console.log('InputModal this.state', this.state)
        return (
            <div>
                <Modal
                    title={modalTitleMap[modalType]}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    {getModalContent({
                        modalType,
                        onFactoryCodeChangedListener:this.onFactoryCodeChangedListener,
                        factoryCodeValid: factoryCodeValid,
                        onFactoryNameChangedListener:this.onFactoryNameChangedListener,
                        factoryNameValid: factoryNameValid,
                        onVendorCodeChangedListener:this.onVendorCodeChangedListener,
                        vendorCodeValid: vendorCodeValid,
                        onVendorNameChangedListener:this.onVendorNameChangedListener,
                        vendorNameValid: vendorNameValid
                    })}
                </Modal>
            </div>
        );
    }
}

function isEmpty(testString) {
    return !testString || testString.length === 0 || testString === ''
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