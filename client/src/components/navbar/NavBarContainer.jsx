import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import NavBar from './NavBar.jsx';
import { ModalTypes } from '../../config';
import { logout, showModal, fetchUser } from '../../redux/actions';

class NavBarContainer extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        showModal: PropTypes.func.isRequired,
        loginState: PropTypes.object.isRequired,
        fetchUser: PropTypes.func.isRequired,
        user: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.actions = {
            showLoginModal: () => props.showModal(ModalTypes.LOGIN),
            logout: () => props.logout(),
        }
    }

    componentDidMount() {
        this.componentDidUpdate({ loginState: {} });
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.loginState.loggedIn && this.props.loginState.loggedIn) {
            this.props.fetchUser();
        }
    }

    render() {
        return <NavBar path={this.props.location.pathname} user={this.props.user} {...this.actions} />;
    }
}

const mapStateToProps = state => {
    return {
        loginState: state.loginState,
        user: state.userData,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout()),
        showModal: modalType => dispatch(showModal(modalType)),
        fetchUser: () => dispatch(fetchUser()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBarContainer);
