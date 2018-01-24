import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from './Modal.jsx';

class LoginModal extends Component {
    static propTypes = {
        hideModal: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
    }

    onClose() {
        this.props.hideModal();
    }

    login() {
        console.log('do some login');
    }

    render() {
        console.log(this.props)
        return (
            <Modal onClose={this.onClose}>
                <input id='email' type='text' placeholder='Email' />
                <input id='password' type='password' placeholder='Password' />
                <input id='submit' type='submit' value='Login' />
            </Modal>
        );
    }
}

export default LoginModal;
