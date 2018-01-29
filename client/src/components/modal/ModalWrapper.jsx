import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Grid, Modal, Message } from 'semantic-ui-react';
import './modal.css';

class ModalWrapper extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        header: PropTypes.string.isRequired,
        subheader: PropTypes.string,
        message: PropTypes.string,
        submitBtn: PropTypes.element,
        isLoading: PropTypes.bool,
        onClose: PropTypes.func.isRequired,
        size: PropTypes.string.isRequired,
        closeIcon: PropTypes.bool.isRequired,
        closeOnEscape: PropTypes.bool.isRequired,
        closeOnRootNodeClick: PropTypes.bool.isRequired,
        dimmer: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    };

    static defaultProps = {
        size:'tiny',
        closeIcon: true,
        closeOnEscape: true,
        closeOnRootNodeClick: true,
        dimmer: 'blurring',
    };

    render() {
        const subheader = this.props.subheader ? <Grid.Row centered>{this.props.subheader}</Grid.Row> : null;
        const message = this.props.message ? <Grid.Row centered><Message className='modal-message' compact negative>{this.props.message}</Message></Grid.Row> : null;
        if (this.props.isLoading) {
            return null;
        } else {
            return (
                <Modal
                    size={this.props.size}
                    open={true}
                    dimmer={this.props.dimmer}
                    onClose={this.props.onClose}
                    closeIcon={this.props.closeIcon}
                    closeOnEscape={this.props.closeOnEscape}
                    closeOnRootNodeClick={this.props.closeOnRootNodeClick}
                >
                    <Modal.Header id='modal-header'>{this.props.header}</Modal.Header>
                    <Modal.Content id='modal-content'>
                        <Grid>
                            {subheader}
                            {message}
                            <Grid.Row centered>
                                <Grid.Column width={16}>
                                    {this.props.children}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <Grid>
                            <Grid.Column width={3} />
                            <Grid.Column width={10}>{this.props.submitBtn}</Grid.Column>
                            <Grid.Column width={3} />
                        </Grid>
                    </Modal.Actions>
                </Modal>
            );
        }
    }
}

export default ModalWrapper;
