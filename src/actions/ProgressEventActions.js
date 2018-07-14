import axios from 'axios';
import {ENDPOINT_PROGRESS_EVENTS} from './utils/api';

export const CREATE_PROGRESS_EVENT_START = 'CREATE_PROGRESS_EVENT_START';
export const CREATE_PROGRESS_EVENT_SUCCESS = 'CREATE_PROGRESS_EVENT_SUCCESS';
export const CREATE_PROGRESS_EVENT_FAILED = 'CREATE_PROGRESS_EVENT_FAILED';
export const LIST_PROGRESS_EVENTS_START = 'LIST_PROGRESS_EVENTS_START';
export const LIST_PROGRESS_EVENTS_SUCCESS = 'LIST_PROGRESS_EVENTS_SUCCESS';
export const LIST_PROGRESS_EVENTS_FAILED = 'LIST_PROGRESS_EVENTS_FAILED';
export const RETRIEVE_PROGRESS_EVENT_START = 'RETRIEVE_PROGRESS_EVENT_START';
export const RETRIEVE_PROGRESS_EVENT_SUCCESS = 'RETRIEVE_PROGRESS_EVENT_SUCCESS';
export const RETRIEVE_PROGRESS_EVENT_FAILED = 'RETRIEVE_PROGRESS_EVENT_FAILED';
export const UPDATE_PROGRESS_EVENT_START = 'UPDATE_PROGRESS_EVENT_START';
export const UPDATE_PROGRESS_EVENT_SUCCESS = 'UPDATE_PROGRESS_EVENT_SUCCESS';
export const UPDATE_PROGRESS_EVENT_FAILED = 'UPDATE_PROGRESS_EVENT_FAILED';
export const LIST_MORE_PROGRESS_EVENTS_START = 'LIST_MORE_PROGRESS_EVENTS_START';
export const LIST_MORE_PROGRESS_EVENTS_SUCCESS = 'LIST_MORE_PROGRESS_EVENTS_SUCCESS';
export const LIST_MORE_PROGRESS_EVENTS_FAILED = 'LIST_MORE_PROGRESS_EVENTS_FAILED';
export const DELETE_PROGRESS_EVENT_START = 'DELETE_PROGRESS_EVENT_START';
export const DELETE_PROGRESS_EVENT_SUCCESS = 'DELETE_PROGRESS_EVENT_SUCCESS';
export const DELETE_PROGRESS_EVENT_FAILED = 'DELETE_PROGRESS_EVENT_FAILED';

export function createProgressEvent(progress_event, target) {
    return dispatch => {
        dispatch(createProgressEventStart(progress_event, target));

        let headers = {};

        axios
            .post(ENDPOINT_PROGRESS_EVENTS, progress_event, {headers})
            .then(function(response) {
                dispatch(createProgressEventSuccess(response.data, target));
            })
            .catch(function(error) {
                dispatch(
                    createProgressEventFailed(
                        (error.response ? error.response.data : null), progress_event, target
                    ),
                );
            });
    };
}

export function createProgressEventStart(progress_event, target) {
    return {
        type: CREATE_PROGRESS_EVENT_START,
        progress_event,
        target
    };
}

export function createProgressEventSuccess(progress_event, target) {
    return {
        type: CREATE_PROGRESS_EVENT_SUCCESS,
        progress_event,
        target
    };
}

export function createProgressEventFailed(error, progress_event, target) {
    return {
        type: CREATE_PROGRESS_EVENT_FAILED,
        error,
        progress_event,
        target
    };
}

export function listProgressEvents(filter, selection, prev_selection) {
    return dispatch => {
        dispatch(listProgressEventsStart(filter, selection, prev_selection));
        axios
            .get(ENDPOINT_PROGRESS_EVENTS, {params: filter})
            .then(function(response) {
                dispatch(listProgressEventsSuccess(response.data, filter, selection));
            })
            .catch(function(error) {
                dispatch(
                    listProgressEventsFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function listProgressEventsStart(filter, selection, prev_selection) {
    return {
        type: LIST_PROGRESS_EVENTS_START,
        filter,
        selection,
        prev_selection,
    };
}

export function listProgressEventsSuccess(response, filter, selection) {
    return {
        type: LIST_PROGRESS_EVENTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        filter,
        selection,
    };
}

export function listProgressEventsFailed(error, selection) {
    return {
        type: LIST_PROGRESS_EVENTS_FAILED,
        error,
        selection,
    };
}

export function retrieveProgressEvent(id) {
    return dispatch => {
        dispatch(retrieveProgressEventStart(id));
        axios
            .get(ENDPOINT_PROGRESS_EVENTS + id + '/')
            .then(function(response) {
                dispatch(retrieveProgressEventSuccess(response.data));
            })
            .catch(function(error) {
                dispatch(
                    retrieveProgressEventFailed(
                        error.response ? error.response.data : null,
                    ),
                );
            });
    };
}

export function retrieveProgressEventStart(id) {
    return {
        type: RETRIEVE_PROGRESS_EVENT_START,
        id,
    };
}

export function retrieveProgressEventSuccess(progress_event) {
    return {
        type: RETRIEVE_PROGRESS_EVENT_SUCCESS,
        progress_event,
    };
}

export function retrieveProgressEventFailed(error) {
    return {
        type: RETRIEVE_PROGRESS_EVENT_FAILED,
        error,
    };
}

export function updateProgressEvent(id, progress_event) {
    return dispatch => {
        dispatch(updateProgressEventStart(id, progress_event, id));

        let headers = {};

        axios
            .patch(ENDPOINT_PROGRESS_EVENTS + id + '/', progress_event, {
                headers: {...headers},
            })
            .then(function(response) {
                dispatch(updateProgressEventSuccess(response.data, id));
            })
            .catch(function(error) {
                dispatch(
                    updateProgressEventFailed(
                        (error.response ? error.response.data : null), progress_event, id
                    ),
                );
            });
    };
}

export function updateProgressEventStart(id, progress_event, target) {
    return {
        type: UPDATE_PROGRESS_EVENT_START,
        id,
        progress_event,
        target
    };
}

export function updateProgressEventSuccess(progress_event, target) {
    return {
        type: UPDATE_PROGRESS_EVENT_SUCCESS,
        progress_event,
        target
    };
}

export function updateProgressEventFailed(error, progress_event, target) {
    return {
        type: UPDATE_PROGRESS_EVENT_FAILED,
        error,
        progress_event,
        target
    };
}

export function listMoreProgressEvents(url, selection) {
    return dispatch => {
        dispatch(listMoreProgressEventsStart(url, selection));
        axios
            .get(url)
            .then(function(response) {
                dispatch(listMoreProgressEventsSuccess(response.data, selection));
            })
            .catch(function(error) {
                dispatch(
                    listMoreProgressEventsFailed(
                        error.response ? error.response.data : null,
                        selection,
                    ),
                );
            });
    };
}

export function listMoreProgressEventsStart(url, selection) {
    return {
        type: LIST_MORE_PROGRESS_EVENTS_START,
        url,
        selection,
    };
}

export function listMoreProgressEventsSuccess(response, selection) {
    return {
        type: LIST_MORE_PROGRESS_EVENTS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count,
        selection,
    };
}

export function listMoreProgressEventsFailed(error) {
    return {
        type: LIST_MORE_PROGRESS_EVENTS_FAILED,
        error,
    };
}

export function deleteProgressEvent(id) {
    return dispatch => {
        dispatch(deleteProgressEventStart(id));
        axios.delete(ENDPOINT_PROGRESS_EVENTS + id + '/')
            .then(function () {
                dispatch(deleteProgressEventSuccess(id));
            }).catch(function (response) {
            dispatch(deleteProgressEventFailed(response.data, id));
        });
    }
}

export function deleteProgressEventStart(id) {
    return {
        type: DELETE_PROGRESS_EVENT_START,
        id
    }
}

export function deleteProgressEventSuccess(id) {
    return {
        type: DELETE_PROGRESS_EVENT_SUCCESS,
        id
    }
}

export function deleteProgressEventFailed(error, id) {
    return {
        type: DELETE_PROGRESS_EVENT_FAILED,
        error,
        id
    }
}
