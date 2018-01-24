import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

class Registration extends Component {
    render() {
        console.log(this.props.match);
        return (
            <Switch>
                <Route exact path='/register' render={(props) => (
                    <div>registration page</div>
                )} />
                <Route path='/register/:id' render={(props) => (
                    <div>registration page {props.match.params.id}</div>
                )} />
            </Switch>
        );
    }
}

export default Registration;
