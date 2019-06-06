import React, {Component} from "react";
import {Icon, NavBar} from "antd-mobile";
import {withRouter} from 'react-router-dom'

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
        const {
            showBackButton,
            navBarTitle,
            showMenuButton,
            menuButton,
            history} = this.props
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
                    rightContent={showMenuButton ? menuButton : null
                    }
                >{navBarTitle}</NavBar>
                {/*<div id="searchBarContainer" style={{zIndex:'998',height:'100%'}} onClick={(e) => {e.preventDefault();e.stopPropagation();e.nativeEvent.stopImmediatePropagation();}}  onTouchStart={(e) =>{e.preventDefault();e.stopPropagation();e.nativeEvent.stopImmediatePropagation();}} />*/}
            </div>
        )
    }
}

export const CommonHeader = withRouter(_CommonHeader)