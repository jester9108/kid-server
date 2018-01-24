import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../css/modal.css';

class Modal extends Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element,
            PropTypes.string,
        ]).isRequired,
        onClose: PropTypes.func,
    };

    listenKeyboard(event) {
        if (event.key === 'Escape' || event.keyCode === 27) {
            this.props.onClose();
        }
    }

    componentDidMount() {
        if (this.props.onClose) {
            window.addEventListener('keydown', this.listenKeyboard.bind(this), true);
        }
    }

    componentWillUnmount() {
        if (this.props.onClose) {
            window.removeEventListener('keydown', this.listenKeyboard.bind(this), true);
        }
    }

    onOverlayClick() {
        this.props.onClose();
    }

    onDialogClick(event) {
        event.stopPropagation();
    }

    render() {
        return (
            <div>
                <div className='modal-overlay' />
                <div className='modal-content' onClick={this.onOverlayClick.bind(this)} >
                    <div className='modal-dialog' onClick={this.onDialogClick}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;
