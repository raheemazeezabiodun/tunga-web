import axios from 'axios';
import {ENDPOINT_ESTIMATE} from '../constants/Api';

import {
    sendGAEvent,
    GA_EVENT_CATEGORIES,
    GA_EVENT_ACTIONS,
    getGAUserType,
} from '../utils/tracking';
import {getUser} from '../utils/auth';

export const CREATE_ESTIMATE_START = 'CREATE_ESTIMATE_START';
export const CREATE_ESTIMATE_SUCCESS = 'CREATE_ESTIMATE_SUCCESS';
export const CREATE_ESTIMATE_FAILED = 'CREATE_ESTIMATE_FAILED';
export const LIST_ESTIMATES_START = 'LIST_ESTIMATES_START';
export const LIST_ESTIMATES_SUCCESS = 'LIST_ESTIMATES_SUCCESS';
export const LIST_ESTIMATES_FAILED = 'LIST_ESTIMATES_FAILED';
export const RETRIEVE_ESTIMATE_START = 'RETRIEVE_ESTIMATE_START';
export const RETRIEVE_ESTIMATE_SUCCESS = 'RETRIEVE_ESTIMATE_SUCCESS';
export const RETRIEVE_ESTIMATE_FAILED = 'RETRIEVE_ESTIMATE_FAILED';
export const UPDATE_ESTIMATE_START = 'UPDATE_ESTIMATE_START';
export const UPDATE_ESTIMATE_SUCCESS = 'UPDATE_ESTIMATE_SUCCESS';
export const UPDATE_ESTIMATE_FAILED = 'UPDATE_ESTIMATE_FAILED';
export const DELETE_ESTIMATE_START = 'DELETE_ESTIMATE_START';
export const DELETE_ESTIMATE_SUCCESS = 'DELETE_ESTIMATE_SUCCESS';
export const DELETE_ESTIMATE_FAILED = 'DELETE_ESTIMATE_FAILED';
export const LIST_MORE_ESTIMATES_START = 'LIST_MORE_ESTIMATES_START';
export const LIST_MORE_ESTIMATES_SUCCESS = 'LIST_MORE_ESTIMATES_SUCCESS';
export const LIST_MORE_ESTIMATES_FAILED = 'LIST_MORE_ESTIMATES_FAILED';

export function createEstimate(estimate, errors = null) {
    return dispatch => {
        dispatch(createEstimateStart(estimate));
        if (errors) {
            return dispatch(createEstimateFailed(errors));
        }
        axios
            .post(ENDPOINT_ESTIMATE, estimate)
            .then(function(response) {
                dispatch(createEstimateSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    createEstimateFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function createEstimateStart(estimate) {
    return {
        type: CREATE_ESTIMATE_START,
        estimate,
    };
}

export function createEstimateSuccess(estimate) {
    sendGAEvent(
        GA_EVENT_CATEGORIES.TASK,
        GA_EVENT_ACTIONS.APPLY,
        getGAUserType(getUser()),
    );
    return {
        type: CREATE_ESTIMATE_SUCCESS,
        estimate,
    };
}

export function createEstimateFailed(error) {
    return {
        type: CREATE_ESTIMATE_FAILED,
        error,
    };
}

export function listEstimates(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listEstimatesStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_ESTIMATE, {params: filter})
            .then(function(response) {
                dispatch(listEstimatesSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listEstimatesFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listEstimatesStart(filter, selection, prev_selection) {
    return {
        type: LIST_ESTIMATES_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listEstimatesSuccess(response, selection) {
    return {
        type: LIST_ESTIMATES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listEstimatesFailed(error, selection) {
    return {
        type: LIST_ESTIMATES_FAILED,
        error,
        selection,
    };
}

export function retrieveEstimate(id) {
    return dispatch => {
        dispatch(retrieveEstimateStart(id));
        axios
            .get(ENDPOINT_ESTIMATE + id + '/')
            .then(function(response) {
                dispatch(retrieveEstimateSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveEstimateFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveEstimateStart(id) {
    return {
        type: RETRIEVE_ESTIMATE_START,
        id,
    };
}

export function retrieveEstimateSuccess(estimate) {
    return {
        type: RETRIEVE_ESTIMATE_SUCCESS,
        estimate,
    };
}

export function retrieveEstimateFailed(error) {
    return {
        type: RETRIEVE_ESTIMATE_FAILED,
        error,
    };
}

export function updateEstimate(id, data) {
    return dispatch => {
        dispatch(updateEstimateStart(id));
        axios
            .patch(ENDPOINT_ESTIMATE + id + '/', data)
            .then(function(response) {
                dispatch(updateEstimateSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    updateEstimateFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function updateEstimateStart(id) {
    return {
        type: UPDATE_ESTIMATE_START,
        id,
    };
}

export function updateEstimateSuccess(estimate) {
    return {
        type: UPDATE_ESTIMATE_SUCCESS,
        estimate,
    };
}

export function updateEstimateFailed(error) {
    return {
        type: UPDATE_ESTIMATE_FAILED,
        error,
    };
}

export function deleteEstimate(id) {
    return dispatch => {
        dispatch(deleteEstimateStart(id));
        axios
            .delete(ENDPOINT_ESTIMATE + id + '/', {})
            .then(function() {
                dispatch(deleteEstimateSuccess(id));
            })
            .catch(function(error) {
                dispatch(
                    deleteEstimateFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function deleteEstimateStart(id) {
    return {
        type: DELETE_ESTIMATE_START,
        id,
    };
}

export function deleteEstimateSuccess(id) {
    return {
        type: DELETE_ESTIMATE_SUCCESS,
        id,
    };
}

export function deleteEstimateFailed(error) {
    return {
        type: DELETE_ESTIMATE_FAILED,
        error,
    };
}
