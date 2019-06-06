import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import './index.less';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();

