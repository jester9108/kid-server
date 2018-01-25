import React, { Component } from 'react';

// import Header from './Header.jsx';
import NavBarContainer from './navbar/NavBarContainer.jsx';
import Main from './Main.jsx';
import ModalContainer from './modals/ModalContainer.jsx';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <NavBarContainer />
                <Main />
                <ModalContainer />
            </div>
        );
    }
}

export default App;
