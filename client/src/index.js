import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

import rootReducer from './redux/reducers';
import { loginSuccess } from './redux/actions';
import App from './components/App.jsx';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

/* Create Redux store */
const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware, logger)
);

/* Load user session */
const accessToken = localStorage.getItem('accessToken');
if (accessToken) {
    console.log('ACCESS TOKEN RECOVERED FROM LOCAL STORAGE');
    store.dispatch(loginSuccess(accessToken));
}

/* Render */
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
    , document.getElementById('root')
);
registerServiceWorker();
