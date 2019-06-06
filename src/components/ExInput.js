import React, { Component } from 'react';
import {
  Input,
} from 'antd';

const _ = require('lodash');

class _EnhancedInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:null,
    }
  }

  onChange = (e) => {
    let { value } = e.target;
    let { regex } = this.props;
    if (!regex) {
      regex = /[\t\s\u3000]+/i;
    }
    value = value.replace(regex, '');
    this.setState({
      value,
    })
    this.props.onChange(e);
  }
  render() {
    _.omit(this.props, 'onChange');
    return (
      <Input {...this.props}
        value = {this.state.value}
        onChange={this.onChange}
      />
    )
  }

}

export const ExInput = _EnhancedInput;