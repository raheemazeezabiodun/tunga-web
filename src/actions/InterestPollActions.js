import axios from 'axios';
import {ENDPOINT_INTEREST_POLL} from './utils/api';

export const CREATE_INTEREST_POLL_START = 'CREATE_INTEREST_POLL_START';
export const CREATE_INTEREST_POLL_SUCCESS = 'CREATE_INTEREST_POLL_SUCCESS';
export const CREATE_INTEREST_POLL_FAILED = 'CREATE_INTEREST_POLL_FAILED';
export const UPDATE_INTEREST_POLL_START = 'UPDATE_INTEREST_POLL_START';
export const UPDATE_INTEREST_POLL_SUCCESS = 'UPDATE_INTEREST_POLL_SUCCESS';
export const UPDATE_INTEREST_POLL_FAILED = 'UPDATE_INTEREST_POLL_FAILED';
export const LIST_INTEREST_POLL_START = 'LIST_INTEREST_POLL_START';
export const LIST_INTEREST_POLL_SUCCESS = 'LIST_INTEREST_POLL_SUCCESS';
export const LIST_INTEREST_POLL_FAILED = 'LIST_INTEREST_POLL_FAILED';
export const RETRIEVE_INTEREST_POLL_START = 'RETRIEVE_INTEREST_POLL_START';
export const RETRIEVE_INTEREST_POLL_SUCCESS = 'RETRIEVE_INTEREST_POLL_SUCCESS';
export const RETRIEVE_INTEREST_POLL_FAILED = 'RETRIEVE_INTEREST_POLL_FAILED';
export const LIST_MORE_INTEREST_POLL_START = 'LIST_MORE_INTEREST_POLL_START';
export const LIST_MORE_INTEREST_POLL_SUCCESS = 'LIST_MORE_INTEREST_POLL_SUCCESS';
export const LIST_MORE_INTEREST_POLL_FAILED = 'LIST_MORE_INTEREST_POLL_FAILED';

export function createInterest(interest, target) {
    return dispatch => {
        dispatch(createInterestStart(interest, target));

        let headers = {};

        axios
            .post(ENDPOINT_INTEREST_POLL, interest, {headers})
            .then(function(response) {
                dispatch(createInterestSuccess(response.data, target));
            })
            .catch(function(error) {
                dispatch(
                    createInterestFailure(
                        (error.response ? error.response.data : null), interest, target
                    ),
                );
            });
    };
}

export function createInterestStart(interest, target) {
    return {
        type: CREATE_INTEREST_POLL_START,
        interest,
        target
    };
}

export function createInterestSuccess(interest, target) {
    return {
        type: CREATE_INTEREST_POLL_SUCCESS,
        interest,
        target
    };
}

export function createInterestFailure(error, interest, target) {
    return {
        type: CREATE_INTEREST_POLL_FAILED,
        error,
        interest,
        target
    };
}

export function updateInterest(id, interest) {
    return dispatch => {
        dispatch(updateInterestStart(id, interest, id));

        let headers = {};

        axios
            .patch(ENDPOINT_INTEREST_POLL + id + '/', interest, {
                headers: {...headers},
            })
            .then(function(response) {
                dispatch(updateInterestSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    updateInterestFailure(
                        (error.response ? error.response.data : null), interest, id
                    ),
                );
            });
    };
}

export function updateInterestStart(id, interest, target) {
    return {
        type: UPDATE_INTEREST_POLL_START,
        id,
        interest,
        target
    };
}

export function updateInterestSuccess(interest, target) {
    return {
        type: UPDATE_INTEREST_POLL_SUCCESS,
        interest,
        target
    };
}

export function updateInterestFailure(error, interest, target) {
    return {
        type: UPDATE_INTEREST_POLL_FAILED,
        error,
        interest,
        target
    };
}

export function listInterest(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listInterestStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_INTEREST_POLL, {params: filter})
            .then(function(response) {
                dispatch(listInterestSuccess(response.data, filter, selection));
            })
            .catch(function(error) {
                dispatch(
                    listInterestFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listInterestStart(filter, selection, prev_selection) {
    return {
        type: LIST_INTEREST_POLL_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listInterestSuccess(response, filter, selection) {
    return {
        type: LIST_INTEREST_POLL_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listInterestFailed(error, selection) {
    return {
        type: LIST_INTEREST_POLL_FAILED,
        error,
        selection,
    };
}

export function retrieveInterest(id) {
    return dispatch => {
        dispatch(retrieveInterestStart(id));
        axios
            .get(ENDPOINT_INTEREST_POLL + id + '/')
            .then(function(response) {
                dispatch(retrieveInterestSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    retrieveInterestFailed(
                        error.response ? error.response.data : null, id
                    ),
                );
            });
    };
}

export function retrieveInterestStart(id) {
    return {
        type: RETRIEVE_INTEREST_POLL_START,
        id,
    };
}

export function retrieveInterestSuccess(interest, id) {
    return {
        type: RETRIEVE_INTEREST_POLL_SUCCESS,
        interest,
        id
    };
}

export function retrieveInterestFailed(error, id) {
    return {
        type: RETRIEVE_INTEREST_POLL_FAILED,
        error,
        id
    };
}

export function listMoreInterest(url, selection) {
    return dispatch => {
        dispatch(listMoreInterestStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreInterestSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreInterestFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreInterestStart(url, selection) {
    return {
        type: LIST_MORE_INTEREST_POLL_START,
        url,
        selection,
    };
}

export function listMoreInterestSuccess(response, selection) {
    return {
        type: LIST_MORE_INTEREST_POLL_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreInterestFailed(error) {
    return {
        type: LIST_MORE_INTEREST_POLL_FAILED,
        error,
    };
}
