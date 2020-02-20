import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './../node_modules/bootstrap/dist/css/bootstrap.css';
import './../node_modules/bootstrap/dist/css/bootstrap-grid.min.css.map';
import './index.css'

ReactDOM.render(<App />, document.getElementById('root'));


serviceWorker.unregister();
