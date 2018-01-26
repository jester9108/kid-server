// import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers';

import * as ACTION from './actions'

/* Modal reducer */
const initialState = {
    modalType: null,
    isLoading: false,
    loginState: {
        loggedIn: false,
        error: null,
    },
    userData: null,
    error: null,
    accessToken: null,
};
function modalState(state = initialState, action) {
    switch (action.type) {
        case ACTION.SHOW_MODAL:
            return Object.assign({}, state, { modalType: action.modalType });
        case ACTION.HIDE_MODAL:
            return Object.assign({}, state, { modalType: null });
        default:
            return state;
    }
}

/* Login reducer */
function loginState(state = initialState, action) {
    switch (action.type) {
        case ACTION.LOGIN_REQUEST:
            return Object.assign({}, state, { isLoading: true });
        case ACTION.LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isLoading: false,
                loginState: { loggedIn: true, error: null },
                accessToken: action.accessToken,
            });
        case ACTION.LOGIN_FAILURE:
            return Object.assign({}, state, {
                isLoading: false,
                loginState: { loggedIn: false, error: action.error },
                accessToken: null,
            });
        case ACTION.LOGOUT:
            return Object.assign({}, state, {
                isLoading: false,
                loginState: { loggedIn: false, error: null },
                accessToken: null,
                userData: null,
            });
        default:
            return state;
    }
}

/* User reducer */
function userState(state = initialState, action) {
    switch (action.type) {
        case ACTION.FETCH_USER_REQUEST:
            return Object.assign({}, state, { isLoading: true });
        case ACTION.FETCH_USER_SUCCESS:
            return Object.assign({}, state, {
                isLoading: false,
                userData: action.userData,
                error: null,
            });
        case ACTION.FETCH_USER_FAILURE:
            return Object.assign({}, state, {
                isLoading: false,
                userData: null,
                error: action.error,
            });
        default:
            return state;
    }
}

// const rootReducer = combineReducers({
//     modalState,
//     loginState,
//     user,
// })

const rootReducer = reduceReducers(
    modalState,
    loginState,
    userState,
);

export default rootReducer;
