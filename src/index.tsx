import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import bootstrap from 'bootstrap';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import bsCustomFileInput from 'bs-custom-file-input'
//Unused, but needed to get js working
// eslint-disable-next-line
let unused = bootstrap;

ReactDOM.render(<App />, document.getElementById('root'));

document.onload = ((ev: Event) => { bsCustomFileInput.init(); });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
