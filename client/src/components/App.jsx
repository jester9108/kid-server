import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import NavBarContainer from './navbar/NavBarContainer.jsx';
import Main from './Main.jsx';
import LoginContainer from './login/LoginContainer.jsx';
import RegisterContainer from './register/RegisterContainer.jsx';
import AccountContainer from './account/AccountContainer.jsx';
import ReceptionContainer from './reception/ReceptionContainer.jsx';
import DashboardContainer from './dashboard/DashboardContainer.jsx';
import ScheduleContainer from './schedule/ScheduleContainer.jsx';
import SettingsContainer from './settings/SettingsContainer.jsx';
import CustomerServiceContainer from './customerservice/CustomerServiceContainer.jsx';
import ModalContainer from './modal/ModalContainer.jsx';
import LoaderContainer from './loader/LoaderContainer.jsx';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Route component={NavBarContainer} />
                <Switch>
                    <Route path='/login' component={LoginContainer} />
                    <Route path='/register' component={RegisterContainer} />
                    <Main>
                        <Switch>
                            <Route path='/account' component={AccountContainer} />
                            <Route path='/reception' component={ReceptionContainer} />
                            <Route path='/dashboard' component={DashboardContainer} />
                            <Route path='/schedule' component={ScheduleContainer} />
                            <Route path='/settings' component={SettingsContainer} />
                            <Route path='/customerservice' component={CustomerServiceContainer} />
                            <Route render={(props) => (
                                <div style={{ 'textAlign': ' center' }}>
                                    <header className="App-header" style={{ 'backgroundColor': '#222', height: '150px', padding: '20px' }}>
                                        <img src={'/logo.svg'} className="App-logo" alt="logo" />
                                        <h1 className="App-title">페이지를 찾을수 없습니다.</h1>
                                    </header>
                                    <p className="App-intro">
                                        {'It seems that we can\'t find the page you are looking for.'}
                                    </p>
                                </div>
                            )} />
                        </Switch>
                    </Main>
                </Switch>
                <ModalContainer />
                <LoaderContainer />
            </div>
        );
    }
}

export default App;
