import axios from 'axios';
import {ENDPOINT_QUOTE} from '../constants/Api';

import {
    sendGAEvent,
    GA_EVENT_CATEGORIES,
    GA_EVENT_ACTIONS,
    getGAUserType,
} from '../utils/tracking';
import {getUser} from '../utils/auth';

export const CREATE_QUOTE_START = 'CREATE_QUOTE_START';
export const CREATE_QUOTE_SUCCESS = 'CREATE_QUOTE_SUCCESS';
export const CREATE_QUOTE_FAILED = 'CREATE_QUOTE_FAILED';
export const LIST_QUOTES_START = 'LIST_QUOTES_START';
export const LIST_QUOTES_SUCCESS = 'LIST_QUOTES_SUCCESS';
export const LIST_QUOTES_FAILED = 'LIST_QUOTES_FAILED';
export const RETRIEVE_QUOTE_START = 'RETRIEVE_QUOTE_START';
export const RETRIEVE_QUOTE_SUCCESS = 'RETRIEVE_QUOTE_SUCCESS';
export const RETRIEVE_QUOTE_FAILED = 'RETRIEVE_QUOTE_FAILED';
export const UPDATE_QUOTE_START = 'UPDATE_QUOTE_START';
export const UPDATE_QUOTE_SUCCESS = 'UPDATE_QUOTE_SUCCESS';
export const UPDATE_QUOTE_FAILED = 'UPDATE_QUOTE_FAILED';
export const DELETE_QUOTE_START = 'DELETE_QUOTE_START';
export const DELETE_QUOTE_SUCCESS = 'DELETE_QUOTE_SUCCESS';
export const DELETE_QUOTE_FAILED = 'DELETE_QUOTE_FAILED';
export const LIST_MORE_QUOTES_START = 'LIST_MORE_QUOTES_START';
export const LIST_MORE_QUOTES_SUCCESS = 'LIST_MORE_QUOTES_SUCCESS';
export const LIST_MORE_QUOTES_FAILED = 'LIST_MORE_QUOTES_FAILED';

export function createQuote(quote, errors = null) {
    return dispatch => {
        dispatch(createQuoteStart(quote));
        if (errors) {
            return dispatch(createQuoteFailed(errors));
        }
        axios
            .post(ENDPOINT_QUOTE, quote)
            .then(function(response) {
                dispatch(createQuoteSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createQuoteFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createQuoteStart(quote) {
    return {
        type: CREATE_QUOTE_START,
        quote,
    };
}

export function createQuoteSuccess(quote) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.TASK,
        GA_EVENT_ACTIONS.APPLY,
        getGAUserType(getUser()),
    );
    return {
        type: CREATE_QUOTE_SUCCESS,
        quote,
    };
}

export function createQuoteFailed(error) {
    return {
        type: CREATE_QUOTE_FAILED,
        error,
    };
}

export function listQuotes(filter) {
    return dispatch => {
        dispatch(listQuotesStart(filter));
        axios
            .get(ENDPOINT_QUOTE, {params: filter})
            .then(function(response) {
                dispatch(listQuotesSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    listQuotesFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listQuotesStart(filter) {
    return {
        type: LIST_QUOTES_START,
        filter,
    };
}

export function listQuotesSuccess(response) {
    return {
        type: LIST_QUOTES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
    };
}

export function listQuotesFailed(error) {
    return {
        type: LIST_QUOTES_FAILED,
        error,
    };
}

export function retrieveQuote(id) {
    return dispatch => {
        dispatch(retrieveQuoteStart(id));
        axios
            .get(ENDPOINT_QUOTE + id + '/')
            .then(function(response) {
                dispatch(retrieveQuoteSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveQuoteFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveQuoteStart(id) {
    return {
        type: RETRIEVE_QUOTE_START,
        id,
    };
}

export function retrieveQuoteSuccess(quote) {
    return {
        type: RETRIEVE_QUOTE_SUCCESS,
        quote,
    };
}

export function retrieveQuoteFailed(error) {
    return {
        type: RETRIEVE_QUOTE_FAILED,
        error,
    };
}

export function updateQuote(id, data) {
    return dispatch => {
        dispatch(updateQuoteStart(id));
        axios
            .patch(ENDPOINT_QUOTE + id + '/', data)
            .then(function(response) {
                dispatch(updateQuoteSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateQuoteFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateQuoteStart(id) {
    return {
        type: UPDATE_QUOTE_START,
        id,
    };
}

export function updateQuoteSuccess(quote) {
    return {
        type: UPDATE_QUOTE_SUCCESS,
        quote,
    };
}

export function updateQuoteFailed(error) {
    return {
        type: UPDATE_QUOTE_FAILED,
        error,
    };
}

export function deleteQuote(id) {
    return dispatch => {
        dispatch(deleteQuoteStart(id));
        axios
            .delete(ENDPOINT_QUOTE + id + '/', {})
            .then(function() {
                dispatch(deleteQuoteSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteQuoteFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteQuoteStart(id) {
    return {
        type: DELETE_QUOTE_START,
        id,
    };
}

export function deleteQuoteSuccess(id) {
    return {
        type: DELETE_QUOTE_SUCCESS,
        id,
    };
}

export function deleteQuoteFailed(error) {
    return {
        type: DELETE_QUOTE_FAILED,
        error,
    };
}
