import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Form, Message } from 'semantic-ui-react'

import ModalWrapper from '../modal/ModalWrapper.jsx';

class DeleteAccountModal extends Component {
    static propTypes = {
        hideModal: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
        reauth: PropTypes.func.isRequired,
        modalState: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        // Initial state
        this.state = { password: '' };

        // Bind methods
        this.onChange = this.onChange.bind(this);
        this.reauth = this.reauth.bind(this);

        // Constants
        this.submitBtnId = 'reauthBtn';
        this.headerTxt = '회원탈퇴';
        this.subHeaderTxt = '보안을 위해 비밀번호를 입력해주시기 바랍니다.';
        this.messageTxt = '* 계정을 삭제하실 경우, 저장된 모든 데이터가 사라집니다. 잠시 서비스를 중단하고 싶으신 경우, 상품 설정에서 중단하기를 눌러주시기 바랍니다.';
        this.passwordTxt = '비밀번호';
        this.submitTxt = '계정 삭제하기';

        // Modal display logic
        const triggerSubmit = () => {
            document.getElementById(this.submitBtnId).click();
        };
        this.options = {
            header: this.headerTxt,
            subheader: this.subHeaderTxt,
            message: this.messageTxt,
            submitBtn: (
                <Button as='label' fluid color='red' content={this.submitTxt} tabIndex='0' onClick={triggerSubmit} />
            ),
            // dimmer: 'inverted',
            // closeIcon: false,
        }
    }

    onChange(e, { id, value }) {
        this.setState({ [id]: value });
    }

    reauth(/* event */) {
        this.props.reauth(this.state.password);
        this.setState({ password: '' });
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
            this.props.hideModal();
        }
    }

    render() {
        const { password } = this.state;
        if (this.props.modalState.isReauthed) {
            return (
                <ModalWrapper {...this.options} isLoading={this.props.isLoading} onClose={this.props.hideModal} >
                    <Form loading={false} error={this.props.modalState.error !== null} onSubmit={this.reauth}>
                        <Grid>
                            <Grid.Column width={3} />
                            <Grid.Column width={10}>
                            GOOD JOB
                            </Grid.Column>
                            <Grid.Column width={3} />
                        </Grid>
                    </Form>
                </ModalWrapper>
            );
        } else {
            return (
                <ModalWrapper {...this.options} isLoading={this.props.isLoading} onClose={this.props.hideModal} >
                    <Form loading={false} error={this.props.modalState.error !== null} onSubmit={this.reauth}>
                        <Grid>
                            <Grid.Column width={3} />
                            <Grid.Column width={10}>
                                <Message error header='오류' content={this.props.modalState.error} />
                                <Form.Input label={this.passwordTxt} id='password' type='password' value={password} placeholder={this.passwordTxt} onChange={this.onChange} />
                                <input id={this.submitBtnId} type='submit' hidden />
                            </Grid.Column>
                            <Grid.Column width={3} />
                        </Grid>
                    </Form>
                </ModalWrapper>
            );
        }
    }
}

export default DeleteAccountModal;
