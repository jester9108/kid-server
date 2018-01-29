import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoginModal from '../login/LoginModal.jsx';
import RegisterModal from '../register/RegisterModal.jsx';
import { hideModal, login, register } from '../../redux/actions';
import { ModalTypes } from '../../config';

class ModalContainer extends Component {
    static propTypes = {
        hideModal: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
        modalState: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        register: PropTypes.func.isRequired,
    };

    render() {
        switch (this.props.modalState.type) {
            case ModalTypes.LOGIN:
                return <LoginModal {...this.props} />;
            case ModalTypes.REGISTER:
                return <RegisterModal {...this.props} />;
            default:
                return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.isLoading,
        isLoggedIn: state.isLoggedIn,
        modalState: state.modalState,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        hideModal: () => dispatch(hideModal()),
        login: (email, password) => dispatch(login(email, password)),
        register: (storeData) => dispatch(register(storeData))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);
