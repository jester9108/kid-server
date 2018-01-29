import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import NavBar from './NavBar.jsx';
import { fetchUser, logout } from '../../redux/actions';

class NavBarContainer extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
        fetchUser: PropTypes.func.isRequired,
        // navigate: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        user: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.actions = {
            // navigate: (target) => props.navigate(target),
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
        activePage: state.activePage,
        isLoggedIn: state.isLoggedIn,
        user: state.userData,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        // navigate: (target) => dispatch(navigate(target)),
        fetchUser: () => dispatch(fetchUser()),
        logout: () => dispatch(logout()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBarContainer);
