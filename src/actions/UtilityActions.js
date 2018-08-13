import axios from 'axios';
import {
    ENDPOINT_CONTACT_REQUEST,
    ENDPOINT_MEDIUM,
    ENDPOINT_MIGRATE
} from '../actions/utils/api';
import {composeFormData, ENDPOINT_INVITE_REQUEST} from "./utils/api";


export const CLEAR_VALIDATIONS = 'CLEAR_VALIDATIONS';
export const SEND_CONTACT_REQUEST_START = 'SEND_CONTACT_REQUEST_START';
export const SEND_CONTACT_REQUEST_SUCCESS = 'SEND_CONTACT_REQUEST_SUCCESS';
export const SEND_CONTACT_REQUEST_FAILED = 'SEND_CONTACT_REQUEST_FAILED';
export const SEND_INVITE_REQUEST_START = 'SEND_INVITE_REQUEST_START';
export const SEND_INVITE_REQUEST_SUCCESS = 'SEND_INVITE_REQUEST_SUCCESS';
export const SEND_INVITE_REQUEST_FAILED = 'SEND_INVITE_REQUEST_FAILED';
export const GET_MEDIUM_POSTS_START = 'GET_MEDIUM_POSTS_START';
export const GET_MEDIUM_POSTS_SUCCESS = 'GET_MEDIUM_POSTS_SUCCESS';
export const GET_MEDIUM_POSTS_FAILED = 'GET_MEDIUM_POSTS_FAILED';
export const FIND_REPLACEMENT_START = 'FIND_REPLACEMENT_START';
export const FIND_REPLACEMENT_SUCCESS = 'FIND_REPLACEMENT_SUCCESS';
export const FIND_REPLACEMENT_FAILED = 'FIND_REPLACEMENT_FAILED';

export function clearValidations() {
    return {
        type: CLEAR_VALIDATIONS,
    };
}

export function sendContactRequest(data) {
    return dispatch => {
        dispatch(sendContactRequestStart(data));
        axios
            .post(ENDPOINT_CONTACT_REQUEST, data)
            .then(function(response) {
                dispatch(sendContactRequestSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    sendContactRequestFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function sendContactRequestStart(data) {
    return {
        type: SEND_CONTACT_REQUEST_START,
        data,
    };
}

export function sendContactRequestSuccess(data) {
    return {
        type: SEND_CONTACT_REQUEST_SUCCESS,
        data,
    };
}

export function sendContactRequestFailed(error) {
    return {
        type: SEND_CONTACT_REQUEST_FAILED,
        error,
    };
}

export function sendInviteRequest(data) {
    return dispatch => {
        dispatch(sendInviteRequestStart(data));

        let headers = {};

        if (data.cv) {
            headers['Content-Type'] = 'multipart/form-data';
            data = composeFormData(data);
        }

        axios
            .post(ENDPOINT_INVITE_REQUEST, data, {headers})
            .then(function(response) {
                dispatch(sendInviteRequestSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    sendInviteRequestFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function sendInviteRequestStart(data) {
    return {
        type: SEND_INVITE_REQUEST_START,
        data,
    };
}

export function sendInviteRequestSuccess(data) {
    return {
        type: SEND_INVITE_REQUEST_SUCCESS,
        data,
    };
}

export function sendInviteRequestFailed(error) {
    return {
        type: SEND_INVITE_REQUEST_FAILED,
        error,
    };
}

export function getMediumPosts() {
    return dispatch => {
        dispatch(getMediumPostsStart());
        axios
            .get(ENDPOINT_MEDIUM)
            .then(function(response) {
                dispatch(getMediumPostsSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    getMediumPostsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function getMediumPostsStart() {
    return {
        type: GET_MEDIUM_POSTS_START,
    };
}

export function getMediumPostsSuccess(posts) {
    return {
        type: GET_MEDIUM_POSTS_SUCCESS,
        posts,
    };
}

export function getMediumPostsFailed(error) {
    return {
        type: GET_MEDIUM_POSTS_FAILED,
        error,
    };
}

export function findReplacement(model, id) {
    return dispatch => {
        dispatch(findReplacementStart(model, id));
        axios
            .get(ENDPOINT_MIGRATE + `${model}/${id}/`)
            .then(function(response) {
                dispatch(findReplacementSuccess(response.data, model, id));
            })
            .catch(function(error) {
                dispatch(
                    findReplacementFailed(
                        error.response ? error.response.data : null, model, id
                    ),
                );
            });
    };
}

export function findReplacementStart(model, id) {
    return {
        type: FIND_REPLACEMENT_START,
        model,
        id,
    };
}

export function findReplacementSuccess(replacement, model, id) {
    return {
        type: FIND_REPLACEMENT_SUCCESS,
        replacement,
        model,
        id
    };
}

export function findReplacementFailed(error, model, id) {
    return {
        type: FIND_REPLACEMENT_FAILED,
        error,
        model,
        id
    };
}
