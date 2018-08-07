import 'babel-polyfill'; // Add Promises polyfill to global environment

if (__PRODUCTION__) {
    // Configure raven
    Raven.config(
        'https://3b4b870154ce496c9d3dd9673a529bb9@sentry.io/121717',
    ).install();
}

//Import local css
import 'react-widgets/lib/less/react-widgets.less';
import './scss/tunga.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import store from './store';

import App from './components/App';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('app-root'),
);
