import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoadingScreen from './LoadingScreen.jsx';

class LoaderContainer extends Component {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        message: PropTypes.string,
    }

    render() {
        if (this.props.isLoading) {
            // console.log('LOADING');
            return <LoadingScreen message={this.props.message} />
        } else {
            // console.log('NOT LOADING');
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.isLoading,
        message: state.loadingMsg,
    }
};

export default connect(mapStateToProps)(LoaderContainer);
