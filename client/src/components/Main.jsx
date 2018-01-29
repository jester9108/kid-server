import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Main extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
    };

    render() {
        if (this.props.isLoggedIn) {
            return this.props.children;
        } else {
            console.log('MAIN ==> LOGIN');
            return <Redirect to='/login' />;
        }
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn,
    };
}

export default connect(mapStateToProps)(Main);
