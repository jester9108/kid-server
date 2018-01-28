import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ModalTypes } from '../../config';
import { showModal } from '../../redux/actions';

class RegisterContainer extends Component {
    static propTypes = {
        showRegisterModal: PropTypes.func.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
    };

    componentDidMount() {
        if (!this.props.isLoggedIn) {
            this.props.showRegisterModal();
        }
    }

    render() {
        if (this.props.isLoggedIn) {
            console.log('REGISTER ==> DASHBOARD');
            return <Redirect to='/dashboard' />;
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        showRegisterModal: () => dispatch(showModal(ModalTypes.REGISTER)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);
