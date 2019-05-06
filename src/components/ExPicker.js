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
    this.setState({
      pickerValue: [this.props.data[0].value],
    })
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

    let wrapperStyle = {
      display: 'flex',
      height: '45px',
      lineHeight: '45px',
    }
    if (this.props.showShadow) {
      wrapperStyle.boxShadow = '7px 4px 18px 0px rgba(53,116,250,0.2)';
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
          <div style={extraStyle}>{props.extra}</div>
        </div>
      </div>
    );

    let cols = 1;
    if (this.props.cols) {
      cols = this.props.cols;
    }
    let val = this.props.selectedFirst ? this.state.pickerValue : '';
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