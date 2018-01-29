import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Form, Message } from 'semantic-ui-react'

import ModalWrapper from '../modal/ModalWrapper.jsx';

class RegisterModal extends Component {
    static propTypes = {
        hideModal: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        register: PropTypes.func.isRequired,
        modalState: PropTypes.object.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.register = this.register.bind(this);
        const triggerSubmit = () => {
            document.getElementById('registerBtn').click();
        };
        this.state = { email: '', password: '', passwordConf: '', storeName: '', adminName: '' };

        // constants
        this.header = '회원가입';
        this.email = '이메일';
        this.password = '비밀번호';
        this.passwordConf = '비밀번호 확인';
        this.storeName = '장소 이름';
        this.adminName = '관리자 이름';

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

    register(/* event */) {
        this.props.register(this.state);
        this.setState({ password: '', passwordConf: '' });
    }

    render() {
        const { email, password, passwordConf, storeName, adminName } = this.state;
        if (this.props.isLoggedIn) {
            return null;
        } else {
            return (
                <ModalWrapper {...this.options} isLoading={this.props.isLoading} onClose={this.props.hideModal} >
                    <Form error={this.props.modalState.error !== null} onSubmit={this.register}>
                        <Grid>
                            <Grid.Column width={3} />
                            <Grid.Column width={10}>
                                <Message error header='오류' content={this.props.modalState.error} />
                                <Form.Input label={this.email} id='email' type='text' value={email} placeholder={this.email} onChange={this.onChange} />
                                <Form.Input label={this.password} id='password' type='password' value={password} placeholder={this.password} onChange={this.onChange} />
                                <Form.Input label={this.passwordConf} id='passwordConf' type='password' value={passwordConf} placeholder={this.passwordConf} onChange={this.onChange} />
                                <Form.Input label={this.storeName} id='storeName' type='text' value={storeName} placeholder={this.storeName} onChange={this.onChange} />
                                <Form.Input label={this.adminName} id='adminName' type='text' value={adminName} placeholder={this.adminName} onChange={this.onChange} />
                                <input id='registerBtn' type='submit' hidden />
                            </Grid.Column>
                            <Grid.Column width={3} />
                        </Grid>
                    </Form>
                </ModalWrapper>
            );
        }
    }
}

export default RegisterModal;
