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
        this.onChange = this.onChange.bind(this);
        this.login = this.login.bind(this);
        const triggerSubmit = () => {
            document.getElementById('loginBtn').click();
        };
        this.state = { email: '', password: '' };

        // constants
        this.header = '로그인';
        this.email = '이메일';
        this.password = '비밀번호';

        this.options = {
            header: this.header,
            // subheader: 'Please login',
            // message: 'We only support email login currently.',
            submitBtn: (
                <Button as='label' fluid color='teal' content={this.header} tabIndex='0' onClick={triggerSubmit} />
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

    render() {
        const { email, password } = this.state;
        if (this.props.isLoggedIn) {
            return null;
        } else {
            return (
                <ModalWrapper {...this.options} isLoading={this.props.isLoading} onClose={this.props.hideModal} >
                    <Form error={this.props.modalState.error !== null} onSubmit={this.login}>
                        <Grid>
                            <Grid.Column width={3} />
                            <Grid.Column width={10}>
                                <Message error header='오류' content={this.props.modalState.error} />
                                <Form.Input label={this.email} id='email' type='text' value={email} placeholder={this.email} onChange={this.onChange} />
                                <Form.Input label={this.password} id='password' type='password' value={password} placeholder={this.password} onChange={this.onChange} />
                                {/* <Form.Checkbox label='Remember me' id='remember' /> */}
                                <input id='loginBtn' type='submit' hidden />
                            </Grid.Column>
                            <Grid.Column width={3} />
                        </Grid>
                    </Form>
                </ModalWrapper>
            );
        }
    }

    componentDidMount() {
        // Cannot attach ref callback to stateless component function
        // document.getElementById('email').focus(); 
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
            this.props.hideModal();
        }
    }
}


export default LoginModal;
