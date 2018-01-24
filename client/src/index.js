import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import kidApp from './redux/reducers';
import App from './components/App.jsx';
import './css/index.css';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(kidApp);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
    , document.getElementById('root')
);
registerServiceWorker();
