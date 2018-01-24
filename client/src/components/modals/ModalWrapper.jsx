import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ModalWrapper extends Component {
    static propTypes = {
        // props
        title: PropTypes.string,
        showOk: PropTypes.bool,
        okText: PropTypes.string,
        okDisabled: PropTypes.bool,
        width: PropTypes.number,
        style: PropTypes.object,
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element,
            PropTypes.string,
        ]).isRequired,
        // methods
        hideModal: PropTypes.func,
        onOk: PropTypes.func,
        onClose: PropTypes.func,
    };

    static defaultProps = {
        title: '',
        showOk: true,
        okText: 'OK',
        okDisabled: false,
        width: 400,
        onOk: () => { }
    }

    // constructor(props) {
    //     super(props);
    //     this.okButton = props.showOk
    //         ? (
    //             <button onClick={props.onOk} disabled={props.okDisabled}>{props.okText}</button>
    //         ) : null;
    // }

    // onBackgroundClick(clickEvent) {
    //     if (clickEvent.target === clickEvent.currentTarget) this.props.hideModal();
    // }

    // onOk() {
    //     this.props.onOk();
    //     this.props.hideModal();
    // }

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
            // <div onClick={this.onBackgroundClick}>
            //     <header>
            //         <h1>{this.props.title}</h1>

            //         <button onClick={this.props.hideModal}>Close</button>
            //     </header>

            //     {this.props.children}

            //     {this.okButton}
            // </div>
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

export default ModalWrapper;
