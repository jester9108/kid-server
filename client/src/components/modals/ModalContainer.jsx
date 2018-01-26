import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoginModal from './LoginModal.jsx';
import { hideModal, login } from '../../redux/actions';
import { ModalTypes } from '../../config';

class ModalContainer extends Component {
    static propTypes = {
        modalType: PropTypes.string,
        hideModal: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        loginState: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
    };

    render() {
        switch (this.props.modalType) {
            case ModalTypes.LOGIN:
                return <LoginModal {...this.props} />;
            default:
                return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        modalType: state.modalType,
        isLoading: state.isLoading,
        loginState: state.loginState,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        hideModal: () => dispatch(hideModal()),
        login: (email, password) => dispatch(login(email, password))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);
