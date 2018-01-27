import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

import rootReducer from './redux/reducers';
import { loginSuccess } from './redux/actions';
import App from './components/App.jsx';
// import Routes from './components/Routes.jsx';
import './index.css';

import registerServiceWorker from './registerServiceWorker';

/* Create Redux store */
const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware, logger)
);

/* Create browser history */
const history = createBrowserHistory();

/* Load user session */
const accessToken = localStorage.getItem('accessToken');
if (accessToken) {
    store.dispatch(loginSuccess(accessToken));
}

/* Render */
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter history={history}>
            <App />
        </BrowserRouter>
    </Provider>
    , document.getElementById('root')
);
registerServiceWorker();
