import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoginModal from './LoginModal.jsx';
import { hideModal } from '../../redux/actions';
import { ModalTypes } from '../../config';

class ModalContainer extends Component {
    static propTypes = {
        modalType: PropTypes.string,
        hideModal: PropTypes.func.isRequired,
    };

    render() {
        console.log(this.props)
        switch (this.props.modalType) {
            case ModalTypes.LOGIN:
                return <LoginModal hideModal={this.props.hideModal}/>;

            default:
                return null;
        }
    }
}

const mapStateToProps = state => {
    return { modalType: state.modalDisplay.modalType };
}

const mapDispatchToProps = dispatch => {
    return { hideModal: () => dispatch(hideModal()) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);
