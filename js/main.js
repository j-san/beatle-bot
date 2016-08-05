
// import 'jquery';
// import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import '../css/style.css';
import 'font-awesome/css/font-awesome.css';
import ReactDOM from 'react-dom';
import React from 'react';

import AppView from './views/AppView.jsx';

ReactDOM.render(
    React.createElement(AppView),
    document.getElementById('container')
);
