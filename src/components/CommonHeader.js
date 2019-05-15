import React, {Component} from "react";
import {Icon, NavBar, Popover, SearchBar} from "antd-mobile";
import {withRouter} from 'react-router-dom'
// const Item = Popover.Item;
// const myImg = src => <img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" alt="" />;

class _CommonHeader extends Component{
    constructor(props){
        super(props) 
        this.from = this.props.location.state?this.props.location.state.from:'';
        console.log('from:', this.from);
        this.state = {
            visible: false,
            selected: '',
        }
    }

    handleVisibleChange = (visible) => {
        let masks = document.getElementsByClassName("am-popover-mask");
        let mask = masks[0];
        
        if (mask) {
            if (visible) {
                mask.addEventListener("click", function(e){
                    e.preventDefault();
                    e.stopPropagation();
                });
                mask.addEventListener("touchstart", function(e){
                    e.preventDefault();
                    e.stopPropagation();
                });
               
            } else {
                mask.removeEventListener("click", function(e){
                    e.preventDefault();
                    e.stopPropagation();
                });
                mask.removeEventListener("touchstart", function(e){
                    e.preventDefault();
                    e.stopPropagation();
                });
            }
        }
       
        this.setState({
            visible,
        })
    }

    onSearchCanceled = () => {
        let visible = this.state.visible;
        if (visible) {
            this.setState({
                visible:false,
            })
        }
        
    }
    render(){
        const {showBackButton, navBarTitle, showMenuButton, history} = this.props
        return (
            <div>
                <NavBar
                    className="navbar-common-class"
                    mode="dark"
                    leftContent={showBackButton?[
                        <Icon key="0" type="left" size="lg" />,'返回'
                    ]:[]}
                    onLeftClick={(e)=>{
                        if (showBackButton) {
                            if (this.from && this.from !== '') {
                                let { tab } = this.props.location.state;
                                let params = {selectedTab: this.from};
                                if (tab) {
                                    params.tab = tab;
                                }
                                history.replace('/main', params)
                            } else {
                                history.goBack();
                            }
                            
                        }
                    }}
                    rightContent={showMenuButton?
                            <Popover mask
                                    overlayClassName="popup-search-bar"
                                    overlayStyle={{ color: 'currentColor' }}
                                    visible={this.state.visible}
                                    overlay={
                                            <SearchBar placeholder="请输入检索条件"
                                                onCancel={this.onSearchCanceled}
                                            />
                                    }
                                    align={{
                                        overflow: { adjustY: 0, adjustX: 10 },
                                        offset: [50, 0],
                                    }}
                                    getTooltipContainer={() => {console.log(document.getElementById('searchBarContainer')) ;return document.getElementById('searchBarContainer')}}
                                    onVisibleChange={this.handleVisibleChange}
                                    onSelect={this.onSelect}
                            >
                            <span className='iconfont' style={{ fontSize: '1.2rem', color: '#fff',}}>&#xe605;</span>
                            </Popover>
                            
                        : null
                    }
                >{navBarTitle}</NavBar>
                <div id="searchBarContainer" style={{zIndex:'998',height:'100%'}} onClick={(e) => {e.preventDefault();e.stopPropagation();e.nativeEvent.stopImmediatePropagation();}}  onTouchStart={(e) =>{e.preventDefault();e.stopPropagation();e.nativeEvent.stopImmediatePropagation();}}></div>
            </div>
        )
    }
}

export const CommonHeader = withRouter(_CommonHeader)