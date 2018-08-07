import axios from 'axios';
import {ENDPOINT_USER} from '../constants/Api';

export const LIST_USERS_START = 'LIST_USERS_START';
export const LIST_USERS_SUCCESS = 'LIST_USERS_SUCCESS';
export const LIST_USERS_FAILED = 'LIST_USERS_FAILED';
export const RETRIEVE_USER_START = 'RETRIEVE_USER_START';
export const RETRIEVE_USER_SUCCESS = 'RETRIEVE_USER_SUCCESS';
export const RETRIEVE_USER_FAILED = 'RETRIEVE_USER_FAILED';
export const UPDATE_USER_START = 'UPDATE_USER_START';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILED = 'UPDATE_USER_FAILED';
export const LIST_MORE_USERS_START = 'LIST_MORE_USERS_START';
export const LIST_MORE_USERS_SUCCESS = 'LIST_MORE_USERS_SUCCESS';
export const LIST_MORE_USERS_FAILED = 'LIST_MORE_USERS_FAILED';

export function listUsers(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listUsersStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_USER, {params: filter})
            .then(function(response) {
                dispatch(listUsersSuccess(response.data, filter, selection));
            })
            .catch(function(error) {
                dispatch(
                    listUsersFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listUsersStart(filter, selection, prev_selection) {
    return {
        type: LIST_USERS_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listUsersSuccess(response, filter, selection) {
    return {
        type: LIST_USERS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listUsersFailed(error, selection) {
    return {
        type: LIST_USERS_FAILED,
        error,
        selection,
    };
}

export function retrieveUser(id) {
    return dispatch => {
        dispatch(retrieveUserStart(id));
        axios
            .get(ENDPOINT_USER + id + '/')
            .then(function(response) {
                dispatch(retrieveUserSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveUserFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveUserStart(id) {
    return {
        type: RETRIEVE_USER_START,
        id,
    };
}

export function retrieveUserSuccess(user) {
    return {
        type: RETRIEVE_USER_SUCCESS,
        user,
    };
}

export function retrieveUserFailed(error) {
    return {
        type: RETRIEVE_USER_FAILED,
        error,
    };
}

export function updateUser(id, data) {
    return dispatch => {
        dispatch(updateUserStart(id));
        axios
            .patch(ENDPOINT_USER + id + '/', data)
            .then(function(response) {
                dispatch(updateUserSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateUserFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateUserStart(id) {
    return {
        type: UPDATE_USER_START,
        id,
    };
}

export function updateUserSuccess(user) {
    return {
        type: UPDATE_USER_SUCCESS,
        user,
    };
}

export function updateUserFailed(error) {
    return {
        type: UPDATE_USER_FAILED,
        error,
    };
}

export function listMoreUsers(url, selection) {
    return dispatch => {
        dispatch(listMoreUsersStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreUsersSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreUsersFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreUsersStart(url, selection) {
    return {
        type: LIST_MORE_USERS_START,
        url,
        selection,
    };
}

export function listMoreUsersSuccess(response, selection) {
    return {
        type: LIST_MORE_USERS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreUsersFailed(error) {
    return {
        type: LIST_MORE_USERS_FAILED,
        error,
    };
}
