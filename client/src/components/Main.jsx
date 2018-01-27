import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Main extends Component {
    static propTypes = {
        children: PropTypes.arrayOf(PropTypes.element).isRequired,
        loggedIn: PropTypes.bool.isRequired,
    };

    // componentDidMount() {
    //     if (!this.props.loggedIn) {

    //     }
    // }

    render() {
        if (this.props.loggedIn) {
            return this.props.children;
        } else {
            console.log('MAIN ==> LOGIN')
            console.log(this.props);
            return <Redirect to='/login' />;
        }
    }
    //     (
    //     < Route render={(/* props */) => (
    //         <div style={{ 'textAlign': ' center' }}>
    //             <header className="App-header" style={{ 'backgroundColor': '#222', height: '150px', padding: '20px' }}>
    //                 <img src={'/logo.svg'} className="App-logo" alt="logo" />
    //                 <h1 className="App-title">404 Page Not Found</h1>
    //             </header>
    //             <p className="App-intro">
    //                 {'It seems that we can\'t find the page you are looking for.'}
    //             </p>
    //         </div>
    //     )} />
    // );
}

const mapStateToProps = state => {
    return {
        loggedIn: state.loginState.loggedIn,
    };
}

export default connect(mapStateToProps)(Main);
