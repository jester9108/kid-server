import { combineReducers } from 'redux'

import {
    SHOW_MODAL,
    HIDE_MODAL,
    GET_USER,
    SET_USER,
} from './actions'

/* Initial modal state */
const initialModalState = {
    modalType: null,
};

/* Modal reducer */
function modalDisplay(state = initialModalState, action) {
    switch (action.type) {
        case SHOW_MODAL:
            return Object.assign({}, state, { modalType: action.modalType });
        case HIDE_MODAL:
            return initialModalState;
        default:
            return state;
    }
}

/* Page reducer */
// function page(state = null, action) {
//     switch (action.type) {
//         case SHOW_MODAL:
//             return Object.assign({}.state, { modalType: action.modalType });
//         case HIDE_MODAL:
//             return initialModalState;
//         default:
//             return state;
//     }
// }

/* User reducer */
function user(state = null, action) {
    switch (action.type) {
        case GET_USER:
            return 'Playground';
        case SET_USER:
            return null;
        default:
            return state;
    }
}

const kidApp = combineReducers({
    modalDisplay,
    user,
    // page,
})

export default kidApp;
