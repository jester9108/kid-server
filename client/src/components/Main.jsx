import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

class Main extends Component {
    render() {
        return (
            <Switch>
                {/* render property example */}
                {/* const extraProps = {color: 'red' } */}
                {/* <Route path='/page' render={(props) => (
                    <Page {...props} data={extraProps} />
                )} /> */}

                {/* default page */}
                <Route render={(/* props */) => (
                    <div style={{ 'textAlign': ' center' }}>
                        <header className="App-header" style={{ 'backgroundColor': '#222', height: '150px', padding: '20px' }}>
                            <img src={'/logo.svg'} className="App-logo" alt="logo" />
                            <h1 className="App-title">404 Page Not Found</h1>
                        </header>
                        <p className="App-intro">
                            {'It seems that we can\'t find the page you are looking for.'}
                        </p>
                    </div>
                )} />
            </Switch>
        );
    }
}

export default Main;