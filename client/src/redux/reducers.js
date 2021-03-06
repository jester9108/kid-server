// import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers';

import * as ACTION from './actions'
import { PageTypes } from '../config';


/* Initial state */

const initialState = {
    activePage: PageTypes.HOME,
    isLoading: false,
    isSaving: false,
    isLoggedIn: false,
    modalState: {
        type: null,
        isReauthed: false,
        error: null,
    },
    userData: null,
    error: null,
    accessToken: null,
};


/* Navigate reducer */

function navigation(state = initialState, action) {
    switch (action.type) {
        case ACTION.NAVIGATE:
            return Object.assign({}, state, { activePage: action.target });
        default:
            return state;
    }
}


/* Modal reducer */

function modalState(state = initialState, action) {
    switch (action.type) {
        case ACTION.SHOW_MODAL:
            return Object.assign({}, state, {
                modalState: {
                    type: action.modalType,
                    isReauthed: false,
                    error: null,
                },
            });
        case ACTION.REAUTH_REQUEST:
            return Object.assign({}, state, { isLoading: true });
        case ACTION.REAUTH_SUCCESS:
            return Object.assign({}, state, {
                isLoading: false,
                modalState: Object.assign({}, state.modalState, { isReauthed: true }),
            });
        case ACTION.REAUTH_FAILURE:
            return Object.assign({}, state, {
                isLoading: false,
                modalState: Object.assign({}, state.modalState, {
                    isReauthed: false,
                    error: action.error,
                }),
            });
        case ACTION.HIDE_MODAL:
            return Object.assign({}, state, {
                modalState: { type: null },
            });
        default:
            return state;
    }
}


/* Register reducer */

function register(state = initialState, action) {
    switch (action.type) {
        case ACTION.REGISTER_REQUEST:
            return Object.assign({}, state, { isLoading: true });
        case ACTION.REGISTER_SUCCESS:
            return Object.assign({}, state, {
                isLoading: false,
                modalState: Object.assign({}, state.modalState, { error: null }),
            });
        case ACTION.REGISTER_FAILURE:
            return Object.assign({}, state, {
                isLoading: false,
                modalState: Object.assign({}, state.modalState, { error: action.error }),
            });
        default:
            return state;
    }
}


/* Login/login reducer */

function login(state = initialState, action) {
    switch (action.type) {
        case ACTION.LOGIN_REQUEST:
            return Object.assign({}, state, { isLoading: true });
        case ACTION.LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isLoading: false,
                isLoggedIn: true,
                modalState: Object.assign({}, state.modalState, { error: null }),
                accessToken: action.accessToken,
            });
        case ACTION.LOGIN_FAILURE:
            return Object.assign({}, state, {
                isLoading: false,
                isLoggedIn: false,
                modalState: Object.assign({}, state.modalState, { error: action.error }),
                accessToken: null,
            });
        case ACTION.LOGOUT:
            return Object.assign({}, state, {
                isLoading: false,
                isLoggedIn: false,
                modalState: Object.assign({}, state.modalState, { error: null }),
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


/* Save reducer */

function save(state = initialState, action) {
    switch (action.type) {
        case ACTION.SAVE_REQUIRED:
            return Object.assign({}, state, { isSaving: true });
        case ACTION.SAVE_SUCCESS:
            return Object.assign({}, state, {
                isSaving: false,
                error: null,
                userData: action.newUserData,
            });
        case ACTION.SAVE_FAILURE:
            return Object.assign({}, state, {
                isSaving: false,
                error: action.error,
            });
        default:
            return state;
    }
}


/* Delete account reducer */

function deleteAccount(state = initialState, action) {
    switch (action.type) {
        case ACTION.DELETE_ACC_REQUEST:
            return Object.assign({}, state, { isLoading: true });
        case ACTION.DELETE_ACC_SUCCESS:
            return Object.assign({}, state, {
                isLoading: false,
                modalState: Object.assign({}, state.modalState, { error: null }),
            });
        case ACTION.DELETE_ACC_FAILURE:
            return Object.assign({}, state, {
                isLoading: false,
                modalState: Object.assign({}, state.modalState, { error: action.error }),
            });
        default:
            return state;
    }
}

const rootReducer = reduceReducers(
    navigation,
    modalState,
    register,
    login,
    userState,
    save,
    deleteAccount,
);

export default rootReducer;
