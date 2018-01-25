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
        this.options = {
            header: 'Login',
            subheader: 'Please login',
            description: 'We only support email login currently.',
            submitText: 'Login',
        }
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
            <Modal onClose={this.onClose} {...this.options}>
                <div className='row'><input id='email' type='text' placeholder='Email' /></div>
                <div className='row'><input id='password' type='password' placeholder='Password' /></div>
            </Modal>
        );
    }
}

export default LoginModal;
