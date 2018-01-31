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

        // Initial state
        this.state = { email: '', password: '', passwordConf: '', storeName: '', adminName: '', bizRegCert: '' };

        // Bind methods
        this.onChange = this.onChange.bind(this);
        this.register = this.register.bind(this);

        // Constants
        this.submitBtnIdTxt = 'registerBtn';
        this.headerTxt = '회원가입';
        this.emailTxt = '이메일';
        this.passwordTxt = '비밀번호';
        this.passwordConfTxt = '비밀번호 확인';
        this.storeNameTxt = '장소 이름';
        this.adminNameTxt = '관리자 이름';
        this.bizRegCertTxt = '사업자 등록증 (PDF 파일)';

        // Modal display logic
        const triggerSubmit = () => {
            document.getElementById(this.submitBtnIdTxt).click();
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

    register(event) {
        const storeData = Object.assign({}, this.state);
        // Cannot get the file binary from this.state, so fetch manually from form elements
        storeData.bizRegCert = event.target.elements.bizRegCert.files[0];
        this.props.register(storeData);
        this.setState({ password: '', passwordConf: '' });
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
            this.props.hideModal();
        }
    }

    render() {
        console.log(this.state)
        const { email, password, passwordConf, storeName, adminName, bizRegCert } = this.state;
        return (
            <ModalWrapper {...this.options} isLoading={this.props.isLoading} onClose={this.props.hideModal} >
                <Form error={this.props.modalState.error !== null} onSubmit={this.register}>
                    <Grid>
                        <Grid.Column width={3} />
                        <Grid.Column width={10}>
                            <Message error header='오류' content={this.props.modalState.error} />
                            <Form.Input label={this.emailTxt} id='email' type='text' value={email} placeholder={this.emailTxt} onChange={this.onChange} />
                            <Form.Input label={this.passwordTxt} id='password' type='password' value={password} placeholder={this.passwordTxt} onChange={this.onChange} />
                            <Form.Input label={this.passwordConfTxt} id='passwordConf' type='password' value={passwordConf} placeholder={this.passwordConfTxt} onChange={this.onChange} />
                            <Form.Input label={this.storeNameTxt} id='storeName' type='text' value={storeName} placeholder={this.storeNameTxt} onChange={this.onChange} />
                            <Form.Input label={this.adminNameTxt} id='adminName' type='text' value={adminName} placeholder={this.adminNameTxt} onChange={this.onChange} />
                            <Form.Input label={this.bizRegCertTxt} id='bizRegCert' type='file' value={bizRegCert} onChange={this.onChange} />
                            <input id={this.submitBtnIdTxt} type='submit' hidden />
                        </Grid.Column>
                        <Grid.Column width={3} />
                    </Grid>
                </Form>
            </ModalWrapper>
        );
    }
}

export default RegisterModal;
