import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Form, Message } from 'semantic-ui-react'

import ModalWrapper from './ModalWrapper.jsx';

class LoginModal extends Component {
    static propTypes = {
        hideModal: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        login: PropTypes.func.isRequired,
        loginState: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
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
            dimmer: false,
            closeOnEscape: false,
            closeOnRootNodeClick: false,
            closeIcon: false,
        }
        this.state = { email: '', password: '' };
    }

    onChange(e, { id, value }) {
        this.setState({ [id]: value });
    }

    login(/* event */) {
        this.props.login(this.state.email, this.state.password);
        this.setState({ password: '' });
    }

    render() {
        const { email, password } = this.state;
        if (this.props.loginState.loggedIn) {
            return null;
        } else {
            return (
                <ModalWrapper {...this.options} isLoading={this.props.isLoading} onClose={this.props.hideModal} >
                    <Grid>
                        <Grid.Column width={3} />
                        <Grid.Column width={10}>
                            <Form error={this.props.loginState.error !== null} onSubmit={this.login}>
                                <Message error header='Login error' content={this.props.loginState.error} />
                                <Form.Input label='Email' id='email' type='text' value={email} placeholder='Email' onChange={this.onChange} />
                                <Form.Input label='Password' id='password' type='password' value={password} placeholder='Password' onChange={this.onChange} />
                                <Form.Checkbox label='Remember me' id='remember' />
                                <input id='loginBtn' type='submit' hidden />
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={3} />
                    </Grid>
                </ModalWrapper>
            );
        }
    }

    componentDidMount() {
        // Cannot attach ref callback to stateless component function
        // document.getElementById('email').focus(); 
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.loginState.loggedIn && this.props.loginState.loggedIn) {
            this.props.hideModal();
        }
    }
}


export default LoginModal;
