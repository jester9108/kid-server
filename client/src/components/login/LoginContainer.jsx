import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ModalTypes } from '../../config';
import { showModal } from '../../redux/actions';

class LoginContainer extends Component {
    static propTypes = {
        showLoginModal: PropTypes.func.isRequired,
        loggedIn: PropTypes.bool.isRequired,
    };

    componentDidMount() {
        if (!this.props.loggedIn) {
            this.props.showLoginModal();
        } else {

        }
    }

    render() {
        if (this.props.loggedIn) {
            console.log('LOGIN ==> DASHBOARD');
            return <Redirect to='/dashboard' />;
        } else {
            return <div>Login Page</div>;
        }
    }
}

const mapStateToProps = state => {
    return {
        loggedIn: state.loginState.loggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        showLoginModal: () => dispatch(showModal(ModalTypes.LOGIN)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
