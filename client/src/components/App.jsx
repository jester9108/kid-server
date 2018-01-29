import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import { fetchUser } from '../redux/actions';
import NavBarContainer from './navbar/NavBarContainer.jsx';
import Main from './Main.jsx';
import LoginContainer from './login/LoginContainer.jsx';
import RegisterContainer from './register/RegisterContainer.jsx';
import AccountContainer from './account/AccountContainer.jsx';
import Reception from './reception/Reception.jsx';
import Dashboard from './dashboard/Dashboard.jsx';
import Schedule from './schedule/Schedule.jsx';
import Settings from './settings/Settings.jsx';
import CustomerService from './customerservice/CustomerService.jsx';
import ModalContainer from './modal/ModalContainer.jsx';
import LoaderContainer from './loader/LoaderContainer.jsx';
import './App.css';

class App extends Component {
    static propTypes = {
        fetchUser: PropTypes.func.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
    }

    componentDidMount() {
        this.componentDidUpdate({ isLoggedIn: false });
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
            this.props.fetchUser();
        }
    }

    render() {
        console.log('APP RENDERING')
        return (
            <div className="App">
                <Route component={NavBarContainer} />
                <Switch>
                    <Route path='/login' component={LoginContainer} />
                    <Route path='/register' component={RegisterContainer} />
                    <Main>
                        <Switch>
                            <Route path='/account' component={AccountContainer} />
                            <Route path='/reception' component={Reception} />
                            <Route path='/dashboard' component={Dashboard} />
                            <Route path='/schedule' component={Schedule} />
                            <Route path='/settings' component={Settings} />
                            <Route path='/customerservice' component={CustomerService} />
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

const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchUser: () => dispatch(fetchUser()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
