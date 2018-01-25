import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Grid, Modal, Message } from 'semantic-ui-react';
import './modal.css';

class ModalWrapper extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        onClose: PropTypes.func.isRequired,
        header: PropTypes.string.isRequired,
        subheader: PropTypes.string,
        message: PropTypes.string,
        submitBtn: PropTypes.element,
    };

    render() {
        const subheader = this.props.subheader ? <Grid.Row centered>{this.props.subheader}</Grid.Row> : null;
        const message = this.props.message ? <Grid.Row centered><Message compact>{this.props.message}</Message></Grid.Row> : null;
        return (
            <Modal size='tiny' open={true} dimmer='blurring' onClose={this.props.onClose} closeIcon>
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

export default ModalWrapper;
