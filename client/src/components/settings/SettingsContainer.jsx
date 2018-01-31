import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';

import { showModal, requireSave, save } from '../../redux/actions';
import { ModalTypes } from '../../config';
import StoreTab from './StoreTab.jsx';
// import SettingsPage from './SettingsPage.jsx';

class SettingsContainer extends Component {
    static propTypes = {
        showDeleteAccountModal: PropTypes.func.isRequired,
        showChangeEmailModal: PropTypes.func.isRequired,
        showChangePasswordModal: PropTypes.func.isRequired,
        requireSave: PropTypes.func.isRequired,
        save: PropTypes.func.isRequired,
        isSaving: PropTypes.bool.isRequired,
        error: PropTypes.string,
        userData: PropTypes.object,
    };

    constructor(props) {
        super(props);

        // Constants
        this.storeSettingsTxt = '스토어 설정';
        this.menuSettingsTxt = '메뉴 설정';
        this.productSettingsTxt = '패키지 설정';
        this.bankAccountSettingsTxt = '결제 설정';
    }

    render() {
        if (this.props.userData) {
            return (
                <Tab className='content-panel' panes={[
                    { menuItem: this.storeSettingsTxt, render: () => <Tab.Pane><StoreTab {...this.props} /></Tab.Pane> },
                    { menuItem: this.menuSettingsTxt, render: () => <Tab.Pane></Tab.Pane> },
                    { menuItem: this.productSettingsTxt, render: () => <Tab.Pane></Tab.Pane> },
                    { menuItem: this.bankAccountSettingsTxt, render: () => <Tab.Pane></Tab.Pane> }
                ]} /* activeIndex={this.state.activeTabIndex} */ onTabChange={this.handleTabChange} />
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        userData: state.userData,
        isSaving: state.isSaving,
        error: state.error,
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
