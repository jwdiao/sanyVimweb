import React, { Component } from 'react';
import {
  Picker,
} from 'antd-mobile';

class _EnhancedPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      pickerValue: []
    }
  }

  componentWillMount() {
    if (this.props.data && this.props.data.length > 0 && this.props.selectedFirst) {
      if (this.props.selectedFirst) {
        console.error('selectedFirst === true will not make the first item value evaluate to parent componenet, need to be fixed!');
      }
      this.setState({
        pickerValue: [this.props.data[0].value],
      }/* , () => {this.props.onPickerOk(this.state.pickerValue)} */)
    }
    
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data && nextProps.data.length > 0 && this.props.selectedFirst) {
      if (this.props.selectedFirst) {
        console.error('selectedFirst === true will not make the first item value evaluate to parent componenet, need to be fixed!');
      }
      this.setState({
        pickerValue: [nextProps.data[0].value],
      }/* , () => {nextProps.onPickerOk(this.state.pickerValue)} */)
    }
    
  }
  onChangeVendor = (val) => {
    this.setState({
      pickerValue: val,
    });
  };
  render() {
    let pickerStyle={ 
      backgroundColor: '#fff', 
      paddingLeft: 15 
    }

    if (this.props.pickerStyle) {
      Object.assign(pickerStyle, this.props.pickerStyle);
    }

    if (this.props.showShadow) {
      pickerStyle.boxShadow = '3px 0px 10px 0px rgba(53,116,250,0.2)';
    }
    let wrapperStyle = {
      display: 'flex',
      height: '45px',
      lineHeight: '45px',
    }
    let titleWrapperStyle = {
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: '1rem',
      color: '#888'
    }

    if (this.props.titleStyle) {
      Object.assign(titleWrapperStyle, this.props.titleStyle);
    }

    let extraStyle = { 
      position:'relative',
      textAlign: 'right', 
      color: '#888', 
      fontSize: '1rem', 
      marginRight: 15 
    }
    if (this.props.extraStyle) {
      Object.assign(extraStyle, this.props.extraStyle);
    }
    const CustomChildren = props => (
      <div
        onClick={props.onClick}
        style={pickerStyle}
      >
        <div style={wrapperStyle}>
          <div style={titleWrapperStyle}>
            {this.props.showIcon && (<span className="iconfont" style={this.props.titleIconStyle}>{this.props.titleIcon}</span>)}
            <span style={{ marginLeft: '0.5rem' }}>{props.children}</span>
          </div>
          <div style={extraStyle}>{props.extra}<span className='iconfont' style={{ fontSize: '1rem', color: '#333', padding:'0.3rem', borderRadius:'0.2rem', }}>&#xe646;</span></div>
        </div>
      </div>
    );

    let cols = 1;
    if (this.props.cols) {
      cols = this.props.cols;
    }
    
    let val =  this.state.pickerValue;
    const linkage = this.props.linkage;
    if (linkage) {
      val = [linkage];
    }
    if (val.length === 0 && this.props.val) {
      val = [this.props.val]
    }
    return (
      <Picker
        data={this.props.data}
        value={val}
        cols={cols}
        onChange={this.onChangeVendor}
        onOk={this.props.onOk}
      >
        <CustomChildren>{this.props.title}</CustomChildren>
      </Picker>
    )
  }

}

export const ExPicker = _EnhancedPicker;