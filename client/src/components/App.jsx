import React, { Component } from 'react';
import '../css/App.css';
import Header from './Header.jsx';
import Main from './Main.jsx';
import Modal from './modals/Modal.jsx';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <Main />
                <Modal />
            </div>
        );
    }
}

export default App;
