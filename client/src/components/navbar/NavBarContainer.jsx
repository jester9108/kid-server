import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import NavBar from './NavBar.jsx';
import { logout, fetchUser } from '../../redux/actions';

class NavBarContainer extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        // showModal: PropTypes.func.isRequired,
        fetchUser: PropTypes.func.isRequired,
        user: PropTypes.object,
        isLoggedIn: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.actions = {
            // showLoginModal: () => props.showModal(ModalTypes.LOGIN),
            logout: () => props.logout(),
        }
    }

    componentDidMount() {
        this.componentDidUpdate({ isLoggedIn: false });
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
            this.props.fetchUser();
        }
    }

    render() {
        return <NavBar path={this.props.location.pathname} user={this.props.user} {...this.actions} />;
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn,
        user: state.userData,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout()),
        // showModal: modalType => dispatch(showModal(modalType)),
        fetchUser: () => dispatch(fetchUser()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBarContainer);
