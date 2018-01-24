import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Navigation from './Navigation.jsx';

class Header extends Component {
    render() {
        return (
            <Switch>
                <Route path='/reception' component={Navigation} />
                <Route path='/dashboard' component={Navigation} />
                <Route path='/schedule' component={Navigation} />
                <Route path='/settings' component={Navigation} />
                <Route path='/customerservice' component={Navigation} />
                <Route exact path='/' component={Navigation} />
            </Switch>
        );
    }
}

export default Header;