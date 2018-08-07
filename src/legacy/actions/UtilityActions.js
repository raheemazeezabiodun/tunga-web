import axios from 'axios';
import {
    ENDPOINT_CONTACT_REQUEST,
    ENDPOINT_MEDIUM,
    OFFER_ITEM_NAMES,
} from '../constants/Api';

import {
    sendGAEvent,
    GA_EVENT_CATEGORIES,
    GA_EVENT_ACTIONS,
    GA_EVENT_LABELS,
} from '../utils/tracking';

export const CLEAR_VALIDATIONS = 'CLEAR_VALIDATIONS';
export const SEND_CONTACT_REQUEST_START = 'SEND_CONTACT_REQUEST_START';
export const SEND_CONTACT_REQUEST_SUCCESS = 'SEND_CONTACT_REQUEST_SUCCESS';
export const SEND_CONTACT_REQUEST_FAILED = 'SEND_CONTACT_REQUEST_FAILED';
export const GET_MEDIUM_POSTS_START = 'GET_MEDIUM_POSTS_START';
export const GET_MEDIUM_POSTS_SUCCESS = 'GET_MEDIUM_POSTS_SUCCESS';
export const GET_MEDIUM_POSTS_FAILED = 'GET_MEDIUM_POSTS_FAILED';

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
    if (data.item) {
        sendGAEvent(
            GA_EVENT_CATEGORIES.CONTACT,
            GA_EVENT_ACTIONS.REQUEST_OFFER,
            OFFER_ITEM_NAMES[data.item],
        );
    }

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
