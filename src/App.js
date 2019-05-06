import React, { Component } from 'react';
import {LocaleProvider} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import Router from './routes'

class App extends Component {
  render() {
    return (
        <LocaleProvider locale={zhCN}>
            <Router />
        </LocaleProvider>
    );
  }
}

export default App;
