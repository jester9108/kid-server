import React, { Component } from 'react';

import Header from './Header.jsx';
import Main from './Main.jsx';
import ModalContainer from './modals/ModalContainer.jsx';
import LoaderContainer from './loader/LoaderContainer.jsx';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <Main />
                <ModalContainer />
                <LoaderContainer />
            </div>
        );
    }
}



export default App;
