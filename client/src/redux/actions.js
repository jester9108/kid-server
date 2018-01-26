/* Modal */
export const SHOW_MODAL = 'SHOW_MODAL';
export function showModal(modalType) {
    return { type: SHOW_MODAL, modalType: modalType };
}

export const HIDE_MODAL = 'HIDE_MODAL';
export function hideModal() {
    return { type: HIDE_MODAL };
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

export const LOGOUT = 'LOGOUT';
export function logout() {
    return function (dispatch) {
        dispatch({ type: LOGOUT });
        localStorage.removeItem('accessToken');
    };
}

export function login(email, password) {
    return function (dispatch) {
        dispatch(loginRequest());
        const formBody = new URLSearchParams({
            username: email,
            password: password,
            grant_type: 'password',
            client_id: null,
            client_secret: null,
        });
        return fetch('/api/store/login', {
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

export function fetchUser() {
    return function (dispatch, getState) {
        dispatch(fetchUserRequest());
        const { accessToken } = getState();
        if (!accessToken) return null;
        return fetch('/api/store/me', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        })
            .then(response => response.json())
            .then((response) => {
                if (response.success) {
                    dispatch(fetchUserSuccess(response.data));
                } else {
                    dispatch(fetchUserFailure(response.message));
                }
            });
    }
}