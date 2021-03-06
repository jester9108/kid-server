import { DataTypes } from '../config';

const storeAPI = '/api/store';


/* Navigation */

export const NAVIGATE = 'NAVIGATE';
export function navigate(target) {
    return { type: NAVIGATE, target: target }
}


/* Server request */

export const API_REQUEST = 'API_REQUEST';
export function apiRequest() {
    return { type: API_REQUEST };
}


/* Modal display */

export const SHOW_MODAL = 'SHOW_MODAL';
export function showModal(modalType) {
    return { type: SHOW_MODAL, modalType: modalType };
}

export const HIDE_MODAL = 'HIDE_MODAL';
export function hideModal() {
    return { type: HIDE_MODAL };
}


/* User registration */

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export function registerRequest() {
    return { type: REGISTER_REQUEST };
}

export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export function registerSuccess() {
    return { type: REGISTER_SUCCESS };
}

export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export function registerFailure(error) {
    return { type: REGISTER_FAILURE, error: error };
}

export function register(storeData) {
    return function (dispatch) {

        // Notify server request
        dispatch(registerRequest());

        // Prepare payload
        const payload = new FormData();
        payload.append('email', storeData.email);
        payload.append('password', storeData.password);
        payload.append('passwordConf', storeData.passwordConf);
        payload.append('storeName', storeData.storeName);
        payload.append('adminName', storeData.adminName);
        payload.append('bizRegCert', storeData.bizRegCert);

        // Make request
        return fetch(`${storeAPI}/register`, {
            method: 'POST',
            // Do not include 'Content-Type' header so that browser can fill boundary itself
            headers: { /* 'Content-Type': 'multipart/form-data' */ },
            body: payload,
        })
            .then(response => response.json())
            .then((response) => {
                if (response.success) {
                    dispatch(registerSuccess());
                    dispatch(login(storeData.email, storeData.password));
                } else {
                    dispatch(registerFailure(response.message));
                }
            });
    }
}


/* User login/logout */

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export function loginRequest() {
    return { type: LOGIN_REQUEST };
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export function loginSuccess(accessToken) {
    return { type: LOGIN_SUCCESS, accessToken: accessToken };
}

export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export function loginFailure(error) {
    return { type: LOGIN_FAILURE, error: error };
}

export function login(email, password) {
    return function (dispatch) {

        // Notify server request
        dispatch(loginRequest());

        // Prepare payload
        const formBody = new URLSearchParams({
            username: email,
            password: password,
            grant_type: 'password',
            client_id: null,
            client_secret: null,
        });

        // Make request
        return fetch(`${storeAPI}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: formBody,
        })
            .then(response => response.json())
            .then((response) => {
                if (response.access_token) {
                    dispatch(loginSuccess(response.access_token));
                    localStorage.setItem('accessToken', response.access_token);
                } else {
                    dispatch(loginFailure(response.message));
                }
            });
    }
}

export const LOGOUT = 'LOGOUT';
export function logout() {
    return function (dispatch) {
        dispatch({ type: LOGOUT });
        localStorage.removeItem('accessToken');
    };
}


/* User data */

export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export function fetchUserRequest() {
    return { type: FETCH_USER_REQUEST };
}

export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export function fetchUserSuccess(userData) {
    return { type: FETCH_USER_SUCCESS, userData: userData };
}

export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export function fetchUserFailure(error) {
    return { type: FETCH_USER_FAILURE, error: error };
}

export function fetchUser(accessToken) {
    return function (dispatch, getState) {

        // Notify server request
        dispatch(fetchUserRequest());

        // Get access token
        if (!accessToken) {
            accessToken = getState().accessToken;
        }
        if (!accessToken) return null;

        // Make request
        return fetch(`${storeAPI}/me`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        })
            .then(response => response.json())
            .then((response) => {
                if (response.success) {
                    dispatch(fetchUserSuccess(response.data));
                    dispatch(loginSuccess(accessToken))
                } else {
                    dispatch(fetchUserFailure(response.message));
                    dispatch(logout())
                }
            });
    }
}


/* Reauthentication */

export const REAUTH_REQUEST = 'REAUTH_REQUEST';
export function reauthRequest() {
    return { type: REAUTH_REQUEST };
}

export const REAUTH_SUCCESS = 'REAUTH_SUCCESS';
export function reauthSuccess() {
    return { type: REAUTH_SUCCESS };
}

export const REAUTH_FAILURE = 'REAUTH_FAILURE';
export function reauthFailure(error) {
    return { type: REAUTH_FAILURE, error: error };
}

export function reauth(password) {
    return function (dispatch, getState) {

        // Notify server request
        dispatch(reauthRequest());

        // Get access token
        const { accessToken } = getState();
        if (!accessToken) return null;

        // Make request
        return fetch(`${storeAPI}/me/reauth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ password }),
        })
            .then(response => response.json())
            .then((response) => {
                if (response.success) {
                    dispatch(reauthSuccess());
                } else {
                    dispatch(reauthFailure(response.message));
                }
            });
    }
}


/* Save data */

export const SAVE_REQUIRED = 'SAVE_REQUIRED';
export function requireSave() {
    return { type: SAVE_REQUIRED };
}

export const SAVE_SUCCESS = 'SAVE_SUCCESS';
export function saveSuccess(newUserData) {
    return { type: SAVE_SUCCESS, newUserData: newUserData };
}

export const SAVE_FAILURE = 'SAVE_FAILURE';
export function saveFailure(error) {
    return { type: SAVE_FAILURE, error: error };
}

export function save(newUserData, dataType, files) {
    return function (dispatch, getState) {

        // Get access token
        const { accessToken } = getState();
        if (!accessToken) return null;

        // Prepare payload
        const payload = new FormData();
        let endpoint;
        if (dataType === DataTypes.ADMIN) {
            endpoint = '/admin-setting';
            payload.append('admin', JSON.stringify(newUserData.admin));
        } else if (dataType === DataTypes.STORE) {
            endpoint = '/store-setting';
            payload.append('store', JSON.stringify(newUserData.store));
            files.forEach((file, index) => {
                payload.append(`file_${index}`, file);
            });
        }

        const keys = payload.keys();
        let entry = keys.next();
        while (entry.value) {
            console.log(entry.value + ': ' + JSON.stringify(payload.get(entry.value)));
            entry = keys.next()
        }
        // Make request
        return fetch(`${storeAPI}/me${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                // Do not include 'Content-Type' header so that browser can fill boundary itself
                // 'Content-Type': 'multipart/form-data'
            },
            body: payload,
        })
            .then(response => response.json())
            .then((response) => {
                if (response.success) {
                    dispatch(saveSuccess(newUserData));
                } else {
                    dispatch(saveFailure(response.message));
                }
            });
    }
}


/* Delete account */

export const DELETE_ACC_REQUEST = 'DELETE_ACC_REQUEST';
export function deleteAccRequest() {
    return { type: DELETE_ACC_REQUEST };
}

export const DELETE_ACC_SUCCESS = 'DELETE_ACC_SUCCESS';
export function deleteAccSuccess() {
    return { type: DELETE_ACC_SUCCESS };
}

export const DELETE_ACC_FAILURE = 'DELETE_ACC_FAILURE';
export function deleteAccFailure(error) {
    return { type: DELETE_ACC_FAILURE, error: error };
}

export function deleteAccount() {
    return function (dispatch, getState) {

        // Notify server request
        dispatch(deleteAccRequest());

        console.log('DELETE ACCOUNT ACTION NOTIFIED')
        // // Get access token
        // const { accessToken } = getState();
        // if (!accessToken) return null;

        // // Make request
        // return fetch(`${storeAPI}/me`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${accessToken}`
        //     },
        // })
        //     .then(response => response.json())
        //     .then((response) => {
        //         if (response.success) {
        //             console.log('--ACCOUNT DELETED FROM SERVER--')
        //             // dispatch(logout());
        //             // dispatch(deleteAccSuccess());
        //         } else {
        //             dispatch(deleteAccFailure(response.message));
        //         }
        //     });
    }
}
