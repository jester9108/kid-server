import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ModalTypes } from '../../config';
import { showModal } from '../../redux/actions';

class LoginContainer extends Component {
    static propTypes = {
        showLoginModal: PropTypes.func.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
    };

    componentDidMount() {
        if (!this.props.isLoggedIn) {
            console.log('DISPATCH SHOW LOGIN MODAL')
            console.log(this.props.state);
            this.props.showLoginModal();
        }
    }

    render() {
        if (this.props.isLoggedIn) {
            console.log('LOGIN ==> DASHBOARD');
            return <Redirect to='/dashboard' />;
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn,
        state: state,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        showLoginModal: () => dispatch(showModal(ModalTypes.LOGIN)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
