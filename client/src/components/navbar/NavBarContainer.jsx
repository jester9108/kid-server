import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import NavBar from './NavBar.jsx';
import { ModalTypes } from '../../config';
import { showModal } from '../../redux/actions';

class NavBarContainer extends Component {
    static propTypes = {
        currentPage: PropTypes.string,
        currentStore: PropTypes.string,
        showModal: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.showLoginModal = this.showLoginModal.bind(this);
    }

    showLoginModal() {
        this.props.showModal(ModalTypes.LOGIN);
    }

    render() {
        console.log(this.props);
        return <NavBar showLoginModal={this.showLoginModal} />;
    }
}

// const mapStateToProps = state => {
//     console.log(state)
//     return {
//         currentPage: state.currentPage,
//         currentStore: state.currentStore,
//         showLoginModal: state.showLoginModal,
//     };
// }

const mapDispatchToProps = dispatch => {
    return { showModal: modalType => dispatch(showModal(modalType)) };
}

export default connect(/* mapStateToProps */null, mapDispatchToProps)(NavBarContainer);
