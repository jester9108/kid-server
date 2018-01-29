import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Form, Message } from 'semantic-ui-react'

import ModalWrapper from '../modal/ModalWrapper.jsx';

class LoginModal extends Component {
    static propTypes = {
        hideModal: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
        login: PropTypes.func.isRequired,
        modalState: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        // Initial state
        this.state = { email: '', password: '' };

        // Bind methods
        this.onChange = this.onChange.bind(this);
        this.login = this.login.bind(this);

        // Constants
        this.submitBtnId = 'loginBtn';
        this.headerTxt = '로그인';
        this.emailTxt = '이메일';
        this.passwordTxt = '비밀번호';

        // Modal display logic
        const triggerSubmit = () => {
            document.getElementById(this.submitBtnId).click();
        };
        this.options = {
            header: this.headerTxt,
            submitBtn: (
                <Button as='label' fluid color='teal' content={this.headerTxt} tabIndex='0' onClick={triggerSubmit} />
            ),
            dimmer: false,
            closeOnEscape: false,
            closeOnRootNodeClick: false,
            closeIcon: false,
        }
    }

    onChange(e, { id, value }) {
        this.setState({ [id]: value });
    }

    login(/* event */) {
        this.props.login(this.state.email, this.state.password);
        this.setState({ password: '' });
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
            this.props.hideModal();
        }
    }

    render() {
        const { email, password } = this.state;
        return (
            <ModalWrapper {...this.options} isLoading={this.props.isLoading} onClose={() => { }} >
                <Form error={this.props.modalState.error !== null} onSubmit={this.login}>
                    <Grid>
                        <Grid.Column width={3} />
                        <Grid.Column width={10}>
                            <Message error header='오류' content={this.props.modalState.error} />
                            <Form.Input label={this.emailTxt} id='email' type='text' value={email} placeholder={this.emailTxt} onChange={this.onChange} />
                            <Form.Input label={this.passwordTxt} id='password' type='password' value={password} placeholder={this.passwordTxt} onChange={this.onChange} />
                            {/* <Form.Checkbox label='Remember me' id='remember' /> */}
                            <input id={this.submitBtnId} type='submit' hidden />
                        </Grid.Column>
                        <Grid.Column width={3} />
                    </Grid>
                </Form>
            </ModalWrapper>
        );
    }
}


export default LoginModal;
