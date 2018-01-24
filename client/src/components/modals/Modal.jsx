import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LoginModal from './LoginModal.jsx';

// const Modal = props => {
//     switch (props.currentModal) {
//         case 'EXPORT_DATA':
//             return <ExportDataModal {...props} />;

//         case 'SOCIAL_SIGN_IN':
//             return <LoginModal {...props} />;

//         case 'FEEDBACK':
//             return <FeedbackModal {...props} />;

//         case 'EDIT_BOX':
//             return <BoxDetailsModal {...props} />;

//         default:
//             return null;
//     }
// };

class Modal extends Component {
    static propTypes = {
        currentModal: PropTypes.string,
    };

    render() {
        switch (this.props.currentModal) {
            case 'LOGIN':
                return <LoginModal {...this.props} />;

            default:
                return null;
        }
    }
}

export default Modal;
