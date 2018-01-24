import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ModalWrapper from './ModalWrapper.jsx';

class LoginModal extends Component {
    static propTypes = {};

    login() {
        console.log('do some login');
    }

    render() {
        return (
            <ModalWrapper {...this.props} title='Login' width={400} showOk={false}>
                <input id='email' type='text' placeholder='Email' />
                <input id='password' type='password' placeholder='Password' />
                <input id='submit' type='submit'value='Login' />
            </ModalWrapper>
        );
    }
}

export default LoginModal;
