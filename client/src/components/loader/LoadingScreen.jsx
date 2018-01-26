import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react'

class LoadingScreen extends Component {
    static propTypes = {
        message: PropTypes.string,
    }

    render() {
        return (
            <Dimmer active page>
                <Loader>{this.props.message || 'Loading'}</Loader>
            </Dimmer>
        )
    }
}

export default LoadingScreen;
