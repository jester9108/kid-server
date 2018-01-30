import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { showModal, requireSave, save } from '../../redux/actions';
import { ModalTypes } from '../../config';
import SettingsPage from './SettingsPage.jsx';

class SettingsContainer extends Component {
    static propTypes = {
        showDeleteAccountModal: PropTypes.func.isRequired,
        showChangeEmailModal: PropTypes.func.isRequired,
        showChangePasswordModal: PropTypes.func.isRequired,
        requireSave: PropTypes.func.isRequired,
        save: PropTypes.func.isRequired,
        isSaving: PropTypes.bool.isRequired,
        userData: PropTypes.object,
    };

    render() {
        if (this.props.userData) {
            return <SettingsPage {...this.props} />;
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        userData: state.userData,
        isSaving: state.isSaving,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        showDeleteAccountModal: () => dispatch(showModal(ModalTypes.DELETE_ACCOUNT)),
        showChangeEmailModal: () => dispatch(showModal(ModalTypes.CHANGE_EMAIL)),
        showChangePasswordModal: () => dispatch(showModal(ModalTypes.CHANGE_PASSWORD)),
        requireSave: () => dispatch(requireSave()),
        save: (userData, dataType) => dispatch(save(userData, dataType)),

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
