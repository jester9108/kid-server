import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Divider, Header, Label } from 'semantic-ui-react';

import ContentPanel from '../panel/ContentPanel.jsx';
import { DataTypes } from '../../config';

class AccountPage extends Component {
    static propTypes = {
        showDeleteAccountModal: PropTypes.func.isRequired,
        showChangeEmailModal: PropTypes.func.isRequired,
        showChangePasswordModal: PropTypes.func.isRequired,
        requireSave: PropTypes.func.isRequired,
        save: PropTypes.func.isRequired,
        userData: PropTypes.object.isRequired,
        isSaving: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            email: props.userData.email || '',
            adminName: props.userData.admin.name || '',
            adminPhone: props.userData.admin.phone || '',
            saveCallback: null,
        }

        // Bind methods
        this.onChange = this.onChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);

        // Constants
        this.headerTxt = '계정설정';
        this.emailTxt = '이메일';
        this.deleteAccTxt = '회원탈퇴';
        this.adminNameTxt = '담당자 성명';
        this.phoneTxt = '전화번호';
        this.emailChangeTxt = '이메일 변경';
        this.pwChangeTxt = '비밀번호 변경';
    }

    onChange(event) {
        clearTimeout(this.state.saveCallback);
        const saveCallback = setTimeout(this.saveChanges, 1500);
        this.setState({
            [event.target.id]: event.target.value,
            saveCallback: saveCallback,
        });
        this.props.requireSave();
    }

    saveChanges() {
        const newUserData = Object.assign({}, this.props.userData, {
            admin: {
                name: this.state.adminName,
                phone: this.state.adminPhone,
            },
        });
        this.props.save(newUserData, DataTypes.ADMIN);
    }

    render() {
        return (
            <ContentPanel isSaving={this.props.isSaving}>
                <Form success={false} error={false} onSubmit={this.login}>
                    <Grid>
                        <Grid.Column width={1} />
                        <Grid.Column width={14}>
                            <Header as='h3' dividing>{this.headerTxt}</Header>
                            <Form.Group style={{ float: 'right' }}>
                                <Label basic color='blue' className='no-border' onClick={this.props.showChangeEmailModal}>{this.emailChangeTxt}</Label>
                                <Label basic color='blue' className='no-border' onClick={this.props.showChangePasswordModal}>{this.pwChangeTxt}</Label>
                            </Form.Group>
                            <Form.Group style={{ clear: 'both' }}>
                                <Form.Field width={16}>
                                    <Label basic color='black' pointing='below'>{this.emailTxt}</Label>
                                    <input id='email' type='text' value={this.state.email} disabled />
                                </Form.Field>
                            </Form.Group>
                            <Divider hidden />
                            <Form.Group>
                                <Form.Field width={8}>
                                    <Label basic color='black' pointing='below'>{this.adminNameTxt}</Label>
                                    <input id='adminName' type='text' value={this.state.adminName} onChange={this.onChange} />
                                </Form.Field>
                                <Form.Field width={8}>
                                    <Label basic color='black' pointing='below'>{this.phoneTxt}</Label>
                                    <input id='adminPhone' type='text' value={this.state.adminPhone} onChange={this.onChange} />
                                </Form.Field>
                            </Form.Group>
                            <Divider section hidden />
                            <Form.Group style={{ float: 'right' }}>
                                <Label basic color='red' className='no-border' onClick={this.props.showDeleteAccountModal}>{this.deleteAccTxt}</Label>
                            </Form.Group>
                        </Grid.Column>
                        <Grid.Column width={1} />
                    </Grid>
                </Form>
            </ContentPanel>
        );
    }
}

export default AccountPage;
