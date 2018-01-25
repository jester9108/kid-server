import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './modal.css';

class Modal extends Component {
    static propTypes = {
        children: PropTypes.arrayOf(PropTypes.element).isRequired,
        onClose: PropTypes.func.isRequired,
        isForm: PropTypes.bool,
        header: PropTypes.string.isRequired,
        subheader: PropTypes.string,
        description: PropTypes.string,
        submitText: PropTypes.string.isRequired,
    };

    constructor(props){
        super(props);
        this.onOverlayClick = this.onOverlayClick.bind(this);
        this.listenKeyboard = this.listenKeyboard.bind(this);
    }

    listenKeyboard(event) {
        if (event.key === 'Escape' || event.keyCode === 27) {
            this.props.onClose();
        }
    }

    componentDidMount() {
        if (this.props.onClose) {
            window.addEventListener('keydown', this.listenKeyboard, true);
        }
    }

    componentWillUnmount() {
        if (this.props.onClose) {
            window.removeEventListener('keydown', this.listenKeyboard, true);
        }
    }

    onOverlayClick() {
        this.props.onClose();
    }

    onDialogClick(event) {
        event.stopPropagation();
    }

    render() {
        console.log(this.props) 
        const ContentTag = this.props.isForm ? 'form' : 'div';
        return (
            <div>
                <div className='modal-overlay' onClick={this.onOverlayClick} >
                    <div className='modal-dialog' onClick={this.onDialogClick}>
                        <span id='modal-close' className='fa fa-close' onClick={this.onOverlayClick}></span>
                        <div id='modal-content'>
                            <div id='modal-header' className='row'>{this.props.header}</div>
                            <div id='modal-subheader' className='row'>{this.props.subheader}</div>
                            <div id='modal-description' className='row'>{this.props.description}</div>
                            <ContentTag className='modal-children'>
                                {this.props.children}
                                <input type='submit' id='submit' hidden />
                            </ContentTag>
                            <div id='modal-footer' className='row'>
                                <label id='modal-submit' htmlFor='submit' tabIndex='0'>{this.props.submitText}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Modal;
