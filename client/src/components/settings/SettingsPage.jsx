import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { /* Form, Grid, Divider, Header, Label, */ Tab } from 'semantic-ui-react';

import StoreTab from './StoreTab.jsx';
// import { DataTypes } from '../../config';

class SettingsPage extends Component {
    // static propTypes = {
    //     showDeleteAccountModal: PropTypes.func.isRequired,
    //     showChangeEmailModal: PropTypes.func.isRequired,
    //     showChangePasswordModal: PropTypes.func.isRequired,
    //     requireSave: PropTypes.func.isRequired,
    //     save: PropTypes.func.isRequired,
    //     userData: PropTypes.object.isRequired,
    //     isSaving: PropTypes.bool.isRequired,
    // };

    constructor(props) {
        super(props);

        // Constants
        this.storeSettingsTxt = '스토어 설정';
        this.menuSettingsTxt = '메뉴 설정';
        this.productSettingsTxt = '패키지 설정';
        this.bankAccountSettingsTxt = '결제 설정';
    }

    render() {
        return (
            // <ContentPanel isSaving={this.props.isSaving}>
            <Tab className='content-panel' panes={[
                { menuItem: this.storeSettingsTxt, render: () => <Tab.Pane><StoreTab {...this.props} /></Tab.Pane> },
                { menuItem: this.menuSettingsTxt, render: () => <Tab.Pane></Tab.Pane> },
                { menuItem: this.productSettingsTxt, render: () => <Tab.Pane></Tab.Pane> },
                { menuItem: this.bankAccountSettingsTxt, render: () => <Tab.Pane></Tab.Pane> }
            ]} /* activeIndex={this.state.activeTabIndex} */ onTabChange={this.handleTabChange} />
            // </ContentPanel>
        );
    }
}

export default SettingsPage;
