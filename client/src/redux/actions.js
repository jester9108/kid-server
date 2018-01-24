
/* Action types */
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const GET_USER = 'GET_USER';
export const SET_USER = 'SET_USER';

/* Action creators */
export function showModal(modalType) {
    return { type: SHOW_MODAL, modalType: modalType };
}

export function hideModal() {
    return { type: HIDE_MODAL };
}

export function getUser() {
    return { type: GET_USER };
}

export function setUser(user) {
    return { type: SET_USER, user: user };
}
