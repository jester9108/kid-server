import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Form, Message } from 'semantic-ui-react'

import ModalWrapper from './ModalWrapper.jsx';

class LoginModal extends Component {
    static propTypes = {
        hideModal: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onClose = this.onClose.bind(this);
        this.login = this.login.bind(this);
        const triggerSubmit = () => {
            document.getElementById('loginBtn').click();
        };
        this.options = {
            header: 'Login',
            // subheader: 'Please login',
            // message: 'We only support email login currently.',
            submitBtn: (
                <Button as='label' fluid color='teal' content='Login' tabIndex='0' onClick={triggerSubmit} />
            ),
        }
        this.state = { email: '', password: '', error: false };
    }

    onChange(e, { name, value }) {
        this.setState({ [name]: value });
    }

    onClose() {
        this.props.hideModal();
    }

    login() {
        this.setState({ password: '',
         error: true, errCode: 'No reason', errMsg: 'Just go die' });
    }

    render() {
        const { email, password } = this.state;
        return (
            <ModalWrapper onClose={this.onClose} {...this.options}>
                <Grid>
                    <Grid.Column width={3} />
                    <Grid.Column width={10}>
                        <Form error={this.state.error} onSubmit={this.login}>
                            <Message error header={this.state.errCode} content={this.state.errMsg}/>
                            <Form.Input label='Email' name='email' type='text' value={email} placeholder='Email' onChange={this.onChange} required />
                            <Form.Input label='Password' name='password' type='password' value={password} placeholder='Password' onChange={this.onChange} required />
                            <Form.Checkbox label='Remember me' name='remember' />
                            <input id='loginBtn' type='submit' hidden />
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={3} />
                </Grid>
            </ModalWrapper>
        );
    }
}

export default LoginModal;
