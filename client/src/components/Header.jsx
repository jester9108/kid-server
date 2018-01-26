import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import NavBarContainer from './navbar/NavBarContainer.jsx';

class Header extends Component {
    render() {
        return (
            <Switch>
                <Route component={NavBarContainer} />
            </Switch>
        );
    }
}

export default Header;